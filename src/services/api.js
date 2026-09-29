/**
 * HerEarn - API Client Service
 * Connects React Frontend with Node.js Express Backend REST API
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('herearn_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper for HTTP requests
const request = async (endpoint, options = {}) => {
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status} Error`);
    }
    return data;
  } catch (err) {
    console.warn(`[API] ${endpoint} request error:`, err.message);
    throw err;
  }
};

export const api = {
  // Auth APIs
  register: (userData) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request('/api/auth/me'),

  // Profile APIs
  getProfile: () => request('/api/users/me'),
  updateProfile: (profileData) => request('/api/users/me', { method: 'PATCH', body: JSON.stringify(profileData) }),

  // Track & Lesson APIs
  getTracks: () => request('/api/tracks'),
  getTrackDetails: (id) => request(`/api/tracks/${id}`),
  getLessons: (trackId) => request(`/api/tracks/${trackId}/lessons`),
  getLesson: (id) => request(`/api/lessons/${id}`),

  // Enrollment & Progress APIs
  enrollTrack: (trackId) => request(`/api/tracks/${trackId}/enroll`, { method: 'POST' }),
  getEnrollments: () => request('/api/enrollments'),
  markLessonComplete: (lessonId) => request(`/api/lessons/${lessonId}/complete`, { method: 'POST' }),
  getTrackProgress: (trackId) => request(`/api/progress/${trackId}`),

  // Portfolio APIs
  getMyPortfolio: () => request('/api/portfolio/me'),
  getPublicPortfolio: () => request('/api/portfolio'),
  createProject: (projectData) => request('/api/portfolio', { method: 'POST', body: JSON.stringify(projectData) }),
  updateProject: (id, projectData) => request(`/api/portfolio/${id}`, { method: 'PATCH', body: JSON.stringify(projectData) }),
  deleteProject: (id) => request(`/api/portfolio/${id}`, { method: 'DELETE' }),

  // Opportunity APIs
  getOpportunities: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/api/opportunities${query ? `?${query}` : ''}`);
  },
  getOpportunityDetails: (id) => request(`/api/opportunities/${id}`),

  // Application APIs
  applyOpportunity: (opportunityId, appData) => request(`/api/opportunities/${opportunityId}/apply`, { method: 'POST', body: JSON.stringify(appData) }),
  getMyApplications: () => request('/api/applications/me'),

  // Dashboard API
  getDashboardMetrics: () => request('/api/dashboard'),
};
