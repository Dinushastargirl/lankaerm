import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Activity, Lock, Mail, Users, AlertCircle, Sparkles } from 'lucide-react';
import type { UserRole } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginMock } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api';
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Invalid credentials' }));
        throw new Error(err.message || 'Login failed');
      }

      const data = await response.json();
      const userDetails = {
        id: data.userId,
        username: data.username,
        email: `${data.username}@lankahospital-emr.lk`,
        fullName: data.username === 'admin' ? 'Admin Chief' : `Clinician (${data.role})`,
        role: data.role,
        active: true,
        permissions: data.permissions
      };
      login(data.accessToken, data.refreshToken, userDetails);
      navigate('/');
    } catch (err: any) {
      console.error('Real database auth failed, checking frontend mock database:', err);
      
      const lowerUser = email.toLowerCase().trim();
      const pass = password.trim();
      
      let matchedRole: any = null;
      if (lowerUser === 'admin' && pass === 'admin123') matchedRole = 'ADMIN';
      else if (lowerUser === 'doctor' && pass === 'doctor123') matchedRole = 'DOCTOR';
      else if (lowerUser === 'nurse' && pass === 'nurse123') matchedRole = 'NURSE';
      else if (lowerUser === 'receptionist' && pass === 'receptionist123') matchedRole = 'RECEPTIONIST';
      else if (lowerUser === 'labtech' && pass === 'labtech123') matchedRole = 'LAB_TECHNICIAN';
      else if (lowerUser === 'pharmacist' && pass === 'pharmacist123') matchedRole = 'PHARMACIST';
      
      if (matchedRole) {
        loginMock(matchedRole);
        navigate('/');
      } else {
        const isNetworkError = err instanceof TypeError || err.message?.toLowerCase().includes('failed to fetch') || err.message?.toLowerCase().includes('network');
        if (isNetworkError) {
          setError('Backend unavailable. (Cloud database not connected, and credentials did not match local dummy fallback).');
        } else {
          setError('Invalid credentials. Please verify your clinician sign-in credentials.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    loginMock(role);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen w-screen bg-slate-900 font-sans text-slate-100">
      
      {/* Left Column: Sri Lankan Clinical Branding Banner */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-950 p-12 lg:flex border-r border-slate-800">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-clinical-500/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl"></div>
        
        {/* Logo Branding */}
        <div className="flex items-center space-x-3 z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-clinical-500 shadow-lg shadow-clinical-500/30">
            <Activity className="h-6 w-6 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-white">
            LANKA<span className="text-clinical-400">EMR</span>
          </span>
        </div>

        {/* Dynamic AI Banner Content */}
        <div className="my-auto max-w-lg z-10 space-y-6">
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-clinical-500/10 px-3 py-1 text-xs font-semibold text-clinical-400 ring-1 ring-inset ring-clinical-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Driven EMR Core v1.0</span>
          </span>
          <h1 className="font-heading text-5xl font-extrabold leading-tight text-white">
            Sri Lanka’s smart EMR ecosystem.
          </h1>
          <p className="text-lg text-slate-400">
            Provisioning clinical intelligence, medical audits, billing registries, and digital prescriptions across South Asia.
          </p>
        </div>

        <p className="text-xs text-slate-500 z-10">
          &copy; 2026 Lanka EMR Platform. HIPAA, GDPR, and Sri Lankan Personal Data Protection Act (PDPA) compliant.
        </p>
      </div>

      {/* Right Column: Authenticate Card Panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20 xl:px-24 bg-slate-950">
        <div className="mx-auto w-full max-w-md space-y-8">
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3 lg:hidden mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-clinical-500">
                <Activity className="h-5 w-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-white">LANKAEMR</span>
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-white">Hospital Gateway</h2>
            <p className="text-sm text-slate-400">
              Sign in with your registry keys or launch a simulated sandbox session.
            </p>
          </div>

          {error && (
            <div className="flex items-start space-x-3 rounded-xl bg-red-950/40 p-4 border border-red-500/20 text-red-200 text-sm">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Clinician Username / Email
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin"
                  className="block w-full rounded-xl border-0 bg-slate-900 py-3 pl-10 pr-4 text-white shadow-sm ring-1 ring-slate-800 placeholder:text-slate-600 focus:ring-2 focus:ring-clinical-500 focus:outline-none transition-all sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Security Password
              </label>
              <div className="relative mt-2">
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
                  className="block w-full rounded-xl border-0 bg-slate-900 py-3 pl-10 pr-4 text-white shadow-sm ring-1 ring-slate-800 placeholder:text-slate-600 focus:ring-2 focus:ring-clinical-500 focus:outline-none transition-all sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-xl bg-clinical-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-clinical-500 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Connecting database...' : 'Authenticate Clinician'}
            </button>
          </form>

          {/* Bypasses */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-3 text-slate-500 font-semibold tracking-wider">
                Or Quick Demo Logins
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('DOCTOR')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-2 hover:bg-slate-900 hover:border-clinical-600/50 hover:text-clinical-400 transition-all group"
            >
              <Users className="h-4.5 w-4.5 text-emerald-400 group-hover:scale-115 transition-transform mb-1" />
              <span className="text-[10px] font-bold text-slate-300">Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('NURSE')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-2 hover:bg-slate-900 hover:border-clinical-600/50 hover:text-clinical-400 transition-all group"
            >
              <Users className="h-4.5 w-4.5 text-teal-400 group-hover:scale-115 transition-transform mb-1" />
              <span className="text-[10px] font-bold text-slate-300">Nurse</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-2 hover:bg-slate-900 hover:border-red-500/50 hover:text-red-400 transition-all group"
            >
              <Users className="h-4.5 w-4.5 text-red-500 group-hover:scale-115 transition-transform mb-1" />
              <span className="text-[10px] font-bold text-slate-300">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('RECEPTIONIST')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-2 hover:bg-slate-900 hover:border-sky-500/50 hover:text-sky-400 transition-all group"
            >
              <Users className="h-4.5 w-4.5 text-sky-400 group-hover:scale-115 transition-transform mb-1" />
              <span className="text-[10px] font-bold text-slate-300">Receptionist</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('LAB_TECHNICIAN')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-2 hover:bg-slate-900 hover:border-clinical-600/50 hover:text-clinical-400 transition-all group"
            >
              <Users className="h-4.5 w-4.5 text-violet-400 group-hover:scale-115 transition-transform mb-1" />
              <span className="text-[10px] font-bold text-slate-300">Lab Tech</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('PHARMACIST')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-2 hover:bg-slate-900 hover:border-pink-500/50 hover:text-pink-400 transition-all group"
            >
              <Users className="h-4.5 w-4.5 text-pink-400 group-hover:scale-115 transition-transform mb-1" />
              <span className="text-[10px] font-bold text-slate-300">Pharmacist</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Need a clinician registry?{' '}
            <Link to="/register" className="font-semibold text-clinical-400 hover:text-clinical-300">
              Register registry keys
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
