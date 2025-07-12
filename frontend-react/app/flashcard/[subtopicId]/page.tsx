import FlashcardPage from "../flashcard-page"

export default function Page({ params }: { params: { subtopicId: string } }) {
  return <FlashcardPage subtopicId={params.subtopicId} />
} 