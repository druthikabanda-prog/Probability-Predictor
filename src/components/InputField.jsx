import React from 'react';

export default function InputField({
  label,
  value,
  onChange,
  type = 'number',
  min,
  max,
  step = 'any',
  placeholder,
  unit,
  error,
  helpText
}) {
  return (
    <div className="space-y-1.5 font-inter">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {unit && (
          <span className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500">
            {unit}
          </span>
        )}
      </div>

      <div className="relative">
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/90 border rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all ${
            error
              ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500'
              : 'border-slate-200 dark:border-slate-700'
          }`}
        />
      </div>

      {error && (
        <p className="text-[11px] font-medium text-rose-500 dark:text-rose-400 mt-1">
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          {helpText}
        </p>
      )}
    </div>
  );
}
