"use client"

import { useSearchParams } from "next/navigation"
import FlashcardPage from "./flashcard-page"

export default function Page() {
  const searchParams = useSearchParams()
  const subtopicId = searchParams.get('subtopicId') || searchParams.get('id') || ''
  
  return <FlashcardPage subtopicId={subtopicId} />
}
