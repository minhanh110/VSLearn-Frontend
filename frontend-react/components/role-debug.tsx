"use client"

import { useUserRole } from "@/hooks/use-user-role"

export function RoleDebug() {
  const { role, loading } = useUserRole()

  if (loading) {
    return (
      <div className="fixed top-20 right-4 bg-yellow-100 border border-yellow-400 rounded-lg p-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
          <span className="text-yellow-800">Loading role...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-20 right-4 bg-blue-100 border border-blue-400 rounded-lg p-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-blue-800 font-semibold">Role:</span>
        <span className="text-blue-600">{role || 'guest'}</span>
      </div>
    </div>
  )
} 