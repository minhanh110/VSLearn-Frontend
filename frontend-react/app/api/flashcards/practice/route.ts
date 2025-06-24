import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subtopicId = searchParams.get('subtopicId');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    
    if (!subtopicId || !start || !end) {
      return NextResponse.json({ error: 'subtopicId, start, and end are required' }, { status: 400 });
    }

    const startIndex = parseInt(start);
    const endIndex = parseInt(end);

    // TODO: Fetch flashcards from database
    // For now, return mock data
    const mockFlashcards = [
      { id: 1, front: { type: "video", content: "/videos/hello.mp4", title: "Hello" }, back: { word: "Xin chào", description: "Greeting" } },
      { id: 2, front: { type: "video", content: "/videos/thankyou.mp4", title: "Thank you" }, back: { word: "Cảm ơn", description: "Expression of gratitude" } },
      { id: 3, front: { type: "video", content: "/videos/goodbye.mp4", title: "Goodbye" }, back: { word: "Tạm biệt", description: "Farewell" } },
      { id: 4, front: { type: "video", content: "/videos/yes.mp4", title: "Yes" }, back: { word: "Có", description: "Affirmative" } },
      { id: 5, front: { type: "video", content: "/videos/no.mp4", title: "No" }, back: { word: "Không", description: "Negative" } },
    ];

    const practiceCards = mockFlashcards.slice(startIndex, endIndex);
    const allCards = mockFlashcards;

    // Generate practice questions
    const questions = practiceCards.map((card) => {
      const correctOption = {
        text: card.back.word,
      };
      
      // Lấy các card sai (ưu tiên trong đoạn vừa học, nếu thiếu thì lấy toàn bộ)
      let distractorPool = practiceCards.filter(c => c.id !== card.id);
      if (distractorPool.length < 3) {
        distractorPool = distractorPool.concat(
          allCards.filter(c => c.id !== card.id && !distractorPool.some(dc => dc.id === c.id))
        );
      }
      
      const distractorOptions = distractorPool
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(c => ({
          text: c.back.word,
        }));
      
      const options = [correctOption, ...distractorOptions].sort(() => 0.5 - Math.random());
      
      return {
        id: card.id,
        videoUrl: card.front.content,
        imageUrl: card.front.type === "image" ? card.front.content : undefined,
        question: "Đây là từ gì?",
        options,
        correctAnswer: correctOption.text,
      };
    }).sort(() => 0.5 - Math.random()); // random thứ tự câu hỏi

    return NextResponse.json({
      questions,
      totalQuestions: questions.length,
      practiceCards: practiceCards.length
    });

  } catch (error) {
    console.error('Error generating practice questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 