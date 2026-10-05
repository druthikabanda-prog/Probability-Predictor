import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Layers, Edit3, Sparkles } from 'lucide-react';
import * as XLSX from 'xlsx';
import { detectNumericalColumns, inferDatasetContext } from '../utils/mathUtils';
import { PRELOADED_DATASETS } from '../data/sampleDatasets';

export default function DatasetUploader({
  currentDataset,
  onDatasetLoaded,
  selectedColumn,
  onColumnSelected,
  onSelectPreloaded
}) {
  const [activeMode, setActiveMode] = useState('file'); // 'file' | 'manual'
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Manual Data Entry State
  const [manualTitle, setManualTitle] = useState('Custom Dataset');
  const [manualColumnName, setManualColumnName] = useState('Values');
  const [manualRawText, setManualRawText] = useState('65, 72, 81, 90, 75, 68, 84, 77, 92');

  const handleFile = (file) => {
    if (!file) return;

    setUploadError('');
    setIsLoading(true);

    const fileName = file.name;
    const fileExt = fileName.split('.').pop().toLowerCase();

    if (!['xlsx', 'xls', 'csv'].includes(fileExt)) {
      setUploadError('Unsupported file format. Please upload an .xlsx, .xls, or .csv file.');
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          setUploadError('The uploaded workbook is empty.');
          setIsLoading(false);
          return;
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!jsonRows || jsonRows.length === 0) {
          setUploadError('No data rows found in the uploaded file.');
          setIsLoading(false);
          return;
        }

        const numCols = detectNumericalColumns(jsonRows);

        if (numCols.length === 0) {
          setUploadError('No numerical columns detected in this dataset. Please upload a dataset containing at least one numerical column (e.g. Marks, Price, Age, Delivery Time).');
          setIsLoading(false);
          return;
        }

        const newDataset = {
          id: `upload-${Date.now()}`,
          name: fileName,
          description: `Uploaded dataset containing ${jsonRows.length} records across ${Object.keys(jsonRows[0]).length} columns.`,
          data: jsonRows,
          defaultColumn: numCols[0]
        };

        onDatasetLoaded(newDataset, numCols[0]);
        setIsLoading(false);
      } catch (err) {
        setUploadError(`Failed to parse file: ${err.message}`);
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Error reading file from disk.');
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setUploadError('');

    if (!manualRawText.trim()) {
      setUploadError('Please enter at least a few numerical values separated by commas or spaces.');
      return;
    }

    // Split numbers by comma, space, semicolon, or newline
    const parsedNumbers = manualRawText
      .split(/[\s,;\n\t]+/)
      .map((item) => Number(item.trim()))
      .filter((n) => typeof n === 'number' && !isNaN(n));

    if (parsedNumbers.length === 0) {
      setUploadError('Could not parse valid numerical values. Example format: 65, 72, 81, 90, 75, 68, 84, 77, 92');
      return;
    }

    const colName = manualColumnName.trim() || 'Values';
    const jsonRows = parsedNumbers.map((val, idx) => ({
      ID: idx + 1,
      [colName]: val
    }));

    const newDataset = {
      id: `manual-${Date.now()}`,
      name: `${manualTitle.trim() || 'Manual Data'}.csv`,
      description: `Manually entered dataset with ${parsedNumbers.length} numerical records.`,
      data: jsonRows,
      defaultColumn: colName
    };

    onDatasetLoaded(newDataset, colName);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const detectedCols = currentDataset ? detectNumericalColumns(currentDataset.data) : [];
  const datasetContext = currentDataset
    ? inferDatasetContext(currentDataset.name, Object.keys(currentDataset.data[0] || {}))
    : null;

  return (
    <div className="space-y-6 font-inter">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 font-manrope text-xs">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveMode('file')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMode === 'file'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Upload Excel / CSV File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('manual')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMode === 'manual'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Enter Data Manually</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSelectPreloaded(PRELOADED_DATASETS[0])}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/80 font-semibold rounded-lg border border-blue-200 dark:border-blue-900/50 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Try Demo Dataset</span>
        </button>
      </div>

      {/* Mode 1: File Upload Drag & Drop */}
      {activeMode === 'file' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          className={`bg-white dark:bg-slate-900 border-2 border-dashed rounded-2xl p-8 text-center transition-all shadow-2xs ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
        >
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <FileSpreadsheet className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold font-poppins text-slate-900 dark:text-slate-100">
                Upload Your Dataset
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Drag &amp; Drop your Excel or CSV file here
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-manrope font-semibold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isLoading ? 'Processing File...' : 'Choose File'}</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx,.xls,.csv"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              Supported formats: XLSX • XLS • CSV
            </p>
          </div>
        </div>
      )}

      {/* Mode 2: Manual Data Entry Form */}
      {activeMode === 'manual' && (
        <form onSubmit={handleManualSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold font-poppins text-sm text-slate-900 dark:text-slate-100">Manual Data Input</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Paste or type numerical values directly</p>
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-semibold bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900/50">
              No File Needed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Dataset Name / Title</label>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="e.g. Student Exam Marks"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Numerical Column Name</label>
              <input
                type="text"
                value={manualColumnName}
                onChange={(e) => setManualColumnName(e.target.value)}
                placeholder="e.g. Marks, Weight, Salary"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Numerical Values (separated by commas, spaces, or newlines)</label>
            <textarea
              rows={4}
              value={manualRawText}
              onChange={(e) => setManualRawText(e.target.value)}
              placeholder="65, 72, 81, 90, 75, 68, 84, 77, 92"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-1">
              Example: 65, 72, 81, 90, 75, 68, 84, 77, 92
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-manrope font-semibold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Load Manual Data</span>
            </button>
          </div>
        </form>
      )}

      {uploadError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2.5 font-inter">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Pre-loaded Sample Datasets Quick Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 font-manrope">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Try Demo Sample Datasets</span>
          </h4>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-inter">Real-World Examples</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRELOADED_DATASETS.map((ds) => {
            const isSelected = currentDataset?.id === ds.id;
            return (
              <button
                key={ds.id}
                type="button"
                onClick={() => onSelectPreloaded(ds)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 shadow-2xs ring-1 ring-blue-400'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate font-inter">
                    {ds.name}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {ds.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Numerical Column Selection Card */}
      {currentDataset && detectedCols.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded border border-blue-100 dark:border-blue-900/50 font-mono">
                  {datasetContext?.title || 'Numerical Data'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-poppins">
                Detected Numerical Variables in <span className="text-blue-600 dark:text-blue-400 font-mono">{currentDataset.name}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Select the numerical variable you want to analyze
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {detectedCols.map((col) => {
              const isSelected = selectedColumn === col;
              return (
                <button
                  key={col}
                  type="button"
                  onClick={() => onColumnSelected(col)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-manrope font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-2xs font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{col}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
