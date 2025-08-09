"use client"

import { useSearchParams } from "next/navigation"
import CreatorsListPage from "./creators-list-page"
import CreatorsDetailPage from "./creators-detail-page"
import { useUserRole } from "@/hooks/use-user-role"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CreatorsPage() {
  const searchParams = useSearchParams()
  const { role, loading: roleLoading } = useUserRole()
  const router = useRouter()
  const id = searchParams.get("id")

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!roleLoading) {
      if (role !== 'general-manager') {
        router.push('/homepage')
        return
      }
    }
  }, [role, roleLoading, router])

  if (id) {
    return <CreatorsDetailPage creatorId={id} />
  }

  return <CreatorsListPage />
}
