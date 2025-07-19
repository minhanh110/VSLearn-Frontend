"use client"

import { useSearchParams } from "next/navigation"
import ApproversListPage from "./approvers-list-page"
import ApproversDetailPage from "./approvers-detail-page"

export default function ApproversPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  if (id) {
    return <ApproversDetailPage approverId={id} />
  }

  return <ApproversListPage />
}
