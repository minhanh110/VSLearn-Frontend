"use client"

import { useState, useEffect } from "react"

interface Flashcard {
  id: number;
  front: {
    type: "video" | "image";
    content: string;
    title: string;
  };
  back: {
    word: string;
    description: string;
  };
}

interface SubtopicInfo {
  id: number;
  subTopicName: string;
  topicName: string;
  status: string;
}

export default function TestSubtopicPage() {
  const [subtopicId, setSubtopicId] = useState("1")
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [subtopicInfo, setSubtopicInfo] = useState<SubtopicInfo | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async (id: string) => {
    setLoading(true)
    console.log("Fetching data for subtopicId:", id)
    
    try {
      // Fetch subtopic info
      const infoResponse = await fetch(`http://localhost:8080/api/v1/flashcards/subtopic/${id}/info`)
      if (infoResponse.ok) {
        const infoData = await infoResponse.json()
        setSubtopicInfo(infoData)
        console.log("Subtopic info:", infoData)
      }

      // Fetch flashcards
      const cardsResponse = await fetch(`http://localhost:8080/api/v1/flashcards/subtopic/${id}`)
      if (cardsResponse.ok) {
        const cardsData = await cardsResponse.json()
        setFlashcards(cardsData)
        console.log("Flashcards:", cardsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(subtopicId)
  }, [subtopicId])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Subtopic Flashcards</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Subtopic ID:</label>
        <input
          type="text"
          value={subtopicId}
          onChange={(e) => setSubtopicId(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => fetchData(subtopicId)}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fetch
        </button>
      </div>

      {loading && <div>Loading...</div>}

      {subtopicInfo && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Subtopic Info:</h2>
          <p>ID: {subtopicInfo.id}</p>
          <p>Name: {subtopicInfo.subTopicName}</p>
          <p>Topic: {subtopicInfo.topicName}</p>
          <p>Status: {subtopicInfo.status}</p>
        </div>
      )}

      <div className="mb-4">
        <h2 className="font-bold">Flashcards ({flashcards.length}):</h2>
        {flashcards.map((card, index) => (
          <div key={card.id} className="p-2 border rounded mb-2">
            <p><strong>Card {index + 1}:</strong></p>
            <p>ID: {card.id}</p>
            <p>Front: {card.front.title}</p>
            <p>Back: {card.back.word} - {card.back.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="font-bold">Quick Test Links:</h2>
        <div className="space-x-2">
          <button
            onClick={() => setSubtopicId("1")}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Subtopic 1
          </button>
          <button
            onClick={() => setSubtopicId("2")}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Subtopic 2
          </button>
          <button
            onClick={() => setSubtopicId("3")}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Subtopic 3
          </button>
        </div>
      </div>
    </div>
  )
} 