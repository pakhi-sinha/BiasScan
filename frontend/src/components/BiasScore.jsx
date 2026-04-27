import { useEffect, useState } from "react";

/**
 * Animated circular gauge for the bias score (0–100).
 * Green (0–39), Yellow (40–69), Red (70–100).
 */
export default function BiasScore({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score counting up
  useEffect(() => {
    let start = 0;
    const duration = 1500; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = score / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color based on severity
  const getColor = (s) => {
    if (s < 40) return { stroke: "#10b981", text: "text-bias-low", bg: "bg-bias-low", label: "Low Risk", labelBg: "bg-bias-low/10 text-bias-low border-bias-low/20" };
    if (s < 70) return { stroke: "#f59e0b", text: "text-bias-medium", bg: "bg-bias-medium", label: "Medium Risk", labelBg: "bg-bias-medium/10 text-bias-medium border-bias-medium/20" };
    return { stroke: "#ef4444", text: "text-bias-high", bg: "bg-bias-high", label: "High Risk", labelBg: "bg-bias-high/10 text-bias-high border-bias-high/20" };
  };

  const color = getColor(score);

  // SVG circle math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">
        Bias Score
      </p>

      {/* Circular Gauge */}
      <div className="relative">
        <svg className="w-44 h-44 -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-[1500ms] ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${color.stroke}40)`,
            }}
          />
        </svg>

        {/* Score number overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-5xl font-extrabold ${color.text}`}>
            {animatedScore}
          </span>
          <span className="text-xs text-white/30 mt-1">/ 100</span>
        </div>
      </div>

      {/* Severity label */}
      <span className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${color.labelBg}`}>
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
            style={{ backgroundColor: color.stroke }}
          />
          <span
            className="relative inline-flex rounded-full h-1.5 w-1.5"
            style={{ backgroundColor: color.stroke }}
          />
        </span>
        {color.label}
      </span>
    </div>
  );
}
