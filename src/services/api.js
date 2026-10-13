/**
 * HerEarn - API Client Service
 * Connects React Frontend with Node.js Express Backend REST API
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('herearn_jwt_token') || sessionStorage.getItem('herearn_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper for HTTP requests
const request = async (endpoint, options = {}) => {
  const config = {
    ...options,
    credentials: 'include', // Ensure HttpOnly cookies are sent and received
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const contentType = res.headers.get('content-type') || '';

    let data;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { message: `Server error (${res.status}): Non-JSON response received` };
    }

    if (!res.ok) {
      const error = new Error(data.message || `HTTP ${res.status} Error`);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data;
  } catch (err) {
    console.warn(`[API Error] ${endpoint}:`, err.message);
    throw err;
  }
};

export const api = {
  // Auth APIs
  register: (userData) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  googleLogin: (credential) => request('/api/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }),
  supabaseSync: (accessToken) => request('/api/auth/supabase-sync', { method: 'POST', body: JSON.stringify({ access_token: accessToken }) }),
  sendOtp: (email) => request('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOtp: (data) => request('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
  verifyAdminKey: (key) => request('/api/auth/verify-admin-key', { method: 'POST', body: JSON.stringify({ key }) }),
  getMe: () => request('/api/auth/me'),

  // User Profile APIs
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
  getTrackEnrollment: (trackId) => request(`/api/enrollments/${trackId}`),
  markLessonComplete: (lessonId) => request(`/api/lessons/${lessonId}/complete`, { method: 'POST' }),
  getTrackProgress: (trackId) => request(`/api/progress/${trackId}`),

  // Portfolio APIs
  getMyPortfolio: () => request('/api/portfolio/me'),
  getPublicPortfolio: () => request('/api/portfolio'),
  getProject: (id) => request(`/api/portfolio/${id}`),
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
  getApplicationDetails: (id) => request(`/api/applications/${id}`),

  // Dashboard & Specific Mine APIs
  getProgressMine: () => request('/api/progress'),
  getApplicationsMine: () => request('/api/applications/mine'),
  getProjectsMine: () => request('/api/projects/mine'),

  // Dashboard API
  getDashboardMetrics: () => request('/api/dashboard'),

  // AI Chatbot API
  sendChatMessage: (message, sessionId) => request('/api/chat', { method: 'POST', body: JSON.stringify({ message, sessionId }) }),

  // Admin APIs
  getAdminMetrics: () => request('/api/admin/metrics'),
  getAdminUsers: () => request('/api/admin/users'),
  updateUserRole: (id, role) => request(`/api/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  updateUserKyc: (id, verifiedKyc) => request(`/api/admin/users/${id}/kyc`, { method: 'PATCH', body: JSON.stringify({ verifiedKyc }) }),
  updateUserStatus: (id, status) => request(`/api/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAdminOpportunities: () => request('/api/admin/opportunities'),
  createAdminOpportunity: (gigData) => request('/api/admin/opportunities', { method: 'POST', body: JSON.stringify(gigData) }),
  updateOpportunityStatus: (id, statusData) => request(`/api/admin/opportunities/${id}/status`, { method: 'PATCH', body: JSON.stringify(statusData) }),
  deleteOpportunity: (id) => request(`/api/admin/opportunities/${id}`, { method: 'DELETE' }),
  getAdminEscrow: () => request('/api/admin/escrow'),
  releaseEscrow: (id) => request(`/api/admin/escrow/${id}/release`, { method: 'POST' }),
  freezeEscrow: (id) => request(`/api/admin/escrow/${id}/freeze`, { method: 'POST' }),
  getAdminSettings: () => request('/api/admin/settings'),
  updateAdminSettings: (settings) => request('/api/admin/settings', { method: 'PATCH', body: JSON.stringify(settings) }),
  getAdminAuditLogs: () => request('/api/admin/audit-logs'),
  createAuditLog: (logData) => request('/api/admin/audit-logs', { method: 'POST', body: JSON.stringify(logData) }),
};
