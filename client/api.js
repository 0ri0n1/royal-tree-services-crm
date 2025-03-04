/**
 * API Service for Royal Tree Services Client Tracker
 * Handles all communication with the backend API
 */

const API_URL = 'http://localhost:3000/api';

/**
 * Handles API errors and returns a standardized error object
 * @param {Error} error - The error object
 * @returns {Object} Standardized error object
 */
const handleError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with an error status code
    return {
      status: 'error',
      message: error.response.data.message || 'An error occurred',
      statusCode: error.response.status
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      status: 'error',
      message: 'No response from server. Please check your connection.',
      statusCode: 0
    };
  } else {
    // Something else caused the error
    return {
      status: 'error',
      message: error.message || 'An unknown error occurred',
      statusCode: 0
    };
  }
};

/**
 * Makes an API request with the appropriate headers and error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data or error
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('jwt');
    
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    // Make the request
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Parse the response
    const data = await response.json();
    
    // Check if the response is an error
    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data
        }
      };
    }
    
    return data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Authentication API methods
 */
const AuthAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Response data or error
   */
  signup: (userData) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} Response data or error
   */
  login: (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  /**
   * Logout the current user
   * @returns {Promise<Object>} Response data or error
   */
  logout: () => {
    return apiRequest('/auth/logout');
  },
  
  /**
   * Update the current user's password
   * @param {Object} passwordData - Password update data
   * @returns {Promise<Object>} Response data or error
   */
  updatePassword: (passwordData) => {
    return apiRequest('/auth/updateMyPassword', {
      method: 'PATCH',
      body: JSON.stringify(passwordData)
    });
  }
};

/**
 * User API methods
 */
const UserAPI = {
  /**
   * Get the current user's profile
   * @returns {Promise<Object>} Response data or error
   */
  getMe: () => {
    return apiRequest('/users/me');
  },
  
  /**
   * Update the current user's profile
   * @param {Object} userData - User profile data
   * @returns {Promise<Object>} Response data or error
   */
  updateMe: (userData) => {
    return apiRequest('/users/updateMe', {
      method: 'PATCH',
      body: JSON.stringify(userData)
    });
  },
  
  /**
   * Delete the current user's account
   * @returns {Promise<Object>} Response data or error
   */
  deleteMe: () => {
    return apiRequest('/users/deleteMe', {
      method: 'DELETE'
    });
  },
  
  /**
   * Get all users (admin only)
   * @returns {Promise<Object>} Response data or error
   */
  getAllUsers: () => {
    return apiRequest('/users');
  },
  
  /**
   * Get a user by ID (admin only)
   * @param {string} id - User ID
   * @returns {Promise<Object>} Response data or error
   */
  getUser: (id) => {
    return apiRequest(`/users/${id}`);
  },
  
  /**
   * Create a new user (admin only)
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Response data or error
   */
  createUser: (userData) => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  /**
   * Update a user (admin only)
   * @param {string} id - User ID
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Response data or error
   */
  updateUser: (id, userData) => {
    return apiRequest(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData)
    });
  },
  
  /**
   * Delete a user (admin only)
   * @param {string} id - User ID
   * @returns {Promise<Object>} Response data or error
   */
  deleteUser: (id) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE'
    });
  }
};

/**
 * Client API methods
 */
const ClientAPI = {
  /**
   * Get all clients
   * @param {Object} queryParams - Query parameters for filtering, sorting, etc.
   * @returns {Promise<Object>} Response data or error
   */
  getAllClients: (queryParams = {}) => {
    // Convert query params to URL search params
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      params.append(key, value);
    });
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/clients${queryString}`);
  },
  
  /**
   * Get a client by ID
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Response data or error
   */
  getClient: (id) => {
    return apiRequest(`/clients/${id}`);
  },
  
  /**
   * Create a new client
   * @param {Object} clientData - Client data
   * @returns {Promise<Object>} Response data or error
   */
  createClient: (clientData) => {
    return apiRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData)
    });
  },
  
  /**
   * Update a client
   * @param {string} id - Client ID
   * @param {Object} clientData - Client data
   * @returns {Promise<Object>} Response data or error
   */
  updateClient: (id, clientData) => {
    return apiRequest(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(clientData)
    });
  },
  
  /**
   * Delete a client
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Response data or error
   */
  deleteClient: (id) => {
    return apiRequest(`/clients/${id}`, {
      method: 'DELETE'
    });
  },
  
  /**
   * Add a note to a client
   * @param {string} id - Client ID
   * @param {Object} noteData - Note data
   * @returns {Promise<Object>} Response data or error
   */
  addClientNote: (id, noteData) => {
    return apiRequest(`/clients/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify(noteData)
    });
  },
  
  /**
   * Add a service to a client
   * @param {string} id - Client ID
   * @param {Object} serviceData - Service data
   * @returns {Promise<Object>} Response data or error
   */
  addClientService: (id, serviceData) => {
    return apiRequest(`/clients/${id}/services`, {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  },
  
  /**
   * Add a document to a client
   * @param {string} id - Client ID
   * @param {Object} documentData - Document data
   * @returns {Promise<Object>} Response data or error
   */
  addClientDocument: (id, documentData) => {
    return apiRequest(`/clients/${id}/documents`, {
      method: 'POST',
      body: JSON.stringify(documentData)
    });
  }
};

/**
 * Offline sync service
 * Handles offline data synchronization with the backend
 */
const OfflineSync = {
  /**
   * Queue for storing offline operations
   */
  queue: [],
  
  /**
   * Initialize the offline sync service
   */
  init: () => {
    // Load queue from localStorage
    const savedQueue = localStorage.getItem('offline_queue');
    if (savedQueue) {
      OfflineSync.queue = JSON.parse(savedQueue);
    }
    
    // Add event listeners for online/offline status
    window.addEventListener('online', OfflineSync.syncWithServer);
    window.addEventListener('offline', () => {
      console.log('App is offline. Changes will be synced when connection is restored.');
    });
    
    // Check if we're online and sync if needed
    if (navigator.onLine && OfflineSync.queue.length > 0) {
      OfflineSync.syncWithServer();
    }
  },
  
  /**
   * Add an operation to the queue
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @param {Function} callback - Callback function to execute after sync
   */
  addToQueue: (endpoint, options, callback) => {
    OfflineSync.queue.push({
      endpoint,
      options,
      callback,
      timestamp: Date.now()
    });
    
    // Save queue to localStorage
    localStorage.setItem('offline_queue', JSON.stringify(OfflineSync.queue));
    
    console.log('Operation added to offline queue');
  },
  
  /**
   * Sync queued operations with the server
   */
  syncWithServer: async () => {
    if (!navigator.onLine || OfflineSync.queue.length === 0) {
      return;
    }
    
    console.log('Syncing offline operations with server...');
    
    // Process each operation in the queue
    const operations = [...OfflineSync.queue];
    OfflineSync.queue = [];
    localStorage.setItem('offline_queue', JSON.stringify(OfflineSync.queue));
    
    for (const op of operations) {
      try {
        const result = await apiRequest(op.endpoint, op.options);
        
        // Execute callback if provided
        if (op.callback && typeof op.callback === 'function') {
          op.callback(result);
        }
        
        console.log('Synced operation:', op.endpoint);
      } catch (error) {
        console.error('Failed to sync operation:', error);
        
        // Add back to queue if it's a server error or connection issue
        if (error.statusCode >= 500 || error.statusCode === 0) {
          OfflineSync.queue.push(op);
          localStorage.setItem('offline_queue', JSON.stringify(OfflineSync.queue));
        }
      }
    }
    
    console.log('Sync completed');
  },
  
  /**
   * Perform an operation with offline support
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @param {Function} callback - Callback function to execute after sync
   * @returns {Promise<Object>} Response data or error
   */
  performOperation: async (endpoint, options, callback) => {
    // If online, try to perform the operation immediately
    if (navigator.onLine) {
      try {
        return await apiRequest(endpoint, options);
      } catch (error) {
        // If server error or connection issue, add to queue
        if (error.statusCode >= 500 || error.statusCode === 0) {
          OfflineSync.addToQueue(endpoint, options, callback);
          return { status: 'queued', message: 'Operation queued for sync' };
        }
        
        // Otherwise, return the error
        return error;
      }
    } else {
      // If offline, add to queue
      OfflineSync.addToQueue(endpoint, options, callback);
      return { status: 'queued', message: 'Operation queued for sync' };
    }
  }
};

// Export the API services
export { AuthAPI, UserAPI, ClientAPI, OfflineSync }; 