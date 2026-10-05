import React, { useState } from 'react';
import { Menu, X, Search, Database, ArrowRight, User, Sun, Moon } from 'lucide-react';
import { NAVIGATION_ITEMS } from './Sidebar';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ activeTab, setActiveTab, onNavigatePredictor }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  const activeItem = NAVIGATION_ITEMS.find((item) => item.id === activeTab) || NAVIGATION_ITEMS[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between font-inter transition-colors duration-200">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="md:hidden p-1.5 bg-blue-600 text-white rounded-lg shadow-2xs">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="text-blue-600 dark:text-blue-400 font-semibold font-poppins">Probability Predictor</span>
              <span>/</span>
              <span className="font-inter">Unified Data Analysis</span>
            </div>
            <h2 className="text-base font-semibold font-poppins text-slate-900 dark:text-slate-100 tracking-tight leading-none mt-0.5">
              {activeItem.label}
            </h2>
          </div>
        </div>
      </div>

      {/* Center/Right: Search bar, Theme Toggle, Predict button, User profile */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center relative w-64">
          <Search className="w-4 h-4 absolute left-3 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search datasets, variables..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-inter"
          />
        </div>

        {/* Dark Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-all cursor-pointer shadow-2xs group"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>

        <button
          type="button"
          onClick={onNavigatePredictor}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-manrope font-semibold text-xs rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          <span>Predict Probability</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-semibold text-xs">
            <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-xl space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-manrope font-semibold text-xs transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
