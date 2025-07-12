/**
 * API Service Layer for SkillSwap Frontend
 * Handles all backend communication with proper error handling
 */

const API_BASE_URL = 'http://localhost:3000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Helper method to get headers with authentication
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken(); // Use getAuthToken() to check both memory and localStorage
      console.log('🔐 Getting auth token:', token ? 'Token found' : 'No token');
      console.log('🔐 Token value:', token);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Helper method to make API requests
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(options.requireAuth),
          ...options.headers,
        },
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Set authentication token
  setAuthToken(token) {
    console.log('💾 Setting auth token:', token ? 'Token received' : 'No token');
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
      console.log('💾 Token stored in localStorage');
    } else {
      localStorage.removeItem('authToken');
      console.log('💾 Token removed from localStorage');
    }
  }

  // Get current auth token
  getAuthToken() {
    return this.token || localStorage.getItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Clear authentication
  clearAuth() {
    console.log('🧹 Clearing authentication data...');
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    console.log('💾 Authentication data cleared from localStorage');
  }

  // Authentication APIs
  async login(email, password) {
    const response = await this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.setAuthToken(response.token);
      // Store user data for quick access
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    }

    return response;
  }

  async signup(userData) {
    const response = await this.makeRequest('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.setAuthToken(response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    }

    return response;
  }

  async logout() {
    console.log('🚪 Logging out user...');
    this.clearAuth();
    console.log('✅ User logged out successfully');
    return Promise.resolve({ success: true });
  }

  // Skills APIs
  async getSkills() {
    return this.makeRequest('/skills');
  }

  // Home/Public Profiles APIs
  async getPublicProfiles() {
    return this.makeRequest('/home');
  }

  // Profile APIs
  async getCurrentUserProfile() {
    return this.makeRequest('/myprofile', {
      requireAuth: true,
    });
  }

  async updateProfile(profileData) {
    return this.makeRequest('/myprofile', {
      method: 'PUT',
      requireAuth: true,
      body: JSON.stringify(profileData),
    });
  }

  async getUserProfile(userId) {
    return this.makeRequest(`/profile/${userId}`, {
      requireAuth: true,
    });
  }

  // Swap APIs
  async getSwapData(receiverId) {
    return this.makeRequest(`/swap/data/${receiverId}`, {
      requireAuth: true,
    });
  }

  async sendSwapRequest(swapData) {
    return this.makeRequest('/swap/send', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(swapData),
    });
  }

  async getMySwaps() {
    return this.makeRequest('/myswaps', {
      requireAuth: true,
    });
  }

  async getSentSwapRequests() {
    return this.makeRequest('/myswaps/sent', {
      requireAuth: true,
    });
  }

  async getReceivedSwapRequests() {
    return this.makeRequest('/myswaps/received', {
      requireAuth: true,
    });
  }

  async acceptSwapRequest(swapId) {
    return this.makeRequest(`/myswaps/${swapId}/accept`, {
      method: 'PUT',
      requireAuth: true,
    });
  }

  async rejectSwapRequest(swapId) {
    return this.makeRequest(`/myswaps/${swapId}/reject`, {
      method: 'PUT',
      requireAuth: true,
    });
  }

  async cancelSwapRequest(swapId) {
    return this.makeRequest(`/myswaps/cancel/${swapId}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  }

  // Feedback APIs
  async submitFeedback(feedbackData) {
    return this.makeRequest('/feedback', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify(feedbackData),
    });
  }

  // Utility method to get current user from localStorage
  getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  // Check if token is expired and refresh if needed
  async checkAuthStatus() {
    const token = this.getAuthToken();
    if (!token) {
      return false;
    }

    try {
      // Try a simple authenticated request to validate token
      const response = await fetch(`${this.baseURL}/myprofile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Ensure token is set in memory
        this.token = token;
        return true;
      } else {
        // Token is invalid
        this.clearAuth();
        return false;
      }
    } catch (error) {
      // Network error or token is invalid
      console.error('Auth status check failed:', error);
      this.clearAuth();
      return false;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export specific methods for convenience
export const {
  login,
  signup,
  logout,
  getSkills,
  getPublicProfiles,
  getCurrentUserProfile,
  updateProfile,
  getUserProfile,
  getSwapData,
  sendSwapRequest,
  getMySwaps,
  getSentSwapRequests,
  getReceivedSwapRequests,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  submitFeedback,
  getCurrentUser,
  isAuthenticated,
  checkAuthStatus,
  setAuthToken,
  clearAuth,
} = apiService;
