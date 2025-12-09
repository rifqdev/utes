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

export interface EssayQuestion {
  id: number;
  question: string;
  referenceContext: string; // Konteks spesifik dari transkrip untuk pertanyaan ini
  keyPoints: string[]; // Poin-poin kunci yang harus ada dalam jawaban
}

// Helper: Parse OpenAI JSON response
function parseOpenAIResponse(content: string | null): any {
  if (!content) {
    throw new Error('No response from OpenAI');
  }
  const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleanContent);
}

// Helper: Call OpenAI API with standard configuration
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.7
): Promise<any> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
  });
  return parseOpenAIResponse(completion.choices[0].message.content);
}

// Helper: Add IDs to questions array
function addQuestionIds<T>(questions: T[]): (T & { id: number })[] {
  return questions.map((q, index) => ({ ...q, id: index + 1 }));
}

export async function generateQuizFromTranscript(
  transcript: string,
  numberOfQuestions: number = QUIZ_DEFAULTS.NUMBER_OF_QUESTIONS
): Promise<QuizQuestion[]> {
  try {
    const userPrompt = `Kamu adalah seorang guru yang ahli dalam membuat soal latihan. Berdasarkan transkrip video berikut, buatlah ${numberOfQuestions} soal pilihan ganda untuk menguji pemahaman siswa.

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

    const systemPrompt = 'Kamu adalah asisten yang membuat soal latihan dalam format JSON. Selalu respond dengan valid JSON array saja.';
    const questions = await callOpenAI(systemPrompt, userPrompt, 0.7);
    return addQuestionIds(questions);
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Gagal membuat soal latihan. Silakan coba lagi.');
  }
}

export async function generateEssayFromTranscript(
  transcript: string,
  numberOfQuestions: number = QUIZ_DEFAULTS.ESSAY_QUESTIONS
): Promise<EssayQuestion[]> {
  try {
    const userPrompt = `Kamu adalah seorang guru yang ahli dalam membuat soal essay. Berdasarkan transkrip video berikut, buatlah ${numberOfQuestions} soal essay untuk menguji pemahaman mendalam siswa.

Transkrip:
${transcript}

Instruksi:
- Buat ${numberOfQuestions} soal essay yang menguji pemahaman konsep secara mendalam
- Untuk setiap soal, sertakan:
  1. Pertanyaan essay yang memerlukan penjelasan detail
  2. Konteks referensi spesifik dari transkrip (kutipan atau ringkasan bagian yang relevan)
  3. Poin-poin kunci yang harus ada dalam jawaban yang baik (3-5 poin)
- Soal harus mendorong siswa untuk menjelaskan, menganalisis, atau menghubungkan konsep
- Referensi konteks harus cukup spesifik agar AI bisa menilai jawaban tanpa membaca full transkrip

Format output harus dalam JSON array dengan struktur:
[
  {
    "question": "Pertanyaan essay yang mendalam",
    "referenceContext": "Kutipan atau ringkasan bagian transkrip yang relevan untuk pertanyaan ini",
    "keyPoints": [
      "Poin kunci 1 yang harus ada dalam jawaban",
      "Poin kunci 2 yang harus ada dalam jawaban",
      "Poin kunci 3 yang harus ada dalam jawaban"
    ]
  }
]

Berikan HANYA JSON array tanpa penjelasan tambahan.`;

    const systemPrompt = 'Kamu adalah asisten yang membuat soal essay dalam format JSON. Selalu respond dengan valid JSON array saja.';
    const questions = await callOpenAI(systemPrompt, userPrompt, 0.7);
    return addQuestionIds(questions);
  } catch (error) {
    console.error('Error generating essay questions:', error);
    throw new Error('Gagal membuat soal essay. Silakan coba lagi.');
  }
}

export async function analyzeEssayAnswer(
  question: string,
  referenceContext: string,
  keyPoints: string[],
  userAnswer: string
): Promise<{ score: number; feedback: string; analysis: string }> {
  try {
    const userPrompt = `Kamu adalah seorang guru yang menilai jawaban essay siswa. Analisis jawaban berikut berdasarkan konteks dan poin kunci yang diberikan.

Pertanyaan:
${question}

Konteks Referensi:
${referenceContext}

Poin Kunci yang Harus Ada:
${keyPoints.map((point, idx) => `${idx + 1}. ${point}`).join('\n')}

Jawaban Siswa:
${userAnswer}

Instruksi:
- Berikan skor dari 0-100 berdasarkan:
  * Kelengkapan (apakah semua poin kunci tercakup)
  * Keakuratan (apakah penjelasan sesuai dengan konteks)
  * Kedalaman pemahaman (apakah siswa menjelaskan dengan baik)
- Berikan feedback konstruktif dalam bahasa Indonesia
- Berikan analisis singkat tentang kekuatan dan area yang perlu diperbaiki

Format output harus dalam JSON dengan struktur:
{
  "score": 85,
  "feedback": "Feedback konstruktif untuk siswa",
  "analysis": "Analisis singkat tentang jawaban"
}

Berikan HANYA JSON tanpa penjelasan tambahan.`;

    const systemPrompt = 'Kamu adalah asisten yang menilai essay dalam format JSON. Selalu respond dengan valid JSON saja.';
    return await callOpenAI(systemPrompt, userPrompt, 0.5);
  } catch (error) {
    console.error('Error analyzing essay answer:', error);
    throw new Error('Gagal menganalisis jawaban. Silakan coba lagi.');
  }
}
