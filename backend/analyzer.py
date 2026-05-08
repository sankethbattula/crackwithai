from __future__ import annotations

import json
import re
from typing import Any, Dict, List

import fitz  # PyMuPDF

from groq_client import get_completion


def extract_text_from_pdf(file_bytes: bytes) -> str:
  if not file_bytes:
    raise ValueError("Empty PDF file")

  doc = fitz.open(stream=file_bytes, filetype="pdf")
  try:
    text_parts: List[str] = []
    for page in doc:
      t = page.get_text("text") or ""
      if t.strip():
        text_parts.append(t)
    text = "\n\n".join(text_parts).strip()
  finally:
    doc.close()

  if not text:
    raise ValueError("No text found in PDF")
  return text


def _extract_years_required(job_description: str) -> int:
  jd = job_description.lower()
  patterns = [
    r"(\d+)\+?\s*(?:years|yrs)\s*(?:of\s*)?(?:experience|exp)",
    r"(?:minimum|min)\s*(\d+)\s*(?:years|yrs)",
    r"(\d+)\s*(?:years|yrs)\s*(?:minimum|min)",
  ]
  years: List[int] = []
  for p in patterns:
    for m in re.finditer(p, jd):
      try:
        years.append(int(m.group(1)))
      except Exception:
        continue
  return max(years) if years else 0


def _extract_candidate_years(resume_text: str) -> int:
  """
  Conservative heuristic: compute span between earliest start year and latest end year.
  This avoids overcounting overlapping roles and tends to under-estimate rather than inflate.
  """
  text = resume_text
  years = [int(y) for y in re.findall(r"\b(19\d{2}|20\d{2})\b", text)]
  if not years:
    return 0

  start = min(years)
  end = max(years)
  span = max(0, end - start)

  # If resume spans only a single year but contains multiple year tokens, treat as 1.
  if span == 0 and len(set(years)) > 1:
    span = 1
  return min(50, span)


ATS_PROMPT_TEMPLATE = """You are an expert ATS analyzer used by Fortune 500 
companies. Analyze using these 10 real ATS rules:
1 Keyword matching exact and semantic
2 Skills section analysis  
3 Job title alignment
4 Education requirements
5 Years of experience calculation
6 Action verb strength
7 Quantifiable achievements
8 Format compatibility
9 Standard section headers
10 Keyword density

Calculate:
required_experience_years from job description
candidate_experience_years from resume dates
experience_fit: poor if gap over 2 years,
borderline if gap 1 to 2 years, good if gap 0 or less
experience_message: honest 2 sentence advice

Return ONLY valid JSON no markdown:
{{
  ats_score: integer 0-100,
  required_experience_years: integer,
  candidate_experience_years: integer,
  experience_fit: poor or borderline or good,
  experience_message: string,
  matched_keywords: array of strings,
  missing_keywords: array of strings,
  bullet_rewrites: array of {{original, improved}},
  strengths: array of strings,
  improvement_areas: array of strings,
  interview_tips: array of 5 strings
}}

Score 90 plus means near perfect.
Most resumes score 40 to 70.
Be strict and honest.

Resume:
{resume_text}

Job Description:
{job_description}

Target Role:
{target_role}
"""


def _clean_ai_text_to_json(text: str) -> str:
  if not text:
    return ""
  # Remove fenced code blocks if present
  text = re.sub(r"```(?:json)?\s*([\s\S]*?)\s*```", r"\1", text, flags=re.IGNORECASE)
  # Extract first JSON object
  m = re.search(r"\{[\s\S]*\}", text)
  return m.group(0) if m else ""


def _compute_experience_fit(required_years: int, candidate_years: int) -> str:
  gap = required_years - candidate_years
  if gap > 2:
    return "poor"
  if gap >= 1:
    return "borderline"
  return "good"


def _two_sentence_message(message: str, fit: str, required_years: int, candidate_years: int) -> str:
  msg = (message or "").strip()
  if msg:
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", msg) if s.strip()]
    if len(sentences) >= 2:
      return f"{sentences[0]} {sentences[1]}"
    if len(sentences) == 1:
      second = (
        "Apply only if you can prove impact and align your skills tightly to the role."
        if fit in ("poor", "borderline")
        else "Tailor your top bullets to match the role keywords and quantify impact."
      )
      return f"{sentences[0]} {second}"

  if fit == "poor":
    return (
      f"The job asks for {required_years} years and your resume shows about {candidate_years}."
      " You will likely be filtered out; target junior roles or strengthen experience signals first."
    )
  if fit == "borderline":
    return (
      f"The job asks for {required_years} years and your resume shows about {candidate_years}."
      " You are close—highlight relevant projects and measurable impact to reduce the gap."
    )
  return (
    f"The job asks for {required_years} years and your resume shows about {candidate_years}."
    " Your experience looks aligned—optimize keywords and bullet strength to maximize ATS match."
  )


def _safe_fallback(required_years: int, candidate_years: int) -> Dict[str, Any]:
  fit = _compute_experience_fit(required_years, candidate_years)
  return {
    "ats_score": 50,
    "required_experience_years": int(required_years),
    "candidate_experience_years": int(candidate_years),
    "experience_fit": fit,
    "experience_message": _two_sentence_message("", fit, required_years, candidate_years),
    "matched_keywords": [],
    "missing_keywords": [],
    "bullet_rewrites": [],
    "strengths": [],
    "improvement_areas": ["Could not parse AI response; try again with a clearer job description."],
    "interview_tips": [
      "Prepare a 60-second role-specific pitch using your top projects.",
      "Practice explaining one project end-to-end: problem, approach, trade-offs, results.",
      "Review the job description and map each requirement to evidence in your resume.",
      "Do 1–2 timed coding/analysis questions daily and review mistakes.",
      "Prepare 5 STAR stories with quantified impact.",
    ],
  }


def analyze_resume(resume_text: str, job_description: str, target_role: str) -> Dict[str, Any]:
  required_guess = _extract_years_required(job_description)
  candidate_guess = _extract_candidate_years(resume_text)

  prompt = ATS_PROMPT_TEMPLATE.format(
    resume_text=resume_text,
    job_description=job_description,
    target_role=target_role or "Software Engineer",
  )

  ai_text = get_completion(prompt)
  json_text = _clean_ai_text_to_json(ai_text)

  try:
    data = json.loads(json_text)
    if not isinstance(data, dict):
      raise ValueError("AI JSON is not an object")
  except Exception:
    return _safe_fallback(required_guess, candidate_guess)

  def _as_int(v, default=0) -> int:
    try:
      return int(v)
    except Exception:
      return int(default)

  ats_score = clamp_int(_as_int(data.get("ats_score"), 50), 0, 100)
  required_years = _as_int(data.get("required_experience_years"), required_guess)
  candidate_years = _as_int(data.get("candidate_experience_years"), candidate_guess)

  # Enforce the requested experience_fit rules deterministically.
  fit = _compute_experience_fit(required_years, candidate_years)
  msg = _two_sentence_message(str(data.get("experience_message") or ""), fit, required_years, candidate_years)

  matched = _as_str_list(data.get("matched_keywords"))
  missing = _as_str_list(data.get("missing_keywords"))
  bullet_rewrites = _as_bullet_rewrites(data.get("bullet_rewrites"))
  strengths = _as_str_list(data.get("strengths"))
  improvements = _as_str_list(data.get("improvement_areas"))
  tips = _as_str_list(data.get("interview_tips"))[:5]
  if len(tips) < 5:
    tips = (tips + _safe_fallback(required_years, candidate_years)["interview_tips"])[:5]

  return {
    "ats_score": ats_score,
    "required_experience_years": required_years,
    "candidate_experience_years": candidate_years,
    "experience_fit": fit,
    "experience_message": msg,
    "matched_keywords": matched,
    "missing_keywords": missing,
    "bullet_rewrites": bullet_rewrites,
    "strengths": strengths,
    "improvement_areas": improvements,
    "interview_tips": tips,
  }


def clamp_int(value: int, lo: int, hi: int) -> int:
  return max(lo, min(hi, int(value)))


def _as_str_list(v: Any) -> List[str]:
  if isinstance(v, list):
    out = []
    for item in v:
      s = str(item).strip()
      if s:
        out.append(s)
    # de-dupe while preserving order
    seen = set()
    uniq = []
    for s in out:
      key = s.lower()
      if key in seen:
        continue
      seen.add(key)
      uniq.append(s)
    return uniq
  return []


def _as_bullet_rewrites(v: Any) -> List[Dict[str, str]]:
  if not isinstance(v, list):
    return []
  out: List[Dict[str, str]] = []
  for item in v:
    if not isinstance(item, dict):
      continue
    original = str(item.get("original") or "").strip()
    improved = str(item.get("improved") or "").strip()
    if original and improved:
      out.append({"original": original, "improved": improved})
  return out
