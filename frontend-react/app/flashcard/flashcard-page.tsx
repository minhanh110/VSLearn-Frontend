"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

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

export default function FlashcardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [mode, setMode] = useState<"learn" | "practice">("learn")
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [subtopicInfo, setSubtopicInfo] = useState<SubtopicInfo | null>(null);

  // Lấy subtopicId từ URL params
  const subtopicId = searchParams.get('subtopicId') || "1";

  // Tạo key để force re-render khi subtopicId thay đổi
  const componentKey = useMemo(() => `flashcard-${subtopicId}`, [subtopicId]);

  useEffect(() => {
    console.log("🚀 Starting fetch for subtopicId:", subtopicId);
    console.log("🔍 URL searchParams:", searchParams.toString());
    
    // Reset state khi subtopicId thay đổi
    setCurrentCard(0);
    setIsFlipped(false);
    setMode("learn");
    setFlashcards([]);
    setSubtopicInfo(null);
    setIsLoading(true);
    
    const fetchSubtopicInfo = async () => {
      try {
        console.log("📡 Fetching subtopic info for:", subtopicId);
        const response = await fetch(`http://localhost:8080/api/v1/flashcards/subtopic/${subtopicId}/info`);
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Subtopic info received:", data);
          setSubtopicInfo(data);
        } else {
          console.error("❌ Failed to fetch subtopic info:", response.status);
        }
      } catch (error) {
        console.error("❌ Error fetching subtopic info:", error);
      }
    };

    const fetchFlashcards = async () => {
      console.log("📡 Fetching flashcards for subtopicId:", subtopicId);
      try {
        const response = await fetch(`http://localhost:8080/api/v1/flashcards/subtopic/${subtopicId}`);
        console.log("📡 Response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch flashcards");
        }
        const data = await response.json();
        console.log("✅ Fetched flashcards:", data.length, "cards");
        console.log("✅ First card:", data[0]);
        setFlashcards(data);
      } catch (error) {
        console.error("❌ Error fetching flashcards:", error);
        // Handle error state in UI
      } finally {
        setIsLoading(false);
      }
    };

    if (subtopicId) {
      fetchSubtopicInfo();
      fetchFlashcards();
    }
  }, [searchParams.toString()]); // Chỉ sử dụng searchParams.toString() để đảm bảo reload khi URL thay đổi

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (flashcards.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">No flashcards found for this subtopic.</div>;
  }

  const totalCards = flashcards.length;
  const practiceInterval = Math.floor(totalCards / 3);

  const currentFlashcard = flashcards[currentCard]

  const nextCard = () => {
    const nextCardIndex = currentCard + 1;
    // Check if it's time for practice
    if (practiceInterval > 0 && nextCardIndex % practiceInterval === 0 && nextCardIndex < totalCards) {
      setMode("practice");
    } else {
      setCurrentCard((prev) => (prev + 1) % flashcards.length)
      setIsFlipped(false)
    }
  }

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    setIsFlipped(false)
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handlePracticeComplete = () => {
    setMode("learn");
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  if (mode === "practice") {
    const practiceCards = flashcards.slice(currentCard + 1 - practiceInterval, currentCard + 1);
    return (
      <PracticeView
        key={`practice-${componentKey}-${currentCard}`}
        practiceCards={practiceCards}
        allCards={flashcards}
        onComplete={handlePracticeComplete}
      />
    );
  }

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
                        src={currentFlashcard.front.content}
                        controls
                      >
                        Trình duyệt của bạn không hỗ trợ video.
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
                    <video
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover"
                      src={currentFlashcard.front.content}
                      controls
                    >
                      Trình duyệt của bạn không hỗ trợ video.
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

// Define the PracticeView component
function PracticeView({ practiceCards, allCards, onComplete }: {
  practiceCards: Flashcard[],
  allCards: Flashcard[],
  onComplete: () => void
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateOptions = (correctCard: Flashcard) => {
    const correctWord = correctCard.back.word;
    const distractors = allCards
      .filter((card) => card.id !== correctCard.id)
      .map((card) => card.back.word);
    
    // Shuffle distractors and pick 3
    const shuffledDistractors = distractors.sort(() => 0.5 - Math.random());
    const finalDistractors = shuffledDistractors.slice(0, 3);

    const options = [correctWord, ...finalDistractors];
    return options.sort(() => 0.5 - Math.random());
  };

  const handleSelectAnswer = (cardId: number, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [cardId]: answer }));
  };

  const checkAnswers = () => {
    let allCorrect = true;
    for (const card of practiceCards) {
      if (selectedAnswers[card.id] !== card.back.word) {
        allCorrect = false;
        break;
      }
    }
    setIsCorrect(allCorrect);
    if (allCorrect) {
      setTimeout(() => {
        onComplete();
      }, 1000); // Wait a bit to show success
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-emerald-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-teal-700 mb-6">Luyện tập</h1>
        <div className="space-y-6">
          {practiceCards.map((card) => (
            <div key={card.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-lg font-semibold text-gray-800 mb-3">"{card.front.title}" có nghĩa là gì?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {generateOptions(card).map((option) => (
                  <Button
                    key={option}
                    onClick={() => handleSelectAnswer(card.id, option)}
                    className={`justify-start w-full text-left h-auto py-3 px-4 transition-colors ${
                      selectedAnswers[card.id] === option
                        ? "bg-blue-500 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button onClick={checkAnswers} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 text-lg rounded-full shadow-lg">
            Kiểm tra
          </Button>
          {isCorrect === false && (
            <p className="text-red-500 mt-4 font-semibold">Chưa đúng hết. Hãy thử lại nhé!</p>
          )}
          {isCorrect === true && (
            <p className="text-green-500 mt-4 font-semibold">Chính xác! Bạn sẽ được chuyển tới bài tiếp theo.</p>
          )}
        </div>
      </div>
    </div>
  );
}
