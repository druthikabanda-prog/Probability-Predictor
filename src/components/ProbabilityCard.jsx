import React from 'react';

export default function ProbabilityCard({ title, percentage, description, color = 'lime', subtitle }) {
  const percentageVal = Math.min(100, Math.max(0, percentage || 0));

  const barColors = {
    lime: 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    blue: 'bg-blue-600 dark:bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]',
    purple: 'bg-purple-600 dark:bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.3)]',
    rose: 'bg-rose-600 dark:bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.3)]'
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {subtitle && (
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
            {subtitle}
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-blue-600 dark:text-emerald-400 tracking-tight font-mono">
            {percentageVal.toFixed(2)}%
          </span>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            ({(percentageVal / 100).toFixed(4)})
          </span>
        </div>

        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full h-2.5 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full ${barColors[color] || barColors.lime} transition-all duration-300`}
            style={{ width: `${percentageVal}%` }}
          />
        </div>
      </div>

      {description && (
        <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
