import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { normalPDF, normalCDF } from '../utils/mathUtils';
import { useTheme } from '../context/ThemeContext';

export default function NormalCurve({
  mean = 40,
  stdDev = 8,
  target = 50,
  lowerBound = null,
  upperBound = null,
  height = 320,
  title = "Normal Probability Distribution",
  variableName = "Variable X",
  condition = "lessEqual",
  unit = ""
}) {
  const { darkMode } = useTheme();

  const chartData = useMemo(() => {
    const data = [];
    const minX = Math.max(0, mean - 4 * stdDev);
    const maxX = mean + 4 * stdDev;
    const step = (maxX - minX) / 100;

    for (let x = minX; x <= maxX; x += step) {
      const pdfVal = normalPDF(x, mean, stdDev);
      const cdfVal = normalCDF(x, mean, stdDev);

      let shadedVal = 0;
      if (condition === 'lessEqual') {
        shadedVal = x <= target ? pdfVal : 0;
      } else if (condition === 'greater') {
        shadedVal = x >= target ? pdfVal : 0;
      } else if (condition === 'between' && lowerBound !== null && upperBound !== null) {
        shadedVal = x >= lowerBound && x <= upperBound ? pdfVal : 0;
      }

      data.push({
        x: Number(x.toFixed(2)),
        pdf: Number(pdfVal.toFixed(5)),
        shaded: Number(shadedVal.toFixed(5)),
        cdf: Number(cdfVal.toFixed(4))
      });
    }
    return data;
  }, [mean, stdDev, target, lowerBound, upperBound, condition]);

  const axisTickColor = darkMode ? '#94A3B8' : '#64748B';
  const gridStroke = darkMode ? '#1E293B' : '#F1F5F9';
  const mainLineColor = darkMode ? '#60A5FA' : '#2563EB';
  const shadedFill = darkMode ? '#3B82F6' : '#93C5FD';
  const refLineColor = darkMode ? '#94A3B8' : '#64748B';
  const targetLineColor = darkMode ? '#38BDF8' : '#1D4ED8';

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Normal Model N(μ = {mean}, σ = {stdDev}) for {variableName}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-600 dark:bg-blue-400 inline-block" />
            <span>Density Curve</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-100 dark:bg-blue-950 border border-blue-400 dark:border-blue-600 inline-block" />
            <span>Probability Region</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 15, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis
              dataKey="x"
              tick={{ fontSize: 11, fill: axisTickColor }}
              stroke={darkMode ? '#475569' : '#CBD5E1'}
            />
            <YAxis tick={{ fontSize: 11, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 p-3 rounded-xl shadow-lg text-xs font-mono">
                      <p className="font-bold text-blue-600 dark:text-blue-400">{variableName}: {data.x} {unit}</p>
                      <div className="mt-1 space-y-0.5 text-slate-600 dark:text-slate-300 text-[11px]">
                        <p>Probability Density f(x): {data.pdf}</p>
                        <p className="text-blue-700 dark:text-blue-400 font-bold">P(X ≤ {data.x}): {(data.cdf * 100).toFixed(2)}%</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="pdf"
              stroke={mainLineColor}
              strokeWidth={2.5}
              fillOpacity={0.05}
              fill={mainLineColor}
              name="Density"
            />

            <Area
              type="monotone"
              dataKey="shaded"
              stroke={darkMode ? '#60A5FA' : '#3B82F6'}
              strokeWidth={1}
              fillOpacity={darkMode ? 0.45 : 0.35}
              fill={shadedFill}
              name="Probability Area"
            />

            <ReferenceLine
              x={mean}
              stroke={refLineColor}
              strokeDasharray="4 4"
              label={{ value: `μ=${mean}`, position: 'top', fill: axisTickColor, fontSize: 11, fontWeight: 600 }}
            />

            {target !== null && (condition === 'lessEqual' || condition === 'greater') && (
              <ReferenceLine
                x={target}
                stroke={targetLineColor}
                strokeWidth={2}
                label={{ value: `Target: ${target}`, position: 'top', fill: targetLineColor, fontSize: 11, fontWeight: 700 }}
              />
            )}

            {condition === 'between' && lowerBound !== null && upperBound !== null && (
              <>
                <ReferenceLine
                  x={lowerBound}
                  stroke={targetLineColor}
                  strokeWidth={2}
                  label={{ value: `L: ${lowerBound}`, position: 'top', fill: targetLineColor, fontSize: 10 }}
                />
                <ReferenceLine
                  x={upperBound}
                  stroke={targetLineColor}
                  strokeWidth={2}
                  label={{ value: `U: ${upperBound}`, position: 'top', fill: targetLineColor, fontSize: 10 }}
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
