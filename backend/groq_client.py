import os

from groq import Groq


class GroqClientError(RuntimeError):
  pass


def _get_client() -> Groq:
  api_key = os.getenv("GROQ_API_KEY")
  if not api_key:
    raise GroqClientError("GROQ_API_KEY is not set")
  return Groq(api_key=api_key)


def get_completion(prompt: str) -> str:
  """
  Get a completion from Groq using llama-3.3-70b-versatile.
  """
  if not isinstance(prompt, str) or not prompt.strip():
    raise GroqClientError("Prompt must be a non-empty string")

  try:
    client = _get_client()
    resp = client.chat.completions.create(
      model="llama-3.3-70b-versatile",
      messages=[
        {"role": "system", "content": "You are a precise assistant that outputs only what is requested."},
        {"role": "user", "content": prompt},
      ],
      temperature=0.3,
      max_tokens=4000,
    )

    content = resp.choices[0].message.content if resp and resp.choices else None
    if not content:
      raise GroqClientError("Empty response from Groq")
    return content
  except GroqClientError:
    raise
  except Exception as e:
    raise GroqClientError(f"Groq request failed: {e}") from e
