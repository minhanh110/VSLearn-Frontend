"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"

export function TestStartPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get("testId")

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleGoBack = () => {
    router.back()
  }

  const handleStartTest = () => {
    // Navigate to actual test page
    router.push(`/test-topic`)
  }

  return (
    <div className="min-h-screen bg-blue-100 relative overflow-hidden">
      {/* Header */}
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-20 pb-28 lg:pb-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-auto border-4 border-blue-100">
          {/* Test mascot */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-mascot-G8XHYRh9RxcugfBPcrIKl040K3hSLD.png"
                alt="Test mascot"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">BẮT ĐẦU BÀI TEST</h1>

          {/* Action buttons */}
          <div className="flex gap-4">
            {/* Go back button */}
            <Button
              onClick={handleGoBack}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-full transition-all duration-200 hover:shadow-lg"
            >
              QUAY VỀ
            </Button>

            {/* Start test button */}
            <Button
              onClick={handleStartTest}
              className="flex-1 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:shadow-lg"
            >
              BẮT ĐẦU
            </Button>
          </div>
        </div>
      </div>

      {/* Additional floating elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-32 w-6 h-6 bg-cyan-200 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute bottom-40 left-32 w-5 h-5 bg-blue-300 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-60 right-20 w-4 h-4 bg-cyan-300 rounded-full opacity-50 animate-pulse"></div>

      {/* Footer */}
      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default TestStartPage
