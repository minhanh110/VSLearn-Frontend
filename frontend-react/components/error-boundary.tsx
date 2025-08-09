"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleGoHome = () => {
    window.location.href = '/homepage'
  }

  handleRefresh = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const isPermissionError = this.state.error?.message?.includes('quyền') || 
                               this.state.error?.message?.includes('permission') ||
                               this.state.error?.message?.includes('unauthorized') ||
                               this.state.error?.message?.includes('forbidden')

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isPermissionError ? 'Không có quyền truy cập' : 'Đã xảy ra lỗi'}
              </h1>
              <p className="text-gray-600 mb-6">
                {isPermissionError 
                  ? 'Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.'
                  : 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.'
                }
              </p>
              
              {this.state.error && (
                <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-gray-700 font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Home className="w-4 h-4" />
                Về trang chủ
              </Button>
              
              <Button
                onClick={this.handleRefresh}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Thử lại
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorHandler() {
  const handleError = (error: Error) => {
    console.error('Error handled by hook:', error)
    
    // Check if it's a permission error
    const isPermissionError = error.message?.includes('quyền') || 
                             error.message?.includes('permission') ||
                             error.message?.includes('unauthorized') ||
                             error.message?.includes('forbidden')
    
    if (isPermissionError) {
      // Redirect to homepage for permission errors
      window.location.href = '/homepage'
    } else {
      // Show error message for other errors
      alert(`Đã xảy ra lỗi: ${error.message}`)
    }
  }

  return { handleError }
} 