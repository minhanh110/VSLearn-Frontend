"use client"
import { useState, useEffect, useMemo, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import authService from "@/app/services/auth.service"
import { SentenceFlashcardModal } from "@/components/flashcard/sentence-flashcard-modal"

// Định nghĩa kiểu dữ liệu cho đáp án
interface PracticeOption {
  text: string;
  videoUrl?: string;
  imageUrl?: string;
}

// Định nghĩa kiểu dữ liệu cho câu hỏi
interface Question {
  id: number;
  type: "multiple-choice" | "sentence-building";
  videoUrl: string;
  imageUrl: string;
  question: string;
  options?: PracticeOption[]; // Sửa lại
  correctAnswer: string;
  words?: string[];
  correctSentence?: string[];
}

// Interface cho từ với vị trí gốc
interface WordWithPosition {
  word: string
  originalIndex: number
}

export default function PracticePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lessonId = searchParams.get("lessonId")
  const testId = searchParams.get("testId")
  const mode = searchParams.get("mode")
  const topicId = searchParams.get("topicId")

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [wrongQuestions, setWrongQuestions] = useState<number[]>([]) // Lưu câu sai để làm lại
  const [currentPhase, setCurrentPhase] = useState<"multiple-choice" | "sentence-building">(
    mode === "sentence-building" ? "sentence-building" : "multiple-choice"
  )
  const [showCompletionPopup, setShowCompletionPopup] = useState(false)
  const [showStartSubtopicPopup, setShowStartSubtopicPopup] = useState(false)

  // Thêm state cho sentence building phase
  const [sentenceBuildingPhase, setSentenceBuildingPhase] = useState<"flashcard" | "practice">("flashcard")
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)

  // Thêm state cho sentence flashcard
  const [showSentenceFlashcard, setShowSentenceFlashcard] = useState(false)
  const [currentSentenceFlashcard, setCurrentSentenceFlashcard] = useState<Question | null>(null)
  const [isSentenceFlashcardFlipped, setIsSentenceFlashcardFlipped] = useState(false)

  // Cho sentence building với vị trí gốc
  const [selectedWords, setSelectedWords] = useState<WordWithPosition[]>([])
  const [availableWords, setAvailableWords] = useState<WordWithPosition[]>([])
  const [animatingWord, setAnimatingWord] = useState<string | null>(null)

  // State cho câu hỏi multiple choice lấy từ backend
  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sentenceBuildingQuestions, setSentenceBuildingQuestions] = useState<Question[]>([])
  const [sentenceBuildingLoading, setSentenceBuildingLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  // Ref để lưu trữ thứ tự từ vựng cho mỗi câu hỏi
  const availableWordsByQuestion = useRef<Map<number, WordWithPosition[]>>(new Map())
  
  // Ref để lưu trữ trạng thái đã chọn cho mỗi câu hỏi
  const selectedWordsByQuestion = useRef<Map<number, WordWithPosition[]>>(new Map())

  // Lấy danh sách câu hỏi hiện tại dựa trên phase
  const getCurrentQuestions = useMemo(() => {
    if (currentPhase === "multiple-choice") {
      return multipleChoiceQuestions;
    }
    return sentenceBuildingQuestions;
  }, [currentPhase, multipleChoiceQuestions, sentenceBuildingQuestions]);

  const currentQuestion = useMemo(() => {
    if (currentPhase === "sentence-building") {
      return sentenceBuildingQuestions[currentSentenceIndex];
    }
    return getCurrentQuestions[currentQuestionIndex];
  }, [currentPhase, getCurrentQuestions, currentQuestionIndex, sentenceBuildingQuestions, currentSentenceIndex]);

  // Check authentication on mount
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      // Check if this is practice for the first topic (lessonId 1 or 2)
      const lessonIdNum = parseInt(lessonId || '0');
      if (lessonIdNum >= 1 && lessonIdNum <= 2) {
        console.log("👤 Guest user accessing first topic practice - allowing access");
        setAuthLoading(false);
      } else {
        console.log("🚫 Guest user trying to access restricted practice - redirecting to login");
        router.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname + window.location.search));
        return;
      }
    } else {
      console.log("👤 Authenticated user accessing practice");
      setAuthLoading(false);
    }
  }, [router, lessonId])

  // Khởi tạo available words khi câu hỏi thay đổi
  useEffect(() => {
    if (currentQuestion?.type === "sentence-building" && currentQuestion.words && !showSentenceFlashcard) {
      // Kiểm tra xem đã có thứ tự từ vựng cho câu hỏi này chưa
      const questionId = currentQuestion.id;
      const existingWords = availableWordsByQuestion.current.get(questionId);
      const existingSelectedWords = selectedWordsByQuestion.current.get(questionId) || [];
      
      if (existingWords) {
        // Nếu đã có, sử dụng lại thứ tự cũ và trạng thái đã chọn
        setAvailableWords(existingWords);
        setSelectedWords(existingSelectedWords);
      } else {
        // Nếu chưa có, tạo thứ tự mới và lưu lại
        const wordsWithPosition = currentQuestion.words.map((word, index) => ({
          word,
          originalIndex: index,
        }));
        setAvailableWords(wordsWithPosition);
        setSelectedWords([]);
        // Lưu thứ tự này để sử dụng lại khi quay lại câu hỏi
        availableWordsByQuestion.current.set(questionId, wordsWithPosition);
        selectedWordsByQuestion.current.set(questionId, []);
      }
    }
  }, [currentQuestion?.id, currentQuestion?.type, showSentenceFlashcard])

  // Hiển thị sentence flashcard khi cần thiết
  useEffect(() => {
    if (currentPhase === "sentence-building" && 
        sentenceBuildingPhase === "flashcard" && 
        sentenceBuildingQuestions.length > 0 && 
        !showSentenceFlashcard) {
      // Hiển thị flashcard cho câu hiện tại
      const currentSentence = sentenceBuildingQuestions[currentSentenceIndex];
      if (currentSentence) {
        handleShowSentenceFlashcard(currentSentence);
      }
    }
  }, [currentPhase, sentenceBuildingPhase, currentSentenceIndex, sentenceBuildingQuestions, showSentenceFlashcard])

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!lessonId) return;
      setLoading(true);
      setError(null);
      try {
        // Gọi trực tiếp backend (dev)
        const res = await axios.get(`http://localhost:8080/api/v1/flashcards/subtopic/${lessonId}/practice`);
        const data = res.data;
        // Map về đúng định dạng Question
        const mapped: Question[] = data.map((q: any) => ({
          id: q.id,
          type: "multiple-choice",
          videoUrl: q.videoUrl,
          imageUrl: q.imageUrl,
          question: q.question,
          options: q.options, // options là mảng object
          correctAnswer: q.correctAnswer,
        }));
        setMultipleChoiceQuestions(mapped);
      } catch (e: any) {
        setError("Không thể tải câu hỏi luyện tập");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [lessonId]);

  // Load sentence building questions from backend
  useEffect(() => {
    const fetchSentenceBuildingQuestions = async () => {
      // Nếu có topicId và mode là sentence-building, sử dụng topicId
      // Nếu không có topicId, sử dụng lessonId như cũ
      const id = topicId || lessonId;
      if (!id) return;
      
      setSentenceBuildingLoading(true);
      try {
        let url;
        if (topicId && mode === "sentence-building") {
          // Lấy sentence building questions cho topic
          url = `http://localhost:8080/api/v1/flashcards/topic/${id}/sentence-building`;
        } else {
          // Sử dụng lessonId như cũ
          url = `http://localhost:8080/api/v1/flashcards/subtopic/${id}/sentence-building`;
        }
        
        const res = await axios.get(url);
        const data = res.data;
        // Map về đúng định dạng Question
        const mapped: Question[] = data.map((q: any) => ({
          id: q.id,
          type: "sentence-building",
          videoUrl: q.videoUrl,
          imageUrl: q.imageUrl,
          question: q.question,
          words: q.words,
          correctSentence: q.correctSentence,
          correctAnswer: q.correctAnswer,
        }));
        setSentenceBuildingQuestions(mapped);
      } catch (e: any) {
        console.warn("Không thể tải câu hỏi ghép câu, sử dụng dữ liệu mặc định");
        // Fallback to default data
        setSentenceBuildingQuestions([
          {
            id: 4,
            type: "sentence-building",
            videoUrl: "/videos/sign-language-demo.mp4",
            imageUrl: "/placeholder.svg?height=300&width=300",
            question: "Ghép câu theo video:",
            words: ["Tôi", "là", "bác sĩ", "tệ", "giỏi", "có giáo"],
            correctSentence: ["Tôi", "là", "bác sĩ"],
            correctAnswer: "Tôi là bác sĩ",
          },
          {
            id: 5,
            type: "sentence-building",
            videoUrl: "/videos/sign-language-demo.mp4",
            imageUrl: "/placeholder.svg?height=300&width=300",
            question: "Ghép câu theo video:",
            words: ["Anh", "ấy", "là", "giáo viên", "học sinh", "bác sĩ"],
            correctSentence: ["Anh", "ấy", "là", "giáo viên"],
            correctAnswer: "Anh ấy là giáo viên",
          },
          {
            id: 6,
            type: "sentence-building",
            videoUrl: "/videos/sign-language-demo.mp4",
            imageUrl: "/placeholder.svg?height=300&width=300",
            question: "Ghép câu theo video:",
            words: ["Chúng tôi", "đang", "học", "ăn", "ngủ", "chơi"],
            correctSentence: ["Chúng tôi", "đang", "học"],
            correctAnswer: "Chúng tôi đang học",
          },
        ]);
      } finally {
        setSentenceBuildingLoading(false);
      }
    };
    fetchSentenceBuildingQuestions();
  }, [lessonId, topicId, mode]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Xử lý khi người dùng chọn đáp án multiple choice
  const handleSelectAnswer = (answer: string) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answer)
    const correct = answer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)

    if (!correct) {
      // Thêm câu này vào danh sách câu sai để làm lại sau
      setWrongQuestions((prev) => [...prev, currentQuestionIndex])
    }
  }

  // Xử lý khi người dùng chọn từ trong sentence building với animation
  const handleWordClick = (wordObj: WordWithPosition, fromAvailable: boolean) => {
    setAnimatingWord(wordObj.word)

    setTimeout(() => {
      if (fromAvailable) {
        // Chuyển từ available sang selected
        const newSelectedWords = [...selectedWords, wordObj];
        const newAvailableWords = availableWords.filter((w) => w.word !== wordObj.word);
        
        setSelectedWords(newSelectedWords);
        setAvailableWords(newAvailableWords);
        
        // Lưu trạng thái mới
        if (currentQuestion?.id) {
          selectedWordsByQuestion.current.set(currentQuestion.id, newSelectedWords);
          availableWordsByQuestion.current.set(currentQuestion.id, newAvailableWords);
        }
      } else {
        // Chuyển từ selected về available và sắp xếp lại theo vị trí gốc
        const newSelectedWords = selectedWords.filter((w) => w.word !== wordObj.word);
        const newAvailableWords = [...availableWords, wordObj].sort((a, b) => a.originalIndex - b.originalIndex);
        
        setSelectedWords(newSelectedWords);
        setAvailableWords(newAvailableWords);
        
        // Lưu trạng thái mới
        if (currentQuestion?.id) {
          selectedWordsByQuestion.current.set(currentQuestion.id, newSelectedWords);
          availableWordsByQuestion.current.set(currentQuestion.id, newAvailableWords);
        }
      }
      setAnimatingWord(null)
    }, 300)
  }

  // Xử lý nộp bài cho sentence building
  const handleSubmitSentence = () => {
    const userSentence = selectedWords.map((w) => w.word).join(" ")
    const correct = userSentence === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)

    if (!correct) {
      setWrongQuestions((prev) => [...prev, currentSentenceIndex])
    }
  }

  // Xử lý khi người dùng nhấn nút tiếp tục
  const handleContinue = () => {
    setSelectedAnswer(null)
    setShowFeedback(false)


    if (isCorrect) {
      // Đúng thì chuyển câu tiếp theo
      if (currentPhase === "multiple-choice") {
        if (currentQuestionIndex < getCurrentQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          // Reset selectedWords khi chuyển câu mới
          setSelectedWords([])
        } else {
          // Hết câu hỏi trong phase hiện tại
          if (wrongQuestions.length > 0) {
            // Có câu sai cần làm lại - không reset selectedWords
            const nextWrongIndex = wrongQuestions[0]
            setWrongQuestions((prev) => prev.slice(1))
            setCurrentQuestionIndex(nextWrongIndex)
          } else {
            // Không có câu sai, chuyển phase
            setCurrentPhase("sentence-building")
            setCurrentQuestionIndex(0)
            setCurrentSentenceIndex(0)
            setSentenceBuildingPhase("flashcard") // Bắt đầu với flashcard phase
            setWrongQuestions([])
            // Reset selectedWords khi chuyển phase
            setSelectedWords([])
          }
        }
      } else {
        // Đang ở sentence building phase
        if (sentenceBuildingPhase === "practice") {
          // Đang ở practice phase, chuyển sang câu tiếp theo
          if (currentSentenceIndex < sentenceBuildingQuestions.length - 1) {
            setCurrentSentenceIndex(currentSentenceIndex + 1)
            setSentenceBuildingPhase("flashcard") // Bắt đầu với flashcard cho câu mới
            setSelectedWords([])
          } else {
            // Hoàn thành tất cả sentence building
            setShowCompletionPopup(true)
          }
        } else {
          // Đang ở flashcard phase, chuyển sang practice
          setSentenceBuildingPhase("practice")
        }
      }
    } else {
      // Sai thì chuyển câu tiếp theo (sẽ quay lại làm lại sau)
      if (currentPhase === "multiple-choice") {
        if (currentQuestionIndex < getCurrentQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          // Reset selectedWords khi chuyển câu mới
          setSelectedWords([])
        } else {
          // Hết câu trong phase, bắt đầu làm lại câu sai
          if (wrongQuestions.length > 0) {
            const nextWrongIndex = wrongQuestions[0]
            setWrongQuestions((prev) => prev.slice(1))
            setCurrentQuestionIndex(nextWrongIndex)
            // Không reset selectedWords khi làm lại câu sai
          } else {
            // Không có câu sai, chuyển phase
            setCurrentPhase("sentence-building")
            setCurrentQuestionIndex(0)
            setCurrentSentenceIndex(0)
            setSentenceBuildingPhase("flashcard") // Bắt đầu với flashcard phase
            setWrongQuestions([])
            // Reset selectedWords khi chuyển phase
            setSelectedWords([])
          }
        }
      } else {
        // Sentence building sai - chuyển sang câu tiếp theo hoặc làm lại câu sai
        if (wrongQuestions.length > 0) {
          const nextWrongIndex = wrongQuestions[0]
          setWrongQuestions((prev) => prev.slice(1))
          setCurrentSentenceIndex(nextWrongIndex)
          setSentenceBuildingPhase("flashcard") // Bắt đầu với flashcard cho câu sai
          setSelectedWords([])
        } else {
          // Không có câu sai, chuyển sang câu tiếp theo
          if (currentSentenceIndex < sentenceBuildingQuestions.length - 1) {
            setCurrentSentenceIndex(currentSentenceIndex + 1)
            setSentenceBuildingPhase("flashcard") // Bắt đầu với flashcard cho câu mới
            setSelectedWords([])
          } else {
            // Hoàn thành tất cả sentence building
            setShowCompletionPopup(true)
          }
        }
      }
    }
  }

  // Xử lý popup hoàn thành
  const handleCompletionContinue = () => {
    // Mark lesson/test as completed
    if (lessonId) {
      markCompleted(lessonId)
    } else if (testId) {
      markCompleted(testId)
    }

    setShowCompletionPopup(false)
    setShowStartSubtopicPopup(true)
  }

  const handleCompletionClose = () => {
    // Mark lesson/test as completed
    if (lessonId) {
      markCompleted(lessonId)
    } else if (testId) {
      markCompleted(testId)
    }

    router.push("/homepage")
  }

  // Xử lý popup bắt đầu subtopic mới
  const handleStartSubtopic = () => {
    // Sử dụng lessonId làm subtopicId
    const subtopicId = lessonId || testId;
    router.push(`/flashcard/${subtopicId}`)
  }

  const handleStartSubtopicClose = () => {
    router.push("/homepage")
  }
  // Function để mark lesson/test completed
  const markCompleted = (id: string) => {
    const completedEvent = new CustomEvent("lessonCompleted", {
      detail: { lessonId: Number.parseInt(id) },
    })
    window.dispatchEvent(completedEvent)
  }

  // Hàm xử lý sentence flashcard
  const handleShowSentenceFlashcard = (question: Question) => {
    setCurrentSentenceFlashcard(question)
    setShowSentenceFlashcard(true)
    setIsSentenceFlashcardFlipped(false)
  }

  const handleSentenceFlashcardFlip = () => {
    setIsSentenceFlashcardFlipped(!isSentenceFlashcardFlipped)
  }

  const handleSentenceFlashcardContinue = () => {
    setShowSentenceFlashcard(false)
    setCurrentSentenceFlashcard(null)
    setIsSentenceFlashcardFlipped(false)
    
    // Chuyển sang practice phase
    setSentenceBuildingPhase("practice")
    
    // Khởi tạo lại available words cho câu hỏi hiện tại
    if (currentQuestion?.type === "sentence-building" && currentQuestion.words) {
      const wordsWithPosition = currentQuestion.words.map((word, index) => ({
        word,
        originalIndex: index,
      }));
      setAvailableWords(wordsWithPosition);
      setSelectedWords([]);
      
      // Lưu trạng thái mới
      if (currentQuestion.id) {
        availableWordsByQuestion.current.set(currentQuestion.id, wordsWithPosition);
        selectedWordsByQuestion.current.set(currentQuestion.id, []);
      }
    }
  }

  // Hàm kiểm tra xem có cần hiển thị sentence flashcard không
  const shouldShowSentenceFlashcard = (question: Question) => {
    return question.type === "sentence-building" && !showSentenceFlashcard
  }

  if (loading) return <div className="flex items-center justify-center h-screen text-xl">Đang tải câu hỏi luyện tập...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-xl text-red-500">{error}</div>;
  if (currentPhase === "multiple-choice" && multipleChoiceQuestions.length === 0) {
    return <div className="flex items-center justify-center h-screen text-xl text-gray-500">Không có câu hỏi luyện tập nào cho bài học này.</div>;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 relative overflow-hidden flex flex-col">
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
      <div className="flex-1 px-4 pb-4 pt-16 relative z-10 min-h-0">
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
          <div className="flex-1 flex flex-col justify-center items-center">
            {/* Video/Image Container - Cùng kích thước cho cả hai loại */}
            <div className="flex justify-center mb-4">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden border-4 border-blue-300 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
                {/* Decorative elements */}
                <div className="absolute top-2 left-2 w-4 h-4 text-yellow-400 z-10">⭐</div>
                <div className="absolute top-2 right-2 w-3 h-3 text-blue-400 z-10">⭐</div>
                <div className="absolute bottom-2 left-2 w-3 h-3 text-green-400 z-10">⭐</div>
                <div className="absolute bottom-2 right-2 w-4 h-4 text-purple-400 z-10">⭐</div>

                {/* Video hoặc Image chính của câu hỏi */}
                <div className="absolute inset-4 rounded-xl overflow-hidden bg-blue-900 flex items-center justify-center">
                  {currentQuestion?.videoUrl ? (
                    <video
                      src={currentQuestion.videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Image
                      src={currentQuestion?.imageUrl || "/placeholder.svg"}
                      alt="Sign language demonstration"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Question */}
            <h2 className="text-xl sm:text-2xl font-bold text-blue-700 text-center mb-6">
              {currentQuestion?.question}
            </h2>

            {/* Multiple Choice Questions */}
            {currentQuestion?.type === "multiple-choice" && (
              <div className="mb-6">
                {currentQuestion.options!.length === 3 ? (
                  // 3 đáp án - 1 hàng ngang
                  <div className="flex justify-center gap-2 sm:gap-3 max-w-xs sm:max-w-2xl mx-auto">
                    {currentQuestion.options!.map((option, index) => (
                      <button
                        key={index}

                        onClick={() => handleSelectAnswer(option.text)}
                        disabled={selectedAnswer !== null}
                        className={`relative py-2 sm:py-3 px-4 sm:px-5 rounded-full border-2 border-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-200 font-bold text-blue-700 text-center text-sm sm:text-base whitespace-nowrap flex-1 ${
                          selectedAnswer === option.text
                            ? option.text === currentQuestion.correctAnswer

                              ? "bg-green-100 border-green-500 text-green-700"
                              : "bg-red-100 border-red-500 text-red-700"
                            : ""
                        }`}
                      >
                        <span>{option.text}</span>
                        {selectedAnswer === option.text && (
                          <span className="absolute -top-1 -right-1">
                            {option.text === currentQuestion.correctAnswer ? (

                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  // 4 đáp án - 2x2 grid (4 góc)
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md mx-auto">
                    {currentQuestion.options!.map((option, index) => (
                      <button
                        key={index}

                        onClick={() => handleSelectAnswer(option.text)}
                        disabled={selectedAnswer !== null}
                        className={`relative py-2 sm:py-3 px-3 sm:px-4 rounded-full border-2 border-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-200 font-bold text-blue-700 text-center text-sm sm:text-base whitespace-nowrap ${
                          selectedAnswer === option.text
                            ? option.text === currentQuestion.correctAnswer
                              ? "bg-green-100 border-green-500 text-green-700"
                              : "bg-red-100 border-red-500 text-red-700"
                            : ""
                        }`}
                      >
                        <span>{option.text}</span>
                        {selectedAnswer === option.text && (
                          <span className="absolute -top-1 -right-1">
                            {option.text === currentQuestion.correctAnswer ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sentence Building Questions */}
            {currentQuestion?.type === "sentence-building" && 
             currentPhase === "sentence-building" && 
             sentenceBuildingPhase === "practice" &&
             !showSentenceFlashcard && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Ghép câu
                  </h2>
                  <p className="text-gray-600">
                    Sắp xếp các từ để tạo thành câu hoàn chỉnh
                  </p>
                </div>

                {/* Answer Box căn giữa hoàn toàn */}
                <div className="mb-4 flex justify-center">
                  <div className="w-full max-w-2xl h-[60px] border-2 border-blue-600 rounded-xl bg-white p-3 flex flex-wrap gap-2 items-center justify-center">
                    {selectedWords.length === 0 ? (
                      <span className="text-gray-400 text-base">Ghép câu tại đây...</span>
                    ) : (
                      selectedWords.map((wordObj, index) => (
                        <button
                          key={`selected-${wordObj.word}-${index}`}
                          onClick={() => handleWordClick(wordObj, false)}
                          disabled={animatingWord === wordObj.word}
                          className={`px-3 py-1.5 bg-blue-100 border-2 border-blue-500 rounded-full text-blue-700 font-bold hover:bg-blue-200 transition-all duration-300 text-sm ${
                            animatingWord === wordObj.word ? "animate-bounce opacity-50" : ""
                          }`}
                        >
                          {wordObj.word}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Available Words - căn giữa */}
                <div className="flex justify-center">
                  <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                    {availableWords.map((wordObj, index) => (
                      <button
                        key={`available-${wordObj.word}-${index}`}
                        onClick={() => handleWordClick(wordObj, true)}
                        disabled={animatingWord === wordObj.word}
                        className={`px-3 py-1.5 bg-blue-50 border-2 border-blue-600 rounded-full text-blue-700 font-bold hover:bg-blue-100 transition-all duration-300 text-sm transform hover:scale-105 ${
                          animatingWord === wordObj.word ? "animate-pulse scale-110 bg-blue-200" : ""
                        }`}
                      >
                        {wordObj.word}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mascot - Responsive và chỉ hiển thị trên desktop */}
          <div className="absolute bottom-2 left-2 hidden md:block">
            <div className="animate-bounce">
              <Image
                src="/images/study-mascot-new.png"
                alt="Study mascot"
                width={120}
                height={120}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button - Fixed position giống nút LUYỆN TẬP ở flashcard */}
      {currentQuestion?.type === "sentence-building" && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 lg:absolute lg:bottom-8 lg:right-8 lg:left-auto lg:transform-none z-30">
          <div className="flex items-center gap-3">
            <div className="text-blue-600 text-2xl animate-pulse hidden lg:block">👉</div>
            <Button
              onClick={handleSubmitSentence}
              disabled={selectedWords.length === 0}
              className="bg-cyan-400 hover:bg-cyan-500 text-blue-900 font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-2xl text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              NỘP BÀI
            </Button>
          </div>
        </div>
      )}

      {/* Feedback Popup  */}
      {showFeedback && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xs mx-4">
            <div className="relative">
              {/* Popup với màu xanh/đỏ dựa trên kết quả */}
              <div
                className={`rounded-2xl px-6 py-6 text-center shadow-2xl border-4 ${
                  isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                {/* Whale mascot */}
                <div className="flex justify-center mb-4">
                  <Image
                    src={isCorrect ? "/images/whale-happy.png" : "/images/whale-sad.png"}
                    alt={isCorrect ? "Happy whale" : "Sad whale"}
                    width={80}
                    height={80}
                    className="object-contain animate-bounce"
                  />
                </div>

                {/* Main title */}
                <h2 className={`text-xl font-bold mb-2 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                  {isCorrect ? "TUYỆT VỜI !!!" : "CHƯA ĐÚNG !!!"}
                </h2>

                {/* Result message */}
                <p className={`text-base font-semibold mb-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? "BẠN ĐÃ TRẢ LỜI ĐÚNG" : "HÃY THỬ LẠI NHÉ"}
                </p>

                {/* Correct answer for wrong answers */}
                {!isCorrect && (
                  <p className="text-red-500 text-sm font-bold mb-6">ĐÁP ÁN: {currentQuestion?.correctAnswer}</p>
                )}

                {isCorrect && <div className="mb-6"></div>}

                {/* Continue button */}
                <Button
                  onClick={handleContinue}
                  className={`w-full font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl text-base ${
                    isCorrect
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  }`}
                >
                  TIẾP TỤC
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Completion Popup - Giống LessonPopup style */}
      {showCompletionPopup && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xs mx-4">
            <div className="relative">
              {/* Blue pastel rounded popup - giống LessonPopup */}
              <div className="bg-blue-50 rounded-2xl px-6 py-6 text-center shadow-2xl border-4 border-blue-200">
                {/* Study mascot */}
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/study-mascot-new.png"
                    alt="Study mascot"
                    width={80}
                    height={80}
                    className="object-contain animate-bounce"
                  />
                </div>

                {/* Main title */}
                <h2 className="text-xl font-bold text-blue-700 mb-2">CHÚC MỪNG !!!</h2>

                {/* Subtitle */}
                <p className="text-blue-600 text-base font-semibold mb-6">
                  {testId ? "BẠN ĐÃ HOÀN THÀNH BÀI TEST" : "BẠN ĐÃ HOÀN THÀNH BÀI HỌC"}
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleCompletionContinue}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl text-base"
                  >
                    TIẾP TỤC
                  </Button>
                  <Button
                    onClick={handleCompletionClose}
                    className="flex-1 bg-gradient-to-r from-blue-300 to-cyan-300 hover:from-blue-400 hover:to-cyan-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl text-base"
                  >
                    ĐÓNG
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Start Subtopic Popup - Giống homepage nhưng lớn hơn */}
      {showStartSubtopicPopup && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4">
            <div className="relative">
              {/* Blue pastel rounded popup - lớn hơn */}
              <div className="bg-blue-50 rounded-2xl px-6 py-6 text-center shadow-2xl border-4 border-blue-200">
                {/* Study mascot - lớn hơn */}
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/study-mascot-new.png"
                    alt="Study mascot"
                    width={80}
                    height={80}
                    className="object-contain animate-bounce"
                  />
                </div>

                {/* Main title - lớn hơn */}
                <h2 className="text-xl font-bold text-blue-700 mb-3">BẮT ĐẦU HỌC NHÉ !!!</h2>

                {/* Lesson topic - lớn hơn */}
                <p className="text-blue-600 text-base font-semibold mb-2">CHỦ ĐỀ: BẢNG CHỮ CÁI</p>

                {/* Word count - lớn hơn */}
                <p className="text-blue-500 text-base font-bold mb-6">20 TỪ VỰNG</p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleStartSubtopic}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl text-base"
                  >
                    BẮT ĐẦU
                  </Button>
                  <Button
                    onClick={handleStartSubtopicClose}
                    className="flex-1 bg-gradient-to-r from-blue-300 to-cyan-300 hover:from-blue-400 hover:to-cyan-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl text-base"
                  >
                    ĐÓNG
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sentence Flashcard Modal */}
      {showSentenceFlashcard && currentSentenceFlashcard && (
        <SentenceFlashcardModal
          isOpen={showSentenceFlashcard}
          question={currentSentenceFlashcard}
          onClose={handleSentenceFlashcardContinue}
        />
      )}

      <Footer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}
