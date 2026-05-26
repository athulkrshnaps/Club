import { createContext, useContext, useState } from 'react';
import { api } from '../lib/api';

const STORAGE_KEY = 'navodhayam-auth';

const demoAccounts = {
  'admin@navodhayam.org': {
    password: 'Admin@12345',
    user: {
      id: 'demo-admin',
      name: 'Navodhayam Admin',
      email: 'admin@navodhayam.org',
      phone: '9995000001',
      role: 'admin',
      membershipId: 'NVA-ADMIN-001',
      address: 'Navodhayam Vayanashala, Amarakuni'
    }
  },
  '9876543210': {
    password: 'Member@12345',
    user: {
      id: 'demo-member',
      name: 'Akhil Member',
      email: 'akhil.member@example.com',
      phone: '9876543210',
      role: 'member',
      membershipId: 'NVA-2026-AKHIL',
      address: 'Amarakuni, Kerala'
    }
  }
};

const AuthContext = createContext(null);

const readStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readStoredAuth);

  const persist = (nextAuth) => {
    setAuth(nextAuth);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
  };

  const login = async ({ identifier, password }) => {
    try {
      const result = await api.post('/auth/login', { identifier, password });
      persist(result);
      return result;
    } catch (error) {
      const demo = demoAccounts[identifier?.trim()];
      if (demo?.password === password) {
        const result = { token: `demo-token-${demo.user.role}`, user: demo.user };
        persist(result);
        return result;
      }

      throw error;
    }
  };

  const registerMember = async (payload) => {
    const result = await api.post('/auth/register-member', payload);
    persist(result);
    return result;
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    token: auth.token,
    user: auth.user,
    isAuthenticated: Boolean(auth.token),
    isAdmin: auth.user?.role === 'admin',
    login,
    registerMember,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
