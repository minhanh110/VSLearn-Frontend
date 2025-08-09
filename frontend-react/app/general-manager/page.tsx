"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GeneralManagerDefaultPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to revenue dashboard as default page for General Manager
    router.push("/general-manager/revenue-dashboard")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-blue-700 font-medium">Đang chuyển đến Dashboard...</p>
      </div>
    </div>
  )
} 