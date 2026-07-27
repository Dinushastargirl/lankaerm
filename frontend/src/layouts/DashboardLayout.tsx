import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  CreditCard, 
  BarChart3, 
  Sparkles, 
  UserCog, 
  ShieldAlert, 
  Menu, 
  Bell, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Database,
  ShieldCheck,
  Send,
  Bot,
  X
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout, isDemoMode, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your clinical EMR co-pilot. How can I help you with patient charts, prescribing guidelines, or clinical calculations?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const query = chatInput;
    setChatInput('');

    setTimeout(() => {
      let responseText = 'Analyzing clinic context... ';
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes('dengue')) {
        responseText += 'Sri Lanka clinical guidelines suggest: Monitor hematocrit, platelet count daily. Restrict fluid intake. Restrict NSAIDs; recommend Paracetamol.';
      } else if (lowerQuery.includes('hypertension')) {
        responseText += 'Hypertension target: <130/80 mmHg for high-risk patients. First-line: Losartan, Amlodipine, or Enalapril. Limit sodium to <2g/day.';
      } else if (lowerQuery.includes('vitals') || lowerQuery.includes('normal')) {
        responseText += 'Standard clinical vitals range: BP 120/80 mmHg, Heart Rate 60-100 bpm, Temp 98.6°F (37°C), Resp Rate 12-20/min.';
      } else if (lowerQuery.includes('search') || lowerQuery.includes('find')) {
        responseText += 'You can query patients using the top search bar, or navigate to the Patients tab on the left.';
      } else {
        responseText += 'Got it. I am ready to assist. You can ask me about "Dengue guidelines", "hypertension therapy", "vitals ranges", or general navigation help.';
      }
      setChatMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    }, 800);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, permission: null },
    { name: 'Patients', path: '/patients', icon: Users, permission: 'PATIENTS_READ' },
    { name: 'Appointments', path: '/appointments', icon: Calendar, permission: 'APPOINTMENTS_CREATE' },
    { name: 'Consultations', path: '/consultations', icon: Stethoscope, permission: 'PRESCRIPTION_CREATE' },
    { name: 'Laboratory', path: '/laboratory', icon: FlaskConical, permission: 'LAB_VIEW' },
    { name: 'Pharmacy', path: '/pharmacy', icon: Pill, permission: 'PHARMACY_VIEW' },
    { name: 'Billing', path: '/billing', icon: CreditCard, permission: 'APPOINTMENTS_CREATE' },
    { name: 'Reports', path: '/reports', icon: BarChart3, permission: 'PATIENTS_READ' },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Sparkles, permission: 'AI_ASSIST_VIEW' },
    { name: 'User Management', path: '/user-management', icon: UserCog, permission: 'USER_MANAGE' },
    { name: 'Security', path: '/security', icon: ShieldAlert, permission: 'SECURITY_MANAGE' },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.permission === null || hasPermission(item.permission)
  );

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'DOCTOR':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'NURSE':
        return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
      case 'RECEPTIONIST':
        return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden md:flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300 relative ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center px-4 border-b border-slate-850 justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-clinical-500 shadow-md shadow-clinical-500/20">
              <Activity className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-heading text-lg font-bold tracking-tight text-white transition-opacity duration-300">
                LANKA<span className="text-clinical-400">EMR</span>
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="h-8 w-8 rounded-lg border border-slate-800 flex items-center justify-center hover:bg-slate-900 text-slate-400 hover:text-white transition-colors absolute -right-4 bg-slate-950 z-10 shadow-md"
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative border ${
                  isActive 
                    ? 'bg-clinical-500/10 text-clinical-400 border-clinical-500/20 shadow-md shadow-clinical-500/5' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border-transparent'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-clinical-400' : 'text-slate-400 group-hover:text-white'}`} />
                {!isSidebarCollapsed && <span className="font-medium text-sm truncate">{item.name}</span>}
                
                {isSidebarCollapsed && (
                  <div className="absolute left-16 bg-slate-950 border border-slate-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card Bottom */}
        <div className="p-3 border-t border-slate-850 bg-slate-950/80">
          <div className={`flex items-center justify-between rounded-xl bg-slate-900/40 p-2 border border-slate-850 ${isSidebarCollapsed ? 'flex-col space-y-2' : ''}`}>
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-clinical-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                {user?.fullName.charAt(0)}
              </div>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate max-w-[110px]">{user?.fullName}</p>
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.2 text-[9px] font-bold ${getRoleBadgeStyle(user?.role || '')} mt-0.5`}>
                    {user?.role}
                  </span>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="h-8 w-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
              title="Logout Clinician"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 z-20">
          <div className="flex items-center space-x-4">
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Search Input Bar */}
            <div className="relative max-w-md hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search patient records or prescriptions..."
                className="w-80 bg-slate-900 border border-slate-850 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-clinical-500 transition-all border-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clinical-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-clinical-500"></span>
              </span>
              <span className="text-slate-400 font-semibold hidden md:inline">Secure EMR Port</span>
            </div>

            {/* Notification Bell */}
            <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-clinical-950 border-b border-clinical-500/20 px-6 py-2 flex items-center justify-between text-xs text-clinical-400 font-medium z-10">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 shrink-0" />
              <span className="truncate">Local Postgres connection skipped. Simulating mock state client-side.</span>
            </div>
            <div className="flex items-center space-x-1 bg-clinical-500/15 px-2 py-0.5 rounded-full text-[10px] font-bold border border-clinical-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Demo Sandbox</span>
            </div>
          </div>
        )}

        {/* Mobile Slide Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/70 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-64 h-full bg-slate-950 border-r border-slate-800 flex flex-col p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-clinical-500">
                  <Activity className="h-5 w-5 text-slate-950 stroke-[2.5]" />
                </div>
                <span className="font-heading text-lg font-bold tracking-tight text-white">LANKAEMR</span>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto">
                {filteredNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 border ${
                        isActive 
                          ? 'bg-clinical-500/10 text-clinical-400 border-clinical-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-slate-850 pt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-clinical-600 flex items-center justify-center text-sm font-bold text-white">
                    {user?.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[120px]">{user?.fullName}</p>
                    <span className="text-[8px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-full">{user?.role}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="h-8 w-8 rounded-lg hover:bg-slate-850 flex items-center justify-center text-slate-400 hover:text-red-400">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Port */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950">
          <Outlet />
        </main>

        {/* Floating AI Chatbot Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          {!isChatOpen ? (
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-clinical-500 hover:bg-clinical-400 text-slate-950 shadow-lg shadow-clinical-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              title="Open AI Assistant"
            >
              <Sparkles className="h-6 w-6 stroke-[2.2]" />
            </button>
          ) : (
            <div className="w-80 sm:w-96 h-[480px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
              {/* Header */}
              <div className="bg-slate-900 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-clinical-500/10 text-clinical-400">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">Clinical AI Co-Pilot</h4>
                    <span className="text-[10px] text-clinical-400 font-semibold mt-1 inline-block">Secure LankaMed-LLM</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 h-7 w-7 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Message Pane */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/50 flex flex-col">
                {chatMessages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start space-x-2 max-w-[85%] ${
                      m.role === 'user' ? 'self-end flex-row-reverse space-x-reverse' : 'self-start'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-clinical-500/10 text-slate-200 border border-clinical-500/20 rounded-tr-none' 
                        : 'bg-slate-900 text-slate-300 border border-slate-850 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSendChat} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about guidelines, vitals, or help..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-clinical-500 transition-all"
                />
                <button
                  type="submit"
                  className="h-8 w-8 bg-clinical-600 hover:bg-clinical-500 text-white rounded-lg flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
