import authService from './auth.service'

export interface UserManagementData {
  id: number
  firstName: string
  lastName: string
  userName: string
  userEmail: string
  phoneNumber?: string
  userRole: string
  userAvatar?: string
  isActive: boolean
  provider: string
  createdAt: string
  createdBy?: number
  updatedAt?: string
  updatedBy?: number
  
  // Additional stats for different roles
  topicsCompleted?: number // For learners
  packagesOwned?: number // For learners
  topicsCreated?: number // For creators
  vocabularyCreated?: number // For creators
  pendingApproval?: number // For creators
  topicsApproved?: number // For approvers
  pendingReview?: number // For approvers
  specialization?: string // For creators/approvers
}

export interface UserListResponse {
  users: UserManagementData[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  
  // Statistics
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  learnersCount: number
  creatorsCount: number
  approversCount: number
  managersCount: number
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  learnersCount: number
  creatorsCount: number
  approversCount: number
  managersCount: number
}

export interface LearnersStats {
  totalLearners: number
  activeLearners: number
  inactiveLearners: number
  averageTopicsCompleted: number
  averagePackagesOwned: number
}

export interface CreatorsStats {
  totalCreators: number
  activeCreators: number
  inactiveCreators: number
  totalTopicsCreated: number
  totalVocabularyCreated: number
  pendingApproval: number
}

export interface ApproversStats {
  totalApprovers: number
  activeApprovers: number
  inactiveApprovers: number
  totalTopicsApproved: number
  pendingReview: number
}

class UserManagementService {
  private baseUrl = 'http://localhost:8080/api/v1/admin'

  private async getAuthHeaders() {
    const token = authService.getCurrentToken()
    console.log('🔑 Auth token:', token ? 'Present' : 'Missing')
    
    // Check if user has proper role
    if (!authService.isGeneralManager()) {
      console.error('❌ User is not GENERAL_MANAGER')
      throw new Error('Access denied: Requires GENERAL_MANAGER role')
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  // ==================== LEARNERS MANAGEMENT ====================
  
  async getLearnersList(page: number = 0, size: number = 10, search?: string, isActive?: boolean): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    if (search) params.append('search', search)
    if (isActive !== undefined) params.append('isActive', isActive.toString())
    
    const response = await fetch(`${this.baseUrl}/users/learners?${params}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch learners list')
    }
    
    return response.json()
  }

  async getLearnersStats(): Promise<LearnersStats> {
    const response = await fetch(`${this.baseUrl}/users/learners/stats`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch learners stats')
    }
    
    return response.json()
  }

  // ==================== CREATORS MANAGEMENT ====================
  
  async getCreatorsList(page: number = 0, size: number = 10, search?: string, isActive?: boolean): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    if (search) params.append('search', search)
    if (isActive !== undefined) params.append('isActive', isActive.toString())
    
    const response = await fetch(`${this.baseUrl}/users/creators?${params}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch creators list')
    }
    
    return response.json()
  }

  async getCreatorsStats(): Promise<CreatorsStats> {
    const url = `${this.baseUrl}/users/creators/stats`
    console.log('🌐 Calling API:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    console.log('📡 Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', errorText)
      throw new Error('Failed to fetch creators stats')
    }
    
    return response.json()
  }

  // ==================== APPROVERS MANAGEMENT ====================
  
  async getApproversList(page: number = 0, size: number = 10, search?: string, isActive?: boolean): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    if (search) params.append('search', search)
    if (isActive !== undefined) params.append('isActive', isActive.toString())
    
    const response = await fetch(`${this.baseUrl}/users/approvers?${params}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch approvers list')
    }
    
    return response.json()
  }

  async getApproversStats(): Promise<ApproversStats> {
    const response = await fetch(`${this.baseUrl}/users/approvers/stats`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch approvers stats')
    }
    
    return response.json()
  }

  // ==================== GENERAL USER MANAGEMENT ====================
  
  async getAllUsersList(page: number = 0, size: number = 10, search?: string, userRole?: string, isActive?: boolean): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    if (search) params.append('search', search)
    if (userRole) params.append('userRole', userRole)
    if (isActive !== undefined) params.append('isActive', isActive.toString())
    
    const response = await fetch(`${this.baseUrl}/users/all?${params}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch users list')
    }
    
    return response.json()
  }

  async getUserStats(): Promise<UserStats> {
    const response = await fetch(`${this.baseUrl}/users/stats`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch user stats')
    }
    
    return response.json()
  }

  // Test method
  async testConnection(): Promise<any> {
    const url = `${this.baseUrl}/test`
    console.log('🧪 Testing connection to:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    console.log('📡 Test response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Test failed:', errorText)
      throw new Error('Test connection failed')
    }
    
    const result = await response.json()
    console.log('✅ Test successful:', result)
    return result
  }

  // ==================== CRUD OPERATIONS ====================
  
  async createUser(userData: {
    firstName: string
    lastName: string
    userName: string
    userEmail: string
    phoneNumber?: string
    userRole: string
    userAvatar?: string
    isActive?: boolean
  }): Promise<{ success: boolean; message: string; data?: UserManagementData }> {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(userData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create user')
    }
    
    return response.json()
  }

  async getUserById(userId: number): Promise<UserManagementData> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch user details')
    }
    
    return response.json()
  }

  async updateUser(userId: number, userData: Partial<{
    firstName: string
    lastName: string
    userName: string
    userEmail: string
    phoneNumber: string
    userRole: string
    userAvatar: string
    isActive: boolean
  }>): Promise<{ success: boolean; message: string; data?: UserManagementData }> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(userData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update user')
    }
    
    return response.json()
  }

  async deleteUser(userId: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete user')
    }
    
    return response.json()
  }

  // ==================== USER STATUS MANAGEMENT ====================
  
  async toggleUserStatus(userId: number): Promise<{ success: boolean; message: string; data?: UserManagementData }> {
    const response = await fetch(`${this.baseUrl}/users/${userId}/toggle-status`, {
      method: 'PUT',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to toggle user status')
    }
    
    return response.json()
  }

  async updateUserRole(userId: number, newRole: string): Promise<{ success: boolean; message: string; data?: UserManagementData }> {
    const response = await fetch(`${this.baseUrl}/users/${userId}/role?newRole=${newRole}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update user role')
    }
    
    return response.json()
  }

  // ==================== EXPORT FUNCTIONALITY ====================
  
  async exportUsersToExcel(userRole?: string, isActive?: boolean): Promise<Blob> {
    const params = new URLSearchParams()
    if (userRole) params.append('userRole', userRole)
    if (isActive !== undefined) params.append('isActive', isActive.toString())
    
    const response = await fetch(`${this.baseUrl}/export?${params}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to export users')
    }
    
    return response.blob()
  }
}

export const userManagementService = new UserManagementService() 