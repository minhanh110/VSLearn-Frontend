import axiosInstance from './axios.config';
import Cookies from 'js-cookie';
import authService from './auth.service';

const API_URL = 'http://localhost:8080/users';

export interface ProfileData {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    userAvatar?: string;
}

class UserService {
    async updateUserProfile(data: ProfileData): Promise<ProfileData> {
        try {
            if (!authService.isAuthenticated()) {
                throw new Error("Update failed");
            }
            const response = await axiosInstance.put(`${API_URL}/profile`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${authService.getCurrentToken()}`
                    }
                }
            );
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Update failed');
        }
    }

    async getUserProfile(): Promise<ProfileData> {
        try {
            if (!authService.isAuthenticated()) {
                throw new Error("No data!");
            }
            const response = await axiosInstance.get(`${API_URL}/profile`, {
                headers: {
                    'Authorization': `Bearer ${authService.getCurrentToken()}`
                }
            });
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'No data!');
        }
    }
}
export default new UserService();