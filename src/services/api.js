/**
 * HerEarn - API Client Service
 * Connects React Frontend with Node.js Express Backend REST API
 */

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const API_BASE = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

const getAuthHeaders = (endpoint = '') => {
  const isAdminEndpoint = endpoint.startsWith('/api/admin');
  const adminToken = sessionStorage.getItem('herearn_admin_token');
  const adminKey = sessionStorage.getItem('herearn_admin_verified_key') || 'HEREARN-ADMIN-2026-X9K';
  const userToken = localStorage.getItem('herearn_jwt_token');

  // For administrative endpoints, prioritize admin authorization credentials
  const token = isAdminEndpoint
    ? (adminToken || userToken)
    : (userToken || adminToken);

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (isAdminEndpoint && adminKey) {
    headers['x-admin-key'] = adminKey;
  }

  return headers;
};

// Helper for HTTP requests with 3.5s timeout to prevent UI freezes
const request = async (endpoint, options = {}) => {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;

  const config = {
    ...options,
    credentials: 'include', // Ensure HttpOnly cookies are sent and received
    signal: options.signal || (controller ? controller.signal : undefined),
    headers: {
      ...getAuthHeaders(endpoint),
      ...options.headers,
    },
  };

  try {
    let res;
    try {
      res = await fetch(`${API_BASE}${endpoint}`, config);
    } catch (fetchErr) {
      // If relative URL failed, attempt direct backend port 5001 fallback
      if (!API_BASE && typeof window !== 'undefined') {
        try {
          res = await fetch(`http://localhost:5001${endpoint}`, config);
        } catch {
          throw fetchErr;
        }
      } else {
        throw fetchErr;
      }
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }

    // If Vite proxy returned 503 (e.g. proxy mismatch), retry directly to backend port 5001
    if (!API_BASE && res && res.status === 503 && typeof window !== 'undefined') {
      try {
        const directRes = await fetch(`http://localhost:5001${endpoint}`, config);
        if (directRes && directRes.status !== 503) {
          res = directRes;
        }
      } catch {
        // Retain original response
      }
    }

    const contentType = res.headers.get('content-type') || '';

    let data;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { message: `Server error (${res.status}): Non-JSON response received` };
    }

    if (!res.ok) {
      if (res.status === 401 && endpoint === '/api/auth/me') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('herearn_jwt_token');
        }
      }
      const error = new Error(data.message || `HTTP ${res.status} Error`);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data;
  } catch (err) {
    if (endpoint !== '/api/auth/me' || err.status !== 401) {
      console.warn(`[API Error] ${endpoint}:`, err.message);
    }
    throw err;
  }
};

export const api = {
    // Recruiter APIs
  getRecruiterStats: () => request('/api/recruiter/stats'),
  getRecruiterJobs: () => request('/api/recruiter/jobs'),
  createRecruiterJob: (data) => request('/api/recruiter/jobs', { method: 'POST', body: JSON.stringify(data) }),
  updateRecruiterJob: (id, data) => request(`/api/recruiter/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteRecruiterJob: (id) => request(`/api/recruiter/jobs/${id}`, { method: 'DELETE' }),
  getRecruiterApplicants: () => request('/api/recruiter/applicants'),
  updateApplicantStatus: (id, status) => request(`/api/recruiter/applicants/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
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
  getPublicPortfolio: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/api/portfolio${query ? `?${query}` : ''}`);
  },
  getPortfolioStats: () => request('/api/portfolio/stats'),
  getProject: (id) => request(`/api/portfolio/${id}`),
  likeProject: (id) => request(`/api/portfolio/${id}/like`, { method: 'POST' }),
  createProject: (projectData) => request('/api/portfolio', { method: 'POST', body: JSON.stringify(projectData) }),
  updateProject: (id, projectData) => request(`/api/portfolio/${id}`, { method: 'PATCH', body: JSON.stringify(projectData) }),
  deleteProject: (id) => request(`/api/portfolio/${id}`, { method: 'DELETE' }),

  // Opportunity APIs
  getOpportunities: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/api/opportunities${query ? `?${query}` : ''}`);
  },
  getOpportunityDetails: (id) => request(`/api/opportunities/${id}`),
  createOpportunity: (data) => request('/api/opportunities', { method: 'POST', body: JSON.stringify(data) }),

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
  deleteOpportunity: (id, extra = {}) => {
    const q = extra?.title ? `?title=${encodeURIComponent(extra.title)}` : '';
    return request(`/api/admin/opportunities/${id}${q}`, { method: 'DELETE', body: JSON.stringify(extra) });
  },
  getAdminEscrow: () => request('/api/admin/escrow'),
  releaseEscrow: (id) => request(`/api/admin/escrow/${id}/release`, { method: 'POST' }),
  freezeEscrow: (id) => request(`/api/admin/escrow/${id}/freeze`, { method: 'POST' }),
  getAdminSettings: () => request('/api/admin/settings'),
  updateAdminSettings: (settings) => request('/api/admin/settings', { method: 'PATCH', body: JSON.stringify(settings) }),
  getAdminAuditLogs: () => request('/api/admin/audit-logs'),
  createAuditLog: (logData) => request('/api/admin/audit-logs', { method: 'POST', body: JSON.stringify(logData) }),

  // Community APIs
  getCommunityUsers: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/api/community/users${query ? `?${query}` : ''}`);
  },
  getCommunityConnections: () => request('/api/community/connections'),
  getPendingRequests: () => request('/api/community/requests/pending'),
  getSentRequests: () => request('/api/community/requests/sent'),
  sendConnectionRequest: (userId) => request(`/api/community/connect/${userId}`, { method: 'POST' }),
  acceptConnectionRequest: (requestId) => request(`/api/community/requests/${requestId}/accept`, { method: 'POST' }),
  rejectConnectionRequest: (requestId) => request(`/api/community/requests/${requestId}/reject`, { method: 'POST' }),
  cancelConnectionRequest: (requestId) => request(`/api/community/requests/${requestId}/cancel`, { method: 'DELETE' }),
  removeConnection: (connectionId) => request(`/api/community/connections/${connectionId}`, { method: 'DELETE' }),
  getConversations: () => request('/api/community/conversations'),
  getMessages: (partnerId) => request(`/api/community/messages/${partnerId}`),
  sendMessage: (partnerId, content) => request(`/api/community/messages/${partnerId}`, { method: 'POST', body: JSON.stringify({ content }) }),
  markMessagesRead: (partnerId) => request(`/api/community/messages/${partnerId}/read`, { method: 'POST' }),
  getCommunityProfile: (userId) => request(`/api/community/profile/${userId}`),
  updateCommunityProfile: (profileData) => request('/api/community/profile', { method: 'PATCH', body: JSON.stringify(profileData) }),
};

