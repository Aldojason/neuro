import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth: string;
  createdAt: string;
  role: 'patient' | 'doctor';
  specialization?: string; // For doctors
  licenseNumber?: string; // For doctors
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
  register: (email: string, password: string, name: string, dateOfBirth: string, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('medipredict_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'patient' | 'doctor') => {
    // Simulate API call
    const userData = {
      id: '1',
      email,
      name: role === 'doctor' ? 'Dr. Smith' : 'John Patient',
      dateOfBirth: '1960-01-01',
      createdAt: new Date().toISOString(),
      role,
      ...(role === 'doctor' && {
        specialization: 'Neurology',
        licenseNumber: 'MD12345'
      })
    };
    setUser(userData);
    localStorage.setItem('medipredict_user', JSON.stringify(userData));
    localStorage.setItem(`${role}Session`, 'true');
  };

  const register = async (email: string, password: string, name: string, dateOfBirth: string, role: 'patient' | 'doctor') => {
    // Simulate API call
    const userData = {
      id: Date.now().toString(),
      email,
      name,
      dateOfBirth,
      createdAt: new Date().toISOString(),
      role,
      ...(role === 'doctor' && {
        specialization: 'Neurology',
        licenseNumber: 'MD' + Date.now().toString().slice(-5)
      })
    };
    setUser(userData);
    localStorage.setItem('medipredict_user', JSON.stringify(userData));
    localStorage.setItem(`${role}Session`, 'true');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medipredict_user');
    localStorage.removeItem('doctorSession');
    localStorage.removeItem('patientSession');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}