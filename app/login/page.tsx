'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'resident' | 'supplier' | 'government'>('resident');
  const [area, setArea] = useState('New Haven');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, signup } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/demo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signup(name, email, phone, role, role === 'resident' ? area : undefined);
      router.push('/demo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  const demoAccounts = [
    { name: 'Joshua Nnadi', email: 'joshua@vale.app', role: 'resident' },
    { name: 'Chief Okoro', email: 'okoro@vale.app', role: 'supplier' },
    { name: 'Dr. Eze', email: 'eze@vale.app', role: 'government' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">V Λ L E</h1>
          <p className="text-gray-600 mt-2">Water Access Platform</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsSignup(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              !isSignup ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              isSignup ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
          {isSignup && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="resident">Resident</option>
                <option value="supplier">Water Supplier</option>
                <option value="government">Government Official</option>
              </select>
              {role === 'resident' && (
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="New Haven">New Haven</option>
                  <option value="Independence Layout">Independence Layout</option>
                  <option value="Abakpa">Abakpa</option>
                  <option value="GRA">GRA</option>
                  <option value="Emene">Emene</option>
                </select>
              )}
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <input
            type="password"
            placeholder="Password (any value)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-600 mb-4 font-medium">Demo Accounts (any password):</p>
          <div className="space-y-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => {
                  setEmail(acc.email);
                  setPassword('demo');
                  setIsSignup(false);
                }}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-sm"
              >
                <p className="font-medium text-gray-900">{acc.name}</p>
                <p className="text-gray-600">{acc.email} ({acc.role})</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
