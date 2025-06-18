"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Play, Volume2 } from "lucide-react"
import Image from "next/image"

export default function LessonPage() {
  const params = useParams()
  const lessonId = params.id

  const lessonData = {
    1: { title: "Lesson 1: Greetings", content: "Learn basic greeting signs" },
    2: { title: "Lesson 2: Family", content: "Learn family member signs" },
    3: { title: "Test: Unit 1", content: "Test your knowledge of Unit 1" },
    4: { title: "Lesson 4: Numbers", content: "Learn number signs" },
    5: { title: "Lesson 5: Colors", content: "Learn color signs" },
  }

  const lesson = lessonData[lessonId as keyof typeof lessonData] || {
    title: "Unknown Lesson",
    content: "Lesson not found",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-200 to-cyan-200 px-4 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/homepage">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">{lesson.title}</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Lesson content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{lesson.title}</h2>
                <p className="text-gray-600">{lesson.content}</p>
              </div>

              {/* Video/Content area */}
              <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
                <div className="w-32 h-32 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Play className="w-16 h-16 text-blue-600" />
                </div>
                <p className="text-gray-600">Video content will be displayed here</p>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Play Audio
                </Button>
                <Button variant="outline">Practice</Button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Link href="/homepage">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Path
              </Button>
            </Link>
            <Button className="bg-green-500 hover:bg-green-600 text-white">Complete Lesson</Button>
          </div>
        </div>
      </main>

      {/* Floating whale */}
      <div className="fixed bottom-8 right-8 animate-bounce">
        <Image
          src="/images/whale-with-book.png"
          alt="Whale with book"
          width={60}
          height={60}
          className="object-contain"
        />
      </div>
    </div>
  )
}
