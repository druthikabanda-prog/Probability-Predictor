import React, { useMemo } from 'react';
import { Database, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import {
  detectNumericalColumns,
  extractColumnValues,
  calculateStats,
  inferDatasetContext
} from '../utils/mathUtils';
import { useTheme } from '../context/ThemeContext';

export default function DataAnalysisPage({
  dataset,
  selectedColumn,
  onColumnSelected,
  onNavigate
}) {
  const { darkMode } = useTheme();

  const numericalCols = useMemo(() => {
    return dataset ? detectNumericalColumns(dataset.data) : [];
  }, [dataset]);

  const activeCol = selectedColumn || (numericalCols[0] ?? '');

  const secondCol = useMemo(() => {
    return numericalCols.find(c => c !== activeCol) || activeCol;
  }, [numericalCols, activeCol]);

  const colValues = useMemo(() => {
    if (!dataset || !activeCol) return [];
    return extractColumnValues(dataset.data, activeCol);
  }, [dataset, activeCol]);

  const stats = useMemo(() => {
    return calculateStats(colValues);
  }, [colValues]);

  const datasetContext = useMemo(() => {
    if (!dataset) return { title: 'General Numerical Data Analysis' };
    return inferDatasetContext(dataset.name, Object.keys(dataset.data[0] || {}));
  }, [dataset]);

  // Calculate missing values count in dataset
  const missingValuesCount = useMemo(() => {
    if (!dataset || !dataset.data) return 0;
    let count = 0;
    dataset.data.forEach((row) => {
      Object.values(row).forEach((val) => {
        if (val === null || val === undefined || val === '') count++;
      });
    });
    return count;
  }, [dataset]);

  // Histogram calculation
  const histogramData = useMemo(() => {
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

  const breakdownData = useMemo(() => {
    let aboveMean = 0;
    let belowMean = 0;
    colValues.forEach((v) => {
      if (v >= stats.mean) aboveMean++;
      else belowMean++;
    });
    return [
      { name: `Below Mean (< ${stats.mean})`, value: belowMean, color: darkMode ? '#60A5FA' : '#3B82F6' },
      { name: `Above Mean (≥ ${stats.mean})`, value: aboveMean, color: darkMode ? '#3B82F6' : '#2563EB' }
    ];
  }, [colValues, stats, darkMode]);

  const scatterData = useMemo(() => {
    if (!dataset || !activeCol || !secondCol) return [];
    return dataset.data.map((row, idx) => ({
      xVal: Number(row[activeCol]) || 0,
      yVal: Number(row[secondCol]) || 0,
      id: idx + 1
    }));
  }, [dataset, activeCol, secondCol]);

  const axisTickColor = darkMode ? '#94A3B8' : '#64748B';
  const gridStroke = darkMode ? '#1E293B' : '#F1F5F9';

  if (!dataset) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-2xs font-inter transition-colors duration-200">
        <Database className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500" />
        <h3 className="font-bold font-poppins text-lg text-slate-900 dark:text-slate-100">No Dataset Uploaded</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Please upload an Excel or CSV file to view data analysis.
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

  const totalCols = dataset.data[0] ? Object.keys(dataset.data[0]).length : 0;

  return (
    <div className="space-y-6 font-inter">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <span className="text-xs font-semibold font-manrope text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
            {datasetContext.title}
          </span>
          <h2 className="text-2xl font-bold font-poppins text-slate-900 dark:text-slate-100 tracking-tight">
            Data Analysis
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Statistical breakdown of <strong className="text-blue-600 dark:text-blue-400 font-mono">{activeCol}</strong> in <strong className="text-slate-800 dark:text-slate-200">{dataset.name}</strong>
          </p>
        </div>

        {/* Numerical Variable Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold font-manrope text-slate-700 dark:text-slate-300">Variable:</label>
          <select
            value={activeCol}
            onChange={(e) => onColumnSelected(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
          >
            {numericalCols.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Section 17: Dataset Summary Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3 transition-colors duration-200">
        <h3 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Dataset Summary</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-manrope font-bold block uppercase">Total Rows</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{stats.count}</span>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-manrope font-bold block uppercase">Total Columns</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{totalCols}</span>
          </div>
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 rounded-xl">
            <span className="text-[10px] text-blue-700 dark:text-blue-300 font-manrope font-bold block uppercase">Numerical Variables</span>
            <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">{numericalCols.length}</span>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-manrope font-bold block uppercase">Missing Values</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{missingValuesCount}</span>
          </div>
        </div>
      </div>

      {/* Section 17: Selected Variable Statistics */}
      <div className="space-y-3">
        <h3 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Selected Variable Statistics for <span className="font-mono text-blue-600 dark:text-blue-400">{activeCol}</span></span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatCard title="Mean (μ)" value={`${stats.mean}`} />
          <StatCard title="Median" value={`${stats.median}`} />
          <StatCard title="Std Dev (σ)" value={`${stats.stdDev}`} />
          <StatCard title="Variance (σ²)" value={`${stats.variance}`} />
          <StatCard title="Minimum" value={`${stats.min}`} />
          <StatCard title="Maximum" value={`${stats.max}`} />
          <StatCard title="Range" value={`${stats.range}`} />
        </div>
      </div>

      {/* Section 17: Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Histogram */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors duration-200">
          <h4 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100 mb-1">
            {activeCol} Frequency Histogram
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-inter mb-4">Empirical count distribution across binned intervals</p>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="binLabel" tick={{ fontSize: 10, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
                <YAxis tick={{ fontSize: 11, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
                <Tooltip />
                <Bar dataKey="count" name="Frequency" fill={darkMode ? '#60A5FA' : '#2563EB'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mean Breakdown Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors duration-200">
          <h4 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100 mb-1">
            Distribution Proportion Around Mean (μ = {stats.mean})
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-inter mb-4">Proportion of values above vs below sample mean</p>
          <div style={{ width: '100%', height: 240 }} className="flex items-center justify-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Density Profile Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors duration-200">
          <h4 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100 mb-1">
            {activeCol} Density Profile
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-inter mb-4">Binned density view for probability curve fitting</p>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="binLabel" tick={{ fontSize: 10, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
                <YAxis tick={{ fontSize: 11, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
                <Tooltip />
                <Bar dataKey="count" fill={darkMode ? '#818CF8' : '#4F46E5'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bivariate Comparison Scatter Plot */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs transition-colors duration-200">
          <h4 className="font-semibold font-poppins text-sm text-slate-900 dark:text-slate-100 mb-1">
            Variable Relationship ({activeCol} vs {secondCol})
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-inter mb-4">Scatter distribution of dataset records</p>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="xVal" name={activeCol} tick={{ fontSize: 10, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
                <YAxis dataKey="yVal" name={secondCol} tick={{ fontSize: 11, fill: axisTickColor }} stroke={darkMode ? '#475569' : '#CBD5E1'} />
                <ZAxis range={[50, 50]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Records" data={scatterData} fill={darkMode ? '#60A5FA' : '#2563EB'} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dataset Table Preview */}
      <DataTable
        data={dataset.data}
        title={`Dataset Preview (${dataset.data.length} total rows)`}
        selectedColumn={activeCol}
        onColumnSelected={onColumnSelected}
      />
    </div>
  );
}
