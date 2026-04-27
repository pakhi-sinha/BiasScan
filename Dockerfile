# ============================================================
# BiasScan — Multi-stage Dockerfile for Cloud Run
# Stage 1: Build the React frontend
# Stage 2: Serve via FastAPI (Python)
# ============================================================

# ── Stage 1: Frontend Build ──────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Python Backend ─────────────────────────────────
FROM python:3.11-slim

# Prevent Python from writing .pyc and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend from Stage 1
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Copy sample data
COPY data/ ./data/

# Cloud Run uses port 8080 by default
ENV PORT=8080
EXPOSE 8080

# Start the FastAPI server
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
