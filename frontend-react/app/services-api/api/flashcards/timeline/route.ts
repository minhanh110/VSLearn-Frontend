import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subtopicId = searchParams.get('subtopicId');
    
    if (!subtopicId) {
      return NextResponse.json({ error: 'subtopicId is required' }, { status: 400 });
    }

    // TODO: Fetch flashcards from database
    // For now, return mock data
    const mockFlashcards = [
      { id: 1, front: { type: "video", content: "/videos/hello.mp4", title: "Hello" }, back: { word: "Xin chào", description: "Greeting" } },
      { id: 2, front: { type: "video", content: "/videos/thankyou.mp4", title: "Thank you" }, back: { word: "Cảm ơn", description: "Expression of gratitude" } },
      { id: 3, front: { type: "video", content: "/videos/goodbye.mp4", title: "Goodbye" }, back: { word: "Tạm biệt", description: "Farewell" } },
    ];

    const totalCards = mockFlashcards.length;
    const practiceInterval = 3; // Cứ 3 flashcard thì có 1 practice

    const timeline = [];
    let i = 0;
    while (i < totalCards) {
      const groupStart = i;
      for (let j = 0; j < practiceInterval && i < totalCards; j++, i++) {
        timeline.push({ type: "flashcard", index: i });
      }
      // Nếu vừa thêm xong 1 nhóm, chèn practice cho nhóm này
      if (i > groupStart) {
        timeline.push({ type: "practice", start: groupStart, end: i });
      }
    }
    // Nếu chưa luyện tập các từ cuối, chèn practice cuối cho đoạn cuối
    if (
      timeline.length === 0 ||
      (timeline[timeline.length - 1].type === "flashcard" && timeline[timeline.length - 1].index !== totalCards - 1)
    ) {
      const lastStep = timeline[timeline.length - 1];
      let lastFlashcardIdx = 0;
      if (timeline.length > 0 && lastStep.type === "flashcard") {
        lastFlashcardIdx = (lastStep as { type: "flashcard", index: number }).index + 1;
      }
      if (lastFlashcardIdx < totalCards) {
        timeline.push({ type: "practice", start: lastFlashcardIdx, end: totalCards });
      }
    }

    return NextResponse.json({
      timeline,
      totalCards,
      practiceInterval
    });

  } catch (error) {
    console.error('Error generating timeline:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 