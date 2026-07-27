import React from 'react';
import { Download } from 'lucide-react';

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Clinical Analytics & Reports</h2>
          <p className="text-sm text-slate-400">Generate demographic data sheets, analyze clinic throughputs, and compile security audit reports.</p>
        </div>
        <button className="inline-flex items-center space-x-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-750 border border-slate-700/50">
          <Download className="h-4 w-4" />
          <span>Export Analytics</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-850 bg-slate-900 p-6 space-y-4">
          <h3 className="font-heading text-base font-bold text-white">Patient Admittance Rates</h3>
          <div className="h-48 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-850">
            <span className="text-xs text-slate-500 font-semibold">[Analytical Chart Component: Throughput Trends]</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-850 bg-slate-900 p-6 space-y-4">
          <h3 className="font-heading text-base font-bold text-white">Prescription Breakdown</h3>
          <div className="h-48 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-850">
            <span className="text-xs text-slate-500 font-semibold">[Analytical Chart Component: Medication Distributions]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
