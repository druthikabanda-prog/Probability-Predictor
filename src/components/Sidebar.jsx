import React from 'react';
import {
  LayoutDashboard,
  Upload,
  Calculator,
  Compass,
  BarChart3,
  Cpu,
  Info,
  Database,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload Dataset', icon: Upload },
  { id: 'predictor', label: 'Probability Predictor', icon: Calculator },
  { id: 'explorer', label: 'Distribution Explorer', icon: Compass },
  { id: 'analysis', label: 'Data Analysis', icon: BarChart3 },
  { id: 'simulation', label: 'Simulation', icon: Cpu },
  { id: 'about', label: 'About Project', icon: Info }
];

export default function Sidebar({ activeTab, setActiveTab, onNavigatePredictor }) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-screen p-5 sticky top-0 h-screen overflow-y-auto font-inter transition-colors duration-200">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-2xs flex items-center justify-center">
            <Database className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base font-bold font-poppins text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              Probability Predictor
            </h1>
            <span className="text-[11px] font-medium font-inter text-blue-600 dark:text-blue-400 mt-1 block">
              Unified Data Analysis
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-manrope">
            Navigation
          </div>
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-manrope font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/50 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer CTA & Dark Mode Toggle Section */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 font-manrope">
        {/* Dark Mode Switch Widget */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            )}
            <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            {darkMode ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          type="button"
          onClick={onNavigatePredictor}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <span>Predict Probability</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="px-2 text-[10px] font-medium text-slate-400 dark:text-slate-500 text-center tracking-wide font-inter">
          Continuous Probability Analytics
        </div>
      </div>
    </aside>
  );
}
