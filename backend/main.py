"""
BiasScan Backend — AI-Powered Bias Detection API
Uses Gemma 4 26B via Vertex AI MaaS endpoint to analyze CSV datasets for bias.
"""

import os
import io
import json
import csv
import pathlib
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
import requests
import subprocess

# Load environment variables from .env
load_dotenv()

# ── Gemma 4 MaaS Configuration ──────────────────────────────────────

def get_access_token():
    result = subprocess.run(
        ["gcloud.cmd", "auth", "print-access-token"],
        capture_output=True, text=True, shell=True
    )
    return result.stdout.strip()


def call_gemma4(prompt: str):
    token = get_access_token()
    project = os.getenv("GOOGLE_CLOUD_PROJECT")
    url = f"https://aiplatform.googleapis.com/v1/projects/{project}/locations/global/endpoints/openapi/chat/completions"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "google/gemma-4-26b-a4b-it-maas",
        "messages": [{"role": "user", "content": prompt}]
    }

    response = requests.post(url, headers=headers, json=payload)
    return response.json()["choices"][0]["message"]["content"]

app = FastAPI(
    title="BiasScan API",
    description="AI-Powered Bias Detection for ML Datasets",
    version="1.0.0",
)

# CORS — allow frontend dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BIAS_ANALYSIS_PROMPT = """You are a fairness auditor. Analyze this CSV dataset for bias. \
Identify demographic columns (gender, age, race). Check if outcomes are unfairly distributed. \
Return JSON only — no markdown, no explanation, no code fences. \
The JSON must follow this exact schema:
{
  "bias_score": <integer 0-100>,
  "flagged_columns": [
    {"column": "<column_name>", "reason": "<explanation of detected bias>"}
  ],
  "summary": "<brief summary of findings>",
  "fix_suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
}

Here is the dataset:
"""


@app.post("/api/analyze")
async def analyze_csv(file: UploadFile = File(...)):
    """
    Accepts a CSV file upload, sends it to Gemma 4 26B via MaaS endpoint
    for bias analysis, and returns a structured bias report.
    """
    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are accepted. Please upload a .csv file.",
        )

    if not os.getenv("GOOGLE_CLOUD_PROJECT"):
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_CLOUD_PROJECT is not configured. Please set it in your .env file.",
        )

    try:
        # Read the uploaded CSV
        contents = await file.read()
        csv_text = contents.decode("utf-8")

        # Parse basic metadata
        lines = csv_text.strip().split("\n")
        total_rows = len(lines) - 1  # Exclude header
        header = lines[0] if lines else ""
        columns = [col.strip() for col in header.split(",")]

        # Limit CSV sample for the prompt (header + first 50 data rows)
        if len(lines) > 51:
            csv_sample = "\n".join(lines[:51])
            csv_sample += f"\n\n... ({total_rows - 50} additional rows not shown, {total_rows} total data rows)"
        else:
            csv_sample = csv_text

        # Build prompt and call Gemma 4 26B via MaaS
        prompt = BIAS_ANALYSIS_PROMPT + csv_sample

        response_text = call_gemma4(prompt).strip()

        # Clean markdown code fences if model adds them
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1]
            response_text = response_text.rsplit("```", 1)[0].strip()

        result = json.loads(response_text)

        # Validate and normalize the response shape
        result.setdefault("bias_score", 0)
        result.setdefault("flagged_columns", [])
        result.setdefault("summary", "No summary provided.")
        result.setdefault("fix_suggestions", [])

        # Clamp bias_score to [0, 100]
        result["bias_score"] = max(0, min(100, int(result["bias_score"])))

        # Ensure flagged_columns have the right structure
        normalized_flags = []
        for flag in result["flagged_columns"]:
            if isinstance(flag, dict):
                normalized_flags.append(
                    {
                        "column": flag.get("column", "Unknown"),
                        "reason": flag.get("reason", "No details provided."),
                    }
                )
            elif isinstance(flag, str):
                normalized_flags.append({"column": flag, "reason": "Flagged by AI."})
        result["flagged_columns"] = normalized_flags

        # Attach dataset metadata
        result["filename"] = file.filename
        result["rows_analyzed"] = total_rows
        result["columns"] = columns

        return result

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse AI response as valid JSON: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}",
        )


@app.get("/api/health")
async def health_check():
    """Health check endpoint for Cloud Run."""
    return {
        "status": "healthy",
        "service": "BiasScan API",
        "model": "google/gemma-4-26b-a4b-it-maas",
        "gcp_configured": bool(os.getenv("GOOGLE_CLOUD_PROJECT")),
    }


# ---------------------------------------------------------------------------
# Serve the React frontend in production (built files in ../frontend/dist)
# ---------------------------------------------------------------------------
FRONTEND_DIST = pathlib.Path(__file__).parent.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    # Serve static assets (JS, CSS, images)
    app.mount(
        "/assets",
        StaticFiles(directory=str(FRONTEND_DIST / "assets")),
        name="static-assets",
    )

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve the React SPA — all non-API routes fall through to index.html."""
        file_path = FRONTEND_DIST / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(FRONTEND_DIST / "index.html"))
