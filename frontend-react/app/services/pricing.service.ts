import { authService } from './auth.service'

export interface PricingData {
  id: number
  pricingType: string
  packageName: string
  description?: string
  price: number
  durationDays: number
  maxVocabCount?: number
  maxTestCount?: number
  isActive: boolean
  discountPercent: number
  createdAt: string
  createdBy?: number
  updatedAt?: string
  updatedBy?: number
}

export interface PricingListResponse {
  packages: PricingData[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface PricingStats {
  totalPricing: number
  activePricing: number
  basicPricing: number
  premiumPricing: number
  enterprisePricing: number
}

class PricingService {
  private baseUrl = '/api/v1/pricing'

  private async getAuthHeaders() {
    const token = authService.getToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  // ==================== CRUD OPERATIONS ====================
  
  async getPricingList(page: number = 0, size: number = 10, search?: string, pricingType?: string, isActive?: boolean): Promise<PricingListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    if (search) params.append('search', search)
    if (pricingType) params.append('pricingType', pricingType)
    if (isActive !== undefined) params.append('isActive', isActive.toString())
    
    const response = await fetch(`${this.baseUrl}/list?${params}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch pricing list')
    }
    
    return response.json()
  }

  async getPricingById(pricingId: number): Promise<PricingData> {
    const response = await fetch(`${this.baseUrl}/${pricingId}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch pricing details')
    }
    
    return response.json()
  }

  async createPricing(pricingData: {
    pricingType: string
    packageName: string
    description?: string
    price: number
    durationDays: number
    maxVocabCount?: number
    maxTestCount?: number
    discountPercent?: number
    isActive?: boolean
  }): Promise<{ success: boolean; message: string; data?: PricingData }> {
    const response = await fetch(`${this.baseUrl}/create`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(pricingData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create pricing')
    }
    
    return response.json()
  }

  async updatePricing(pricingId: number, pricingData: Partial<{
    pricingType: string
    packageName: string
    description: string
    price: number
    durationDays: number
    maxVocabCount: number
    maxTestCount: number
    discountPercent: number
    isActive: boolean
  }>): Promise<{ success: boolean; message: string; data?: PricingData }> {
    const response = await fetch(`${this.baseUrl}/${pricingId}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(pricingData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update pricing')
    }
    
    return response.json()
  }

  async deletePricing(pricingId: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/${pricingId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete pricing')
    }
    
    return response.json()
  }

  // ==================== ADDITIONAL OPERATIONS ====================
  
  async getActivePricing(): Promise<PricingData[]> {
    const response = await fetch(`${this.baseUrl}/active`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch active pricing')
    }
    
    return response.json()
  }

  async getPricingByType(pricingType: string): Promise<PricingData[]> {
    const response = await fetch(`${this.baseUrl}/type/${pricingType}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch pricing by type')
    }
    
    return response.json()
  }

  async getPricingByPriceRange(minPrice: number, maxPrice: number): Promise<PricingData[]> {
    const response = await fetch(`${this.baseUrl}/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch pricing by price range')
    }
    
    return response.json()
  }

  async getPricingStats(): Promise<PricingStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch pricing stats')
    }
    
    return response.json()
  }

  async togglePricingStatus(pricingId: number): Promise<{ success: boolean; message: string; data?: PricingData }> {
    const response = await fetch(`${this.baseUrl}/${pricingId}/toggle-status`, {
      method: 'PUT',
      headers: await this.getAuthHeaders()
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to toggle pricing status')
    }
    
    return response.json()
  }
}

export const pricingService = new PricingService() 
