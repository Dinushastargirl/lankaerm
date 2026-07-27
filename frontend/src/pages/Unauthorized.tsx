import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 text-center shadow-xl border border-slate-800 transition-all hover:shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <ShieldAlert className="h-9 w-9" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-white">Access Restricted</h1>
        <p className="mt-3 text-sm text-slate-400">
          Your credentials do not grant access to this secure medical division. 
          Please contact the hospital IT service desk if this is in error.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 rounded-xl bg-clinical-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-clinical-700 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
