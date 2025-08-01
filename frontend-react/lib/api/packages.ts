import api from "@/lib/axios"

export interface Package {
  id: string
  title: string
  description: string
  price: string
  duration: string
  features: string[]
  isPopular: boolean
  status: "active" | "inactive" | "draft"
  createdAt: string
  updatedAt: string
}

export interface CreatePackageRequest {
  title: string
  description: string
  price: string
  duration: string
  features: string[]
}

export interface UpdatePackageRequest {
  title?: string
  description?: string
  price?: string
  duration?: string
  features?: string[]
}

// API calls
export const packagesApi = {
  // Test connection
  testConnection: async () => {
    try {
      const response = await api.get('/pricing/test')
      return response.data
    } catch (error) {
      console.error('Test connection error:', error)
      return { success: false, message: 'Connection failed' }
    }
  },

  // Lấy danh sách packages
  getPackages: async () => {
    try {
      const response = await api.get('/pricing/list', {
        params: {
          page: 0,
          size: 100
        }
      })
      return response.data
    } catch (error: any) {
      console.error('Get packages error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch packages',
        data: { content: [] }
      }
    }
  },

  // Lấy chi tiết package
  getPackageById: async (id: string) => {
    try {
      const response = await api.get(`/pricing/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Get package by id error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch package details'
      }
    }
  },

  // Tạo package mới
  createPackage: async (data: CreatePackageRequest) => {
    try {
      const response = await api.post('/pricing/create', {
        pricingType: data.title,
        description: data.description,
        price: parseInt(data.price.replace(/\D/g, '')), // Convert "100.000" to 100000
        durationDays: parseInt(data.duration)
      })
      return response.data
    } catch (error: any) {
      console.error('Create package error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create package'
      }
    }
  },

  // Cập nhật package
  updatePackage: async (id: string, data: UpdatePackageRequest) => {
    try {
      const updateData: any = {}
      if (data.title) updateData.pricingType = data.title
      if (data.description) updateData.description = data.description
      if (data.price) updateData.price = parseInt(data.price.replace(/\D/g, ''))
      if (data.duration) updateData.durationDays = parseInt(data.duration)

      const response = await api.put(`/pricing/${id}`, updateData)
      return response.data
    } catch (error: any) {
      console.error('Update package error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update package'
      }
    }
  },

  // Xóa package
  deletePackage: async (id: string) => {
    try {
      const response = await api.delete(`/pricing/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Delete package error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete package'
      }
    }
  }
} 