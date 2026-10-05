import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, trend }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-tight uppercase">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
            <Icon className="w-4 h-4 stroke-[2]" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-mono">
          {value}
        </div>
        {subtext && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {subtext}
          </p>
        )}
      </div>

      {trend && (
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{trend}</span>
        </div>
      )}
    </div>
  );
}
