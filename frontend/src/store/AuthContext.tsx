import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (accessToken: string, refreshToken: string, userDetails: User) => void;
  loginMock: (role: UserRole) => void;
  logout: () => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  hasPermission: (requiredPermission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('emr_token');
    const savedUser = localStorage.getItem('emr_user');
    const savedDemo = localStorage.getItem('emr_demo_mode');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsDemoMode(savedDemo === 'true');
    }
    setIsLoading(false);

    const handleAuthChange = () => {
      const activeToken = localStorage.getItem('emr_token');
      const activeUser = localStorage.getItem('emr_user');
      if (!activeToken || !activeUser) {
        setToken(null);
        setUser(null);
        setIsDemoMode(false);
      }
    };

    window.addEventListener('auth_change', handleAuthChange);
    return () => window.removeEventListener('auth_change', handleAuthChange);
  }, []);

  const login = (jwtToken: string, refreshJwtToken: string, userDetails: User) => {
    localStorage.setItem('emr_token', jwtToken);
    localStorage.setItem('emr_refresh_token', refreshJwtToken);
    localStorage.setItem('emr_user', JSON.stringify(userDetails));
    localStorage.setItem('emr_demo_mode', 'false');
    setToken(jwtToken);
    setUser(userDetails);
    setIsDemoMode(false);
  };

  const loginMock = (role: UserRole) => {
    let permissions: string[] = [];
    if (role === 'ADMIN') {
      permissions = ['PATIENTS_READ', 'PATIENTS_WRITE', 'PATIENTS_DELETE', 'USER_MANAGE', 'SECURITY_MANAGE'];
    } else if (role === 'DOCTOR') {
      permissions = ['PATIENTS_READ', 'PATIENTS_WRITE', 'PRESCRIPTION_CREATE', 'LAB_VIEW', 'AI_ASSIST_VIEW'];
    } else if (role === 'NURSE') {
      permissions = ['PATIENTS_READ', 'VITALS_RECORD'];
    } else if (role === 'RECEPTIONIST') {
      permissions = ['PATIENTS_READ', 'PATIENTS_WRITE', 'PATIENTS_CREATE', 'APPOINTMENTS_CREATE'];
    } else if (role === 'LAB_TECHNICIAN') {
      permissions = ['PATIENTS_READ', 'LAB_VIEW', 'LAB_WRITE'];
    } else if (role === 'PHARMACIST') {
      permissions = ['PATIENTS_READ', 'PHARMACY_VIEW', 'PHARMACY_WRITE'];
    }

    const mockUser: User = {
      id: 999,
      username: role.toLowerCase(),
      email: `${role.toLowerCase()}@lankahospital-emr.lk`,
      fullName: role === 'PATIENT' ? 'Sarah Jenkins (Patient)' : 
                role === 'NURSE' ? 'Nurse Emily Stone' :
                role === 'ADMIN' ? 'Admin Chief (Lanka EMR)' :
                role === 'RECEPTIONIST' ? 'Sunil Perera (Receptionist)' : `Dr. Alex Carter (${role})`,
      role: role,
      active: true,
      permissions: permissions
    };

    const mockToken = 'mock_jwt_token_for_lanka_emr_dashboard';
    localStorage.setItem('emr_token', mockToken);
    localStorage.setItem('emr_refresh_token', 'mock_refresh_token');
    localStorage.setItem('emr_user', JSON.stringify(mockUser));
    localStorage.setItem('emr_demo_mode', 'true');
    setToken(mockToken);
    setUser(mockUser);
    setIsDemoMode(true);
  };

  const logout = () => {
    localStorage.removeItem('emr_token');
    localStorage.removeItem('emr_refresh_token');
    localStorage.removeItem('emr_user');
    localStorage.removeItem('emr_demo_mode');
    setToken(null);
    setUser(null);
    setIsDemoMode(false);
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const hasPermission = (requiredPermission: string): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return user.permissions ? user.permissions.includes(requiredPermission) : false;
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isDemoMode, login, loginMock, logout, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
