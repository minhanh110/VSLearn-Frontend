"use client"

import RevenueDashboardComponent from "./revenue-dashboard-real"
import { useUserRole } from "@/hooks/use-user-role"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const { role, loading: roleLoading } = useUserRole()
  const router = useRouter()

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!roleLoading) {
      if (role !== 'general-manager') {
        router.push('/homepage')
        return
      }
    }
  }, [role, roleLoading, router])

  return <RevenueDashboardComponent />
}
