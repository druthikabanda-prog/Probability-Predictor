import React, { useState, useMemo } from 'react';
import { Table, Search, BookOpen } from 'lucide-react';
import InputField from '../components/InputField';
import NormalCurve from '../components/NormalCurve';
import { standardNormalCDF } from '../utils/mathUtils';

export default function ZTableCalculatorPage() {
  const [zInput, setZInput] = useState(1.25);
  const [searchTableZ, setSearchTableZ] = useState('');

  const zVal = Number(zInput) || 0;

  const pLeft = standardNormalCDF(zVal);
  const pRight = 1 - pLeft;
  const pTwoTailed = 2 * (1 - standardNormalCDF(Math.abs(zVal)));

  const zTableGrid = useMemo(() => {
    const rows = [];
    for (let r = -3.4; r <= 3.4; r += 0.1) {
      const rowZ = Number(r.toFixed(1));
      const cols = [];
      for (let c = 0; c <= 0.09; c += 0.01) {
        const fullZ = Number((rowZ >= 0 ? rowZ + c : rowZ - c).toFixed(2));
        const p = standardNormalCDF(fullZ);
        cols.push({
          fullZ,
          val: p.toFixed(4)
        });
      }
      rows.push({ rowZ, cols });
    }
    return rows;
  }, []);

  return (
    <div className="space-y-6 font-inter">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs transition-colors duration-200">
        <h2 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-slate-100 tracking-tight">
          Z-Table Calculator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
          Compute left-tail, right-tail, and two-tailed probabilities for standard normal variate Z ~ N(0, 1).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT (4 cols) Inputs & Calculation Steps */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-5 transition-colors duration-200">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-poppins">Z-Score Input</h3>
          </div>

          <InputField
            label="Z-Score Value"
            value={zInput}
            onChange={setZInput}
            step={0.01}
            placeholder="e.g. 1.25"
            helpText="Supports positive and negative Z-scores"
          />

          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase font-manrope">Quick Presets:</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[-1.96, -1.25, 0, 1.0, 1.25, 1.645, 1.96].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setZInput(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    zVal === preset
                      ? 'bg-blue-600 dark:bg-blue-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset > 0 ? `+${preset}` : preset}
                </button>
              ))}
            </div>
          </div>

          {/* Mathematical Step Breakdown */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-2 text-xs font-mono">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-poppins">
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Calculation Steps:</span>
            </h4>
            <div className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
              <p>Z = {zVal.toFixed(2)}</p>
              <p className="text-blue-700 dark:text-blue-400 font-semibold">P(Z ≤ {zVal.toFixed(2)}) = {pLeft.toFixed(4)} ({(pLeft * 100).toFixed(2)}%)</p>
              <p className="text-slate-600 dark:text-slate-400">P(Z &gt; {zVal.toFixed(2)}) = 1 - {pLeft.toFixed(4)} = {pRight.toFixed(4)} ({(pRight * 100).toFixed(2)}%)</p>
            </div>
          </div>
        </div>

        {/* RIGHT (8 cols) Metrics & Visual Chart */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-manrope">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs transition-colors duration-200">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">P(Z ≤ z) Left-Tail</span>
              <div className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-1">
                {(pLeft * 100).toFixed(2)}%
              </div>
              <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-1">Φ(z) = {pLeft.toFixed(4)}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs transition-colors duration-200">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">P(Z &gt; z) Right-Tail</span>
              <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
                {(pRight * 100).toFixed(2)}%
              </div>
              <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-1">1 - Φ(z) = {pRight.toFixed(4)}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs transition-colors duration-200">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Two-Tailed P(|Z| &gt; |z|)</span>
              <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                {(pTwoTailed * 100).toFixed(2)}%
              </div>
              <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-1">Area = {pTwoTailed.toFixed(4)}</p>
            </div>
          </div>

          <NormalCurve
            mean={0}
            stdDev={1}
            target={zVal}
            condition="lessEqual"
            variableName="Standard Z"
            title={`Standard Normal Curve N(0, 1) for Z = ${zVal}`}
            height={260}
          />
        </div>
      </div>

      {/* Standard Z-Table Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 font-poppins">
              <Table className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Standard Normal Cumulative Z-Table Grid</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Exact mathematical probabilities P(Z ≤ z) from Z = -3.49 to +3.49
            </p>
          </div>

          <div className="relative w-52">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Highlight Z (e.g. 1.2)..."
              value={searchTableZ}
              onChange={(e) => setSearchTableZ(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-72 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-center text-xs font-mono border-collapse bg-white dark:bg-slate-900">
            <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 font-bold">Z</th>
                {[.00, .01, .02, .03, .04, .05, .06, .07, .08, .09].map((col) => (
                  <th key={col} className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">{col.toFixed(2)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {zTableGrid.map((row) => {
                const isSearched = searchTableZ && row.rowZ.toString().startsWith(searchTableZ);
                return (
                  <tr key={row.rowZ} className={isSearched ? 'bg-blue-50/60 dark:bg-blue-950/40 font-bold' : ''}>
                    <td className="p-1.5 bg-slate-50 dark:bg-slate-800/80 font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
                      {row.rowZ > 0 ? `+${row.rowZ.toFixed(1)}` : row.rowZ.toFixed(1)}
                    </td>
                    {row.cols.map((col) => {
                      const isMatch = Math.abs(col.fullZ - zVal) < 0.005;
                      return (
                        <td
                          key={col.fullZ}
                          className={`p-1.5 border border-slate-200 dark:border-slate-800 text-[11px] transition-all ${
                            isMatch
                              ? 'bg-blue-600 dark:bg-blue-600 text-white font-bold shadow-2xs'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          {col.val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
