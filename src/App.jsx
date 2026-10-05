import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import PredictorPage from './pages/PredictorPage';
import DistributionExplorerPage from './pages/DistributionExplorerPage';
import DataAnalysisPage from './pages/DataAnalysisPage';
import SimulationPage from './pages/SimulationPage';
import AboutPage from './pages/AboutPage';

import { PRELOADED_DATASETS } from './data/sampleDatasets';
import { detectNumericalColumns, extractColumnValues, calculateStats } from './utils/mathUtils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dataset, setDataset] = useState(PRELOADED_DATASETS[0]);
  const [selectedColumn, setSelectedColumn] = useState('Marks');

  // Dynamically calculate stats for the selected numerical column
  const stats = useMemo(() => {
    if (!dataset || !selectedColumn) {
      return { mean: 0, median: 0, stdDev: 0, variance: 0, min: 0, max: 0, range: 0, count: 0 };
    }
    const colVals = extractColumnValues(dataset.data, selectedColumn);
    return calculateStats(colVals);
  }, [dataset, selectedColumn]);

  const handleDatasetLoaded = (newDataset, defaultCol) => {
    setDataset(newDataset);
    const numCols = detectNumericalColumns(newDataset.data);
    const colToUse = defaultCol || numCols[0] || '';
    setSelectedColumn(colToUse);
  };

  const handleSelectPreloaded = (preloadedDs) => {
    setDataset(preloadedDs);
    setSelectedColumn(preloadedDs.defaultColumn);
  };

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors duration-200">
      <div className="flex flex-1">
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          onNavigatePredictor={() => handleNavigate('predictor')}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          <Navbar
            activeTab={activeTab}
            setActiveTab={handleNavigate}
            onNavigatePredictor={() => handleNavigate('predictor')}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <DashboardPage
                dataset={dataset}
                selectedColumn={selectedColumn}
                stats={stats}
                onColumnSelected={setSelectedColumn}
                onDatasetLoaded={handleDatasetLoaded}
                onSelectPreloaded={handleSelectPreloaded}
                onNavigate={handleNavigate}
              />
            )}
            {activeTab === 'upload' && (
              <UploadPage
                dataset={dataset}
                selectedColumn={selectedColumn}
                stats={stats}
                onColumnSelected={setSelectedColumn}
                onDatasetLoaded={handleDatasetLoaded}
                onSelectPreloaded={handleSelectPreloaded}
                onNavigate={handleNavigate}
              />
            )}
            {activeTab === 'predictor' && (
              <PredictorPage
                dataset={dataset}
                selectedColumn={selectedColumn}
                onColumnSelected={setSelectedColumn}
                onNavigate={handleNavigate}
              />
            )}
            {activeTab === 'explorer' && <DistributionExplorerPage />}
            {activeTab === 'analysis' && (
              <DataAnalysisPage
                dataset={dataset}
                selectedColumn={selectedColumn}
                onColumnSelected={setSelectedColumn}
                onNavigate={handleNavigate}
              />
            )}
            {activeTab === 'simulation' && (
              <SimulationPage
                dataset={dataset}
                selectedColumn={selectedColumn}
                onNavigate={handleNavigate}
              />
            )}
            {activeTab === 'about' && <AboutPage />}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
