import React from 'react';
import { ShieldCheck, Terminal } from 'lucide-react';

export const Security: React.FC = () => {
  const auditLogs = [
    { id: 1, user: 'admin', action: 'LOGIN_SUCCESS', module: 'AUTH', ip: '192.168.1.100', timestamp: '2026-07-27 13:42:15' },
    { id: 2, user: 'dr_perera', action: 'VIEW_PATIENT_CHART', module: 'PATIENTS', ip: '192.168.1.102', timestamp: '2026-07-27 13:44:02' },
    { id: 3, user: 'nurse_stone', action: 'APPEND_PATIENT_VITALS', module: 'PATIENTS', ip: '192.168.1.105', timestamp: '2026-07-27 13:45:55' },
    { id: 4, user: 'sunil_p', action: 'CREATE_APPOINTMENT', module: 'APPOINTMENTS', ip: '192.168.1.110', timestamp: '2026-07-27 13:46:12' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">System Security & Audit logs</h2>
          <p className="text-sm text-slate-400">View real-time security events, manage JWT key variables, and check system logs.</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-clinical-500/10 px-3 py-1.5 rounded-xl border border-clinical-500/20 text-xs font-semibold text-clinical-400">
          <ShieldCheck className="h-4 w-4" />
          <span>HIPAA Compliance OK</span>
        </div>
      </div>

      {/* Audit Logs list */}
      <div className="rounded-2xl border border-slate-850 bg-slate-900 p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-850">
          <Terminal className="h-5 w-5 text-clinical-500" />
          <h3 className="font-heading text-base font-bold text-white">Clinical Audit Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase border border-slate-850">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">User</th>
                <th className="px-4 py-3">Security Action</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3 rounded-r-xl">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/30 text-xs font-mono">
                  <td className="px-4 py-3.5 font-bold text-slate-200">{log.user}</td>
                  <td className="px-4 py-3.5 text-clinical-400 font-bold">{log.action}</td>
                  <td className="px-4 py-3.5">{log.module}</td>
                  <td className="px-4 py-3.5 text-slate-500">{log.ip}</td>
                  <td className="px-4 py-3.5 text-slate-400">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
