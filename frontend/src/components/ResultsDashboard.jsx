import BiasScore from "./BiasScore";
import FlaggedColumns from "./FlaggedColumns";
import FixSuggestions from "./FixSuggestions";

export default function ResultsDashboard({ results, onReset }) {
  const { bias_score, flagged_columns, summary, fix_suggestions, filename, rows_analyzed, columns } = results;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 animate-fade-in">
      {/* Dataset metadata bar */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium text-white/70">{filename}</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <span className="text-xs text-white/40 font-medium">
          {rows_analyzed?.toLocaleString()} rows
        </span>
        <div className="h-4 w-px bg-white/10" />
        <span className="text-xs text-white/40 font-medium">
          {columns?.length} columns
        </span>
      </div>

      {/* Top Row — Score + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bias Score */}
        <div className="lg:col-span-1 glass-card p-8 flex flex-col items-center justify-center animate-fade-in-up" style={{ opacity: 0 }}>
          <BiasScore score={bias_score} />
        </div>

        {/* Summary */}
        <div className="lg:col-span-2 glass-card p-8 animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-purple/10 flex items-center justify-center">
              <svg className="h-4 w-4 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold">Analysis Summary</h3>
          </div>
          <p className="text-white/60 leading-relaxed">{summary}</p>

          {/* Column pills */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
              Columns Analyzed
            </p>
            <div className="flex flex-wrap gap-2">
              {columns?.map((col, i) => {
                const isFlagged = flagged_columns?.some(
                  (f) => f.column?.toLowerCase() === col.toLowerCase()
                );
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                      isFlagged
                        ? "bg-bias-high/10 text-bias-high border border-bias-high/20"
                        : "bg-white/5 text-white/40 border border-white/5"
                    }`}
                  >
                    {isFlagged && (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    )}
                    {col}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row — Flagged Columns */}
      {flagged_columns && flagged_columns.length > 0 && (
        <div className="mb-8 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
          <FlaggedColumns columns={flagged_columns} />
        </div>
      )}

      {/* Bottom Row — Fix Suggestions */}
      {fix_suggestions && fix_suggestions.length > 0 && (
        <div className="mb-8 animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
          <FixSuggestions suggestions={fix_suggestions} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-12 animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
        <button onClick={onReset} className="btn-primary">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Scan Another Dataset
        </button>
      </div>
    </div>
  );
}
