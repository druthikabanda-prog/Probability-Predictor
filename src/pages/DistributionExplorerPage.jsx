import React, { useState, useMemo } from 'react';
import { BookOpen, Activity, Layers, Scale, CheckCircle2 } from 'lucide-react';
import DistributionChart from '../components/DistributionChart';
import InputField from '../components/InputField';

export default function DistributionExplorerPage() {
  const [selectedDist, setSelectedDist] = useState('Normal');

  // Normal params
  const [meanNormal, setMeanNormal] = useState(75);
  const [stdNormal, setStdNormal] = useState(10);

  // Gamma params
  const [alphaGamma, setAlphaGamma] = useState(4);
  const [lambdaGamma, setLambdaGamma] = useState(0.05);

  // Uniform params
  const [aUniform, setAUniform] = useState(50);
  const [bUniform, setBUniform] = useState(100);

  const distDetails = useMemo(() => {
    if (selectedDist === 'Normal') {
      const m = Number(meanNormal) || 75;
      const s = Number(stdNormal) || 10;
      const v = Math.pow(s, 2);
      return {
        title: 'Normal Distribution N(μ, σ²)',
        summary: 'Bell-shaped distribution suitable for approximately symmetric continuous data.',
        meanVal: `${m.toFixed(1)}`,
        varianceVal: `${v.toFixed(1)}`,
        stdDevVal: `${s.toFixed(1)}`,
        dataType: 'Symmetric continuous variables centered around a sample mean.',
        example: 'Student exam marks, product weights, blood pressure levels, and standardized delivery transit times.',
        params: { mean: m, stdDev: s }
      };
    } else if (selectedDist === 'Gamma') {
      const a = Number(alphaGamma) || 4;
      const l = Number(lambdaGamma) || 0.05;
      const m = a / l;
      const v = a / Math.pow(l, 2);
      const s = Math.sqrt(v);
      return {
        title: 'Gamma Distribution Gamma(α, λ)',
        summary: 'Useful for positive continuous data and waiting/service-type measurements.',
        meanVal: `${m.toFixed(1)}`,
        varianceVal: `${v.toFixed(1)}`,
        stdDevVal: `${s.toFixed(1)}`,
        dataType: 'Strictly positive continuous variables with right skewness.',
        example: 'Hospital waiting times, customer service call durations, order preparation times, and lifespan data.',
        params: { alpha: a, lambda: l }
      };
    } else {
      const a = Number(aUniform) || 50;
      const b = Number(bUniform) || 100;
      const m = (a + b) / 2;
      const v = Math.pow(b - a, 2) / 12;
      const s = Math.sqrt(v);
      return {
        title: 'Uniform Distribution U(a, b)',
        summary: 'Useful when values within a defined interval are assumed equally likely.',
        meanVal: `${m.toFixed(1)}`,
        varianceVal: `${v.toFixed(1)}`,
        stdDevVal: `${s.toFixed(1)}`,
        dataType: 'Bounded continuous variables with constant probability density.',
        example: 'Scheduled bus arrival windows, lottery ticket number distributions, and uniform random noise.',
        params: { a, b }
      };
    }
  }, [selectedDist, meanNormal, stdNormal, alphaGamma, lambdaGamma, aUniform, bUniform]);

  return (
    <div className="space-y-6 font-inter">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs transition-colors duration-200">
        <h2 className="text-2xl font-bold font-poppins text-slate-900 dark:text-slate-100 tracking-tight">
          Distribution Explorer
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
          Explore behavior, shape curves, parameters, and real-world data types for the three continuous probability distributions.
        </p>
      </div>

      {/* Section 16: Three Distribution Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Normal Card */}
        <button
          type="button"
          onClick={() => setSelectedDist('Normal')}
          className={`p-5 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
            selectedDist === 'Normal'
              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 shadow-2xs ring-1 ring-blue-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold font-poppins text-slate-900 dark:text-slate-100 text-sm">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Normal Distribution</span>
            </div>
            {selectedDist === 'Normal' && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Bell-shaped distribution suitable for approximately symmetric continuous data.
          </p>
        </button>

        {/* Gamma Card */}
        <button
          type="button"
          onClick={() => setSelectedDist('Gamma')}
          className={`p-5 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
            selectedDist === 'Gamma'
              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 shadow-2xs ring-1 ring-blue-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold font-poppins text-slate-900 dark:text-slate-100 text-sm">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Gamma Distribution</span>
            </div>
            {selectedDist === 'Gamma' && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Useful for positive continuous data and waiting/service-type measurements.
          </p>
        </button>

        {/* Uniform Card */}
        <button
          type="button"
          onClick={() => setSelectedDist('Uniform')}
          className={`p-5 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
            selectedDist === 'Uniform'
              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 shadow-2xs ring-1 ring-blue-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold font-poppins text-slate-900 dark:text-slate-100 text-sm">
              <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Uniform Distribution</span>
            </div>
            {selectedDist === 'Uniform' && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Useful when values within a defined interval are assumed equally likely.
          </p>
        </button>
      </div>

      {/* Main Interactive Details & Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls & Parameters (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-5 transition-colors duration-200">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100">{distDetails.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Adjust parameters to observe graph changes</p>
          </div>

          {/* Parameter Inputs */}
          {selectedDist === 'Normal' && (
            <div className="space-y-3">
              <InputField label="Mean (μ)" value={meanNormal} onChange={setMeanNormal} />
              <InputField label="Std Dev (σ)" value={stdNormal} onChange={setStdNormal} min={0.1} />
            </div>
          )}

          {selectedDist === 'Gamma' && (
            <div className="space-y-3">
              <InputField label="Shape (α)" value={alphaGamma} onChange={setAlphaGamma} min={0.1} step={0.5} />
              <InputField label="Rate (λ)" value={lambdaGamma} onChange={setLambdaGamma} min={0.005} step={0.01} />
            </div>
          )}

          {selectedDist === 'Uniform' && (
            <div className="space-y-3">
              <InputField label="Lower Bound (a)" value={aUniform} onChange={setAUniform} />
              <InputField label="Upper Bound (b)" value={bUniform} onChange={setBUniform} />
            </div>
          )}

          {/* Calculated Parameters */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 font-mono text-xs">
            <span className="font-semibold font-manrope text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">Calculated Stats</span>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-inter">Mean E(X)</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{distDetails.meanVal}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-600 dark:text-slate-300 font-inter">Variance Var(X)</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{distDetails.varianceVal}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-600 dark:text-slate-300 font-inter">Std Dev SD(X)</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{distDetails.stdDevVal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Distribution Graph & Application (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <DistributionChart
            distribution={selectedDist}
            params={distDetails.params}
            height={300}
          />

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-3 transition-colors duration-200">
            <h3 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Suitable Data Type &amp; Real-World Example</span>
            </h3>
            <div className="space-y-2 text-xs font-inter text-slate-700 dark:text-slate-300">
              <p>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Suitable Data Type:</strong> {distDetails.dataType}
              </p>
              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-xl text-slate-800 dark:text-slate-200">
                <strong className="text-blue-700 dark:text-blue-300 font-bold block mb-0.5">Real-World Examples:</strong>
                {distDetails.example}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
