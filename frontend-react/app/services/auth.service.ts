import axiosInstance from './axios.config';
import Cookies from 'js-cookie';

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

  async login(data: LoginData) {
    try {
      const response = await axiosInstance.post(`${API_URL}/signin`, data);
      if (response.data) {
        Cookies.set('token', response.data.data, { expires: 7 }); // Token hết hạn sau 7 ngày
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.data.message || 'Login failed');
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
    return !!this.getCurrentToken();
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
}

export default new AuthService();