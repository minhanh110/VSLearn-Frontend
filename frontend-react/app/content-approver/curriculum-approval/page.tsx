"use client"
import CurriculumApprovalPage from "./curriculum-approval-page"

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
  return <CurriculumApprovalPage />
}
