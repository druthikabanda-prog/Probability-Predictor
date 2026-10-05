import React, { useMemo } from 'react';
import { Database, Upload, Calculator, Edit3, Sparkles, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import {
  detectNumericalColumns,
  extractColumnValues,
  inferDatasetContext,
  normalCDF
} from '../utils/mathUtils';
import { PRELOADED_DATASETS } from '../data/sampleDatasets';
import { useTheme } from '../context/ThemeContext';

export default function DashboardPage({
  dataset,
  selectedColumn,
  stats,
  onColumnSelected,
  onDatasetLoaded,
  onSelectPreloaded,
  onNavigate
}) {
  const { darkMode } = useTheme();

  const numericalCols = useMemo(() => {
    return dataset ? detectNumericalColumns(dataset.data) : [];
  }, [dataset]);

  const totalColumnsCount = useMemo(() => {
    if (!dataset || !dataset.data || dataset.data.length === 0) return 0;
    return Object.keys(dataset.data[0]).length;
  }, [dataset]);

  const datasetContext = useMemo(() => {
    if (!dataset) return { title: 'General Numerical Data Analysis', badge: 'Numerical Dataset' };
    const allCols = dataset.data[0] ? Object.keys(dataset.data[0]) : [];
    return inferDatasetContext(dataset.name, allCols);
  }, [dataset]);

  const colValues = useMemo(() => {
    if (!dataset || !selectedColumn) return [];
    return extractColumnValues(dataset.data, selectedColumn);
  }, [dataset, selectedColumn]);

  const histogramBins = useMemo(() => {
    if (colValues.length === 0) return [];
    const minVal = Math.floor(stats.min);
    const maxVal = Math.ceil(stats.max);
    const numBins = 10;
    const binWidth = Math.max(0.1, (maxVal - minVal) / numBins);

    const bins = Array.from({ length: numBins }, (_, i) => {
      const start = minVal + i * binWidth;
      const end = start + binWidth;
      return {
        binLabel: `${Math.round(start)}-${Math.round(end)}`,
        count: 0
      };
    });

    colValues.forEach((val) => {
      const idx = Math.min(numBins - 1, Math.max(0, Math.floor((val - minVal) / binWidth)));
      if (bins[idx]) bins[idx].count++;
    });

    return bins;
  }, [colValues, stats]);

  const mean = Number(stats.mean) || 0;
  const stdDev = Number(stats.stdDev) || 1;
  const sampleTarget = Math.round(mean + stdDev * 0.5);
  const sampleProb = normalCDF(sampleTarget, mean, stdDev) * 100;

  const axisTickColor = darkMode ? '#94A3B8' : '#64748B';
  const gridStroke = darkMode ? '#1E293B' : '#F1F5F9';

  return (
    <div className="space-y-6 font-inter">
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-200">
        <div className="max-w-2xl space-y-1.5">
          <div className="text-xs font-semibold font-manrope text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span>Unified Probability Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-slate-900 dark:text-slate-100 tracking-tight">
            Probability Predictor
          </h1>
          <p className="text-sm font-semibold font-inter text-slate-700 dark:text-slate-300">
            Unified Data Analysis
          </p>
          <p className="text-xs font-inter text-slate-500 dark:text-slate-400 leading-relaxed">
            General-purpose probability estimation using continuous probability distributions (Normal, Gamma, Uniform) for any real-world numerical dataset.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 font-manrope">
          <button
            type="button"
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Dataset</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('predictor')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Probability Predictor</span>
          </button>
        </div>
      </div>

      {/* No Dataset State */}
      {!dataset ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 sm:p-12 text-center space-y-5 shadow-2xs transition-colors duration-200">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
            <Database className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold font-poppins text-slate-900 dark:text-slate-100">
              Welcome to Probability Predictor
            </h2>
            <blockquote className="text-sm font-inter text-slate-600 dark:text-slate-300 italic border-l-2 border-blue-500 dark:border-blue-400 pl-3 py-1 my-2 inline-block">
              Upload an Excel/CSV dataset or enter numerical data manually to begin probability analysis.
            </blockquote>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-manrope pt-2">
            <button
              type="button"
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Dataset</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Enter Data Manually</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectPreloaded(PRELOADED_DATASETS[0])}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/80 font-semibold text-xs rounded-xl border border-blue-200 dark:border-blue-900/50 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Try Demo Dataset</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Section 7: Dataset Information Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-4 transition-colors duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100">Dataset Information</h3>
              </div>
              <span className="text-xs font-semibold font-manrope px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                Context: {datasetContext.title}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold font-manrope block">Dataset Name</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate block" title={dataset.name}>{dataset.name}</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold font-manrope block">Number of Rows</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{stats.count}</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold font-manrope block">Total Columns</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{totalColumnsCount}</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold font-manrope block">Numerical Columns</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{numericalCols.length}</span>
              </div>
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-blue-700 dark:text-blue-300 text-[10px] uppercase font-bold font-manrope block">Selected Variable</span>
                <span className="font-bold text-blue-700 dark:text-blue-300 truncate block" title={selectedColumn}>{selectedColumn}</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold font-manrope block">Dataset Context</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block" title={datasetContext.title}>{datasetContext.badge}</span>
              </div>
            </div>

            {/* Numerical Variable Selector Chips */}
            {numericalCols.length > 1 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold font-manrope text-slate-600 dark:text-slate-400">Switch Variable:</span>
                {numericalCols.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => onColumnSelected(col)}
                    className={`px-3 py-1 rounded-lg text-xs font-manrope transition-all cursor-pointer ${
                      selectedColumn === col
                        ? 'bg-blue-600 dark:bg-blue-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section 7: Statistics Summary Grid */}
          <div className="space-y-3">
            <h3 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Statistical Summary for <span className="font-mono text-blue-600 dark:text-blue-400">{selectedColumn}</span></span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <StatCard title="Count (N)" value={`${stats.count}`} />
              <StatCard title="Mean (μ)" value={`${stats.mean}`} />
              <StatCard title="Median" value={`${stats.median}`} />
              <StatCard title="Variance (σ²)" value={`${stats.variance}`} />
              <StatCard title="Std Dev (σ)" value={`${stats.stdDev}`} />
              <StatCard title="Minimum" value={`${stats.min}`} />
              <StatCard title="Maximum" value={`${stats.max}`} />
              <StatCard title="Range" value={`${stats.range}`} />
            </div>
          </div>

          {/* Section 7: Visualization (Histogram of selected variable) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div>
                  <h4 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100">
                    Histogram: {selectedColumn} Frequency Distribution
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-inter">Binned frequency graph across empirical data range</p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  {histogramBins.length} Bins
                </span>
              </div>

              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={histogramBins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="binLabel" tick={{ fontSize: 10, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
                    <YAxis tick={{ fontSize: 11, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
                    <Tooltip />
                    <Bar dataKey="count" name="Frequency" fill={darkMode ? '#60A5FA' : '#2563EB'} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Prediction Shortcut Card */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-4 transition-colors duration-200">
              <div>
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 flex items-center justify-between">
                  <h4 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Quick Probability</span>
                  </h4>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/50">
                    Normal Model
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-manrope font-bold block uppercase">Dataset Context</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 font-inter">{datasetContext.title}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl flex justify-between text-slate-700 dark:text-slate-300">
                    <span className="font-inter">Sample Target</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{sampleTarget}</span>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 rounded-xl flex justify-between text-blue-700 dark:text-blue-300">
                    <span className="font-bold font-inter">P({selectedColumn} ≤ {sampleTarget})</span>
                    <span className="font-extrabold">{sampleProb.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('predictor')}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-manrope font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Open Probability Predictor</span>
              </button>
            </div>
          </div>

          {/* Dataset Preview Table */}
          <DataTable
            data={dataset.data}
            title={`Dataset Preview: ${dataset.name}`}
            selectedColumn={selectedColumn}
            onColumnSelected={onColumnSelected}
          />
        </>
      )}
    </div>
  );
}
