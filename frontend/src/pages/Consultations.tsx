import React from 'react';
import { Plus, ClipboardList } from 'lucide-react';

export const Consultations: React.FC = () => {
  const items = [
    { id: 101, patient: 'Samantha Ratnayake', date: '2026-07-20', reason: 'Fever checkup', diagnosis: 'Dengue Fever (Non-Severe)', notes: 'Adhere to fluid intake regime.' },
    { id: 102, patient: 'Rohan Fernando', date: '2026-07-15', reason: 'BP Review', diagnosis: 'Essential Hypertension', notes: 'Maintain BP diary updates daily.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Consultations Desk</h2>
          <p className="text-sm text-slate-400">Log clinical consultations, document symptoms, and record diagnoses.</p>
        </div>
        <button className="inline-flex items-center space-x-2 rounded-xl bg-clinical-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-clinical-500">
          <Plus className="h-4 w-4" />
          <span>Start Consultation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-850 bg-slate-900 p-6 space-y-4 hover:border-slate-800 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-850">
              <div className="flex items-center space-x-2.5">
                <ClipboardList className="h-5 w-5 text-clinical-500" />
                <span className="font-bold text-white text-sm">{item.patient}</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">{item.date}</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-slate-400">
                <span className="block font-semibold text-slate-500 text-[10px] uppercase">Reason for Visit</span>
                {item.reason}
              </p>
              <p className="text-xs text-slate-300">
                <span className="block font-semibold text-slate-500 text-[10px] uppercase">Confirmed Diagnosis</span>
                <span className="text-clinical-400 font-semibold">{item.diagnosis}</span>
              </p>
              <p className="text-xs text-slate-400">
                <span className="block font-semibold text-slate-500 text-[10px] uppercase">Encounter Notes</span>
                {item.notes}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
