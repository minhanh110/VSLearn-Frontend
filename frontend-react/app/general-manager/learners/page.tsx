"use client"

import { useSearchParams } from "next/navigation"
import LearnersListPage from "./learners-list-page"
import LearnersDetailPage from "./learners-detail-page"

export default function LearnersPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  if (id) {
    return <LearnersDetailPage learnerId={id} />
  }

  return <LearnersListPage />
}
