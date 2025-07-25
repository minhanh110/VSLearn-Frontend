"use client"

import { useSearchParams } from "next/navigation"
import CreatorsListPage from "./creators-list-page"
import CreatorsDetailPage from "./creators-detail-page"

export default function CreatorsPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  if (id) {
    return <CreatorsDetailPage creatorId={id} />
  }

  return <CreatorsListPage />
}
