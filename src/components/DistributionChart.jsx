import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  normalPDF, normalCDF,
  uniformPDF, uniformCDF,
  gammaPDF, gammaCDF
} from '../utils/mathUtils';
import { useTheme } from '../context/ThemeContext';

export default function DistributionChart({ distribution = 'Normal', params = {}, height = 300, variableName = "Variable X" }) {
  const [plotMode, setPlotMode] = useState('both');
  const { darkMode } = useTheme();

  const chartData = useMemo(() => {
    const data = [];
    let minX = 0;
    let maxX = 60;

    if (distribution === 'Normal') {
      const mean = params.mean ?? 40;
      const stdDev = params.stdDev ?? 8;
      minX = Math.max(0, mean - 4 * stdDev);
      maxX = mean + 4 * stdDev;
      const step = (maxX - minX) / 100;
      for (let x = minX; x <= maxX; x += step) {
        data.push({
          x: Number(x.toFixed(2)),
          PDF: Number(normalPDF(x, mean, stdDev).toFixed(5)),
          CDF: Number(normalCDF(x, mean, stdDev).toFixed(4))
        });
      }
    } else if (distribution === 'Uniform') {
      const a = params.a ?? 15;
      const b = params.b ?? 45;
      minX = Math.max(0, a - (b - a) * 0.2);
      maxX = b + (b - a) * 0.2;
      const step = (maxX - minX) / 100;
      for (let x = minX; x <= maxX; x += step) {
        data.push({
          x: Number(x.toFixed(2)),
          PDF: Number(uniformPDF(x, a, b).toFixed(5)),
          CDF: Number(uniformCDF(x, a, b).toFixed(4))
        });
      }
    } else if (distribution === 'Gamma') {
      const alpha = params.alpha ?? 3;
      const lambda = params.lambda ?? 0.08;
      maxX = Math.ceil((alpha / lambda) * 3);
      const step = Math.max(0.1, maxX / 100);
      for (let x = 0.1; x <= maxX; x += step) {
        data.push({
          x: Number(x.toFixed(2)),
          PDF: Number(gammaPDF(x, alpha, lambda).toFixed(5)),
          CDF: Number(gammaCDF(x, alpha, lambda).toFixed(4))
        });
      }
    }

    return data;
  }, [distribution, params]);

  const axisTickColor = darkMode ? '#94A3B8' : '#64748B';
  const gridStroke = darkMode ? '#1E293B' : '#F1F5F9';

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {distribution} Distribution Model ({variableName})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Probability Density Function (PDF) &amp; Cumulative Distribution Function (CDF)
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setPlotMode('both')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              plotMode === 'both'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            PDF &amp; CDF
          </button>
          <button
            type="button"
            onClick={() => setPlotMode('pdf')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              plotMode === 'pdf'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            PDF Only
          </button>
          <button
            type="button"
            onClick={() => setPlotMode('cdf')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              plotMode === 'cdf'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            CDF Only
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="x" tick={{ fontSize: 11, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
            {plotMode === 'both' && (
              <YAxis yAxisId="right" orientation="right" domain={[0, 1]} tick={{ fontSize: 11, fill: darkMode ? '#818CF8' : '#4F46E5' }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
            )}
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', color: axisTickColor }} />

            {(plotMode === 'both' || plotMode === 'pdf') && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="PDF"
                stroke={darkMode ? '#60A5FA' : '#2563EB'}
                strokeWidth={2.5}
                dot={false}
                name="PDF f(x)"
              />
            )}

            {(plotMode === 'both' || plotMode === 'cdf') && (
              <Line
                yAxisId={plotMode === 'both' ? 'right' : 'left'}
                type="monotone"
                dataKey="CDF"
                stroke={darkMode ? '#818CF8' : '#4F46E5'}
                strokeWidth={2}
                dot={false}
                name="CDF P(X <= x)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
