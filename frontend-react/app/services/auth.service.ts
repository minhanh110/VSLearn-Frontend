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
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('http://localhost:8080/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Parse response first
      const jsonObj = await response.json();
      
      if (!response.ok) {
        // Handle HTTP error responses
        if (response.status === 400) {
          throw new Error(jsonObj.message || 'Dữ liệu đăng nhập không hợp lệ');
        } else if (response.status === 401) {
          throw new Error(jsonObj.message || 'Tên đăng nhập hoặc mật khẩu không chính xác');
        } else if (response.status === 404) {
          throw new Error(jsonObj.message || 'Tài khoản không tồn tại');
        } else if (response.status === 500) {
          throw new Error('Lỗi server. Vui lòng thử lại sau');
        } else {
          throw new Error(jsonObj.message || 'Đăng nhập thất bại. Vui lòng thử lại');
        }
      }
      
      if (jsonObj.status === 200) {
        // Store token in both Cookies and localStorage for compatibility
        Cookies.set('token', jsonObj.data);
        localStorage.setItem('token', jsonObj.data);
        return jsonObj;
      } else {
        // Handle unsuccessful response with proper status code
        throw new Error(jsonObj.message || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      // Handle timeout
      if (error.name === 'AbortError') {
        throw new Error('Kết nối quá lâu. Vui lòng kiểm tra mạng và thử lại');
      }
      
      // If it's already our custom error, re-throw it
      if (error.message && (
          error.message.includes('Tên đăng nhập') || 
          error.message.includes('Tài khoản') || 
          error.message.includes('Đăng nhập thất bại') ||
          error.message.includes('Dữ liệu') ||
          error.message.includes('Lỗi server') ||
          error.message.includes('Kết nối')
        )) {
        throw error;
      }
      
      // For network errors or other issues
      console.error('Login network error:', error);
      throw new Error('Có lỗi kết nối. Vui lòng kiểm tra mạng và thử lại');
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
    localStorage.removeItem('token');
    Cookies.remove('email-reset');
    Cookies.remove('otp');
  }

  getCurrentToken() {
    // Try to get token from both Cookies and localStorage for compatibility
    const tokenFromCookies = Cookies.get('token');
    const tokenFromLocalStorage = localStorage.getItem('token');
    const token = tokenFromCookies || tokenFromLocalStorage;
    
    // If we have token in one place but not the other, sync them
    if (tokenFromCookies && !tokenFromLocalStorage) {
      localStorage.setItem('token', tokenFromCookies);
    } else if (tokenFromLocalStorage && !tokenFromCookies) {
      Cookies.set('token', tokenFromLocalStorage);
    }
    
    return token;
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
        // Store token in both Cookies and localStorage for compatibility
        Cookies.set('token', data.data);
        localStorage.setItem('token', data.data);
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

  isGeneralManager() {
    const token = this.getCurrentToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      // Tùy backend, có thể là 'ROLE_GENERAL_MANAGER' hoặc 'general-manager'
      return (
        decoded.scope === 'ROLE_GENERAL_MANAGER' ||
        decoded.role === 'general-manager'
      );
    } catch {
      return false;
    }
  }
}

export default new AuthService();