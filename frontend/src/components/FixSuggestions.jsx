/**
 * Displays actionable fix suggestions as numbered items.
 */
export default function FixSuggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="h-8 w-8 rounded-lg bg-bias-low/10 flex items-center justify-center">
          <svg className="h-4 w-4 text-bias-low" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="font-display text-lg font-bold">Fix Suggestions</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <div
            key={i}
            className="glass-card-hover p-5 flex items-start gap-4"
          >
            {/* Number badge */}
            <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-bias-low/20 to-bias-low/5 border border-bias-low/20 flex items-center justify-center">
              <span className="text-sm font-bold text-bias-low">
                {i + 1}
              </span>
            </div>

            {/* Suggestion text */}
            <p className="text-white/60 leading-relaxed text-sm pt-1">
              {suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
