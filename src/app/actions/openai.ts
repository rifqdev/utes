'use server';

import OpenAI from 'openai';
import { QUIZ_DEFAULTS } from '@/lib/constants';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export async function generateQuizFromTranscript(
  transcript: string,
  numberOfQuestions: number = QUIZ_DEFAULTS.NUMBER_OF_QUESTIONS
): Promise<QuizQuestion[]> {
  try {
    const prompt = `Kamu adalah seorang guru yang ahli dalam membuat soal latihan. Berdasarkan transkrip video berikut, buatlah ${numberOfQuestions} soal pilihan ganda untuk menguji pemahaman siswa.

Transkrip:
${transcript}

Instruksi:
- Buat ${numberOfQuestions} soal pilihan ganda
- Setiap soal harus memiliki ${QUIZ_DEFAULTS.NUMBER_OF_OPTIONS} pilihan jawaban
- Soal harus menguji pemahaman konsep, bukan hanya hafalan
- Soal harus relevan dengan materi di transkrip
- Berikan jawaban yang benar untuk setiap soal

Format output harus dalam JSON array dengan struktur:
[
  {
    "question": "Pertanyaan soal",
    "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
    "correct": 0
  }
]

Catatan: "correct" adalah index jawaban yang benar (0-3).

Berikan HANYA JSON array tanpa penjelasan tambahan.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah asisten yang membuat soal latihan dalam format JSON. Selalu respond dengan valid JSON array saja.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const questions = JSON.parse(cleanContent);

    // Add IDs to questions
    return questions.map((q: any, index: number) => ({
      id: index + 1,
      question: q.question,
      options: q.options,
      correct: q.correct,
    }));
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Gagal membuat soal latihan. Silakan coba lagi.');
  }
}
