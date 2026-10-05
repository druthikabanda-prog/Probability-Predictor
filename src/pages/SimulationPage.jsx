import React from 'react';
import { Cpu, Database } from 'lucide-react';
import SimulationPanel from '../components/SimulationPanel';
import { detectNumericalColumns, extractColumnValues, calculateStats, inferDatasetContext } from '../utils/mathUtils';

export default function SimulationPage({ dataset, selectedColumn, onNavigate }) {
  const numericalCols = dataset ? detectNumericalColumns(dataset.data) : [];
  const activeCol = selectedColumn || (numericalCols[0] ?? 'Variable');

  const colStats = dataset && activeCol
    ? calculateStats(extractColumnValues(dataset.data, activeCol))
    : { mean: 40, stdDev: 8, min: 10, max: 80, count: 100 };

  const defaultTarget = Math.round(colStats.mean + colStats.stdDev * 0.5);

  const datasetContext = dataset
    ? inferDatasetContext(dataset.name, [activeCol])
    : { title: 'General Numerical Data Analysis' };

  if (!dataset) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-2xs font-inter transition-colors duration-200">
        <Database className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500" />
        <h3 className="font-bold font-poppins text-lg text-slate-900 dark:text-slate-100">No Dataset Uploaded</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Please upload an Excel or CSV file to run Monte Carlo simulations.
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold font-manrope text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{datasetContext.title}</span>
          </div>
          <h2 className="text-2xl font-bold font-poppins text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
            Monte Carlo Simulation Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Generate randomized trial samples for variable <strong className="text-blue-600 dark:text-blue-400 font-mono">{activeCol}</strong> using Normal, Gamma, or Uniform distribution models.
          </p>
        </div>
      </div>

      <SimulationPanel
        datasetName={dataset.name}
        columnName={activeCol}
        stats={colStats}
        defaultTarget={defaultTarget}
      />
    </div>
  );
}
