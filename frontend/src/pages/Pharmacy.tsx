import React from 'react';
import { Plus, CheckCircle2, ShieldAlert } from 'lucide-react';

export const Pharmacy: React.FC = () => {
  const items = [
    { id: 101, patient: 'Samantha Ratnayake', meds: 'Paracetamol 500mg PO Q6H PRN', doctor: 'Dr. Kanishka Perera', date: '2026-07-20', status: 'DISPENSED' },
    { id: 102, patient: 'Rohan Fernando', meds: 'Losartan 50mg PO QD', doctor: 'Dr. Kanishka Perera', date: '2026-07-15', status: 'DISPENSED' },
    { id: 103, patient: 'Dilshan Jayawardene', meds: 'Metformin 500mg PO BID', doctor: 'Dr. Priyanthi Silva', date: '2026-07-27', status: 'AWAITING DISPENSE' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Pharmacy Dispensary</h2>
          <p className="text-sm text-slate-400">Track active medication prescriptions, print dosage instructions, and dispense pharmacy inventory.</p>
        </div>
        <button className="inline-flex items-center space-x-2 rounded-xl bg-clinical-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-clinical-500">
          <Plus className="h-4 w-4" />
          <span>New Prescription</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-850 bg-slate-900 p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase border border-slate-850">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Patient</th>
                <th className="px-4 py-3">Prescribed Medication Regime</th>
                <th className="px-4 py-3">Prescribed By</th>
                <th className="px-4 py-3">Issue Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/30">
                  <td className="px-4 py-4 font-bold text-slate-100">{item.patient}</td>
                  <td className="px-4 py-4">
                    <code className="text-xs text-teal-300 font-mono bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-850 block w-fit">
                      {item.meds}
                    </code>
                  </td>
                  <td className="px-4 py-4">{item.doctor}</td>
                  <td className="px-4 py-4 text-slate-450">{item.date}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.status === 'DISPENSED' ? 'bg-clinical-500/10 text-clinical-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {item.status === 'DISPENSED' ? <CheckCircle2 className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-xs text-clinical-400 hover:underline font-semibold">Dispense</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
