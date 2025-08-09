"use client"
import CurriculumApprovalPage from "./curriculum-approval-page"
import { useUserRole } from "@/hooks/use-user-role"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface TopicItem {
  id: number
  topicName: string
  isFree: boolean
  status: "active" | "needs_edit"
  sortOrder: number
  createdAt: string
  createdBy: number
  subtopicCount?: number
  isHidden?: boolean
}

interface CurriculumChangeRequest {
  id: string
  requestedBy: {
    id: number
    name: string
    email: string
  }
  requestedAt: string
  reason?: string
  oldCurriculum: TopicItem[]
  newCurriculum: TopicItem[]
  status: "pending" | "approved" | "rejected"
}

export default function Page() {
  const { role, loading: roleLoading } = useUserRole()
  const router = useRouter()

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!roleLoading) {
      if (role !== 'content-approver' && role !== 'general-manager') {
        router.push('/homepage')
        return
      }
    }
  }, [role, roleLoading, router])

  return <CurriculumApprovalPage />
}
