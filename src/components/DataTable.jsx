import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { detectNumericalColumns } from '../utils/mathUtils';

export default function DataTable({
  data = [],
  title = "Dataset Records",
  selectedColumn,
  onColumnSelected
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const numericalCols = useMemo(() => {
    return detectNumericalColumns(data);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(row => {
      return Object.values(row).some(val =>
        String(val).toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400 font-medium transition-colors duration-200">
        <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500 mb-2" />
        <p>No dataset loaded. Upload an Excel file or select a pre-loaded dataset above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden transition-colors duration-200">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {title}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 font-mono">
              {data.length} Rows × {columns.length} Columns
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Detected {numericalCols.length} numerical variable columns ({numericalCols.join(', ')})
          </p>
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 uppercase font-semibold text-[11px] tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 sticky top-0">
            <tr>
              {columns.map((col) => {
                const isNumerical = numericalCols.includes(col);
                const isSelected = selectedColumn === col;
                return (
                  <th
                    key={col}
                    onClick={() => isNumerical && onColumnSelected && onColumnSelected(col)}
                    className={`px-4 py-3 font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 dark:bg-blue-600 text-white font-bold'
                        : isNumerical
                        ? 'text-blue-700 dark:text-blue-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col}</span>
                      {isNumerical && (
                        <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'
                        }`}>
                          NUM
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  {columns.map((col) => {
                    const isSelected = selectedColumn === col;
                    const val = row[col];
                    return (
                      <td
                        key={col}
                        className={`px-4 py-2.5 font-mono ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-950/50 font-bold text-blue-900 dark:text-blue-300'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {val !== null && val !== undefined ? String(val) : ''}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length || 1} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 font-medium">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/30">
        <span>Displaying {paginatedData.length} of {filteredData.length} records (Page {currentPage} of {totalPages})</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
