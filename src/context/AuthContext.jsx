import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { sounds } from '../utils/audio';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Customer Auth State
  const [customerUser, setCustomerUser] = useState(() => {
    try {
      const saved = localStorage.getItem('thc_customer_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Admin Auth State (session-persisted)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('thc_admin_auth') === 'true';
  });

  // Modals visibility controlled through context
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [authPendingCallback, setAuthPendingCallback] = useState(null);

  // Sync Customer User to storage
  useEffect(() => {
    if (customerUser) {
      localStorage.setItem('thc_customer_user', JSON.stringify(customerUser));
    } else {
      localStorage.removeItem('thc_customer_user');
    }
  }, [customerUser]);

  // Sync Admin Auth state
  useEffect(() => {
    if (isAdminLoggedIn) {
      sessionStorage.setItem('thc_admin_auth', 'true');
    } else {
      sessionStorage.removeItem('thc_admin_auth');
    }
  }, [isAdminLoggedIn]);

  // Customer Login / Signup
  const customerLogin = async (userData) => {
    sounds.playClick();
    const res = await api.customerLogin(userData);
    if (res.success && res.user) {
      setCustomerUser(res.user);
      setIsCustomerAuthOpen(false);
      sounds.playOrderPlaced();

      if (authPendingCallback && typeof authPendingCallback === 'function') {
        authPendingCallback(res.user);
        setAuthPendingCallback(null);
      }
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  // Customer Logout
  const customerLogout = () => {
    sounds.playClick();
    setCustomerUser(null);
  };

  // Admin Login
  const adminLogin = async (pinOrPassword) => {
    sounds.playClick();
    const res = await api.adminLogin(pinOrPassword);
    if (res.success) {
      setIsAdminLoggedIn(true);
      setIsAdminLoginOpen(false);
      sounds.playOrderPlaced();
      return { success: true };
    }
    return { success: false, message: res.message || 'Invalid passcode or password' };
  };

  // Admin Logout
  const adminLogout = () => {
    sounds.playClick();
    setIsAdminLoggedIn(false);
  };

  // Helper: Guard actions that require customer login (e.g. Menu, Cart checkout)
  const requireCustomerAuth = (callback) => {
    if (customerUser) {
      if (callback) callback(customerUser);
      return true;
    } else {
      setAuthPendingCallback(() => callback);
      setIsCustomerAuthOpen(true);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customerUser,
        isCustomerLoggedIn: !!customerUser,
        isAdminLoggedIn,
        isCustomerAuthOpen,
        setIsCustomerAuthOpen,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        customerLogin,
        customerLogout,
        adminLogin,
        adminLogout,
        requireCustomerAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
