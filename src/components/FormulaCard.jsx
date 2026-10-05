import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import { BookOpen } from 'lucide-react';

function KatexLine({ math }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(math, ref.current, {
        displayMode: true,
        throwOnError: false
      });
    }
  }, [math]);

  return <div ref={ref} className="my-1.5 overflow-x-auto text-center text-slate-900 dark:text-slate-100" />;
}

export default function FormulaCard({ title, expressions = [] }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs flex flex-col justify-between h-full space-y-4 font-inter transition-colors duration-200">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-center gap-2">
        <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <h4 className="font-bold font-poppins text-xs sm:text-sm text-slate-900 dark:text-slate-100 tracking-wider text-center uppercase font-manrope">
          {title}
        </h4>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-2 py-4 bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-4 font-mono text-sm">
        {expressions.map((exp, i) => (
          <KatexLine key={i} math={exp} />
        ))}
      </div>
    </div>
  );
}
