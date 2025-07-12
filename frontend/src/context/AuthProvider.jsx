/**
 * Authentication Provider Component
 */

import React, { useState, useEffect } from 'react';
import { AuthContext } from './authContext';
import apiService from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const storedUser = apiService.getCurrentUser();
        const isValidToken = await apiService.checkAuthStatus();

        if (isValidToken && storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          // Clear invalid auth data
          apiService.clearAuth();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        apiService.clearAuth();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.user && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await apiService.signup(userData);
      
      if (response.user && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      apiService.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: error.message };
    }
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const refreshUserProfile = async () => {
    try {
      const response = await apiService.getCurrentUserProfile();
      if (response.profile) {
        const updatedUser = {
          ...user,
          ...response.profile,
          isLoggedIn: true
        };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
      return { success: false, error: error.message };
    }
  };

  // Create currentUser object in the format expected by existing components
  const currentUser = user ? {
    isLoggedIn: true,
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    location: user.location,
    availability: user.availability,
    public_profile: user.public_profile,
    profile_completed: user.profile_completed,
    skills_offered: user.skills_offered || [],
    skills_wanted: user.skills_wanted || []
  } : {
    isLoggedIn: false,
    user_id: null,
    name: null
  };

  const value = {
    user,
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
