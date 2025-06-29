import { useState, useEffect } from 'react';
import { FlashcardService, type Flashcard, type TimelineStep, type ProgressRequest, type ProgressResponse, type NextSubtopicInfo } from '@/app/services/flashcard.service';
import { useRouter } from 'next/navigation';

// Import API_BASE_URL từ service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface SubtopicInfo {
  id: number;
  subTopicName: string;
  topicId: number;
  topicName: string;
  status: string;
  totalFlashcards: number;
}

export function useFlashcardLogic(subtopicId: string, userId: string = 'default-user') {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subtopicInfo, setSubtopicInfo] = useState<SubtopicInfo | null>(null);
  const [nextSubtopicInfo, setNextSubtopicInfo] = useState<NextSubtopicInfo | null>(null);
  const [timeline, setTimeline] = useState<TimelineStep[]>([]);
  const [timelinePos, setTimelinePos] = useState(0);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [showTransitionPopup, setShowTransitionPopup] = useState(false);
  const [showPracticeTransitionModal, setShowPracticeTransitionModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [userProgress, setUserProgress] = useState<ProgressResponse | null>(null);
  const [completedFlashcards, setCompletedFlashcards] = useState<number[]>([]);
  const [completedPractices, setCompletedPractices] = useState<Set<string>>(new Set()); // Track completed practice ranges
  const router = useRouter();

  // Fetch flashcards và subtopic info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoData, flashcardsData] = await Promise.all([
          FlashcardService.getSubtopicInfo(subtopicId),
          FlashcardService.getFlashcards(subtopicId)
        ]);
        
        setSubtopicInfo(infoData);
        setFlashcards(flashcardsData);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [subtopicId]);

  // Load next subtopic info
  useEffect(() => {
    const loadNextSubtopic = async () => {
      try {
        console.log("🔍 Loading next subtopic info for subtopicId:", subtopicId);
        const nextInfo = await FlashcardService.getNextSubtopic(subtopicId);
        setNextSubtopicInfo(nextInfo);
        console.log("📊 Next subtopic info loaded:", nextInfo);
        console.log("📊 hasNext:", nextInfo.hasNext);
        console.log("📊 nextSubtopicId:", nextInfo.nextSubtopicId);
      } catch (error) {
        console.warn('Failed to load next subtopic info:', error);
        setNextSubtopicInfo({ hasNext: false });
      }
    };

    if (subtopicId) {
      loadNextSubtopic();
    }
  }, [subtopicId]);

  // Load user progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await FlashcardService.getProgress(subtopicId);
        setUserProgress(progress);
        setCompletedFlashcards(progress.completedFlashcards);
        
        // Load completed practices from progress
        if (progress.completedPractices && Array.isArray(progress.completedPractices)) {
          const practiceSet = new Set<string>(progress.completedPractices);
          setCompletedPractices(practiceSet);
          console.log("📊 Loaded completed practices:", practiceSet);
        }
      } catch (error) {
        console.warn('Failed to load progress:', error);
      }
    };

    if (subtopicId) {
      loadProgress();
    }
  }, [subtopicId]);

  // Generate timeline from backend
  useEffect(() => {
    const generateTimeline = async () => {
      if (flashcards.length === 0) return;
      
      try {
        console.log("🔧 Fetching timeline from backend for", flashcards.length, "cards");
        const backendTimeline = await FlashcardService.getTimeline(subtopicId);
        console.log("📊 Backend timeline:", backendTimeline);
        
        if (backendTimeline && backendTimeline.length > 0) {
          console.log("📊 Using backend timeline:", backendTimeline);
          setTimeline(backendTimeline);
          return;
        }
      } catch (error) {
        console.error("❌ Failed to fetch timeline from backend, using fallback:", error);
      }
      
      // Fallback: tạo timeline đơn giản
      const totalCards = flashcards.length;
      console.log("🔧 Creating fallback timeline for", totalCards, "cards");
      
      let numGroups = 3;
      if (totalCards <= 6) {
        numGroups = 2;
      } else if (totalCards <= 9) {
        numGroups = 3;
      } else if (totalCards <= 12) {
        numGroups = 4;
      } else {
        numGroups = 4;
      }
      
      const groupSize = Math.ceil(totalCards / numGroups);
      console.log("  - numGroups:", numGroups);
      console.log("  - groupSize:", groupSize);

      const fallbackTimeline: TimelineStep[] = [];
      let currentIndex = 0;
      
      for (let group = 0; group < numGroups && currentIndex < totalCards; group++) {
        const groupStart = currentIndex;
        const remainingCards = totalCards - currentIndex;
        const currentGroupSize = Math.min(groupSize, remainingCards);
        
        console.log(`  - Group ${group + 1}: taking ${currentGroupSize} cards (${currentIndex} to ${currentIndex + currentGroupSize - 1})`);
        
        // Thêm flashcards cho nhóm này
        for (let j = 0; j < currentGroupSize; j++) {
          fallbackTimeline.push({ type: "flashcard", index: currentIndex });
          currentIndex++;
        }
        
        // Thêm practice cho nhóm vừa thêm (chỉ khi có ít nhất 2 flashcard và chưa hoàn thành)
        if (currentGroupSize >= 2) {
          const practiceKey = `${groupStart}-${currentIndex}`;
          if (!completedPractices.has(practiceKey)) {
            console.log(`    - Adding practice for cards ${groupStart} to ${currentIndex}`);
            fallbackTimeline.push({ type: "practice", start: groupStart, end: currentIndex });
          } else {
            console.log(`    - Skipping completed practice for cards ${groupStart} to ${currentIndex}`);
          }
        } else {
          console.log(`    - Skipping practice for single card group`);
        }
      }
      
      console.log("📊 Final fallback timeline:", fallbackTimeline);
      console.log("📊 Timeline length:", fallbackTimeline.length);
      console.log("📊 Practice steps in timeline:", fallbackTimeline.filter(step => step.type === "practice"));
      setTimeline(fallbackTimeline);
    };

    if (flashcards.length > 0) {
      generateTimeline();
    }
  }, [subtopicId, flashcards.length, completedPractices]);

  // Debug timeline changes
  useEffect(() => {
    console.log("🔄 Timeline state updated:", timeline);
    console.log("🔄 TimelinePos:", timelinePos);
    console.log("🔄 Practice steps in timeline:", timeline.filter(step => step.type === "practice"));
    console.log("🔄 Current step:", timeline[timelinePos]);
  }, [timeline, timelinePos]);

  // Debug showCompletionPopup changes in hook
  useEffect(() => {
    console.log("🔄 Hook: showCompletionPopup state changed to:", showCompletionPopup);
  }, [showCompletionPopup]);

  // Save progress when completed flashcards change
  const saveProgress = async (newCompletedFlashcards: number[], completedPractice: boolean = false, userChoice?: 'continue' | 'review') => {
    console.log("💾 saveProgress called with:");
    console.log("  - newCompletedFlashcards:", newCompletedFlashcards);
    console.log("  - completedPractice:", completedPractice);
    console.log("  - userChoice:", userChoice);
    console.log("  - userId:", userId);
    console.log("  - subtopicId:", subtopicId);
    
    try {
      const progressRequest: ProgressRequest = {
        completedFlashcards: newCompletedFlashcards,
        completedPractice,
        completedPractices: Array.from(completedPractices),
        userChoice,
        userId
      };

      console.log("📤 Sending progress request:", progressRequest);
      const response = await FlashcardService.saveProgress(subtopicId, progressRequest);
      setUserProgress(response);
      console.log('✅ Progress saved:', response);
    } catch (error) {
      console.error('❌ Failed to save progress:', error);
    }
  };

  // Navigation functions
  const nextStep = () => {
    const currentStep = timeline[timelinePos];
    console.log("➡️ nextStep called:");
    console.log("  - currentStep:", currentStep);
    console.log("  - timelinePos:", timelinePos);
    
    if (currentStep?.type === "flashcard") {
      // Nếu đang ở flashcard, kiểm tra xem có phải flashcard cuối cùng trong nhóm không
      const currentIndex = currentStep.index || 0;
      
      // Tìm flashcard tiếp theo trong cùng nhóm
      let nextFlashcardIndex = -1;
      for (let i = timelinePos + 1; i < timeline.length; i++) {
        if (timeline[i].type === "flashcard") {
          const stepIndex = timeline[i].index || 0;
          if (stepIndex > currentIndex) {
            nextFlashcardIndex = stepIndex;
            break;
          }
        } else if (timeline[i].type === "practice") {
          // Nếu gặp practice step, dừng tìm kiếm
          break;
        }
      }
      
      if (nextFlashcardIndex >= 0) {
        // Tìm vị trí của flashcard tiếp theo trong timeline
        const nextTimelinePos = timeline.findIndex(step => 
          step.type === "flashcard" && step.index === nextFlashcardIndex
        );
        console.log("  - Found next flashcard at index:", nextFlashcardIndex);
        console.log("  - Setting timelinePos to:", nextTimelinePos);
        setTimelinePos(nextTimelinePos);
      } else {
        // Nếu không có flashcard tiếp theo, kiểm tra xem có practice step không
        const nextStepIndex = timelinePos + 1;
        const nextStep = timeline[nextStepIndex];
        
        if (nextStep?.type === "practice") {
          // Kiểm tra xem practice này đã hoàn thành chưa
          const practiceKey = `${nextStep.start}-${nextStep.end}`;
          if (completedPractices.has(practiceKey)) {
            console.log("  - Next practice already completed, skipping to next step");
            // Bỏ qua practice đã hoàn thành, chuyển sang step tiếp theo
            setTimelinePos((prev) => Math.min(prev + 2, timeline.length - 1));
          } else {
            console.log("  - Next step is practice, showing modal");
            setShowPracticeTransitionModal(true);
          }
        } else {
          console.log("  - No next flashcard or practice found, going to next step");
          setTimelinePos((prev) => Math.min(prev + 1, timeline.length - 1));
        }
      }
    } else if (currentStep?.type === "practice") {
      // Nếu đang ở practice step, tìm step tiếp theo (bỏ qua practice đã hoàn thành)
      console.log("  - Currently in practice step, finding next step");
      
      let nextPos = timelinePos + 1;
      
      // Bỏ qua các practice đã hoàn thành
      while (nextPos < timeline.length) {
        const nextStep = timeline[nextPos];
        if (nextStep?.type === "practice") {
          const practiceKey = `${nextStep.start}-${nextStep.end}`;
          if (completedPractices.has(practiceKey)) {
            console.log(`  - Skipping completed practice at position ${nextPos}`);
            nextPos++;
          } else {
            console.log(`  - Found uncompleted practice at position ${nextPos}`);
            break;
          }
        } else {
          console.log(`  - Found non-practice step at position ${nextPos}:`, nextStep);
          break;
        }
      }
      
      console.log("  - Setting timelinePos to:", nextPos);
      setTimelinePos(nextPos);
    } else {
      // Nếu không phải flashcard, chuyển sang step tiếp theo
      console.log("  - Not a flashcard step, going to next step");
      setTimelinePos((prev) => Math.min(prev + 1, timeline.length - 1));
    }
  };

  const prevStep = () => {
    const currentStep = timeline[timelinePos];
    console.log("🔙 prevStep called:");
    console.log("  - currentStep:", currentStep);
    console.log("  - timelinePos:", timelinePos);
    console.log("  - timeline:", timeline.map((step, idx) => `${idx}: ${step.type}${step.index !== undefined ? `(${step.index})` : ''}`));
    
    if (currentStep?.type === "flashcard") {
      // Nếu đang ở flashcard, tìm flashcard trước đó
      const currentIndex = currentStep.index || 0;
      console.log("  - Current flashcard index:", currentIndex);
      
      // Tìm flashcard trước đó (bỏ qua practice steps)
      let prevFlashcardIndex = -1;
      for (let i = timelinePos - 1; i >= 0; i--) {
        console.log(`  - Checking step ${i}:`, timeline[i]);
        if (timeline[i].type === "flashcard") {
          const stepIndex = timeline[i].index || 0;
          console.log(`  - Found flashcard at step ${i} with index ${stepIndex}`);
          if (stepIndex < currentIndex) {
            prevFlashcardIndex = stepIndex;
            console.log(`  - This is the previous flashcard (${stepIndex} < ${currentIndex})`);
            break;
          } else {
            console.log(`  - This flashcard is not previous (${stepIndex} >= ${currentIndex})`);
          }
        } else {
          console.log(`  - Skipping ${timeline[i].type} step`);
        }
        // Bỏ qua practice steps, chỉ tìm flashcard
      }
      
      if (prevFlashcardIndex >= 0) {
        // Tìm vị trí của flashcard trước đó trong timeline
        const prevTimelinePos = timeline.findIndex(step => 
          step.type === "flashcard" && step.index === prevFlashcardIndex
        );
        console.log("  - Found previous flashcard at index:", prevFlashcardIndex);
        console.log("  - Setting timelinePos to:", prevTimelinePos);
        setTimelinePos(prevTimelinePos);
      } else {
        // Nếu không có flashcard trước đó, giữ nguyên vị trí hiện tại
        console.log("  - No previous flashcard found, staying at current position");
      }
    } else if (currentStep?.type === "practice") {
      // Nếu đang ở practice, quay về flashcard cuối cùng trong nhóm trước đó
      console.log("  - Currently in practice, going back to last flashcard of previous group");
      
      // Tìm flashcard cuối cùng trước practice step hiện tại
      let lastFlashcardIndex = -1;
      for (let i = timelinePos - 1; i >= 0; i--) {
        console.log(`  - Checking step ${i} for flashcard:`, timeline[i]);
        if (timeline[i].type === "flashcard") {
          lastFlashcardIndex = timeline[i].index || 0;
          console.log(`  - Found last flashcard at index: ${lastFlashcardIndex}`);
          break;
        }
      }
      
      if (lastFlashcardIndex >= 0) {
        const prevTimelinePos = timeline.findIndex(step => 
          step.type === "flashcard" && step.index === lastFlashcardIndex
        );
        console.log("  - Found last flashcard at index:", lastFlashcardIndex);
        console.log("  - Setting timelinePos to:", prevTimelinePos);
        setTimelinePos(prevTimelinePos);
      } else {
        // Nếu không tìm thấy flashcard nào, quay về step đầu tiên
        console.log("  - No flashcard found, going to first step");
        setTimelinePos(0);
      }
    } else {
      // Trường hợp khác, quay về step trước đó
      console.log("  - Other step type, going to previous step");
      setTimelinePos((prev) => Math.max(prev - 1, 0));
    }
  };

  const resetTimeline = () => {
    setTimelinePos(0);
  };

  // Handle practice transition modal actions
  const handlePracticeTransitionContinue = () => {
    setShowPracticeTransitionModal(false);
    setTimelinePos((prev) => Math.min(prev + 1, timeline.length - 1));
  };

  const handlePracticeTransitionReview = () => {
    setShowPracticeTransitionModal(false);
    // Quay lại flashcard cuối cùng trong nhóm hiện tại
    const currentStep = timeline[timelinePos];
    if (currentStep?.type === "flashcard" && currentStep.index !== undefined) {
      // Tìm flashcard cuối cùng trong nhóm hiện tại
      let lastFlashcardIndex = currentStep.index;
      for (let i = timelinePos - 1; i >= 0; i--) {
        if (timeline[i].type === "flashcard") {
          lastFlashcardIndex = timeline[i].index || 0;
          break;
        }
      }
      // Đặt vị trí về flashcard cuối cùng trong nhóm
      setTimelinePos(timeline.findIndex(step => 
        step.type === "flashcard" && step.index === lastFlashcardIndex
      ));
    }
  };

  const handlePracticeTransitionClose = () => {
    setShowPracticeTransitionModal(false);
  };

  // Handle completion popup actions
  const handleCompletionRetry = () => {
    setShowCompletionModal(false);
    resetTimeline();
  };

  const handleCompletionNext = () => {
    console.log("🚀 handleCompletionNext called");
    console.log("📊 nextSubtopicInfo:", nextSubtopicInfo);
    
    if (nextSubtopicInfo?.hasNext && nextSubtopicInfo?.nextSubtopicId) {
      // Có subtopic tiếp theo - chuyển đến subtopic đó
      console.log("➡️ Navigating to next subtopic:", nextSubtopicInfo.nextSubtopicId);
      router.push(`/flashcard/${nextSubtopicInfo.nextSubtopicId}`);
    } else {
      // Không có subtopic tiếp theo - kiểm tra điều kiện làm test
      console.log("📝 No next subtopic, checking test conditions");
      
      if (isAllSubtopicsCompleted) {
        // Tất cả subtopics đã hoàn thành - cho phép làm test
        console.log("✅ All subtopics completed, navigating to test");
        const topicId = subtopicInfo?.topicId;
        if (topicId) {
          router.push(`/test-start?topicId=${topicId}`);
        } else {
          router.push('/homepage');
        }
      } else {
        // Chưa hoàn thành tất cả subtopics - về homepage
        console.log("❌ Not all subtopics completed, going to homepage");
        router.push('/homepage');
      }
    }
  };

  const handleCompletionClose = () => {
    setShowCompletionModal(false);
  };

  // Mark flashcard as completed
  const markFlashcardCompleted = (flashcardId: number) => {
    const newCompleted = [...completedFlashcards, flashcardId];
    setCompletedFlashcards(newCompleted);
    saveProgress(newCompleted);
  };

  // Mark practice as completed
  const markPracticeCompleted = () => {
    const currentStep = timeline[timelinePos];
    if (currentStep?.type === "practice" && currentStep.start !== undefined && currentStep.end !== undefined) {
      const practiceKey = `${currentStep.start}-${currentStep.end}`;
      setCompletedPractices(prev => new Set([...prev, practiceKey]));
      console.log("✅ Practice marked as completed:", practiceKey);
    }
    saveProgress(completedFlashcards, true);
  };

  // Handle user choice in transition popup
  const handleUserChoice = (choice: 'continue' | 'review') => {
    saveProgress(completedFlashcards, false, choice);
  };

  // Check if current step is last flashcard
  const isLastFlashcard = () => {
    const currentStep = timeline[timelinePos];
    return currentStep?.type === "flashcard" && currentStep.index === flashcards.length - 1;
  };

  // Check if current step is last practice - Sửa lại logic
  const isLastPractice = () => {
    const currentStep = timeline[timelinePos];
    console.log("🔍 isLastPractice called:");
    console.log("  - currentStep:", currentStep);
    console.log("  - timelinePos:", timelinePos);
    console.log("  - timeline length:", timeline.length);
    
    if (currentStep?.type !== "practice") {
      console.log("  - Not a practice step, returning false");
      return false;
    }
    
    // Kiểm tra xem có practice step nào chưa hoàn thành sau step hiện tại không
    for (let i = timelinePos + 1; i < timeline.length; i++) {
      console.log(`  - Checking step ${i}:`, timeline[i]);
      if (timeline[i].type === "practice") {
        // Kiểm tra xem practice này đã hoàn thành chưa
        const practiceKey = `${timeline[i].start}-${timeline[i].end}`;
        if (!completedPractices.has(practiceKey)) {
          console.log("  - Found uncompleted practice step, returning false");
          return false; // Còn practice step chưa hoàn thành
        } else {
          console.log("  - Found completed practice step, continuing search");
        }
      }
    }
    console.log("  - No more uncompleted practice steps found, returning true");
    return true; // Đây là practice step cuối cùng chưa hoàn thành
  };

  // Get current step info
  const getCurrentStep = () => {
    return timeline[timelinePos];
  };

  // Get practice cards for current step
  const getPracticeCards = () => {
    const currentStep = timeline[timelinePos];
    if (currentStep?.type === "practice" && currentStep.start !== undefined && currentStep.end !== undefined) {
      return flashcards.slice(currentStep.start, currentStep.end);
    }
    return [];
  };

  // Get practice cards for upcoming practice step (for modal)
  const getUpcomingPracticeCards = () => {
    const currentStep = timeline[timelinePos];
    console.log("🔍 getUpcomingPracticeCards called:");
    console.log("  - currentStep:", currentStep);
    console.log("  - timelinePos:", timelinePos);
    console.log("  - timeline length:", timeline.length);
    
    if (currentStep?.type === "flashcard") {
      // Tìm practice step tiếp theo
      const nextStepIndex = timelinePos + 1;
      const nextStep = timeline[nextStepIndex];
      console.log("  - nextStepIndex:", nextStepIndex);
      console.log("  - nextStep:", nextStep);
      
      if (nextStep?.type === "practice" && nextStep.start !== undefined && nextStep.end !== undefined) {
        const practiceCards = flashcards.slice(nextStep.start, nextStep.end);
        console.log("  - practiceCards found:", practiceCards.length, "cards");
        console.log("  - start:", nextStep.start, "end:", nextStep.end);
        return practiceCards;
      }
    }
    console.log("  - No practice cards found");
    return [];
  };

  // Check if flashcard is completed
  const isFlashcardCompleted = (flashcardId: number) => {
    return completedFlashcards.includes(flashcardId);
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    if (flashcards.length === 0) return 0;
    return Math.round((completedFlashcards.length * 100) / flashcards.length);
  };

  // Get current group size for practice transition modal
  const getCurrentGroupSize = () => {
    const currentStep = timeline[timelinePos];
    if (currentStep?.type === "flashcard" && currentStep.index !== undefined) {
      // Tìm số lượng flashcard trong nhóm hiện tại
      let groupSize = 0;
      for (let i = timelinePos; i >= 0; i--) {
        if (timeline[i].type === "flashcard") {
          groupSize++;
        } else if (timeline[i].type === "practice") {
          break;
        }
      }
      return groupSize;
    }
    return 0;
  };

  // Check if practice button should be shown
  const shouldShowPracticeButton = () => {
    const currentStep = timeline[timelinePos];
    console.log("🔍 shouldShowPracticeButton called:");
    console.log("  - currentStep:", currentStep);
    console.log("  - timelinePos:", timelinePos);
    
    if (currentStep?.type === "flashcard") {
      // Kiểm tra xem có practice step tiếp theo không
      const nextStepIndex = timelinePos + 1;
      const nextStep = timeline[nextStepIndex];
      console.log("  - nextStepIndex:", nextStepIndex);
      console.log("  - nextStep:", nextStep);
      
      if (nextStep?.type === "practice" && nextStep.start !== undefined && nextStep.end !== undefined) {
        // Kiểm tra xem practice này đã hoàn thành chưa
        const practiceKey = `${nextStep.start}-${nextStep.end}`;
        const isCompleted = completedPractices.has(practiceKey);
        console.log("  - practiceKey:", practiceKey);
        console.log("  - isCompleted:", isCompleted);
        console.log("  - shouldShow:", !isCompleted);
        return !isCompleted; // Chỉ hiển thị nếu chưa hoàn thành
      }
    }
    console.log("  - Not a flashcard step or no practice next, shouldShow: false");
    return false;
  };

  // Kiểm tra xem tất cả subtopics trong topic đã hoàn thành chưa
  const checkAllSubtopicsCompleted = async () => {
    try {
      if (!subtopicInfo?.topicId) return false;
      
      // Gọi API để lấy tất cả subtopics trong topic này
      const response = await fetch(`${API_BASE_URL}/flashcards/topic/${subtopicInfo.topicId}/subtopics`);
      if (response.ok) {
        const subtopics = await response.json();
        
        // Lấy progress của user cho topic này
        const userProgress = await FlashcardService.getUserProgress(userId);
        
        // Kiểm tra xem tất cả subtopics đã hoàn thành chưa
        const allCompleted = subtopics.every((subtopic: any) => 
          userProgress.completedSubtopicIds.includes(subtopic.id)
        );
        
        return allCompleted;
      }
    } catch (error) {
      console.warn('Failed to check all subtopics completion:', error);
    }
    return false;
  };

  const [isAllSubtopicsCompleted, setIsAllSubtopicsCompleted] = useState(false);

  // Kiểm tra khi subtopicInfo thay đổi
  useEffect(() => {
    const checkCompletion = async () => {
      const completed = await checkAllSubtopicsCompleted();
      setIsAllSubtopicsCompleted(completed);
    };
    
    if (subtopicInfo?.topicId) {
      checkCompletion();
    }
  }, [subtopicInfo?.topicId, userId]);

  return {
    // State
    flashcards,
    isLoading,
    subtopicInfo,
    nextSubtopicInfo,
    timeline,
    timelinePos,
    showCompletionPopup,
    showTransitionPopup,
    showPracticeTransitionModal,
    showCompletionModal,
    userProgress,
    completedFlashcards,
    completedPractices,
    
    // Actions
    setShowCompletionPopup,
    setShowTransitionPopup,
    setShowPracticeTransitionModal,
    setShowCompletionModal,
    nextStep,
    prevStep,
    resetTimeline,
    handlePracticeTransitionContinue,
    handlePracticeTransitionReview,
    handlePracticeTransitionClose,
    markFlashcardCompleted,
    markPracticeCompleted,
    handleUserChoice,
    
    // Computed values
    isLastFlashcard,
    isLastPractice,
    getCurrentStep,
    getPracticeCards,
    getUpcomingPracticeCards,
    isFlashcardCompleted,
    getProgressPercentage,
    getCurrentGroupSize,
    shouldShowPracticeButton,
    totalCards: flashcards.length,
    
    // Completion popup actions
    handleCompletionRetry,
    handleCompletionNext,
    handleCompletionClose,
    isAllSubtopicsCompleted,
  };
} 