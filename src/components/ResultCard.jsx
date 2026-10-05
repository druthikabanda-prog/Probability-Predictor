import React, { useMemo } from 'react';
import { Calculator, Database, AlertCircle } from 'lucide-react';
import { inferDatasetContext } from '../utils/mathUtils';

export default function ResultCard({
  datasetName = "Dataset",
  columnName = "Variable",
  distribution = "Normal",
  target = 50,
  lowerVal = null,
  upperVal = null,
  condition = "lessEqual",
  probVal = 0,
  stats = {},
  zScore = null,
  isGammaInvalid = false
}) {
  const percentageStr = (probVal * 100).toFixed(1);

  const context = useMemo(() => {
    return inferDatasetContext(datasetName, [columnName]);
  }, [datasetName, columnName]);

  // Context-aware outcome text generator
  const contextAwareHeadline = useMemo(() => {
    let targetFormatted = `${target}`;
    let lowerFormatted = `${lowerVal}`;
    let upperFormatted = `${upperVal}`;

    const colLower = columnName.toLowerCase();
    if (colLower.includes('time') || colLower.includes('min') || colLower.includes('duration') || colLower.includes('wait')) {
      targetFormatted = `${target} min`;
      lowerFormatted = `${lowerVal} min`;
      upperFormatted = `${upperVal} min`;
    } else if (colLower.includes('price') || colLower.includes('salary') || colLower.includes('cost') || colLower.includes('wage') || colLower.includes('revenue')) {
      targetFormatted = `₹${target}`;
      lowerFormatted = `₹${lowerVal}`;
      upperFormatted = `₹${upperVal}`;
    }

    if (condition === 'lessEqual') {
      return `Probability of ${columnName} ≤ ${targetFormatted}: ${percentageStr}%`;
    } else if (condition === 'greater') {
      return `Probability of ${columnName} > ${targetFormatted}: ${percentageStr}%`;
    } else if (condition === 'between') {
      return `Probability of ${columnName} between ${lowerFormatted} and ${upperFormatted}: ${percentageStr}%`;
    }
    return `Probability of ${columnName} ≤ ${targetFormatted}: ${percentageStr}%`;
  }, [columnName, target, lowerVal, upperVal, condition, percentageStr]);

  if (isGammaInvalid) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 rounded-xl p-6 shadow-2xs space-y-3 font-inter transition-colors duration-200">
        <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 font-bold font-poppins text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Invalid Parameter Warning for Gamma Distribution</span>
        </div>
        <p className="text-xs text-amber-900 dark:text-amber-200 font-semibold leading-relaxed">
          Gamma Distribution requires positive numerical values. Please select another variable or clean the dataset.
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-400 font-inter">
          The selected column <span className="font-mono font-bold">{columnName}</span> contains non-positive values (min value: {stats.min}).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 font-inter">
      {/* Main Result Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold font-manrope text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {context.title}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-medium">
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
              {distribution} Distribution
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 truncate max-w-[160px]">
              {columnName}
            </span>
          </div>
        </div>

        {/* Section 20: Prominent Context-Aware Result Statement */}
        <div className="mt-5 space-y-2">
          <div className="text-xs font-semibold font-manrope uppercase text-slate-400 dark:text-slate-500 tracking-wider">
            Calculated Result
          </div>
          <div className="p-4 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl">
            <h3 className="text-lg sm:text-xl font-extrabold font-poppins text-blue-700 dark:text-blue-300 leading-snug">
              {contextAwareHeadline}
            </h3>
          </div>
        </div>

        {/* Main Percentage Display */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div>
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight font-mono">
              {percentageStr}%
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 font-mono">
              {condition === 'lessEqual' && `P(${columnName} ≤ ${target})`}
              {condition === 'greater' && `P(${columnName} > ${target})`}
              {condition === 'between' && `P(${lowerVal} ≤ ${columnName} ≤ ${upperVal})`}
            </p>
          </div>
        </div>

        {/* Statistical Parameters Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 font-mono text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-manrope font-medium block">Dataset</span>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate" title={datasetName}>
              {datasetName}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-manrope font-medium block">Mean (μ)</span>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {stats.mean ?? 'N/A'}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-manrope font-medium block">Std Dev (σ)</span>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {stats.stdDev ?? 'N/A'}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-manrope font-medium block">Records (N)</span>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              {stats.count ?? 'N/A'}
            </div>
          </div>
        </div>

        {/* Section 12: Supporting Z-Score inside Normal Distribution result */}
        {distribution === 'Normal' && zScore !== null && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl font-mono text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Standardized Z-Score:</span>
            <span className="font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
              Z = {zScore.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Step-by-Step Calculation Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-4 transition-colors duration-200">
        <h3 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Calculation Methodology</span>
        </h3>

        {distribution === 'Normal' && (
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl font-mono text-xs space-y-1.5">
              <p className="font-semibold text-slate-900 dark:text-slate-100 font-manrope">1. Parameter Estimation from Dataset:</p>
              <p className="text-slate-600 dark:text-slate-400">Sample Mean μ = {stats.mean}, Sample Std Dev σ = {stats.stdDev}, Variance σ² = {stats.variance}</p>
              {zScore !== null && (
                <p className="text-blue-700 dark:text-blue-400 font-medium">Standardized Z-Score: Z = (Target - μ) / σ = ({target} - {stats.mean}) / {stats.stdDev} = {zScore.toFixed(2)}</p>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl font-mono text-xs space-y-1.5">
              <p className="font-semibold text-slate-900 dark:text-slate-100 font-manrope">2. Continuous Cumulative Integration:</p>
              <p className="text-blue-700 dark:text-blue-400 font-bold">{contextAwareHeadline}</p>
            </div>
          </div>
        )}

        {distribution === 'Gamma' && (
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl font-mono text-xs space-y-1.5">
              <p className="font-semibold text-slate-900 dark:text-slate-100 font-manrope">1. Method of Moments Parameter Estimation:</p>
              <p className="text-slate-600 dark:text-slate-400">Shape Parameter α = μ² / σ² = {((stats.mean ** 2) / (stats.variance || 1)).toFixed(2)}</p>
              <p className="text-slate-600 dark:text-slate-400">Rate Parameter λ = μ / σ² = {(stats.mean / (stats.variance || 1)).toFixed(4)}</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl font-mono text-xs space-y-1.5">
              <p className="font-semibold text-slate-900 dark:text-slate-100 font-manrope">2. Incomplete Gamma Integration:</p>
              <p className="text-blue-700 dark:text-blue-400 font-bold">{contextAwareHeadline}</p>
            </div>
          </div>
        )}

        {distribution === 'Uniform' && (
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl font-mono text-xs space-y-1.5">
              <p className="font-semibold text-slate-900 dark:text-slate-100 font-manrope">1. Bounded Data Range:</p>
              <p className="text-slate-600 dark:text-slate-400">Lower Bound (a) = {stats.min}, Upper Bound (b) = {stats.max}</p>
              <p className="text-slate-600 dark:text-slate-400">Mean E(X) = (a+b)/2 = {((stats.min + stats.max)/2).toFixed(2)}, Variance = (b-a)²/12 = {((stats.max - stats.min)**2/12).toFixed(2)}</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl font-mono text-xs space-y-1.5">
              <p className="font-semibold text-slate-900 dark:text-slate-100 font-manrope">2. Uniform Cumulative Probability:</p>
              <p className="text-blue-700 dark:text-blue-400 font-bold">{contextAwareHeadline}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
