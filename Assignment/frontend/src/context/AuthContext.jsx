/**
 * AuthContext — Simple authentication state management
 * Stores the logged-in user in React context so all components can access it.
 * Uses localStorage to persist between page refreshes.
 */

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if there's a saved user in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ocms_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userObj = { ...userData, loggedInAt: new Date().toISOString() };
    setUser(userObj);
    localStorage.setItem('ocms_user', JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ocms_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
