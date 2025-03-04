/**
 * Authentication Service for Royal Tree Services Client Tracker
 * Handles user authentication, session management, and role-based access control
 */

import { AuthAPI, UserAPI } from './api.js';

/**
 * Authentication service
 */
const AuthService = {
  /**
   * Current authenticated user
   */
  currentUser: null,
  
  /**
   * Authentication token
   */
  token: null,
  
  /**
   * Event listeners for auth state changes
   */
  listeners: [],
  
  /**
   * Initialize the authentication service
   * @returns {Promise<Object|null>} Current user or null if not authenticated
   */
  init: async () => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('jwt');
    
    if (token) {
      AuthService.token = token;
      
      try {
        // Fetch current user profile
        const response = await UserAPI.getMe();
        
        if (response.status === 'success') {
          AuthService.currentUser = response.data.user;
          AuthService._notifyListeners();
          return AuthService.currentUser;
        } else {
          // Token is invalid, clear it
          AuthService.logout();
          return null;
        }
      } catch (error) {
        console.error('Failed to initialize auth service:', error);
        AuthService.logout();
        return null;
      }
    }
    
    return null;
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Response data or error
   */
  register: async (userData) => {
    const response = await AuthAPI.signup(userData);
    
    if (response.status === 'success') {
      // Store token and user data
      localStorage.setItem('jwt', response.token);
      AuthService.token = response.token;
      AuthService.currentUser = response.data.user;
      AuthService._notifyListeners();
    }
    
    return response;
  },
  
  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} Response data or error
   */
  login: async (credentials) => {
    const response = await AuthAPI.login(credentials);
    
    if (response.status === 'success') {
      // Store token and user data
      localStorage.setItem('jwt', response.token);
      AuthService.token = response.token;
      AuthService.currentUser = response.data.user;
      AuthService._notifyListeners();
    }
    
    return response;
  },
  
  /**
   * Logout the current user
   * @returns {Promise<Object>} Response data or error
   */
  logout: async () => {
    // Clear token and user data
    localStorage.removeItem('jwt');
    AuthService.token = null;
    AuthService.currentUser = null;
    AuthService._notifyListeners();
    
    // Call logout API (not critical if it fails)
    try {
      await AuthAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    
    return { status: 'success' };
  },
  
  /**
   * Update the current user's password
   * @param {Object} passwordData - Password update data
   * @returns {Promise<Object>} Response data or error
   */
  updatePassword: async (passwordData) => {
    const response = await AuthAPI.updatePassword(passwordData);
    
    if (response.status === 'success') {
      // Update token and user data
      localStorage.setItem('jwt', response.token);
      AuthService.token = response.token;
      AuthService.currentUser = response.data.user;
      AuthService._notifyListeners();
    }
    
    return response;
  },
  
  /**
   * Check if the user is authenticated
   * @returns {boolean} True if authenticated, false otherwise
   */
  isAuthenticated: () => {
    return !!AuthService.currentUser;
  },
  
  /**
   * Check if the user has a specific role
   * @param {string|string[]} roles - Role(s) to check
   * @returns {boolean} True if the user has the role, false otherwise
   */
  hasRole: (roles) => {
    if (!AuthService.currentUser) {
      return false;
    }
    
    if (Array.isArray(roles)) {
      return roles.includes(AuthService.currentUser.role);
    }
    
    return AuthService.currentUser.role === roles;
  },
  
  /**
   * Add a listener for auth state changes
   * @param {Function} listener - Listener function
   */
  addListener: (listener) => {
    if (typeof listener === 'function') {
      AuthService.listeners.push(listener);
    }
  },
  
  /**
   * Remove a listener for auth state changes
   * @param {Function} listener - Listener function
   */
  removeListener: (listener) => {
    const index = AuthService.listeners.indexOf(listener);
    if (index !== -1) {
      AuthService.listeners.splice(index, 1);
    }
  },
  
  /**
   * Notify all listeners of auth state changes
   * @private
   */
  _notifyListeners: () => {
    AuthService.listeners.forEach(listener => {
      try {
        listener(AuthService.currentUser);
      } catch (error) {
        console.error('Auth listener error:', error);
      }
    });
  }
};

export default AuthService; 