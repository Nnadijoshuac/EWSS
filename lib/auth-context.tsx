'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';
import { awardNewBadges } from './badges';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, phone: string, role: 'resident' | 'supplier' | 'government', area?: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('vale:user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const stored = localStorage.getItem('vale:users');
    const users: User[] = stored ? JSON.parse(stored) : [];
    const foundUser = users.find((u) => u.email === email);

    if (!foundUser) {
      throw new Error('User not found');
    }

    localStorage.setItem('vale:user', JSON.stringify(foundUser));
    setUser(foundUser);
  };

  const logout = () => {
    localStorage.removeItem('vale:user');
    setUser(null);
  };

  const signup = async (name: string, email: string, phone: string, role: 'resident' | 'supplier' | 'government', area?: string) => {
    const stored = localStorage.getItem('vale:users');
    const users: User[] = stored ? JSON.parse(stored) : [];

    if (users.find((u) => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role,
      area,
      points: 0,
      trustScore: 100,
      badges: [],
      reportCount: 0,
      verifiedReportCount: 0,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('vale:users', JSON.stringify(users));
    localStorage.setItem('vale:user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    let updated = { ...user, ...updates };
    updated = awardNewBadges(updated);

    setUser(updated);
    localStorage.setItem('vale:user', JSON.stringify(updated));

    const stored = localStorage.getItem('vale:users');
    const users: User[] = stored ? JSON.parse(stored) : [];
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = updated;
      localStorage.setItem('vale:users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
