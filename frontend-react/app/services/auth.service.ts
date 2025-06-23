import axiosInstance from './axios.config';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8080/users';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  userRole?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

class AuthService {
  async register(data: RegisterData) {
    try {
      const response = await axiosInstance.post(`${API_URL}/signup`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async login(data: { username: string; password: string }) {
    try {
      const response = await fetch('http://localhost:8080/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const jsonObj = await response.json();
      if (jsonObj.status === 200) {
        Cookies.set('token', jsonObj.data);
      }
      return jsonObj;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await axiosInstance.post(`${API_URL}/forgot-password`, { email: email });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Forgot password failed');
    }
  }

  async resetPassword(otp: string, newPassword: string, confirmPassword: string) {
    try {
      const response = await axiosInstance.post(`${API_URL}/reset-password`, {
        otp: otp,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Reset password failed');
    }
  }

  logout() {
    Cookies.remove('token');
    Cookies.remove('email-reset');
    Cookies.remove('otp');
  }

  getCurrentToken() {
    return Cookies.get('token');
  }

  isAuthenticated() {
    const token = this.getCurrentToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.exp ? decoded.exp * 1000 > Date.now() : false;
    } catch {
      return false;
    }
  }

  isTokenExpiringSoon() {
    const token = this.getCurrentToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return false;
      
      // Kiểm tra nếu token sẽ hết hạn trong 5 phút tới
      const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
      return decoded.exp * 1000 < fiveMinutesFromNow;
    } catch {
      return false;
    }
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    try {
      const response = await axiosInstance.put(`${API_URL}/change-password`, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Change password failed');
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Change password failed');
    }
  }

  async handleOAuth2Callback() {
    try {
      const response = await fetch('http://localhost:8080/users/oauth2/success', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 200 && data.data) {
        Cookies.set('token', data.data);
        return data;
      }
      throw new Error(data.message || 'Authentication failed');
    } catch (error: any) {
      console.error('OAuth2 callback error:', error);
      throw new Error(error.message || 'Authentication failed');
    }
  }

  async requestSignupOtp(email: string) {
    try {
      const response = await axiosInstance.post(`${API_URL}/signup/request-otp`, null, {
        params: { email }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  }

  async verifySignupOtp(email: string, otp: string) {
    try {
      const response = await axiosInstance.post(`${API_URL}/signup/verify-otp`, {
        email,
        otp
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    }
  }

  async signup(data: RegisterData) {
    try {
      const response = await axiosInstance.post(`${API_URL}/signup`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }
}

export default new AuthService();