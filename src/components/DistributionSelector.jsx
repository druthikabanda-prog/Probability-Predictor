import React from 'react';
import { Activity, Layers, Zap, Scale } from 'lucide-react';

export default function DistributionSelector({ selected, onChange }) {
  const distributions = [
    {
      id: 'Normal',
      name: 'Normal Distribution',
      icon: Activity,
      tag: 'N(μ, σ²)',
      desc: 'Symmetric bell curve around dataset mean.'
    },
    {
      id: 'Exponential',
      name: 'Exponential Distribution',
      icon: Zap,
      tag: 'Exp(λ)',
      desc: 'Models waiting times between arrival events.'
    },
    {
      id: 'Gamma',
      name: 'Gamma Distribution',
      icon: Layers,
      tag: 'Gamma(α, λ)',
      desc: 'Models multi-stage process execution times.'
    },
    {
      id: 'Uniform',
      name: 'Uniform Distribution',
      icon: Scale,
      tag: 'U(a, b)',
      desc: 'Equal probability density across a bounded interval.'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-inter">
      {distributions.map((dist) => {
        const Icon = dist.icon;
        const isSelected = selected === dist.id;
        return (
          <button
            key={dist.id}
            type="button"
            onClick={() => onChange(dist.id)}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              isSelected
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 dark:border-blue-400 text-slate-900 dark:text-slate-100 shadow-2xs ring-1 ring-blue-500/40'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}>
                  {dist.tag}
                </span>
              </div>
              <h4 className="font-bold text-sm mt-3 text-slate-900 dark:text-slate-100 font-poppins">{dist.name}</h4>
              <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                {dist.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
