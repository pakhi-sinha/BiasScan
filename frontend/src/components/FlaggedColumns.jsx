/**
 * Displays flagged columns as individual cards with column name and reason.
 */
export default function FlaggedColumns({ columns }) {
  if (!columns || columns.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="h-8 w-8 rounded-lg bg-bias-high/10 flex items-center justify-center">
          <svg className="h-4 w-4 text-bias-high" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        </div>
        <h3 className="font-display text-lg font-bold">Flagged Columns</h3>
        <span className="ml-auto text-xs font-semibold text-bias-high bg-bias-high/10 border border-bias-high/20 rounded-full px-3 py-1">
          {columns.length} found
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((col, i) => (
          <div
            key={i}
            className="glass-card-hover p-5 relative overflow-hidden"
          >
            {/* Accent stripe */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-bias-high to-bias-high/30 rounded-l-2xl" />

            <div className="pl-3">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-4 w-4 text-bias-high shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h4 className="font-semibold text-white text-sm tracking-wide uppercase">
                  {col.column}
                </h4>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                {col.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
