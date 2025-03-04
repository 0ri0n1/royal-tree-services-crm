/**
 * Client Service for Royal Tree Services Client Tracker
 * Handles client data management with offline support
 */

import { ClientAPI, OfflineSync } from './api.js';

/**
 * Client service
 */
const ClientService = {
  /**
   * Cached clients data
   */
  clients: [],
  
  /**
   * Event listeners for client data changes
   */
  listeners: [],
  
  /**
   * Initialize the client service
   * @returns {Promise<Object[]>} Clients data
   */
  init: async () => {
    try {
      // Initialize offline sync
      OfflineSync.init();
      
      // Load clients from API
      const response = await ClientAPI.getAllClients();
      
      if (response.status === 'success') {
        ClientService.clients = response.data.clients;
        ClientService._notifyListeners();
      } else {
        console.error('Failed to load clients:', response.message);
        
        // Try to load from cache if API fails
        const cachedClients = localStorage.getItem('cached_clients');
        if (cachedClients) {
          ClientService.clients = JSON.parse(cachedClients);
          ClientService._notifyListeners();
        }
      }
      
      return ClientService.clients;
    } catch (error) {
      console.error('Failed to initialize client service:', error);
      
      // Try to load from cache if initialization fails
      const cachedClients = localStorage.getItem('cached_clients');
      if (cachedClients) {
        ClientService.clients = JSON.parse(cachedClients);
        ClientService._notifyListeners();
      }
      
      return ClientService.clients;
    }
  },
  
  /**
   * Get all clients
   * @param {Object} queryParams - Query parameters for filtering, sorting, etc.
   * @returns {Promise<Object[]>} Clients data
   */
  getAllClients: async (queryParams = {}) => {
    try {
      const response = await ClientAPI.getAllClients(queryParams);
      
      if (response.status === 'success') {
        ClientService.clients = response.data.clients;
        
        // Cache clients for offline use
        localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
        
        ClientService._notifyListeners();
      }
      
      return ClientService.clients;
    } catch (error) {
      console.error('Failed to get clients:', error);
      return ClientService.clients;
    }
  },
  
  /**
   * Get a client by ID
   * @param {string} id - Client ID
   * @returns {Promise<Object|null>} Client data or null if not found
   */
  getClient: async (id) => {
    // First check if we have it in the cache
    const cachedClient = ClientService.clients.find(client => client._id === id);
    
    if (cachedClient) {
      return cachedClient;
    }
    
    // If not in cache, fetch from API
    try {
      const response = await ClientAPI.getClient(id);
      
      if (response.status === 'success') {
        // Update cache if client exists in it
        const index = ClientService.clients.findIndex(client => client._id === id);
        
        if (index !== -1) {
          ClientService.clients[index] = response.data.client;
        } else {
          ClientService.clients.push(response.data.client);
        }
        
        // Cache clients for offline use
        localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
        
        ClientService._notifyListeners();
        
        return response.data.client;
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to get client ${id}:`, error);
      return cachedClient || null;
    }
  },
  
  /**
   * Create a new client
   * @param {Object} clientData - Client data
   * @returns {Promise<Object|null>} Created client or null if failed
   */
  createClient: async (clientData) => {
    try {
      // Use offline sync to handle potential offline state
      const response = await OfflineSync.performOperation(
        '/clients',
        {
          method: 'POST',
          body: JSON.stringify(clientData)
        },
        (result) => {
          if (result.status === 'success') {
            // Add to cache
            ClientService.clients.push(result.data.client);
            
            // Cache clients for offline use
            localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
            
            ClientService._notifyListeners();
          }
        }
      );
      
      if (response.status === 'success') {
        // Add to cache
        ClientService.clients.push(response.data.client);
        
        // Cache clients for offline use
        localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
        
        ClientService._notifyListeners();
        
        return response.data.client;
      } else if (response.status === 'queued') {
        // Create a temporary client with a temporary ID
        const tempClient = {
          ...clientData,
          _id: `temp_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _isTemp: true
        };
        
        // Add to cache
        ClientService.clients.push(tempClient);
        
        // Cache clients for offline use
        localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
        
        ClientService._notifyListeners();
        
        return tempClient;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to create client:', error);
      return null;
    }
  },
  
  /**
   * Update a client
   * @param {string} id - Client ID
   * @param {Object} clientData - Client data
   * @returns {Promise<Object|null>} Updated client or null if failed
   */
  updateClient: async (id, clientData) => {
    try {
      // Use offline sync to handle potential offline state
      const response = await OfflineSync.performOperation(
        `/clients/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(clientData)
        },
        (result) => {
          if (result.status === 'success') {
            // Update cache
            const index = ClientService.clients.findIndex(client => client._id === id);
            
            if (index !== -1) {
              ClientService.clients[index] = result.data.client;
              
              // Cache clients for offline use
              localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
              
              ClientService._notifyListeners();
            }
          }
        }
      );
      
      if (response.status === 'success') {
        // Update cache
        const index = ClientService.clients.findIndex(client => client._id === id);
        
        if (index !== -1) {
          ClientService.clients[index] = response.data.client;
          
          // Cache clients for offline use
          localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
          
          ClientService._notifyListeners();
          
          return response.data.client;
        }
      } else if (response.status === 'queued') {
        // Update the client in cache with a temporary flag
        const index = ClientService.clients.findIndex(client => client._id === id);
        
        if (index !== -1) {
          const updatedClient = {
            ...ClientService.clients[index],
            ...clientData,
            updatedAt: new Date().toISOString(),
            _isTemp: true
          };
          
          ClientService.clients[index] = updatedClient;
          
          // Cache clients for offline use
          localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
          
          ClientService._notifyListeners();
          
          return updatedClient;
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to update client ${id}:`, error);
      return null;
    }
  },
  
  /**
   * Delete a client
   * @param {string} id - Client ID
   * @returns {Promise<boolean>} Success status
   */
  deleteClient: async (id) => {
    try {
      // Use offline sync to handle potential offline state
      const response = await OfflineSync.performOperation(
        `/clients/${id}`,
        {
          method: 'DELETE'
        },
        (result) => {
          if (result.status === 'success') {
            // Remove from cache
            ClientService.clients = ClientService.clients.filter(client => client._id !== id);
            
            // Cache clients for offline use
            localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
            
            ClientService._notifyListeners();
          }
        }
      );
      
      if (response.status === 'success' || response.status === 'queued') {
        // Remove from cache
        ClientService.clients = ClientService.clients.filter(client => client._id !== id);
        
        // Cache clients for offline use
        localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
        
        ClientService._notifyListeners();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Failed to delete client ${id}:`, error);
      return false;
    }
  },
  
  /**
   * Add a note to a client
   * @param {string} id - Client ID
   * @param {Object} noteData - Note data
   * @returns {Promise<Object|null>} Updated client or null if failed
   */
  addClientNote: async (id, noteData) => {
    try {
      // Use offline sync to handle potential offline state
      const response = await OfflineSync.performOperation(
        `/clients/${id}/notes`,
        {
          method: 'POST',
          body: JSON.stringify(noteData)
        },
        (result) => {
          if (result.status === 'success') {
            // Update cache
            const index = ClientService.clients.findIndex(client => client._id === id);
            
            if (index !== -1) {
              ClientService.clients[index] = result.data.client;
              
              // Cache clients for offline use
              localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
              
              ClientService._notifyListeners();
            }
          }
        }
      );
      
      if (response.status === 'success') {
        // Update cache
        const index = ClientService.clients.findIndex(client => client._id === id);
        
        if (index !== -1) {
          ClientService.clients[index] = response.data.client;
          
          // Cache clients for offline use
          localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
          
          ClientService._notifyListeners();
          
          return response.data.client;
        }
      } else if (response.status === 'queued') {
        // Add a temporary note to the client in cache
        const index = ClientService.clients.findIndex(client => client._id === id);
        
        if (index !== -1) {
          const tempNote = {
            ...noteData,
            _id: `temp_${Date.now()}`,
            createdAt: new Date().toISOString(),
            _isTemp: true
          };
          
          const updatedClient = {
            ...ClientService.clients[index],
            notes: [...(ClientService.clients[index].notes || []), tempNote],
            updatedAt: new Date().toISOString()
          };
          
          ClientService.clients[index] = updatedClient;
          
          // Cache clients for offline use
          localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
          
          ClientService._notifyListeners();
          
          return updatedClient;
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to add note to client ${id}:`, error);
      return null;
    }
  },
  
  /**
   * Add a service to a client
   * @param {string} id - Client ID
   * @param {Object} serviceData - Service data
   * @returns {Promise<Object|null>} Updated client or null if failed
   */
  addClientService: async (id, serviceData) => {
    try {
      // Use offline sync to handle potential offline state
      const response = await OfflineSync.performOperation(
        `/clients/${id}/services`,
        {
          method: 'POST',
          body: JSON.stringify(serviceData)
        },
        (result) => {
          if (result.status === 'success') {
            // Update cache
            const index = ClientService.clients.findIndex(client => client._id === id);
            
            if (index !== -1) {
              ClientService.clients[index] = result.data.client;
              
              // Cache clients for offline use
              localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
              
              ClientService._notifyListeners();
            }
          }
        }
      );
      
      if (response.status === 'success') {
        // Update cache
        const index = ClientService.clients.findIndex(client => client._id === id);
        
        if (index !== -1) {
          ClientService.clients[index] = response.data.client;
          
          // Cache clients for offline use
          localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
          
          ClientService._notifyListeners();
          
          return response.data.client;
        }
      } else if (response.status === 'queued') {
        // Add a temporary service to the client in cache
        const index = ClientService.clients.findIndex(client => client._id === id);
        
        if (index !== -1) {
          const tempService = {
            ...serviceData,
            _id: `temp_${Date.now()}`,
            createdAt: new Date().toISOString(),
            _isTemp: true
          };
          
          const updatedClient = {
            ...ClientService.clients[index],
            services: [...(ClientService.clients[index].services || []), tempService],
            updatedAt: new Date().toISOString()
          };
          
          ClientService.clients[index] = updatedClient;
          
          // Cache clients for offline use
          localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
          
          ClientService._notifyListeners();
          
          return updatedClient;
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to add service to client ${id}:`, error);
      return null;
    }
  },
  
  /**
   * Add a document to a client
   * @param {string} id - Client ID
   * @param {Object} documentData - Document data
   * @returns {Promise<Object|null>} Updated client or null if failed
   */
  addClientDocument: async (id, documentData) => {
    try {
      // Use offline sync to handle potential offline state
      const response = await OfflineSync.performOperation(
        `/clients/${id}/documents`,
        {
          method: 'POST',
          body: JSON.stringify(documentData)
        },
        (result) => {
          if (result.status === 'success') {
            // Update cache
            const index = ClientService.clients.findIndex(client => client._id === id);
            
            if (index !== -1) {
              ClientService.clients[index] = result.data.client;
              
              // Cache clients for offline use
              localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
              
              ClientService._notifyListeners();
            }
          }
        }
      );
      
      if (response.status === 'success') {
        // Update cache
        const index = ClientService.clients.findIndex(client => client._id === id);
        
        if (index !== -1) {
          ClientService.clients[index] = response.data.client;
          
          // Cache clients for offline use
          localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
          
          ClientService._notifyListeners();
          
          return response.data.client;
        }
      } else if (response.status === 'queued') {
        // Add a temporary document to the client in cache
        const index = ClientService.clients.findIndex(client => client._id === id);
        
        if (index !== -1) {
          const tempDocument = {
            ...documentData,
            _id: `temp_${Date.now()}`,
            uploadedAt: new Date().toISOString(),
            _isTemp: true
          };
          
          const updatedClient = {
            ...ClientService.clients[index],
            documents: [...(ClientService.clients[index].documents || []), tempDocument],
            updatedAt: new Date().toISOString()
          };
          
          ClientService.clients[index] = updatedClient;
          
          // Cache clients for offline use
          localStorage.setItem('cached_clients', JSON.stringify(ClientService.clients));
          
          ClientService._notifyListeners();
          
          return updatedClient;
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to add document to client ${id}:`, error);
      return null;
    }
  },
  
  /**
   * Add a listener for client data changes
   * @param {Function} listener - Listener function
   */
  addListener: (listener) => {
    if (typeof listener === 'function') {
      ClientService.listeners.push(listener);
    }
  },
  
  /**
   * Remove a listener for client data changes
   * @param {Function} listener - Listener function
   */
  removeListener: (listener) => {
    const index = ClientService.listeners.indexOf(listener);
    if (index !== -1) {
      ClientService.listeners.splice(index, 1);
    }
  },
  
  /**
   * Notify all listeners of client data changes
   * @private
   */
  _notifyListeners: () => {
    ClientService.listeners.forEach(listener => {
      try {
        listener(ClientService.clients);
      } catch (error) {
        console.error('Client listener error:', error);
      }
    });
  }
};

export default ClientService; 