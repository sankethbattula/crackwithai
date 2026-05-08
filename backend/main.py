import os

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from analyzer import analyze_resume, extract_text_from_pdf

load_dotenv()

app = FastAPI(title="CrackWithAI Backend", version="1.0.0")

app.add_middleware(
  CORSMiddleware,
  allow_origins=[
    "http://localhost:5173",
    "https://crackwithai-sai.vercel.app",
  ],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/")
def health():
  return {"status": "ok"}


@app.post("/api/analyze")
async def analyze(
  resume_file: UploadFile = File(...),
  job_description: str = Form(...),
  target_role: str = Form("Software Engineer"),
):
  if not resume_file:
    raise HTTPException(status_code=400, detail="Please upload your resume PDF")

  content_type = (resume_file.content_type or "").lower()
  filename = (resume_file.filename or "").lower()
  if content_type != "application/pdf" and not filename.endswith(".pdf"):
    raise HTTPException(status_code=400, detail="Only PDF files are accepted")

  if not job_description or not job_description.strip():
    raise HTTPException(status_code=400, detail="Please paste the job description")

  try:
    file_bytes = await resume_file.read()
  except Exception:
    raise HTTPException(status_code=400, detail="Please upload your resume PDF")

  max_size = 5 * 1024 * 1024
  if not file_bytes:
    raise HTTPException(status_code=400, detail="Please upload your resume PDF")
  if len(file_bytes) > max_size:
    raise HTTPException(status_code=400, detail="Please upload a PDF under 5MB")

  try:
    resume_text = extract_text_from_pdf(file_bytes)
  except ValueError as e:
    msg = str(e).lower()
    if "no text" in msg:
      raise HTTPException(status_code=400, detail="Could not read PDF, use text-based PDF")
    raise HTTPException(status_code=400, detail=str(e))
  except Exception:
    raise HTTPException(status_code=400, detail="Could not read PDF, use text-based PDF")

  try:
    result = analyze_resume(resume_text, job_description, target_role)
    return result
  except HTTPException:
    raise
  except Exception as e:
    detail = str(e) or "Analysis failed, please try again"
    # Avoid leaking environment details
    if "GROQ_API_KEY" in detail:
      detail = "Analysis failed, please try again"
    raise HTTPException(status_code=500, detail=detail)
