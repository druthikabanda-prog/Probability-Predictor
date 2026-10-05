import React from 'react';
import { Database, ArrowRight } from 'lucide-react';
import DatasetUploader from '../components/DatasetUploader';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';

export default function UploadPage({
  dataset,
  selectedColumn,
  stats,
  onColumnSelected,
  onDatasetLoaded,
  onSelectPreloaded,
  onNavigate
}) {
  return (
    <div className="space-y-6 font-inter">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <h2 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-slate-100 tracking-tight">
            Upload &amp; Manage Dataset
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Upload Excel (.xlsx, .xls) or CSV files containing real-world numerical variables (Marks, Prices, Attendance, Durations, etc.)
          </p>
        </div>

        {dataset && (
          <button
            type="button"
            onClick={() => onNavigate('predictor')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all shadow-2xs cursor-pointer font-manrope shrink-0"
          >
            <span>Proceed to Prediction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dataset Uploader Box */}
      <DatasetUploader
        currentDataset={dataset}
        onDatasetLoaded={onDatasetLoaded}
        selectedColumn={selectedColumn}
        onColumnSelected={onColumnSelected}
        onSelectPreloaded={onSelectPreloaded}
      />

      {/* Automatic Statistical Analysis */}
      {dataset && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Statistical Summary for <span className="text-blue-600 dark:text-blue-400 font-mono">{selectedColumn}</span></span>
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              N = {stats.count} records
            </span>
          </div>

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
      )}

      {/* Dataset Records Table Preview */}
      {dataset && (
        <DataTable
          data={dataset.data}
          title={`Dataset Records: ${dataset.name}`}
          selectedColumn={selectedColumn}
          onColumnSelected={onColumnSelected}
        />
      )}
    </div>
  );
}
