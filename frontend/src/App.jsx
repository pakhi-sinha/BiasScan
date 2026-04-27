import { useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import ResultsDashboard from "./components/ResultsDashboard";

/* ================================================================== */
/* App States: idle | uploading | analyzing | results | error          */
/* ================================================================== */
export default function App() {
  const [appState, setAppState] = useState("idle");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file) => {
    setAppState("uploading");
    setError("");
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setAppState("analyzing");

      const response = await axios.post("/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total || 1));
          setProgress(pct);
        },
      });

      setResults(response.data);
      setAppState("results");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Something went wrong. Please try again.";
      setError(msg);
      setAppState("error");
    }
  };

  const handleReset = () => {
    setAppState("idle");
    setResults(null);
    setError("");
    setProgress(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-dark-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button onClick={handleReset} className="flex items-center gap-3 group">
            {/* Logo icon */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-indigo to-accent-purple shadow-lg shadow-accent-purple/20 transition-transform duration-300 group-hover:scale-110">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              {/* Glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-purple opacity-40 blur-lg" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight gradient-text">
                BiasScan
              </h1>
              <p className="text-[11px] font-medium tracking-wider text-white/30 uppercase">
                AI Bias Detection
              </p>
            </div>
          </button>

          {appState === "results" && (
            <button onClick={handleReset} className="btn-secondary text-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              New Scan
            </button>
          )}
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main className="flex-1">
        {/* Idle / Upload State */}
        {(appState === "idle" || appState === "error") && (
          <div className="mx-auto max-w-4xl px-6 py-16 animate-fade-in">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-purple/20 bg-accent-purple/5 px-4 py-1.5 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-purple opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-purple"></span>
                </span>
                <span className="text-xs font-medium text-accent-purple">
                  Powered by Gemini AI
                </span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                Detect{" "}
                <span className="gradient-text">Hidden Bias</span>
                <br />
                in Your ML Datasets
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-white/50 leading-relaxed">
                Upload a CSV file and let our AI fairness auditor analyze your
                dataset for demographic biases, unequal outcome distributions,
                and provide actionable fix suggestions.
              </p>
            </div>

            {/* Error Banner */}
            {appState === "error" && error && (
              <div className="mb-8 animate-fade-in-up rounded-xl border border-bias-high/20 bg-bias-high/5 p-4 flex items-start gap-3">
                <svg className="h-5 w-5 text-bias-high mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="font-semibold text-bias-high text-sm">Analysis Failed</p>
                  <p className="text-sm text-white/60 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <FileUpload onUpload={handleUpload} />

            {/* Feature Cards */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  ),
                  title: "Bias Score",
                  desc: "Get a clear 0–100 risk score with color-coded severity",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  ),
                  title: "Flagged Columns",
                  desc: "Identify exactly which columns carry demographic bias",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  ),
                  title: "Fix Suggestions",
                  desc: "Actionable recommendations to make your data fairer",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className={`glass-card-hover p-6 animate-fade-in-up stagger-${i + 1}`}
                  style={{ opacity: 0 }}
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-purple/10">
                    <svg className="h-5 w-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {feature.icon}
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-white/40">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyzing / Loading State */}
        {appState === "analyzing" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            {/* Animated scanner icon */}
            <div className="relative mb-8">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center animate-float">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              {/* Orbiting ring */}
              <div className="absolute -inset-4 rounded-3xl border border-accent-purple/20 animate-spin-slow" />
              <div className="absolute -inset-8 rounded-3xl border border-accent-indigo/10 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "5s" }} />
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl bg-accent-purple/20 blur-2xl" />
            </div>

            <h3 className="font-display text-2xl font-bold mb-2">
              Analyzing Your Dataset
            </h3>
            <p className="text-white/40 text-center max-w-md mb-6">
              Our AI fairness auditor is scanning for demographic biases,
              unequal distributions, and potential concerns…
            </p>

            {/* Progress bar */}
            <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-indigo to-accent-purple rounded-full animate-pulse-slow w-full" />
            </div>
          </div>
        )}

        {/* Results State */}
        {appState === "results" && results && (
          <ResultsDashboard results={results} onReset={handleReset} />
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-6 text-center text-xs text-white/20">
        BiasScan &copy; {new Date().getFullYear()} &middot; Built with Gemini AI
        &middot; Fairness matters.
      </footer>
    </div>
  );
}
