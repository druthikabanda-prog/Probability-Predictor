import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

export default function RiskIndicator({ probability }) {
  const prob = Number(probability) || 0;

  let riskLevel = 'Low Risk';
  let badgeBg = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
  let iconColor = 'text-emerald-600 dark:text-emerald-400';
  let Icon = ShieldCheck;
  let description = 'High confidence of on-time delivery. Operational SLA target is comfortably met.';

  if (prob < 60) {
    riskLevel = 'High Risk';
    badgeBg = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    iconColor = 'text-rose-600 dark:text-rose-400';
    Icon = AlertCircle;
    description = 'High likelihood of SLA breach. Immediate route or dispatch optimization recommended.';
  } else if (prob < 80) {
    riskLevel = 'Moderate Risk';
    badgeBg = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    iconColor = 'text-amber-600 dark:text-amber-400';
    Icon = AlertTriangle;
    description = 'Moderate delay probability. Monitor traffic and preparation bottlenecks.';
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Delivery Risk Assessment
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
          {riskLevel}
        </span>
      </div>

      <div className="mt-3 flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {riskLevel} Assessment
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
