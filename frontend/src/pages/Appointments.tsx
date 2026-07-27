import React from 'react';
import { Plus, Clock, User, CheckCircle2 } from 'lucide-react';

export const Appointments: React.FC = () => {
  const items = [
    { id: 1, patient: 'Samantha Ratnayake', doctor: 'Dr. Kanishka Perera', date: '2026-07-27', time: '09:00 AM', status: 'CONFIRMED' },
    { id: 2, patient: 'Rohan Fernando', doctor: 'Dr. Kanishka Perera', date: '2026-07-27', time: '10:30 AM', status: 'CONFIRMED' },
    { id: 3, patient: 'Dilshan Jayawardene', doctor: 'Dr. Priyanthi Silva', date: '2026-07-28', time: '11:15 AM', status: 'PENDING' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Appointments Registry</h2>
          <p className="text-sm text-slate-400">Schedule checkups and coordinate clinic calendars.</p>
        </div>
        <button className="inline-flex items-center space-x-2 rounded-xl bg-clinical-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-clinical-500">
          <Plus className="h-4 w-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-850 bg-slate-900 p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase border border-slate-850">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Patient</th>
                <th className="px-4 py-3">Assigned Physician</th>
                <th className="px-4 py-3">Schedule Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/30">
                  <td className="px-4 py-4 font-bold text-slate-100 flex items-center space-x-2.5">
                    <User className="h-4 w-4 text-clinical-400" />
                    <span>{item.patient}</span>
                  </td>
                  <td className="px-4 py-4">{item.doctor}</td>
                  <td className="px-4 py-4">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>{item.date} &bull; {item.time}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.status === 'CONFIRMED' ? 'bg-clinical-500/10 text-clinical-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-xs text-clinical-400 hover:underline font-semibold">Modify</button>
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
