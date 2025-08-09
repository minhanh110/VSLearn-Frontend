"use client"

import { Star, Lock, Trophy } from "lucide-react"
import { useState } from "react"

interface Lesson {
  id: number
  completed: boolean
  locked: boolean
  type: "lesson" | "test"
  position: "left" | "center" | "right"
}

interface LessonPathProps {
  colorScheme?: "blue" | "purple" | "green" | "orange"
  initialLessons?: Lesson[]
}

export default function LessonPath({ colorScheme = "blue", initialLessons }: LessonPathProps) {
  const getColors = () => {
    switch (colorScheme) {
      case "purple":
        return {
          primary: "from-purple-300 to-purple-400",
          secondary: "from-purple-400 to-purple-500",
          border: "border-purple-400",
          text: "text-purple-600",
          fill: "text-purple-500",
          gradient: "from-purple-300 via-gray-200 to-gray-200",
          treasure: "from-purple-400 to-purple-500",
          treasureText: "text-purple-900",
          treasureBg: "bg-purple-400",
        }
      case "green":
        return {
          primary: "from-emerald-300 to-emerald-400",
          secondary: "from-emerald-400 to-emerald-500",
          border: "border-emerald-400",
          text: "text-emerald-600",
          fill: "text-emerald-500",
          gradient: "from-emerald-300 via-gray-200 to-gray-200",
          treasure: "from-emerald-400 to-emerald-500",
          treasureText: "text-emerald-900",
          treasureBg: "bg-emerald-400",
        }
      case "orange":
        return {
          primary: "from-orange-300 to-orange-400",
          secondary: "from-orange-400 to-orange-500",
          border: "border-orange-400",
          text: "text-orange-600",
          fill: "text-orange-500",
          gradient: "from-orange-300 via-gray-200 to-gray-200",
          treasure: "from-orange-400 to-orange-500",
          treasureText: "text-orange-900",
          treasureBg: "bg-orange-400",
        }
      case "blue":
      default:
        return {
          primary: "from-sky-300 to-sky-400",
          secondary: "from-sky-400 to-sky-500",
          border: "border-sky-400",
          text: "text-sky-600",
          fill: "text-sky-500",
          gradient: "from-sky-300 via-gray-200 to-gray-200",
          treasure: "from-yellow-400 to-yellow-500",
          treasureText: "text-yellow-900",
          treasureBg: "bg-yellow-400",
        }
    }
  }

  const colors = getColors()

  const [lessons, setLessons] = useState<Lesson[]>(
    initialLessons || [
      { id: 1, completed: true, locked: false, type: "lesson", position: "center" },
      { id: 2, completed: false, locked: false, type: "lesson", position: "left" },
      { id: 3, completed: false, locked: true, type: "lesson", position: "right" },
      { id: 4, completed: false, locked: true, type: "lesson", position: "center" },
      { id: 5, completed: false, locked: true, type: "lesson", position: "left" },
      { id: 6, completed: false, locked: true, type: "lesson", position: "right" },
      { id: 7, completed: false, locked: true, type: "test", position: "center" },
    ],
  )

  const handleLessonClick = (lessonId: number) => {
    const lesson = lessons.find((l) => l.id === lessonId)
    if (lesson && !lesson.locked) {
      setLessons((prev) => prev.map((l) => (l.id === lessonId ? { ...l, completed: !l.completed } : l)))
    }
  }

  const allLessonsCompleted = lessons.filter((l) => l.type === "lesson").every((l) => l.completed)

  const getPositionClass = (position: string) => {
    switch (position) {
      case "left":
        return "justify-start pl-8"
      case "right":
        return "justify-end pr-8"
      case "center":
      default:
        return "justify-center"
    }
  }

  return (
    <div className="flex flex-col space-y-6 py-4 max-w-md mx-auto">
      {/* First Star */}
      <div className="flex justify-center">
        <div className="relative">
          <button
            onClick={() => handleLessonClick(1)}
            disabled={lessons[0].locked}
            className={`relative flex h-20 w-20 items-center justify-center rounded-full border-4 shadow-lg transition-all duration-200 ${
              lessons[0].completed
                ? `${colors.border} bg-gradient-to-br ${colors.primary} hover:shadow-xl hover:scale-105`
                : lessons[0].locked
                  ? "border-gray-300 bg-gray-200 cursor-not-allowed"
                  : `${colors.border} bg-gradient-to-br ${colors.primary} hover:shadow-xl hover:scale-105`
            }`}
          >
            {lessons[0].locked ? (
              <Lock className="h-8 w-8 text-gray-500" />
            ) : (
              <Star
                className={`h-8 w-8 ${lessons[0].completed ? "text-white fill-current" : "text-white fill-current"}`}
              />
            )}
            {!lessons[0].locked && (
              <div
                className={`absolute -inset-2 rounded-full border-4 border-opacity-50 ${colors.border} opacity-50`}
              ></div>
            )}
          </button>
        </div>
      </div>

      {/* Zigzag Lesson Path */}
      {lessons.slice(1, -1).map((lesson, index) => (
        <div key={lesson.id} className={`flex ${getPositionClass(lesson.position)} relative`}>
          {/* Connecting Line */}
          <div
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-gradient-to-b ${
              lesson.id === 2 ? colors.gradient : "from-gray-300 to-gray-300"
            } -translate-y-6`}
          ></div>

          <button
            onClick={() => handleLessonClick(lesson.id)}
            disabled={lesson.locked}
            className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-lg transition-all duration-200 ${
              lesson.completed
                ? `${colors.border} bg-gradient-to-br ${colors.primary} hover:shadow-xl hover:scale-105`
                : lesson.locked
                  ? "border-gray-300 bg-gray-200 cursor-not-allowed"
                  : "border-gray-400 bg-gray-300 hover:border-gray-300 hover:bg-gray-100 hover:scale-105"
            }`}
          >
            {lesson.locked ? (
              <Lock className="h-6 w-6 text-gray-500" />
            ) : (
              <Star className={`h-6 w-6 ${lesson.completed ? "text-white fill-current" : "text-gray-600"}`} />
            )}
          </button>
        </div>
      ))}

      {/* Treasure Chest (Test) */}
      <div className="flex justify-center relative">
        {/* Connecting Line */}
        <div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-gradient-to-b from-gray-300 to-gray-300 -translate-y-6`}
        ></div>

        <button
          onClick={() => allLessonsCompleted && handleLessonClick(lessons.length)}
          disabled={!allLessonsCompleted}
          className={`relative flex h-20 w-20 items-center justify-center rounded-xl shadow-lg transition-all duration-200 ${
            allLessonsCompleted
              ? `bg-gradient-to-br ${colors.treasure} hover:shadow-xl hover:scale-105 animate-pulse`
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <div className={`text-4xl ${allLessonsCompleted ? "animate-bounce" : ""}`}>🏆</div>
          {!allLessonsCompleted && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-400/50 rounded-xl">
              <Lock className="h-8 w-8 text-gray-600" />
            </div>
          )}
        </button>

        {allLessonsCompleted && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div
              className={`${colors.treasureBg} ${colors.treasureText} rounded-lg px-3 py-1 shadow-md font-bold text-sm`}
            >
              KHO BÁU MỞ!
            </div>
          </div>
        )}
      </div>

      {/* Progress Info */}
      <div className="mt-4 text-center">
        <div className="bg-white rounded-xl p-3 shadow-md border">
          <h3 className="font-bold text-gray-800 mb-2 text-sm">Tiến độ học tập</h3>
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Star className={`h-3 w-3 fill-current ${colors.fill}`} />
              <span className={`${colors.text} font-semibold`}>
                {lessons.filter((l) => l.completed && l.type === "lesson").length}/
                {lessons.filter((l) => l.type === "lesson").length} bài học
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-3 w-3 text-yellow-500" />
              <span className="text-yellow-600 font-semibold">
                {lessons.find((l) => l.type === "test")?.completed ? "1/1" : "0/1"} bài test
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
