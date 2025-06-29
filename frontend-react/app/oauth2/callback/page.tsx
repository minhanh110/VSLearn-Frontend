"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import authService from '../../services/auth.service'

export default function OAuth2Callback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const response = await authService.handleOAuth2Callback()
        if (response.status === 200) {
          router.push('/homepage')
        }
      } catch (error) {
        console.error('OAuth2 callback error:', error)
        router.push('/login?error=oauth2_failed')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Processing login...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  )
} 