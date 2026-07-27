import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const users = [
    { id: 1, name: 'Admin Chief', email: 'admin@lankahospital-emr.lk', role: 'ADMIN', active: true },
    { id: 2, name: 'Dr. Kanishka Perera', email: 'kanishka.p@lankahospital-emr.lk', role: 'DOCTOR', active: true },
    { id: 3, name: 'Nurse Emily Stone', email: 'emily.s@lankahospital-emr.lk', role: 'NURSE', active: true },
    { id: 4, name: 'Sunil Perera', email: 'sunil.p@lankahospital-emr.lk', role: 'RECEPTIONIST', active: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Clinician Registry (User Management)</h2>
        <p className="text-sm text-slate-400">Add hospital staff, modify roles, and activate/deactivate accounts.</p>
      </div>

      <div className="rounded-2xl border border-slate-850 bg-slate-900 p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase border border-slate-850">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Full Name</th>
                <th className="px-4 py-3">Email Key</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {users.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/30">
                  <td className="px-4 py-4 font-bold text-slate-100 flex items-center space-x-2.5">
                    <div className="h-8 w-8 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-clinical-400 font-bold border border-slate-700">
                      {item.name.charAt(0)}
                    </div>
                    <span>{item.name}</span>
                  </td>
                  <td className="px-4 py-4">{item.email}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center space-x-1 bg-slate-950 px-2.5 py-0.5 rounded-full text-xs text-slate-300 border border-slate-850 font-bold">
                      <Shield className="h-3 w-3 text-clinical-400" />
                      <span>{item.role}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center space-x-1.5 text-xs text-clinical-400 font-semibold">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Active</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-xs text-clinical-400 hover:underline font-semibold">Edit Privileges</button>
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
