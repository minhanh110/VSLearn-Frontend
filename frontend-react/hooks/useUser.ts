import { useState, useEffect } from 'react';
import userService, { ProfileData } from '@/app/services/user.service';
import authService from '@/app/services/auth.service';

export interface UserInfo {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userAvatar?: string;
  displayName: string;
}

export function useUser() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndLoadUser();
  }, []);

  const checkAuthAndLoadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        // User is not authenticated, set default guest info
        setUserInfo({
          firstName: '',
          lastName: '',
          displayName: 'Guest'
        });
        return;
      }
      
      // User is authenticated, load profile data
      const profileData = await userService.getUserProfile();
      
      const displayName = profileData.firstName && profileData.lastName 
        ? `${profileData.firstName} ${profileData.lastName}`
        : profileData.firstName || profileData.lastName || 'User';
      
      setUserInfo({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        phoneNumber: profileData.phoneNumber,
        userAvatar: profileData.userAvatar,
        displayName
      });
    } catch (err: any) {
      console.error('Failed to load user info:', err);
      setError(err.message || 'Failed to load user info');
      // Set default user info if failed to load
      setUserInfo({
        firstName: '',
        lastName: '',
        displayName: 'User'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (data: ProfileData) => {
    try {
      await userService.updateUserProfile(data);
      await checkAuthAndLoadUser(); // Reload user info after update
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update user info');
    }
  };

  return {
    userInfo,
    loading,
    error,
    isAuthenticated,
    loadUserInfo: checkAuthAndLoadUser,
    updateUserInfo
  };
} 