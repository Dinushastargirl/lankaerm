import React from 'react';
import { CreditCard, Plus, Receipt, DollarSign } from 'lucide-react';

export const Billing: React.FC = () => {
  const items = [
    { id: 'INV-00921', patient: 'Samantha Ratnayake', service: 'Consultation + Dengue blood work', amount: 'LKR 8,500.00', status: 'PAID', date: '2026-07-20' },
    { id: 'INV-00918', patient: 'Rohan Fernando', service: 'Hypertension Consultation + Lisinopril', amount: 'LKR 4,200.00', status: 'PAID', date: '2026-07-15' },
    { id: 'INV-00925', patient: 'Dilshan Jayawardene', service: 'Laboratory Profile Glucose', amount: 'LKR 2,800.00', status: 'UNPAID', date: '2026-07-27' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Billing & Invoices</h2>
          <p className="text-sm text-slate-400">Issue invoices, process cash payments, and reconcile private health insurance claims.</p>
        </div>
        <button className="inline-flex items-center space-x-2 rounded-xl bg-clinical-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-clinical-500">
          <Plus className="h-4 w-4" />
          <span>New Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-850 bg-slate-900 p-5 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-clinical-500/10 text-clinical-400">
            <Receipt className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Total Revenue Today</p>
            <p className="text-xl font-bold text-white">LKR 12,700.00</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-850 bg-slate-900 p-5 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Pending Claims</p>
            <p className="text-xl font-bold text-white">LKR 2,800.00</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-850 bg-slate-900 p-5 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Insurance Approved</p>
            <p className="text-xl font-bold text-white">LKR 120,500.00</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-850 bg-slate-900 p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase border border-slate-850">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Invoice Code</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Clinical Services Provided</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Issue Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/30">
                  <td className="px-4 py-4 font-bold text-slate-100">{item.id}</td>
                  <td className="px-4 py-4">{item.patient}</td>
                  <td className="px-4 py-4 text-xs text-slate-400">{item.service}</td>
                  <td className="px-4 py-4 font-bold text-white">{item.amount}</td>
                  <td className="px-4 py-4 text-slate-450">{item.date}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.status === 'PAID' ? 'bg-clinical-500/10 text-clinical-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-xs text-clinical-400 hover:underline font-semibold">Print Receipt</button>
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
