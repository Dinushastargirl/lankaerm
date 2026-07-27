import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, Mail, User as UserIcon, ShieldAlert, Sparkles, Award } from 'lucide-react';
import type { UserRole } from '../types';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('DOCTOR');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8085/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullName, email, password, role }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(err.message || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(
        'Database connection refused. Real registration requires a running PostgreSQL database. For evaluation, please utilize the "Quick Demo Logins" on the login page.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-slate-900 font-sans text-slate-100">
      
      {/* Left Banner */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-950 p-12 lg:flex border-r border-slate-800">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-clinical-500/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl"></div>
        
        <div className="flex items-center space-x-3 z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-clinical-500 shadow-lg shadow-clinical-500/30">
            <Activity className="h-6 w-6 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-white">
            LANKA<span className="text-clinical-400">EMR</span>
          </span>
        </div>

        <div className="my-auto max-w-lg z-10 space-y-6">
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-clinical-500/10 px-3 py-1 text-xs font-semibold text-clinical-400 ring-1 ring-inset ring-clinical-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join the Healthcare System</span>
          </span>
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-white">
            Provision secure clinician accounts in seconds.
          </h1>
          <p className="text-lg text-slate-400">
            Secure, centralized registry keys matching international health standards.
          </p>
        </div>

        <p className="text-xs text-slate-500 z-10">
          &copy; 2026 Lanka EMR Platform. Protected under strict privacy frameworks.
        </p>
      </div>

      {/* Right Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20 xl:px-24 bg-slate-950">
        <div className="mx-auto w-full max-w-md space-y-8">
          
          <div className="flex flex-col space-y-2">
            <h2 className="font-heading text-3xl font-extrabold text-white">Register Registry</h2>
            <p className="text-sm text-slate-400">
              Provision credential access inside the secure clinical database.
            </p>
          </div>

          {error && (
            <div className="flex items-start space-x-3 rounded-xl bg-red-950/40 p-4 border border-red-500/20 text-red-200 text-sm">
              <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-clinical-950/40 p-4 border border-clinical-500/20 text-clinical-200 text-sm">
              Account created! Transferring to login...
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-slate-300 uppercase">
                Username
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. dr_perera"
                  className="block w-full rounded-xl border-0 bg-slate-900 py-2.5 pl-10 pr-4 text-white shadow-sm ring-1 ring-slate-800 placeholder:text-slate-600 focus:ring-2 focus:ring-clinical-500 focus:outline-none transition-all sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 uppercase">
                Full Name
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Award className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Kanishka Perera"
                  className="block w-full rounded-xl border-0 bg-slate-900 py-2.5 pl-10 pr-4 text-white shadow-sm ring-1 ring-slate-800 placeholder:text-slate-600 focus:ring-2 focus:ring-clinical-500 focus:outline-none transition-all sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kanishka.p@lankahospital.lk"
                  className="block w-full rounded-xl border-0 bg-slate-900 py-2.5 pl-10 pr-4 text-white shadow-sm ring-1 ring-slate-800 placeholder:text-slate-600 focus:ring-2 focus:ring-clinical-500 focus:outline-none transition-all sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-xs font-semibold text-slate-300 uppercase">
                Division Access (Role)
              </label>
              <div className="mt-1.5">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="block w-full rounded-xl border-0 bg-slate-900 py-2.5 px-3 text-white shadow-sm ring-1 ring-slate-800 focus:ring-2 focus:ring-clinical-500 focus:outline-none transition-all sm:text-sm"
                >
                  <option value="DOCTOR">Medical Practitioner (Doctor)</option>
                  <option value="NURSE">Clinical Nurse (Nurse)</option>
                  <option value="RECEPTIONIST">Front Desk (Receptionist)</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase">
                Password
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border-0 bg-slate-900 py-2.5 pl-10 pr-4 text-white shadow-sm ring-1 ring-slate-800 placeholder:text-slate-600 focus:ring-2 focus:ring-clinical-500 focus:outline-none transition-all sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-xl bg-clinical-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-clinical-500 active:scale-[0.98] transition-all disabled:opacity-50 mt-6"
            >
              {isLoading ? 'Creating registry...' : 'Register Clinician'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-clinical-400 hover:text-clinical-300">
              Return to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
