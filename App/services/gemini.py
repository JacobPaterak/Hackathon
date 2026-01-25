from google import genai
from .config import GEMINI_API_KEY
import os

_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

_client = None

def _get_client() -> genai.Client:
    global _client
    if _client is None:
        if not GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not set in .env")
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client

def generate_reply(prompt: str) -> tuple[str, dict]:
    client = _get_client()

    response = client.models.generate_content(
        model=_MODEL,
        contents=prompt,
    )

    text = response.text or ""

    usage = getattr(response, "usage_metadata", None)
    # usage has: prompt_token_count, candidates_token_count, total_token_count
    input_tokens = getattr(usage, "prompt_token_count", 0) if usage else 0
    output_tokens = getattr(usage, "candidates_token_count", 0) if usage else 0
    total_tokens = getattr(usage, "total_token_count", 0) if usage else 0

    return text, {
        "input_tokens": int(input_tokens or 0),
        "output_tokens": int(output_tokens or 0),
        "total_tokens": int(total_tokens or 0),
        "model": _MODEL,
    }