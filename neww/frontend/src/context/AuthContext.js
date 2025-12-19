import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('transactions');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_ERROR':
      localStorage.clear();
      
      // Clear all form inputs when auth error occurs
      if (typeof window !== 'undefined') {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
          if (input.type !== 'submit' && input.type !== 'button') {
            input.value = '';
            input.removeAttribute('value');
          }
        });
      }
      
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load user on mount
  useEffect(() => {
    const initAuth = async () => {
      // Clear any cached data on app start to prevent auto-login
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      dispatch({ type: 'AUTH_ERROR' });
    };

    initAuth();
  }, []);

  const loadUser = async () => {
    // Always require explicit login
    dispatch({ type: 'AUTH_ERROR' });
  };

  const login = async (email, password) => {
    try {
      // Handle demo admin login
      if (email === 'admin@demo.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin',
          name: 'Admin User',
          email: 'admin@demo.com',
          phone: '9123456789',
          balance: 5000,
          role: 'admin'
        };
        
        localStorage.setItem('userData', JSON.stringify(adminUser));
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: adminUser, token: 'admin-token' } });
        toast.success('Welcome Admin!');
        return { success: true, user: adminUser };
      }
      
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;
      
      console.log('🔑 Login Token Received:', token);
      console.log('👤 User Data:', userData);
      
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Add demo transactions if none exist
      const existingTransactions = localStorage.getItem('transactions');
      if (!existingTransactions || JSON.parse(existingTransactions).length === 0) {
        const demoTransactions = [
          {
            id: Date.now() - 1000,
            type: 'recharge',
            amount: 299,
            status: 'success',
            date: new Date(Date.now() - 86400000).toISOString(),
            description: 'Recharge for 9876543210',
            operator: 'Airtel',
            number: '9876543210'
          },
          {
            id: Date.now() - 2000,
            type: 'wallet_add',
            amount: 500,
            status: 'success',
            date: new Date(Date.now() - 172800000).toISOString(),
            description: 'Money added to wallet'
          }
        ];
        localStorage.setItem('transactions', JSON.stringify(demoTransactions));
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userData, token } });
      toast.success(`Welcome ${userData.role === 'admin' ? 'Admin' : userData.name}!`);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;
      
      localStorage.setItem('userData', JSON.stringify(newUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: newUser, token } });
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Clear all localStorage data
    localStorage.clear();
    
    // Clear any form data that might be cached
    if (typeof window !== 'undefined') {
      // Clear any cached form data
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        if (form.reset) form.reset();
      });
      
      // Clear any input fields and remove autocomplete
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        if (input.type !== 'submit' && input.type !== 'button') {
          input.value = '';
          input.removeAttribute('value');
          input.setAttribute('autocomplete', 'off');
        }
      });
      
      // Clear any select fields
      const selects = document.querySelectorAll('select');
      selects.forEach(select => {
        select.selectedIndex = 0;
      });
      
      // Clear any textarea fields
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach(textarea => {
        textarea.value = '';
      });
    }
    
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
    setShowLogoutModal(false);
    
    // Force redirect to login page
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
    }, 500);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const updateUser = async (userData) => {
    try {
      const response = await userAPI.updateProfile(userData);
      const updatedUser = response.data;
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const addMoney = async (amount) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const currentBalance = state.user?.balance || 0;
      const newBalance = currentBalance + parseFloat(amount);
      
      // Add transaction
      const transaction = {
        id: Date.now(),
        type: 'wallet_add',
        amount: parseFloat(amount),
        status: 'success',
        date: new Date().toISOString(),
        description: 'Money added to wallet'
      };
      
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.unshift(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      // Update user balance
      const updatedUser = { ...state.user, balance: newBalance };
      dispatch({ type: 'UPDATE_USER', payload: { balance: newBalance } });
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      toast.success('Money added successfully!');
      return { success: true };
    } catch (error) {
      toast.error('Payment failed');
      return { success: false };
    }
  };

  const addTransaction = (transaction) => {
    const newTransaction = { ...transaction, id: Date.now(), date: new Date().toISOString() };
    
    // Add to user's personal transactions
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Add to global admin view (persistent across all users)
    const globalTransactions = JSON.parse(localStorage.getItem('adminGlobalTransactions') || '[]');
    globalTransactions.unshift({
      ...newTransaction,
      userName: state.user?.name || 'Guest User',
      userEmail: state.user?.email || 'guest@example.com'
    });
    localStorage.setItem('adminGlobalTransactions', JSON.stringify(globalTransactions));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('transactionAdded'));
  };

  const updateBalance = (newBalance) => {
    const updatedUser = { ...state.user, balance: newBalance };
    dispatch({ type: 'UPDATE_USER', payload: { balance: newBalance } });
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    loadUser,
    addMoney,
    addTransaction,
    updateBalance,
    showLogoutModal,
    confirmLogout,
    cancelLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex space-x-3">
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Logout
              </button>
              <button
                onClick={cancelLogout}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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