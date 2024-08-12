import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import router from '@/router';
import { API_BASE_URL } from '@/api/config';

interface User {
  username: string;
  role: string;
}

interface DecodedToken {
  userId: string;
  username: string;
  role: string;
  exp: number;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token'),
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
          throw new Error('Login failed');
        }
        const data = await response.json();
        this.setToken(data.token);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      router.push('/login');
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
      const decoded = jwtDecode<DecodedToken>(token);
      this.user = { username: decoded.username, role: decoded.role };
    },
    checkToken() {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 > Date.now()) {
          this.setToken(token);
        } else {
          this.logout();
        }
      }
    },
  },
});
