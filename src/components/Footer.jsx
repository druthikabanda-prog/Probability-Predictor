import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 font-inter transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-left">
          <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span className="font-poppins text-slate-900 dark:text-slate-100 font-bold">Probability Predictor</span>
            <span className="text-slate-300 dark:text-slate-700 font-normal">|</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium font-inter">Unified Data Analysis</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-inter">
            General-purpose continuous probability analysis system for real-world datasets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-manrope font-medium text-[11px] border border-slate-200 dark:border-slate-700">
            Continuous Probability Platform
          </span>
        </div>
      </div>
    </footer>
  );
}
