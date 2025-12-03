# UTES - Learning Assessment Platform

A web-based interactive learning assessment platform that generates multiple-choice and essay questions to evaluate comprehension of previously studied material.

**UTES** (Universal Testing & Evaluation System) adalah aplikasi web yang dirancang untuk membantu pengguna menguji pemahaman materi pembelajaran melalui latihan soal interaktif berbasis pilihan ganda dan essay.

## Fitur

- 🎯 Dua level tantangan: NOB (pilihan ganda) dan LEGEND (essay)
- 📊 Tracking progress pembelajaran
- 🤖 Analisis AI untuk feedback essay
- 🎨 UI modern dengan Tailwind CSS

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Lucide React Icons

## Instalasi

```bash
# Install dependencies dengan pnpm
pnpm install

# Jalankan development server
pnpm dev

# Build untuk production
pnpm build

# Jalankan production server
pnpm start
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Dokumentasi

- 🏗️ [Project Structure](PROJECT_STRUCTURE.md) - Struktur project dan best practices
- 📝 [Migration Guide](MIGRATION.md) - Dokumentasi migrasi dari Vite ke Next.js

## Struktur Project

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout dengan QuizProvider
│   ├── page.tsx           # Home page (input URL)
│   ├── globals.css        # Global styles
│   ├── verify/
│   │   └── page.tsx       # Verifikasi video
│   ├── progress-check/
│   │   └── page.tsx       # Input progress pembelajaran
│   ├── confirm-topic/
│   │   └── page.tsx       # Konfirmasi topik
│   ├── select-level/
│   │   └── page.tsx       # Pilih level (Nob/Legend)
│   ├── quiz/
│   │   └── page.tsx       # Quiz pilihan ganda
│   ├── essay/
│   │   └── page.tsx       # Essay/uraian
│   └── result/
│       └── page.tsx       # Hasil akhir
├── components/
│   ├── Button.tsx         # Reusable button
│   └── Card.tsx           # Reusable card
├── context/
│   └── QuizContext.tsx    # Global state management
└── data/
    └── mockData.ts        # Mock data
```

## Routing

Aplikasi menggunakan file-based routing Next.js:

- `/` - Input URL video YouTube
- `/verify` - Verifikasi video yang ditemukan
- `/progress-check` - Input progress pembelajaran (jika belum selesai)
- `/confirm-topic` - Konfirmasi topik yang akan diuji
- `/select-level` - Pilih level tantangan (Nob atau Legend)
- `/quiz` - Quiz pilihan ganda (Level Nob)
- `/essay` - Essay/uraian (Level Legend)
- `/result` - Hasil akhir dan opsi retry
