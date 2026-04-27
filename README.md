# 🛡️ BiasScan — AI-Powered Bias Detection for ML Datasets

> **Google Solution Challenge 2026** — Addressing **UN SDG 10: Reduced Inequalities** through AI-driven fairness auditing.

![Stack](https://img.shields.io/badge/React-18-blue) ![Stack](https://img.shields.io/badge/FastAPI-0.115-green) ![Stack](https://img.shields.io/badge/Gemma_4_26B-Vertex_AI_MaaS-purple) ![Stack](https://img.shields.io/badge/Cloud_Run-Deployed-orange) ![SDG](https://img.shields.io/badge/UN_SDG-10_Reduced_Inequalities-e5243b)

---

## 🎯 Problem Statement

Artificial intelligence is increasingly used to make high-stakes decisions — hiring candidates, approving loans, diagnosing patients, and allocating resources. But when the training data carries hidden demographic biases, AI systems inherit and **amplify** those inequalities at scale:

- **Hiring**: Résumé screening models trained on historically biased data reject qualified candidates based on gender or ethnicity.
- **Lending**: Credit scoring algorithms penalize applicants from certain racial or socioeconomic backgrounds.
- **Healthcare**: Diagnostic models underperform for underrepresented populations, widening health disparities.

These biases disproportionately affect marginalized communities and directly undermine **UN Sustainable Development Goal 10 — Reduced Inequalities**. The root cause? Most practitioners never audit their datasets for fairness before training.

---

## 💡 Solution

**BiasScan** is a web application that makes bias detection accessible to everyone — data scientists, researchers, students, and policymakers. Upload any CSV dataset and receive an instant AI-powered fairness audit:

1. **Upload** — Drag & drop or browse to upload your dataset (CSV)
2. **Analyze** — Gemma 4 26B scans for demographic biases across gender, age, race, and other sensitive attributes
3. **Report** — Get a structured bias report with:
   - 🎯 **Bias Score** (0–100) — Color-coded severity gauge (🟢 Low / 🟡 Medium / 🔴 High)
   - 🚩 **Flagged Columns** — Exactly which columns carry bias, with detailed explanations
   - 🔧 **Fix Suggestions** — 3 actionable recommendations to make the data fairer

---

## 🌐 Google Technologies Used

| Technology | Purpose |
| --- | --- |
| **Gemma 4 26B A4B IT** via Vertex AI MaaS (Model Garden) | AI engine for bias analysis — accessed through the `aiplatform.googleapis.com` OpenAPI-compatible endpoint |
| **Google Cloud Run** | Serverless container deployment for the full-stack application |
| **Google Cloud Project** | `biasscan-sc2026` — hosts all services and API access |
| **Application Default Credentials (ADC)** | Authentication via `gcloud auth application-default login` — no API keys required |

---

## 🌍 UN Sustainable Development Goal Addressed

### SDG 10: Reduced Inequalities

> *"Reduce inequality within and among countries."*

BiasScan empowers users to identify and mitigate discriminatory patterns in datasets **before** they are used to train AI models. By catching bias at the data layer, we prevent inequality from being encoded into automated decision-making systems that affect millions of lives.

---

## 🏗️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 18 + Tailwind CSS 3 + Vite |
| **Backend** | FastAPI (Python 3.11) |
| **AI Engine** | Gemma 4 26B A4B IT (`google/gemma-4-26b-a4b-it-maas`) via Vertex AI MaaS |
| **Auth** | Google Cloud ADC (`gcloud auth application-default login`) |
| **Deployment** | Docker (multi-stage) + Google Cloud Run |

---

## ⚙️ How It Works

```
User uploads CSV
       ↓
FastAPI POST /api/analyze
       ↓
CSV parsed → first 50 rows sampled
       ↓
Prompt constructed for fairness audit
       ↓
gcloud auth print-access-token → Bearer token
       ↓
POST to aiplatform.googleapis.com MaaS endpoint
  Model: google/gemma-4-26b-a4b-it-maas
       ↓
Gemma 4 26B analyzes for demographic bias
       ↓
JSON response: bias_score + flagged_columns + fix_suggestions
       ↓
Results displayed in React dashboard
```

**Architecture:**

```
┌──────────────┐     /api/analyze     ┌──────────────┐     REST API     ┌─────────────────────┐
│   React UI   │ ──────────────────── │   FastAPI     │ ────────────── │  Vertex AI MaaS     │
│  (Vite dev)  │     multipart/form   │   Backend     │   Bearer auth  │  Gemma 4 26B A4B IT │
└──────────────┘                      └──────────────┘                 └─────────────────────┘
```

---

## 📁 Project Structure

```
BiasScan/
├── frontend/                 # React + Tailwind CSS (Vite)
│   ├── src/
│   │   ├── App.jsx           # Main app with state management
│   │   ├── main.jsx          # React entry point
│   │   ├── index.css         # Tailwind + custom styles
│   │   └── components/
│   │       ├── FileUpload.jsx        # CSV upload with drag & drop
│   │       ├── ResultsDashboard.jsx  # Main results container
│   │       ├── BiasScore.jsx         # Animated score gauge
│   │       ├── FlaggedColumns.jsx    # Bias flags display
│   │       └── FixSuggestions.jsx    # Remediation suggestions
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── main.py               # FastAPI + Gemma 4 MaaS integration
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # GCP config (not committed)
│   └── .env.example          # Template for environment variables
├── data/
│   ├── generate_sample_data.py   # Script to generate biased test data
│   └── hiring_data.csv          # Sample biased dataset (100 rows)
├── Dockerfile                # Multi-stage build for Cloud Run
├── .gitignore
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Google Cloud SDK** (`gcloud` CLI installed)
- **Google Cloud Project** with Vertex AI API enabled

### Step 1: Clone the repository

```bash
git clone https://github.com/pakhi-sinha/BiasScan.git
cd BiasScan
```

### Step 2: Authenticate with Google Cloud

BiasScan uses **Application Default Credentials** — no API keys needed.

```bash
# Login to your Google Cloud account
gcloud auth application-default login

# Set your active project
gcloud config set project biasscan-sc2026
```

### Step 3: Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your GCP project ID:

```env
GOOGLE_CLOUD_PROJECT=biasscan-sc2026
GOOGLE_CLOUD_LOCATION=us-central1
```

### Step 4: Generate sample data (optional)

```bash
cd data
python generate_sample_data.py
cd ..
```

This creates `hiring_data.csv` — a synthetic hiring dataset with intentional gender, race, and age biases.

### Step 5: Start the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be running at `http://localhost:8000`. Test it:

```bash
curl http://localhost:8000/api/health
```

### Step 6: Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

> **Note:** The Vite dev server proxies `/api` requests to the FastAPI backend automatically (configured in `vite.config.js`).

---

## 🐳 Deployment

### Build and run with Docker locally

```bash
docker build -t biasscan .
docker run -p 8080:8080 \
  -e GOOGLE_CLOUD_PROJECT=biasscan-sc2026 \
  -e GOOGLE_CLOUD_LOCATION=us-central1 \
  biasscan
```

Visit `http://localhost:8080`.

### Deploy to Google Cloud Run

```bash
# Set your project
gcloud config set project biasscan-sc2026

# Build and deploy in one command
gcloud run deploy biasscan \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=biasscan-sc2026,GOOGLE_CLOUD_LOCATION=us-central1
```

Cloud Run will automatically build the Docker image, push it to Artifact Registry, and deploy it.

---

## 📡 API Reference

### `POST /api/analyze`

Upload a CSV file for bias analysis.

**Request:**
- `Content-Type: multipart/form-data`
- Body: `file` (CSV file)

**Response (200):**

```json
{
  "bias_score": 72,
  "flagged_columns": [
    { "column": "gender", "reason": "Males hired at 70% vs Females at 45%" },
    { "column": "race", "reason": "White candidates hired at 72% vs others at 40-50%" }
  ],
  "summary": "Significant gender and racial bias detected in hiring outcomes.",
  "fix_suggestions": [
    "Apply stratified sampling to balance gender representation",
    "Use blind-review processes to remove racial identifiers",
    "Implement outcome parity constraints during model training"
  ],
  "filename": "hiring_data.csv",
  "rows_analyzed": 100,
  "columns": ["age", "gender", "race", "experience_years", "hired"]
}
```

### `GET /api/health`

Health check endpoint. Returns service status and model configuration.

```json
{
  "status": "healthy",
  "service": "BiasScan API",
  "model": "google/gemma-4-26b-a4b-it-maas",
  "gcp_configured": true
}
```

---

## 📊 Sample Output

When analyzing `data/hiring_data.csv` (100 rows of synthetic hiring data), BiasScan produces a report like:

```json
{
  "bias_score": 72,
  "flagged_columns": [
    {
      "column": "gender",
      "reason": "Significant disparity: Male candidates have a hire rate of ~70%, while Female candidates are hired at ~45%. This 25-percentage-point gap suggests systemic gender bias in hiring outcomes."
    },
    {
      "column": "race",
      "reason": "White candidates are hired at ~72%, while Black (~42%), Hispanic (~48%), and Asian (~50%) candidates have substantially lower hire rates, indicating racial bias."
    },
    {
      "column": "age",
      "reason": "Candidates under 35 show higher hire rates (~65%) compared to those over 45 (~38%), suggesting age-based discrimination."
    }
  ],
  "summary": "This hiring dataset exhibits significant bias across gender, race, and age dimensions. Males, White candidates, and younger applicants are systematically favored in hiring decisions, violating principles of equal opportunity.",
  "fix_suggestions": [
    "Apply stratified sampling to ensure equal gender and racial representation in training data",
    "Implement blind-review features that remove demographic identifiers (gender, race, age) during model training",
    "Add outcome parity constraints to ensure hire rates are equalized across demographic groups within a ±5% tolerance"
  ],
  "filename": "hiring_data.csv",
  "rows_analyzed": 100,
  "columns": ["age", "gender", "race", "experience_years", "hired"]
}
```

---

## 🧪 Sample Dataset

The included `data/hiring_data.csv` contains 100 rows of synthetic hiring data with **intentional biases** for testing:

| Column | Description |
| --- | --- |
| `age` | Candidate age (22–58) |
| `gender` | Male / Female |
| `race` | White / Black / Hispanic / Asian |
| `experience_years` | Years of experience (0–20) |
| `hired` | Hiring outcome (0 = No, 1 = Yes) |

**Built-in biases:**
- 🚹 **Gender**: Males hired at ~70%, Females at ~45%
- 🌍 **Race**: White candidates hired at ~72%, others at ~40–50%
- 📅 **Age**: Younger candidates (<35) have higher hire rates

---

## 👥 Team

Built for the **Google Solution Challenge 2026**.

---

## 📄 License

MIT License — use freely for learning, research, and building fairer AI systems.
