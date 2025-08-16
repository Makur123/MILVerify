import { apiRequest } from "./queryClient";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch {
        this.user = null;
      }
    }
  }

  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await apiRequest('POST', '/api/auth/register', {
      email,
      password,
      name
    });
    
    const data: AuthResponse = await response.json();
    this.setAuth(data);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest('POST', '/api/auth/login', {
      email,
      password
    });
    
    const data: AuthResponse = await response.json();
    this.setAuth(data);
    return data;
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  private setAuth(data: AuthResponse) {
    this.token = data.token;
    this.user = data.user;
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }
}

export const authService = new AuthService();
