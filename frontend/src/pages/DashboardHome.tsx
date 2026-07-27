import React from 'react';
import { useAuth } from '../store/AuthContext';
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Clock, 
  Plus, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Admitted Patients', value: '1,280', change: '+4.75%', changeType: 'increase', icon: Users, color: 'text-clinical-400 bg-clinical-500/10' },
    { name: 'Consultations Today', value: '42', change: '+12%', changeType: 'increase', icon: Calendar, color: 'text-teal-400 bg-teal-500/10' },
    { name: 'Reports Transcribed', value: '189', change: '-1.5%', changeType: 'decrease', icon: FileText, color: 'text-blue-400 bg-blue-500/10' },
    { name: 'Operational Capacity', value: '88.4%', change: '+2.3%', changeType: 'increase', icon: TrendingUp, color: 'text-red-400 bg-red-500/10' },
  ];

  const appointments = [
    { id: 1, name: 'Sarah Jenkins', time: '09:00 AM', type: 'Annual Physical Checkup', status: 'In Progress' },
    { id: 2, name: 'Robert Chen', time: '10:30 AM', type: 'Hypertension Follow-up', status: 'Scheduled' },
    { id: 3, name: 'Linda Hargrove', time: '11:15 AM', type: 'Post-op Examination', status: 'Scheduled' },
    { id: 4, name: 'Marcus Brody', time: '02:00 PM', type: 'Diabetes Consultation', status: 'Scheduled' },
  ];

  const systemAlerts = [
    { id: 1, message: 'Critical blood pressure telemetry received for patient Jane Doe (Ward 4B)', time: '5m ago', type: 'critical' },
    { id: 2, message: 'Lab findings published: Patient Robert Chen (Serum Chemistries)', time: '20m ago', type: 'info' },
    { id: 3, message: 'Server-side auto backups synchronized successfully with primary EMR storage', time: '1h ago', type: 'sys' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-clinical-950 p-6 md:p-8 border border-slate-800">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-48 w-48 rounded-full bg-clinical-500/10 blur-2xl"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Welcome back, {user?.fullName}
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-400">
            Securely logged in as <span className="font-semibold text-clinical-400">{user?.role}</span>. You have 4 upcoming appointments and 3 unresolved system telemetry notifications.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center space-x-1 rounded-lg bg-slate-800/80 px-3 py-1.5 font-medium text-slate-300 border border-slate-700/50">
              <ShieldCheck className="h-4 w-4 text-clinical-400" />
              <span>HIPAA Vault: Encrypted</span>
            </span>
            <span className="inline-flex items-center space-x-1 rounded-lg bg-slate-800/80 px-3 py-1.5 font-medium text-slate-300 border border-slate-700/50">
              <Clock className="h-4 w-4 text-clinical-400" />
              <span>Shift: Active Duty</span>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="relative overflow-hidden rounded-2xl bg-slate-900 p-5 border border-slate-850 shadow-md hover:shadow-xl hover:border-slate-800 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">{stat.name}</span>
                <div className={`p-2.5 rounded-xl ${stat.color} transition-transform group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold tracking-tight text-white">{stat.value}</span>
                <div className="mt-2 flex items-center space-x-1.5 text-xs">
                  <span className={`font-bold ${stat.changeType === 'increase' ? 'text-clinical-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                  <span className="text-slate-500">vs last cycle</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Appointments column */}
        <div className="rounded-2xl border border-slate-850 bg-slate-900 p-6 flex flex-col justify-between lg:col-span-2">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-slate-850">
              <div className="flex items-center space-x-2.5">
                <Calendar className="h-5 w-5 text-clinical-500" />
                <h3 className="font-heading text-lg font-bold text-white">Daily Consultation Schedule</h3>
              </div>
              <button className="flex items-center space-x-1 text-xs text-clinical-400 font-semibold hover:text-clinical-300 hover:underline">
                <span>View Full Registry</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {appointments.map((app) => (
                <div key={app.id} className="flex items-center justify-between rounded-xl bg-slate-950 p-4 border border-slate-850 hover:border-slate-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 shrink-0 bg-slate-900 border border-slate-800 flex items-center justify-center rounded-lg text-sm text-clinical-400 font-bold">
                      {app.time.substring(0, 5)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{app.name}</p>
                      <p className="text-xs text-slate-500">{app.type}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                    app.status === 'In Progress' 
                      ? 'bg-clinical-500/10 text-clinical-400 border-clinical-500/30' 
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <button className="mt-6 flex w-full items-center justify-center space-x-1.5 rounded-xl bg-slate-850 py-3 text-sm font-semibold text-white hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98] border border-slate-700/50">
            <Plus className="h-4 w-4" />
            <span>Book New Appointment</span>
          </button>
        </div>

        {/* Telemetry/Alerts column */}
        <div className="rounded-2xl border border-slate-850 bg-slate-900 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-slate-850">
              <h3 className="font-heading text-lg font-bold text-white">Live Clinical Alerts</h3>
              <span className="inline-flex items-center rounded-full bg-slate-950 px-2.5 py-0.5 text-xs font-semibold text-slate-400 border border-slate-850">
                Active Telemetry
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="relative overflow-hidden rounded-xl bg-slate-950 p-4 border border-slate-850 hover:border-slate-800 transition-colors">
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    alert.type === 'critical' ? 'bg-red-500' : alert.type === 'info' ? 'bg-clinical-500' : 'bg-slate-750'
                  }`}></div>
                  <div className="pl-1">
                    <p className="text-xs font-semibold text-slate-300 leading-relaxed">{alert.message}</p>
                    <span className="text-[10px] text-slate-500 mt-2 block font-medium">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="mt-6 w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-400 transition-colors">
            Acknowledge all telemetry alerts
          </button>
        </div>
      </div>
    </div>
  );
};
