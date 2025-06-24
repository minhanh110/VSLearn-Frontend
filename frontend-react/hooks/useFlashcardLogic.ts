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

  // Generate timeline
  useEffect(() => {
    const generateTimeline = async () => {
      try {
        const apiTimeline = await FlashcardService.getTimeline(subtopicId);
        if (apiTimeline.length > 0) {
          setTimeline(apiTimeline);
          console.log('📊 Generated timeline:', apiTimeline);
          return;
        }
      } catch (error) {
        console.warn('Timeline API failed, using frontend logic');
      }

      // Fallback: tạo timeline ở frontend
      const totalCards = flashcards.length;
      
      console.log("🔧 Creating frontend timeline:");
      console.log("  - totalCards:", totalCards);
      
      // Logic đơn giản: chia đều thành 3-4 nhóm
      let numGroups = 3; // Bắt đầu với 3 nhóm
      
      if (totalCards <= 9) {
        numGroups = 3;
      } else if (totalCards <= 12) {
        numGroups = 4;
      } else {
        numGroups = 4; // Tối đa 4 nhóm
      }
      
      const groupSize = Math.ceil(totalCards / numGroups);
      
      console.log("  - numGroups:", numGroups);
      console.log("  - groupSize:", groupSize);

      const frontendTimeline: TimelineStep[] = [];
      let i = 0;
      
      // Tạo các nhóm flashcard và practice
      for (let group = 0; group < numGroups; group++) {
        const groupStart = i;
        const remainingCards = totalCards - i;
        
        if (remainingCards <= 0) break;
        
        const currentGroupSize = Math.min(groupSize, remainingCards);
        
        console.log(`  - Group ${group + 1}: taking ${currentGroupSize} cards (${i} to ${i + currentGroupSize - 1})`);
        
        // Thêm flashcards cho nhóm này
        for (let j = 0; j < currentGroupSize; j++) {
          frontendTimeline.push({ type: "flashcard", index: i });
          i++;
        }
        
        // Thêm practice cho nhóm vừa thêm
        console.log(`    - Adding practice for cards ${groupStart} to ${i}`);
        frontendTimeline.push({ type: "practice", start: groupStart, end: i });
      }
      
      console.log("📊 Final frontend timeline:", frontendTimeline);
      console.log(`✅ Total cards covered: ${i}/${totalCards}`);
      
      // Kiểm tra cuối cùng
      if (i !== totalCards) {
        console.error(`❌ ERROR: Expected ${totalCards} cards but got ${i}`);
      }
      
      setTimeline(frontendTimeline);
    };

    if (flashcards.length > 0) {
      generateTimeline();
    }
  }, [subtopicId, flashcards.length]);

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
    setTimelinePos((prev) => Math.min(prev + 1, timeline.length - 1));
  };

  const prevStep = () => {
    setTimelinePos((prev) => Math.max(prev - 1, 0));
  };

  const resetTimeline = () => {
    setTimelinePos(0);
  };

  const goToPractice = () => {
    // Debug log để kiểm tra timeline
    console.log("🔍 goToPractice called");
    console.log("  - timeline:", timeline);
    console.log("  - timeline.length:", timeline.length);
    
    // Tìm practice step cuối cùng
    let lastPracticeIndex = -1;
    for (let i = timeline.length - 1; i >= 0; i--) {
      if (timeline[i].type === "practice") {
        lastPracticeIndex = i;
        break;
      }
    }
    
    if (lastPracticeIndex !== -1) {
      console.log("  - Found last practice at index:", lastPracticeIndex);
      setTimelinePos(lastPracticeIndex);
    } else {
      console.log("  - No practice found, staying at current position");
    }
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

  // Check if current step is last practice
  const isLastPractice = () => {
    return timelinePos === timeline.length - 1;
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

  // Check if flashcard is completed
  const isFlashcardCompleted = (flashcardId: number) => {
    return completedFlashcards.includes(flashcardId);
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    if (flashcards.length === 0) return 0;
    return Math.round((completedFlashcards.length * 100) / flashcards.length);
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
    userProgress,
    completedFlashcards,
    
    // Actions
    setShowCompletionPopup,
    setShowTransitionPopup,
    nextStep,
    prevStep,
    resetTimeline,
    goToPractice,
    markFlashcardCompleted,
    markPracticeCompleted,
    handleUserChoice,
    
    // Computed values
    isLastFlashcard,
    isLastPractice,
    getCurrentStep,
    getPracticeCards,
    isFlashcardCompleted,
    getProgressPercentage,
    totalCards: flashcards.length,
  };
} 