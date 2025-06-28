import { useState, useEffect } from 'react';
import { FlashcardService, type Flashcard, type TimelineStep, type ProgressRequest, type ProgressResponse } from '@/app/services/flashcard.service';

interface SubtopicInfo {
  id: number;
  subTopicName: string;
  topicName: string;
  status: string;
}

export function useFlashcardLogic(subtopicId: string, userId: string = 'default-user') {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subtopicInfo, setSubtopicInfo] = useState<SubtopicInfo | null>(null);
  const [timeline, setTimeline] = useState<TimelineStep[]>([]);
  const [timelinePos, setTimelinePos] = useState(0);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [showTransitionPopup, setShowTransitionPopup] = useState(false);
  const [showPracticeTransitionModal, setShowPracticeTransitionModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [userProgress, setUserProgress] = useState<ProgressResponse | null>(null);
  const [completedFlashcards, setCompletedFlashcards] = useState<number[]>([]);

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

  // Load user progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await FlashcardService.getProgress(subtopicId);
        setUserProgress(progress);
        setCompletedFlashcards(progress.completedFlashcards);
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
        
        // Thêm practice cho nhóm vừa thêm (chỉ khi có ít nhất 2 flashcard)
        if (currentGroupSize >= 2) {
          console.log(`    - Adding practice for cards ${groupStart} to ${currentIndex}`);
          fallbackTimeline.push({ type: "practice", start: groupStart, end: currentIndex });
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
  }, [subtopicId, flashcards.length]);

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
    try {
      const progressRequest: ProgressRequest = {
        completedFlashcards: newCompletedFlashcards,
        completedPractice,
        userChoice,
        userId
      };

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
          console.log("  - Next step is practice, showing modal");
          setShowPracticeTransitionModal(true);
        } else {
          console.log("  - No next flashcard or practice found, going to next step");
          setTimelinePos((prev) => Math.min(prev + 1, timeline.length - 1));
        }
      }
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
    
    if (currentStep?.type === "flashcard") {
      // Nếu đang ở flashcard, kiểm tra xem có phải flashcard đầu tiên trong nhóm không
      const currentIndex = currentStep.index || 0;
      
      // Tìm flashcard trước đó trong cùng nhóm
      let prevFlashcardIndex = -1;
      for (let i = timelinePos - 1; i >= 0; i--) {
        if (timeline[i].type === "flashcard") {
          const stepIndex = timeline[i].index || 0;
          if (stepIndex < currentIndex) {
            prevFlashcardIndex = stepIndex;
            break;
          }
        } else if (timeline[i].type === "practice") {
          // Nếu gặp practice step, dừng tìm kiếm
          break;
        }
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
        // Nếu không có flashcard trước đó, quay về step trước đó
        console.log("  - No previous flashcard found, going to previous step");
        setTimelinePos((prev) => Math.max(prev - 1, 0));
      }
    } else {
      // Nếu không phải flashcard, quay về step trước đó
      console.log("  - Not a flashcard step, going to previous step");
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
    setShowCompletionModal(false);
    // TODO: Navigate to next subtopic
    console.log("Navigate to next subtopic");
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
    
    // Kiểm tra xem có practice step nào sau step hiện tại không
    for (let i = timelinePos + 1; i < timeline.length; i++) {
      console.log(`  - Checking step ${i}:`, timeline[i]);
      if (timeline[i].type === "practice") {
        console.log("  - Found another practice step, returning false");
        return false; // Còn practice step khác
      }
    }
    console.log("  - No more practice steps found, returning true");
    return true; // Đây là practice step cuối cùng
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
      
      const shouldShow = nextStep?.type === "practice" && nextStep.start !== undefined && nextStep.end !== undefined;
      console.log("  - shouldShow:", shouldShow);
      return shouldShow;
    }
    console.log("  - Not a flashcard step, shouldShow: false");
    return false;
  };

  return {
    // State
    flashcards,
    isLoading,
    subtopicInfo,
    timeline,
    timelinePos,
    showCompletionPopup,
    showTransitionPopup,
    showPracticeTransitionModal,
    showCompletionModal,
    userProgress,
    completedFlashcards,
    
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
  };
} 