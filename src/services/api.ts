import { AnalysisRecord, DashboardStats, User } from '../types/index.ts';

const TOKEN_KEY = 'truthguard_auth_token';
const USER_KEY = 'truthguard_auth_user';

export const authStorage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {}
  },
  getUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser(user: User) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {}
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
  }
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({ success: false, error: 'Network response parsing failed' }));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async register(name: string, email: string, password: string): Promise<{ success: boolean; user: User; token: string }> {
    const res = await apiFetch<{ success: boolean; user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    if (res.token) {
      authStorage.setToken(res.token);
      authStorage.setUser(res.user);
    }
    return res;
  },

  async login(email: string, password: string): Promise<{ success: boolean; user: User; token: string }> {
    const res = await apiFetch<{ success: boolean; user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) {
      authStorage.setToken(res.token);
      authStorage.setUser(res.user);
    }
    return res;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await apiFetch<{ success: boolean; user: User }>('/api/auth/me');
      if (res.user) {
        authStorage.setUser(res.user);
        return res.user;
      }
    } catch {
      authStorage.clear();
    }
    return null;
  },

  logout() {
    authStorage.clear();
  },

  // News Analysis
  async analyzeText(headline: string, articleText: string, sourceUrl?: string): Promise<{ success: boolean; analysis: AnalysisRecord }> {
    return apiFetch<{ success: boolean; analysis: AnalysisRecord }>('/api/news/analyze', {
      method: 'POST',
      body: JSON.stringify({ headline, articleText, sourceUrl })
    });
  },

  async analyzeUrl(url: string): Promise<{ success: boolean; analysis: AnalysisRecord }> {
    return apiFetch<{ success: boolean; analysis: AnalysisRecord }>('/api/news/analyze-url', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
  },

  async analyzeFile(fileContent: string, fileName?: string): Promise<{ success: boolean; analysis: AnalysisRecord }> {
    return apiFetch<{ success: boolean; analysis: AnalysisRecord }>('/api/news/analyze-file', {
      method: 'POST',
      body: JSON.stringify({ fileContent, fileName })
    });
  },

  // History & Records
  async getHistory(params?: { search?: string; classification?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.classification) query.set('classification', params.classification);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());

    return apiFetch<{
      success: boolean;
      items: AnalysisRecord[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/api/news/history?${query.toString()}`);
  },

  async getAnalysisById(id: string): Promise<{ success: boolean; analysis: AnalysisRecord }> {
    return apiFetch<{ success: boolean; analysis: AnalysisRecord }>(`/api/news/${id}`);
  },

  async deleteAnalysis(id: string): Promise<{ success: boolean; message: string }> {
    return apiFetch<{ success: boolean; message: string }>(`/api/news/${id}`, {
      method: 'DELETE'
    });
  },

  // Stats
  async getStats(): Promise<{ success: boolean; stats: DashboardStats }> {
    return apiFetch<{ success: boolean; stats: DashboardStats }>('/api/dashboard/stats');
  },

  async seedExamples(): Promise<{ success: boolean; addedCount: number }> {
    return apiFetch<{ success: boolean; addedCount: number }>('/api/news/seed-examples', {
      method: 'POST'
    });
  }
};
