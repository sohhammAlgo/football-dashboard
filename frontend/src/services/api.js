// src/services/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token in localStorage
const setToken = (token) => localStorage.setItem('token', token);

// Remove token from localStorage
const removeToken = () => localStorage.removeItem('token');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== AUTH API ====================

export const authAPI = {
  login: async (username, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (data.success && data.token) {
      setToken(data.token);
    }
    
    return data;
  },

  logout: () => {
    removeToken();
  },

  isAuthenticated: () => {
    return !!getToken();
  }
};

// ==================== PLAYER API ====================

export const playerAPI = {
  getAll: () => apiRequest('/players'),

  getById: (id) => apiRequest(`/players/${id}`),

  create: (playerData) => apiRequest('/players', {
    method: 'POST',
    body: JSON.stringify(playerData),
  }),

  update: (id, playerData) => apiRequest(`/players/${id}`, {
    method: 'PUT',
    body: JSON.stringify(playerData),
  }),

  delete: (id) => apiRequest(`/players/${id}`, {
    method: 'DELETE',
  }),

  getTopPaid: (limit = 5) => apiRequest(`/players/stats/top-paid?limit=${limit}`),

  filterByPosition: (position) => apiRequest(`/players/filter/position/${position}`),

  filterByNationality: (nationality) => apiRequest(`/players/filter/nationality/${nationality}`),
};

// ==================== CLUB API ====================

export const clubAPI = {
  getAll: () => apiRequest('/clubs'),

  getById: (id) => apiRequest(`/clubs/${id}`),
};

// ==================== STADIUM API ====================

export const stadiumAPI = {
  getAll: () => apiRequest('/stadiums'),
};

// ==================== REVENUE API ====================

export const revenueAPI = {
  getAll: () => apiRequest('/revenue'),

  getByClub: (clubId) => apiRequest(`/revenue/club/${clubId}`),

  update: (clubId, revenueData) => apiRequest(`/revenue/${clubId}`, {
    method: 'PUT',
    body: JSON.stringify(revenueData),
  }),

  getTotalRevenue: (clubId) => apiRequest(`/revenue/total/${clubId}`),
};

// ==================== LOGS API ====================

export const logsAPI = {
  getSalaryLogs: () => apiRequest('/logs/salary'),

  getRevenueLogs: () => apiRequest('/logs/revenue'),
};

// ==================== VIEWS API ====================

export const viewsAPI = {
  getPlayerClubView: () => apiRequest('/views/player-club'),

  getTopPlayersView: () => apiRequest('/views/top-players'),
};

// ==================== ANALYTICS API ====================

export const analyticsAPI = {
  getUpcomingBirthdays: () => apiRequest('/analytics/birthdays'),

  getAgeDistribution: () => apiRequest('/analytics/age-distribution'),

  getSalaryStats: () => apiRequest('/analytics/salary-stats'),
};

// ==================== DASHBOARD API ====================

export const dashboardAPI = {
  getStats: () => apiRequest('/dashboard/stats'),
};

export default {
  auth: authAPI,
  player: playerAPI,
  club: clubAPI,
  stadium: stadiumAPI,
  revenue: revenueAPI,
  logs: logsAPI,
  views: viewsAPI,
  analytics: analyticsAPI,
  dashboard: dashboardAPI,
};