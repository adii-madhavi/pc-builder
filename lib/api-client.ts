import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // The bundled API wraps payloads; the optional Express API returns them directly.
    this.client.interceptors.response.use((response) => {
      if (response.data?.success === true && 'data' in response.data) {
        response.data = response.data.data;
      }
      return response;
    });
    this.client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) config.headers.set('Authorization', `Bearer ${token}`);
        else config.headers.delete('Authorization');
      }
      return config;
    });

    // Load token from localStorage on init
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      if (this.token) {
        this.setAuthToken(this.token);
      }
    }
  }

  setAuthToken(token: string) {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
  }

  // Auth endpoints
  async register(email: string, password: string, username: string) {
    const response = await this.client.post('/auth/register', { email, password, username });
    if (response.data.token) {
      this.setAuthToken(response.data.token);
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.token) {
      this.setAuthToken(response.data.token);
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async logout() {
    this.clearAuthToken();
    localStorage.removeItem('token');
  }

  async getCurrentUser() {
    return this.client.get('/auth/me');
  }

  async updateProfile(profile: any) {
    return this.client.put('/auth/profile', { profile });
  }

  // Component endpoints
  async getComponents(query?: any) {
    return this.client.get('/components', { params: query });
  }

  async getComponentsByType(type: string, limit = 50) {
    return this.client.get(`/components/type/${type}`, { params: { limit } });
  }

  async getComponent(id: string) {
    return this.client.get(`/components/${id}`);
  }

  // Build endpoints
  async getMyBuilds() {
    return this.client.get('/builds');
  }

  async getPublicBuilds() {
    return this.client.get('/builds/public/trending');
  }

  async getBuild(id: string) {
    return this.client.get(`/builds/${id}`);
  }

  async createBuild(data: any) {
    return this.client.post('/builds', data);
  }

  async updateBuild(id: string, data: any) {
    return this.client.put(`/builds/${id}`, data);
  }

  async deleteBuild(id: string) {
    return this.client.delete(`/builds/${id}`);
  }

  async cloneBuild(id: string) {
    return this.client.post(`/builds/${id}/clone`);
  }

  async likeBuild(id: string) {
    return this.client.post(`/builds/${id}/like`);
  }

  // Community endpoints
  async getForumPosts(category?: string) {
    return this.client.get('/community/forums', { params: { category } });
  }

  async getForumPost(id: string) {
    return this.client.get(`/community/forums/${id}`);
  }

  async createForumPost(data: any) {
    return this.client.post('/community/forums', data);
  }

  async getReviews(buildId: string) {
    return this.client.get(`/community/reviews/${buildId}`);
  }

  async createReview(data: any) {
    return this.client.post('/community/reviews', data);
  }

  async markReviewHelpful(id: string) {
    return this.client.post(`/community/reviews/${id}/helpful`);
  }

  // Performance endpoints
  async getBenchmarks(category?: string) {
    return this.client.get('/performance/benchmarks', { params: { category } });
  }

  async getBuildBenchmarks(buildId: string) {
    return this.client.get(`/performance/benchmarks/${buildId}`);
  }

  async createBenchmark(data: any) {
    return this.client.post('/performance/benchmarks', data);
  }

  // RGB endpoints
  async getRGBPresets() {
    return this.client.get('/rgb/presets');
  }

  async updateRGBConfig(buildId: string, config: any) {
    return this.client.put(`/rgb/config/${buildId}`, config);
  }

  async getRGBConfig(buildId: string) {
    return this.client.get(`/rgb/config/${buildId}`);
  }
}

export const apiClient = new APIClient();
