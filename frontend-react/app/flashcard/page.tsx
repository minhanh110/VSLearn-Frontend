"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function FlashcardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)

  // Sample flashcard data
  const flashcards = [
    {
      id: 1,
      front: {
        type: "video",
        content: "/placeholder.svg?height=400&width=600",
        title: "Xin chào",
      },
      back: {
        word: "XIN CHÀO",
        description: "Mô tả: Gio tay lên vẫy",
      },
    },
    {
      id: 2,
      front: {
        type: "video",
        content: "/placeholder.svg?height=400&width=600",
        title: "Cảm ơn",
      },
      back: {
        word: "CẢM ÔN",
        description: "Mô tả: Đặt tay lên ngực và cúi đầu",
      },
    },
  ]

  const currentFlashcard = flashcards[currentCard]

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length)
    setIsFlipped(false)
  }

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    setIsFlipped(false)
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden">
      {/* Decorative Stars Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large stars */}
        <div className="absolute top-20 left-20 w-8 h-8 text-yellow-300 animate-pulse">⭐</div>
        <div className="absolute top-32 right-24 w-6 h-6 text-blue-300 animate-bounce">⭐</div>
        <div className="absolute top-40 left-1/4 w-5 h-5 text-green-300 animate-pulse">⭐</div>
        <div className="absolute top-60 right-1/3 w-7 h-7 text-purple-300 animate-bounce">⭐</div>
        <div className="absolute bottom-40 left-16 w-6 h-6 text-pink-300 animate-pulse">⭐</div>
        <div className="absolute bottom-32 right-20 w-8 h-8 text-yellow-300 animate-bounce">⭐</div>

        {/* Small decorative elements */}
        <div className="absolute top-24 right-1/4 w-4 h-4 bg-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute top-48 left-1/3 w-3 h-3 bg-purple-200 rounded-full animate-bounce"></div>
        <div className="absolute bottom-48 right-1/4 w-5 h-5 bg-pink-200 rounded-full animate-pulse"></div>
        <div className="absolute bottom-60 left-1/4 w-4 h-4 bg-green-200 rounded-full animate-bounce"></div>

        {/* More scattered stars */}
        <div className="absolute top-16 left-1/2 w-4 h-4 text-cyan-300 animate-pulse">⭐</div>
        <div className="absolute top-72 right-16 w-5 h-5 text-indigo-300 animate-bounce">⭐</div>
        <div className="absolute bottom-24 left-1/3 w-6 h-6 text-rose-300 animate-pulse">⭐</div>
      </div>

      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main Content Container */}
      <div className="pt-20 pb-28 lg:pb-20 px-4 min-h-screen relative z-10">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-center min-h-[calc(100vh-10rem)]">
          <div className="w-full max-w-6xl mx-auto flex items-center justify-center gap-8">
            {/* Left Arrow */}
            <Button
              onClick={prevCard}
              className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            {/* Flashcard */}
            <div className="relative w-full max-w-lg aspect-square">
              <div
                className={`relative w-full h-full cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                onClick={toggleFlip}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Side */}
                <div
                  className={`absolute inset-0 w-full h-full backface-hidden ${
                    isFlipped ? "opacity-0" : "opacity-100"
                  } transition-opacity duration-300`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-3xl border-4 border-blue-400 shadow-2xl p-8 flex items-center justify-center relative overflow-hidden">
                    {/* Decorative border stars */}
                    <div className="absolute top-4 left-4 w-6 h-6 text-yellow-400">⭐</div>
                    <div className="absolute top-4 right-4 w-5 h-5 text-blue-400">⭐</div>
                    <div className="absolute bottom-4 left-4 w-5 h-5 text-green-400">⭐</div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 text-purple-400">⭐</div>
                    <div className="absolute top-1/2 left-4 w-4 h-4 bg-pink-300 rounded-full"></div>
                    <div className="absolute top-1/2 right-4 w-4 h-4 bg-cyan-300 rounded-full"></div>

                    {/* Video/GIF content */}
                    <div className="w-4/5 aspect-square bg-teal-600 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
                      <video
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                        poster={currentFlashcard.front.content}
                      >
                        <source src="/videos/sign-language-demo.mp4" type="video/mp4" />
                        <Image
                          src={currentFlashcard.front.content || "/placeholder.svg"}
                          alt={currentFlashcard.front.title}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </video>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div
                  className={`absolute inset-0 w-full h-full backface-hidden ${
                    isFlipped ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-300`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-3xl border-4 border-blue-400 shadow-2xl p-8 flex flex-col items-center justify-center text-center relative">
                    {/* Decorative border elements */}
                    <div className="absolute top-4 left-4 w-6 h-6 text-yellow-400">⭐</div>
                    <div className="absolute top-4 right-4 w-5 h-5 text-blue-400">⭐</div>
                    <div className="absolute bottom-4 left-4 w-5 h-5 text-green-400">⭐</div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 text-purple-400">⭐</div>

                    {/* Text content */}
                    <h1 className="text-4xl lg:text-6xl font-bold text-blue-700 mb-4 lg:mb-8">
                      {currentFlashcard.back.word}
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-700 font-medium">{currentFlashcard.back.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <Button
              onClick={nextCard}
              className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] gap-6">
          {/* Flashcard */}
          <div className="relative w-full max-w-sm aspect-square">
            <div
              className={`relative w-full h-full cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={toggleFlip}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front Side */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden ${
                  isFlipped ? "opacity-0" : "opacity-100"
                } transition-opacity duration-300`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-3xl border-4 border-blue-400 shadow-2xl p-6 flex items-center justify-center relative overflow-hidden">
                  {/* Decorative border stars */}
                  <div className="absolute top-3 left-3 w-5 h-5 text-yellow-400">⭐</div>
                  <div className="absolute top-3 right-3 w-4 h-4 text-blue-400">⭐</div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 text-green-400">⭐</div>
                  <div className="absolute bottom-3 right-3 w-5 h-5 text-purple-400">⭐</div>

                  {/* Video/GIF content */}
                  <div className="w-4/5 aspect-square bg-teal-600 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
                    <video
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover"
                      poster={currentFlashcard.front.content}
                    >
                      <source src="/videos/sign-language-demo.mp4" type="video/mp4" />
                      <Image
                        src={currentFlashcard.front.content || "/placeholder.svg"}
                        alt={currentFlashcard.front.title}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </video>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden ${
                  isFlipped ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-3xl border-4 border-blue-400 shadow-2xl p-6 flex flex-col items-center justify-center text-center relative">
                  {/* Decorative border elements */}
                  <div className="absolute top-3 left-3 w-5 h-5 text-yellow-400">⭐</div>
                  <div className="absolute top-3 right-3 w-4 h-4 text-blue-400">⭐</div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 text-green-400">⭐</div>
                  <div className="absolute bottom-3 right-3 w-5 h-5 text-purple-400">⭐</div>

                  {/* Text content */}
                  <h1 className="text-3xl font-bold text-blue-700 mb-4">{currentFlashcard.back.word}</h1>
                  <p className="text-base text-gray-700 font-medium">{currentFlashcard.back.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center justify-center gap-8">
            <Button
              onClick={prevCard}
              className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={nextCard}
              className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* New Study Mascot - Desktop only */}
        <div className="absolute bottom-8 left-8 hidden lg:block">
          <Image
            src="/images/study-mascot-new.png"
            alt="Study mascot"
            width={120}
            height={120}
            className="animate-bounce"
          />
        </div>

        {/* Card Counter */}
        <div className="absolute top-24 right-4 lg:right-8 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <span className="text-blue-700 font-semibold text-sm lg:text-base">
            {currentCard + 1} / {flashcards.length}
          </span>
        </div>
      </div>

      {/* Practice Button - Fixed at bottom for mobile */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 lg:absolute lg:bottom-8 lg:right-8 lg:left-auto lg:transform-none z-30">
        <div className="flex items-center gap-3">
          <div className="text-blue-600 text-2xl animate-pulse hidden lg:block">👉</div>
          <Link href="/practice">
            <Button className="bg-cyan-400 hover:bg-cyan-500 text-blue-900 font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-2xl text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              LUYỆN TẬP
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}
