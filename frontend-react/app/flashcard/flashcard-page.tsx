"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PracticeGroup } from "@/components/flashcard/practice-group"
import { useFlashcardLogic } from "@/hooks/useFlashcardLogic"
import { type Flashcard } from "@/app/services/flashcard.service"

export default function FlashcardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [videoError, setVideoError] = useState(false);

  const subtopicId = searchParams.get("subtopicId") || "1";

  // Sử dụng custom hook để quản lý logic
  const {
    flashcards,
    isLoading,
    subtopicInfo,
    timeline,
    timelinePos,
    showCompletionPopup,
    showTransitionPopup,
    setShowCompletionPopup,
    setShowTransitionPopup,
    nextStep,
    prevStep,
    resetTimeline,
    goToPractice,
    isLastFlashcard,
    isLastPractice,
    getCurrentStep,
    getPracticeCards,
    totalCards,
  } = useFlashcardLogic(subtopicId);

  // Tạo key để force re-render khi subtopicId thay đổi
  const componentKey = useMemo(() => `flashcard-${subtopicId}`, [subtopicId]);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePracticeComplete = () => {
    if (isLastPractice()) {
      setShowCompletionPopup(true);
    } else {
      nextStep();
      setIsFlipped(false);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    console.warn("Video failed to load, showing fallback");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 text-lg font-semibold">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (timelinePos < timeline.length) {
    const currentStep = getCurrentStep();

    // Debug log để kiểm tra
    console.log("🔍 Debug info:");
    console.log("  - timelinePos:", timelinePos);
    console.log("  - timeline.length:", timeline.length);
    console.log("  - currentStep:", currentStep);
    console.log("  - totalCards:", totalCards);
    console.log("  - isLastFlashcard:", isLastFlashcard());

    if (currentStep?.type === "practice") {
      const practiceCards = getPracticeCards();
      const isLastPracticeStep = isLastPractice();
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden flex flex-col">
          {/* Decorative Stars Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-6 h-6 text-yellow-300 animate-pulse">⭐</div>
            <div className="absolute top-32 right-24 w-5 h-5 text-blue-300 animate-bounce">⭐</div>
            <div className="absolute top-40 left-1/4 w-4 h-4 text-green-300 animate-pulse">⭐</div>
            <div className="absolute bottom-40 left-16 w-5 h-5 text-pink-300 animate-pulse">⭐</div>
            <div className="absolute bottom-32 right-20 w-6 h-6 text-yellow-300 animate-bounce">⭐</div>
          </div>
          {/* Header */}
          <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
          {/* Main Content */}
          <div className="flex-1 px-4 pb-4 pt-16 relative z-10 min-h-0 flex flex-col justify-center items-center">
            <PracticeGroup
              practiceCards={practiceCards}
              allCards={flashcards}
              onContinue={handlePracticeComplete}
              subtopicId={subtopicId}
            />
          </div>
          <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>
      );
    }

    if (currentStep?.type === "flashcard") {
      let currentFlashcard: Flashcard | null = null;
      if (currentStep.index !== undefined) {
        currentFlashcard = flashcards[currentStep.index];
      }

      // Debug log để xem dữ liệu
      console.log("Current flashcard:", currentFlashcard);
      console.log("Front content:", currentFlashcard?.front.content);
      console.log("Is video:", currentFlashcard?.front.content?.includes('.mp4'));

      return (
        <div key={componentKey} className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden">
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

          {/* Subtopic Info - Desktop */}
          {subtopicInfo && (
            <div className="hidden lg:block absolute top-24 left-8 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <div className="text-center">
                <p className="text-blue-600 font-semibold text-sm">{subtopicInfo.topicName}</p>
                <p className="text-blue-700 font-bold text-base">{subtopicInfo.subTopicName}</p>
              </div>
            </div>
          )}

          {/* Main Content Container */}
          <div className="pt-20 pb-28 lg:pb-20 px-4 min-h-screen relative z-10">
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-center min-h-[calc(100vh-10rem)]">
              <div className="w-full max-w-6xl mx-auto flex items-center justify-center gap-8">
                {/* Left Arrow */}
                <Button
                  onClick={prevStep}
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
                          {currentFlashcard?.front.content && currentFlashcard.front.content.includes('.mp4') && !videoError ? (
                            <video
                              autoPlay
                              loop
                              muted
                              className="w-full h-full object-cover"
                              src={currentFlashcard.front.content}
                              controls
                              onError={handleVideoError}
                            >
                              Trình duyệt của bạn không hỗ trợ video.
                            </video>
                          ) : (
                            <Image
                              src={currentFlashcard?.front.content || "/placeholder.svg"}
                              alt="Sign language demonstration"
                              fill
                              className="object-cover"
                            />
                          )}
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
                          {currentFlashcard?.back.word}
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-700 font-medium">{currentFlashcard?.back.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Arrow */}
                <Button
                  onClick={() => {
                    // Debug log
                    console.log("🚀 Next button clicked!");
                    console.log("  - currentStep:", currentStep);
                    console.log("  - totalCards:", totalCards);
                    
                    // Kiểm tra xem có phải flashcard cuối cùng không
                    const isLastFlashcardStep = isLastFlashcard();
                    console.log("  - isLastFlashcard:", isLastFlashcardStep);
                    
                    if (isLastFlashcardStep) {
                      console.log("  - Showing transition popup!");
                      setShowTransitionPopup(true);
                    } else {
                      console.log("  - Going to next step");
                      nextStep();
                    }
                  }}
                  className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] gap-6">
              {/* Subtopic Info - Mobile */}
              {subtopicInfo && (
                <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <div className="text-center">
                    <p className="text-blue-600 font-semibold text-xs">{subtopicInfo.topicName}</p>
                    <p className="text-blue-700 font-bold text-sm">{subtopicInfo.subTopicName}</p>
                  </div>
                </div>
              )}

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
                        {currentFlashcard?.front.content && currentFlashcard.front.content.includes('.mp4') && !videoError ? (
                          <video
                            autoPlay
                            loop
                            muted
                            className="w-full h-full object-cover"
                            src={currentFlashcard.front.content}
                            controls
                            onError={handleVideoError}
                          >
                            Trình duyệt của bạn không hỗ trợ video.
                          </video>
                        ) : (
                          <Image
                            src={currentFlashcard?.front.content || "/placeholder.svg"}
                            alt="Sign language demonstration"
                            fill
                            className="object-cover"
                          />
                        )}
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
                      <h1 className="text-3xl font-bold text-blue-700 mb-4">{currentFlashcard?.back.word}</h1>
                      <p className="text-base text-gray-700 font-medium">{currentFlashcard?.back.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="flex items-center gap-3 mt-4">
                <Button
                  onClick={prevStep}
                  className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  onClick={() => {
                    // Debug log
                    console.log("🚀 Next button clicked!");
                    console.log("  - currentStep:", currentStep);
                    console.log("  - totalCards:", totalCards);
                    
                    // Kiểm tra xem có phải flashcard cuối cùng không
                    const isLastFlashcardStep = isLastFlashcard();
                    console.log("  - isLastFlashcard:", isLastFlashcardStep);
                    
                    if (isLastFlashcardStep) {
                      console.log("  - Showing transition popup!");
                      setShowTransitionPopup(true);
                    } else {
                      console.log("  - Going to next step");
                      nextStep();
                    }
                  }}
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

            {/* Card Counter - only for flashcard */}
            <div className="absolute top-24 right-4 lg:right-8 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="text-blue-700 font-semibold text-sm lg:text-base">
                {currentStep?.type === "flashcard" && currentStep.index !== undefined ? currentStep.index + 1 : 0} / {flashcards.length}
              </span>
            </div>
          </div>

          {/* Practice Button - Fixed at bottom for mobile */}
          <div className="flex items-center gap-3">
            <div className="text-blue-600 text-2xl animate-pulse hidden lg:block">👉</div>
            <Link href="/practice">
              <Button className="bg-cyan-400 hover:bg-cyan-500 text-blue-900 font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-2xl text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                LUYỆN TẬP
              </Button>
            </Link>
          </div>
          {/* Footer */}
          <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>
      );
    }
  }

  // Transition popup for when flashcard is finished
  if (showTransitionPopup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Decorative Stars Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-8 h-8 text-yellow-300 animate-pulse">⭐</div>
          <div className="absolute top-32 right-24 w-6 h-6 text-blue-300 animate-bounce">⭐</div>
          <div className="absolute top-40 left-1/4 w-5 h-5 text-green-300 animate-pulse">⭐</div>
          <div className="absolute top-60 right-1/3 w-7 h-7 text-purple-300 animate-bounce">⭐</div>
          <div className="absolute bottom-40 left-16 w-6 h-6 text-pink-300 animate-pulse">⭐</div>
          <div className="absolute bottom-32 right-20 w-8 h-8 text-yellow-300 animate-bounce">⭐</div>
        </div>
        
        {/* Popup content */}
        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 w-full text-center shadow-2xl border-4 border-blue-300">
            {/* Study mascot */}
            <div className="flex justify-center mb-6">
              <Image
                src="/images/study-mascot-new.png"
                alt="Study mascot"
                width={100}
                height={100}
                className="object-contain animate-bounce"
              />
            </div>
            
            {/* Message */}
            <h1 className="text-2xl font-bold text-blue-700 mb-4">🎯 BẠN SẼ ĐƯỢC CHUYỂN SANG</h1>
            <p className="text-lg font-semibold text-blue-700 mb-2">Luyện tập những từ vựng vừa học</p>
            <p className="text-base text-blue-600 mb-6">Chọn cách bạn muốn tiếp tục:</p>
            
            {/* Navigation buttons */}
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => {
                  setShowTransitionPopup(false);
                  resetTimeline(); // Quay lại flashcard đầu tiên
                  setIsFlipped(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Học tiếp
              </Button>
              <Button 
                onClick={() => {
                  setShowTransitionPopup(false);
                  goToPractice(); // Chuyển sang practice
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    );
  }

  // Completion popup for when subtopic is finished
  if (showCompletionPopup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Decorative Stars Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-8 h-8 text-yellow-300 animate-pulse">⭐</div>
          <div className="absolute top-32 right-24 w-6 h-6 text-blue-300 animate-bounce">⭐</div>
          <div className="absolute top-40 left-1/4 w-5 h-5 text-green-300 animate-pulse">⭐</div>
          <div className="absolute top-60 right-1/3 w-7 h-7 text-purple-300 animate-bounce">⭐</div>
          <div className="absolute bottom-40 left-16 w-6 h-6 text-pink-300 animate-pulse">⭐</div>
          <div className="absolute bottom-32 right-20 w-8 h-8 text-yellow-300 animate-bounce">⭐</div>
        </div>
        
        {/* Popup content */}
        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 w-full text-center shadow-2xl border-4 border-green-300">
            {/* Celebration mascot */}
            <div className="flex justify-center mb-6">
              <Image
                src="/images/whale-happy.png"
                alt="Happy whale"
                width={100}
                height={100}
                className="object-contain animate-bounce"
              />
            </div>
            
            {/* Congratulations message */}
            <h1 className="text-2xl font-bold text-green-700 mb-4">🎉 CHÚC MỪNG! 🎉</h1>
            <p className="text-lg font-semibold text-blue-700 mb-2">Bạn đã hoàn thành</p>
            <p className="text-xl font-bold text-blue-800 mb-6">{subtopicInfo?.subTopicName}</p>
            
            {/* Navigation buttons */}
            <div className="flex flex-col gap-3">
              <Link href="/homepage">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Về trang chủ
                </Button>
              </Link>
              <Button 
                onClick={() => {
                  setShowCompletionPopup(false);
                  resetTimeline();
                  setIsFlipped(false);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Xem lại
              </Button>
            </div>
          </div>
        </div>
        <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    );
  }
}
