import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Database, AlertCircle } from 'lucide-react';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import NormalCurve from '../components/NormalCurve';
import DistributionChart from '../components/DistributionChart';
import {
  normalCDF,
  gammaCDF,
  uniformCDF,
  estimateGammaParams,
  calculateZScore,
  detectNumericalColumns,
  extractColumnValues,
  calculateStats,
  inferDatasetContext
} from '../utils/mathUtils';

export default function PredictorPage({
  dataset,
  selectedColumn,
  onColumnSelected,
  onNavigate
}) {
  const numericalCols = useMemo(() => {
    return dataset ? detectNumericalColumns(dataset.data) : [];
  }, [dataset]);

  const activeCol = selectedColumn || (numericalCols[0] ?? '');

  const colValues = useMemo(() => {
    if (!dataset || !activeCol) return [];
    return extractColumnValues(dataset.data, activeCol);
  }, [dataset, activeCol]);

  const colStats = useMemo(() => {
    return calculateStats(colValues);
  }, [colValues]);

  const datasetContext = useMemo(() => {
    if (!dataset) return { title: 'General Numerical Data Analysis' };
    return inferDatasetContext(dataset.name, [activeCol]);
  }, [dataset, activeCol]);

  // Check if Gamma is invalid for this variable (Gamma requires x > 0)
  const isGammaInvalid = useMemo(() => {
    if (colValues.length === 0) return false;
    return colValues.some((v) => v <= 0);
  }, [colValues]);

  // Predictor Inputs
  const [distribution, setDistribution] = useState('Normal'); // 'Normal' | 'Gamma' | 'Uniform'
  const [condition, setCondition] = useState('lessEqual'); // 'lessEqual' | 'greater' | 'between'
  const [targetInput, setTargetInput] = useState(() => Math.round(colStats.mean + colStats.stdDev * 0.5));
  const [lowerValInput, setLowerValInput] = useState(() => Math.round(colStats.min + colStats.range * 0.25));
  const [upperValInput, setUpperValInput] = useState(() => Math.round(colStats.mean + colStats.stdDev * 0.5));

  // Sync target default whenever selected column changes
  useEffect(() => {
    if (colStats && colStats.mean) {
      setTargetInput(Math.round(colStats.mean + colStats.stdDev * 0.5));
      setLowerValInput(Math.round(colStats.min + colStats.range * 0.25));
      setUpperValInput(Math.round(colStats.mean + colStats.stdDev * 0.5));
    }
  }, [activeCol, dataset?.id]);

  const targetVal = Number(targetInput) || 0;
  const lowerVal = Number(lowerValInput) || 0;
  const upperVal = Number(upperValInput) || 0;

  // Exact continuous probability calculations
  const calculations = useMemo(() => {
    const m = Number(colStats.mean) || 1;
    const s = Number(colStats.stdDev) || 1;
    const v = Math.max(0.001, Math.pow(s, 2));

    let z = null;
    let probVal = 0;
    let gammaParams = { alpha: 1, lambda: 0.1 };

    if (distribution === 'Normal') {
      z = calculateZScore(targetVal, m, s);
      if (condition === 'lessEqual') {
        probVal = normalCDF(targetVal, m, s);
      } else if (condition === 'greater') {
        probVal = 1 - normalCDF(targetVal, m, s);
      } else if (condition === 'between') {
        probVal = Math.max(0, normalCDF(upperVal, m, s) - normalCDF(lowerVal, m, s));
      }
    } else if (distribution === 'Gamma') {
      gammaParams = estimateGammaParams(m, v);
      if (condition === 'lessEqual') {
        probVal = gammaCDF(targetVal, gammaParams.alpha, gammaParams.lambda);
      } else if (condition === 'greater') {
        probVal = 1 - gammaCDF(targetVal, gammaParams.alpha, gammaParams.lambda);
      } else if (condition === 'between') {
        probVal = Math.max(0, gammaCDF(upperVal, gammaParams.alpha, gammaParams.lambda) - gammaCDF(lowerVal, gammaParams.alpha, gammaParams.lambda));
      }
    } else if (distribution === 'Uniform') {
      const a = Number(colStats.min) || 0;
      const b = Number(colStats.max) || 100;
      if (condition === 'lessEqual') {
        probVal = uniformCDF(targetVal, a, b);
      } else if (condition === 'greater') {
        probVal = 1 - uniformCDF(targetVal, a, b);
      } else if (condition === 'between') {
        probVal = Math.max(0, uniformCDF(upperVal, a, b) - uniformCDF(lowerVal, a, b));
      }
    }

    return {
      zScore: z,
      probVal: Math.min(1, Math.max(0, probVal)),
      gammaParams
    };
  }, [distribution, condition, targetVal, lowerVal, upperVal, colStats]);

  if (!dataset) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-2xs font-inter transition-colors duration-200">
        <Database className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500" />
        <h3 className="font-bold font-poppins text-lg text-slate-900 dark:text-slate-100">No Dataset Available</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Please upload an Excel/CSV dataset or enter data manually to perform probability predictions.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('upload')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-manrope font-semibold text-xs rounded-xl shadow-2xs cursor-pointer"
        >
          Upload Dataset Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-inter">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <span className="text-xs font-semibold font-manrope text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
            {datasetContext.title}
          </span>
          <h2 className="text-2xl font-bold font-poppins text-slate-900 dark:text-slate-100 tracking-tight">
            Probability Predictor
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Data-driven probability predictions for variable <strong className="text-blue-600 dark:text-blue-400 font-mono">{activeCol}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="truncate max-w-[180px]">{dataset.name}</span>
        </div>
      </div>

      {/* Main Prediction Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-5 transition-colors duration-200">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100">Prediction Controls</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select numerical column, continuous distribution, and condition</p>
          </div>

          <div className="space-y-4">
            {/* Numerical Column Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold font-manrope text-slate-700 dark:text-slate-300">Select Numerical Column</label>
              <select
                value={activeCol}
                onChange={(e) => onColumnSelected(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {numericalCols.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* Distribution Selector (ONLY Normal, Gamma, Uniform) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold font-manrope text-slate-700 dark:text-slate-300">Distribution Model</label>
              <select
                value={distribution}
                onChange={(e) => setDistribution(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-manrope font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Normal">Normal Distribution N(μ, σ²)</option>
                <option value="Gamma">Gamma Distribution Gamma(α, λ)</option>
                <option value="Uniform">Uniform Distribution U(a, b)</option>
              </select>
            </div>

            {/* Section 13 Warning for Non-Positive values on Gamma */}
            {distribution === 'Gamma' && isGammaInvalid && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-800 dark:text-amber-300 space-y-1 font-inter">
                <div className="flex items-center gap-1.5 font-bold font-poppins text-amber-900 dark:text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Gamma Distribution Requirement</span>
                </div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Gamma Distribution requires positive numerical values. Please select another variable or clean the dataset.
                </p>
              </div>
            )}

            {/* Data-Driven Parameter Estimation Readout */}
            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-xl space-y-1 text-xs font-mono">
              <span className="text-[10px] uppercase font-bold font-manrope text-blue-700 dark:text-blue-400 block">Dataset Estimated Parameters:</span>
              {distribution === 'Normal' && (
                <p className="text-slate-800 dark:text-slate-200 font-medium">Mean μ = {colStats.mean}, Std Dev σ = {colStats.stdDev}, Variance σ² = {colStats.variance}</p>
              )}
              {distribution === 'Gamma' && (
                <p className="text-slate-800 dark:text-slate-200 font-medium">Shape α = {calculations.gammaParams.alpha}, Rate λ = {calculations.gammaParams.lambda}</p>
              )}
              {distribution === 'Uniform' && (
                <p className="text-slate-800 dark:text-slate-200 font-medium">Min a = {colStats.min}, Max b = {colStats.max}</p>
              )}
            </div>

            {/* Probability Condition Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold font-manrope text-slate-700 dark:text-slate-300">Probability Condition</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium">
                <button
                  type="button"
                  onClick={() => setCondition('lessEqual')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    condition === 'lessEqual'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  P(X ≤ target)
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('greater')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    condition === 'greater'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  P(X &gt; target)
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('between')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    condition === 'between'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  P(L &lt; X &lt; U)
                </button>
              </div>
            </div>

            {/* Target Value Inputs */}
            {(condition === 'lessEqual' || condition === 'greater') && (
              <InputField
                label={`Target Value (${activeCol})`}
                value={targetInput}
                onChange={setTargetInput}
                step="any"
              />
            )}

            {condition === 'between' && (
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Lower Value (L)"
                  value={lowerValInput}
                  onChange={setLowerValInput}
                  step="any"
                />
                <InputField
                  label="Upper Value (U)"
                  value={upperValInput}
                  onChange={setUpperValInput}
                  step="any"
                />
              </div>
            )}
          </div>

          <button
            type="button"
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-manrope font-semibold text-xs rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-white" />
            <span>Predict Probability</span>
          </button>
        </div>

        {/* RIGHT PANEL Results & Curves (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <ResultCard
            datasetName={dataset.name}
            columnName={activeCol}
            distribution={distribution}
            target={targetVal}
            lowerVal={lowerVal}
            upperVal={upperVal}
            condition={condition}
            probVal={calculations.probVal}
            stats={colStats}
            zScore={calculations.zScore}
            isGammaInvalid={distribution === 'Gamma' && isGammaInvalid}
          />

          {!(distribution === 'Gamma' && isGammaInvalid) && (
            distribution === 'Normal' ? (
              <NormalCurve
                mean={colStats.mean}
                stdDev={colStats.stdDev}
                target={targetVal}
                lowerBound={lowerVal}
                upperBound={upperVal}
                condition={condition}
                variableName={activeCol}
                title={`Normal Bell Curve for ${activeCol}`}
                height={270}
              />
            ) : (
              <DistributionChart
                distribution={distribution}
                params={
                  distribution === 'Gamma'
                    ? calculations.gammaParams
                    : { a: colStats.min, b: colStats.max }
                }
                variableName={activeCol}
                height={270}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
