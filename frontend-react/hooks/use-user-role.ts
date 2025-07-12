import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  scope: string
  sub: string
  id: string
  iss: string
  exp: number
  iat: number
}

export type UserRole = 'learner' | 'content-creator' | 'content-approver' | 'general-manager' | 'guest'

export function useUserRole(): { role: UserRole | null; loading: boolean } {
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getRoleFromToken = () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setRole('guest')
          setLoading(false)
          return
        }

        const decoded = jwtDecode<JwtPayload>(token)
        const scope = decoded.scope

        // Map JWT scope to role
        let userRole: UserRole = 'guest'
        
        if (scope === 'ROLE_LEARNER') {
          userRole = 'learner'
        } else if (scope === 'ROLE_CONTENT_CREATOR') {
          userRole = 'content-creator'
        } else if (scope === 'ROLE_CONTENT_APPROVER') {
          userRole = 'content-approver'
        } else if (scope === 'ROLE_GENERAL_MANAGER') {
          userRole = 'general-manager'
        } else {
          userRole = 'guest'
        }

        setRole(userRole)
      } catch (error) {
        console.error('Error decoding JWT token:', error)
        setRole('guest')
      } finally {
        setLoading(false)
      }
    }

    getRoleFromToken()
  }, [])

  return { role, loading }
} 