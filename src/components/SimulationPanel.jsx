import React, { useState, useEffect } from 'react';
import { Play, BarChart3, Cpu } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import {
  randomNormal,
  randomUniform,
  randomGamma,
  calculateStats,
  estimateGammaParams
} from '../utils/mathUtils';
import InputField from './InputField';
import { useTheme } from '../context/ThemeContext';

export default function SimulationPanel({
  datasetName = "Dataset",
  columnName = "Variable",
  stats = { mean: 40, stdDev: 8, min: 10, max: 80, count: 100 },
  defaultTarget = 50
}) {
  const [numSimulations, setNumSimulations] = useState(1000);
  const [target, setTarget] = useState(defaultTarget);
  const [distribution, setDistribution] = useState('Normal'); // 'Normal' | 'Gamma' | 'Uniform'

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);
  const { darkMode } = useTheme();

  const runSimulation = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const generatedValues = [];
      const count = Math.min(10000, Math.max(10, Number(numSimulations) || 1000));
      const m = Number(stats.mean) || 40;
      const s = Number(stats.stdDev) || 8;
      const t = Number(target) || 50;

      if (distribution === 'Normal') {
        for (let i = 0; i < count; i++) {
          generatedValues.push(Number(randomNormal(m, s).toFixed(2)));
        }
      } else if (distribution === 'Uniform') {
        const a = Number(stats.min) || 0;
        const b = Number(stats.max) || 100;
        for (let i = 0; i < count; i++) {
          generatedValues.push(Number(randomUniform(a, b).toFixed(2)));
        }
      } else if (distribution === 'Gamma') {
        const variance = Math.pow(s, 2) || 1;
        const { alpha, lambda } = estimateGammaParams(m, variance);
        for (let i = 0; i < count; i++) {
          generatedValues.push(Number(randomGamma(alpha, lambda).toFixed(2)));
        }
      }

      const simStats = calculateStats(generatedValues);
      const belowCount = generatedValues.filter(x => x <= t).length;
      const aboveCount = count - belowCount;
      const belowPct = Number(((belowCount / count) * 100).toFixed(1));
      const abovePct = Number(((aboveCount / count) * 100).toFixed(1));

      const minVal = Math.floor(simStats.min);
      const maxVal = Math.ceil(simStats.max);
      const numBins = 20;
      const binWidth = Math.max(0.1, (maxVal - minVal) / numBins);

      const bins = Array.from({ length: numBins }, (_, i) => {
        const binStart = minVal + i * binWidth;
        const binEnd = binStart + binWidth;
        return {
          binLabel: `${Math.round(binStart)}-${Math.round(binEnd)}`,
          count: 0
        };
      });

      generatedValues.forEach(val => {
        const binIdx = Math.min(numBins - 1, Math.max(0, Math.floor((val - minVal) / binWidth)));
        if (bins[binIdx]) bins[binIdx].count++;
      });

      setSimulationResults({
        simStats,
        belowPct,
        abovePct,
        histogram: bins,
        count,
        target: t
      });

      setIsSimulating(false);
    }, 150);
  };

  useEffect(() => {
    runSimulation();
  }, [datasetName, columnName, stats.mean, stats.stdDev, distribution]);

  const axisTickColor = darkMode ? '#94A3B8' : '#64748B';
  const gridStroke = darkMode ? '#1E293B' : '#F1F5F9';

  return (
    <div className="space-y-6 font-inter">
      {/* Simulation Setup Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-5 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100">
                Monte Carlo Simulation Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Simulating <strong className="text-blue-600 dark:text-blue-400 font-mono">{columnName}</strong> from <strong className="text-slate-800 dark:text-slate-200">{datasetName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSimulating}
            onClick={runSimulation}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-manrope font-semibold text-xs rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isSimulating ? (
              <span>Simulating...</span>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Run Simulation</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Simulated Sample Count (N)"
            value={numSimulations}
            onChange={setNumSimulations}
            min={10}
            max={10000}
            step={100}
          />
          <InputField
            label={`Target Value (${columnName})`}
            value={target}
            onChange={setTarget}
          />
          <div className="flex flex-col gap-1.5 font-manrope">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Distribution Model</label>
            <select
              value={distribution}
              onChange={(e) => setDistribution(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Normal">Normal Distribution N(μ, σ²)</option>
              <option value="Gamma">Gamma Distribution Gamma(α, λ)</option>
              <option value="Uniform">Uniform Distribution U(a, b)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results & Comparison Section */}
      {simulationResults && (
        <div className="space-y-6">
          {/* Section 18: Original Data vs Simulated Data Comparison Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100">
                Original Data vs Simulated Data
              </h4>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900/50">
                {distribution} Distribution Model
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/80 uppercase text-[11px] font-manrope text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 font-semibold">Statistical Metric</th>
                    <th className="p-3 text-slate-900 dark:text-slate-100 font-bold">Original Dataset ({datasetName})</th>
                    <th className="p-3 text-blue-700 dark:text-blue-400 font-bold">Simulated Data (N = {simulationResults.count})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-medium text-slate-600 dark:text-slate-300 font-inter">Sample Count (N)</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{stats.count}</td>
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{simulationResults.count}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-600 dark:text-slate-300 font-inter">Simulated Mean (μ)</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{stats.mean}</td>
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{simulationResults.simStats.mean}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-600 dark:text-slate-300 font-inter">Simulated Standard Deviation (σ)</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{stats.stdDev}</td>
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{simulationResults.simStats.stdDev}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-600 dark:text-slate-300 font-inter">Minimum Value</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{stats.min}</td>
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{simulationResults.simStats.min}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-600 dark:text-slate-300 font-inter">Maximum Value</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{stats.max}</td>
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{simulationResults.simStats.max}</td>
                  </tr>
                  <tr className="bg-blue-50/50 dark:bg-blue-950/30">
                    <td className="p-3 font-bold text-blue-900 dark:text-blue-300 font-inter">Probability Below Target P(X ≤ {simulationResults.target})</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400 font-inter">Continuous CDF Model</td>
                    <td className="p-3 font-extrabold text-blue-700 dark:text-blue-400 text-sm">{simulationResults.belowPct}%</td>
                  </tr>
                  <tr className="bg-blue-50/50 dark:bg-blue-950/30">
                    <td className="p-3 font-bold text-blue-900 dark:text-blue-300 font-inter">Probability Above Target P(X &gt; {simulationResults.target})</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400 font-inter">Continuous CDF Model</td>
                    <td className="p-3 font-extrabold text-blue-700 dark:text-blue-400 text-sm">{simulationResults.abovePct}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Simulated Histogram */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs transition-colors duration-200">
            <h4 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Simulated Data Histogram (N = {simulationResults.count})</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-inter mb-4">Empirical frequency distribution of simulated {columnName} trial values</p>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={simulationResults.histogram} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="binLabel" tick={{ fontSize: 10, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
                  <YAxis tick={{ fontSize: 11, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
                  <Tooltip />
                  <Bar dataKey="count" name="Frequency" fill={darkMode ? '#60A5FA' : '#2563EB'} radius={[4, 4, 0, 0]} />
                  <ReferenceLine x={`${simulationResults.target}`} stroke="#EF4444" strokeWidth={2} strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
