# Project Structure Guide

## Quick Overview

Utes adalah aplikasi web untuk mengetes dengan latihan soal interaktif. Dibangun dengan Next.js 15 App Router, React 19, TypeScript, dan Tailwind CSS.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **State Management**: React Context API

## Directory Structure

```
youtube-learning-companion/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout + QuizProvider
│   │   ├── page.tsx           # Home (/)
│   │   ├── globals.css        # Global styles
│   │   ├── verify/
│   │   │   └── page.tsx       # Video verification
│   │   ├── progress-check/
│   │   │   └── page.tsx       # Progress input
│   │   ├── confirm-topic/
│   │   │   └── page.tsx       # Topic confirmation
│   │   ├── select-level/
│   │   │   └── page.tsx       # Level selection
│   │   ├── quiz/
│   │   │   └── page.tsx       # Multiple choice quiz
│   │   ├── essay/
│   │   │   └── page.tsx       # Essay questions
│   │   └── result/
│   │       └── page.tsx       # Results page
│   ├── components/
│   │   ├── Button.tsx         # Reusable button component
│   │   └── Card.tsx           # Reusable card component
│   ├── context/
│   │   └── QuizContext.tsx    # Global state management
│   └── data/
│       └── mockData.ts        # Mock quiz data
├── public/                     # Static assets
├── .gitignore
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── postcss.config.mjs         # PostCSS configuration
├── package.json               # Dependencies
├── pnpm-lock.yaml            # Lock file
├── README.md                  # Project readme
├── MIGRATION.md              # Migration documentation
├── ROUTING.md                # Routing architecture
└── PROJECT_STRUCTURE.md      # This file
```

## Key Files Explained

### `src/app/layout.tsx`
Root layout yang membungkus semua halaman dengan:
- Font Inter dari Google Fonts
- QuizProvider untuk state management global
- Global styling

### `src/context/QuizContext.tsx`
Context API untuk state management:
- Menyimpan semua state aplikasi
- Accessible dari semua halaman via `useQuiz()` hook
- Fungsi `resetQuiz()` untuk reset state

### `src/components/Button.tsx`
Reusable button component dengan:
- Multiple variants (primary, secondary, outline, danger, nob, legend)
- Icon support
- Disabled state
- Type support (button, submit, reset)

### `src/components/Card.tsx`
Simple card wrapper component untuk konsistensi UI

### `src/data/mockData.ts`
Mock data untuk:
- Video information
- Quiz questions (full & partial)
- Essay questions

## Pages Breakdown

### 1. Home (`/`)
- Input URL video YouTube
- Validasi input
- Navigate ke `/verify`

### 2. Verify (`/verify`)
- Tampilkan preview video
- Tanya status: sudah selesai atau belum
- Route ke `/select-level` atau `/progress-check`

### 3. Progress Check (`/progress-check`)
- Input waktu progress (menit)
- Input topik terakhir
- Navigate ke `/confirm-topic`

### 4. Confirm Topic (`/confirm-topic`)
- Konfirmasi data yang diinput
- Navigate ke `/select-level`

### 5. Select Level (`/select-level`)
- Pilih level Nob (multiple choice)
- Pilih level Legend (essay)
- Navigate ke `/quiz` atau `/essay`

### 6. Quiz (`/quiz`)
- Multiple choice questions
- Instant feedback
- Progress bar
- Navigate ke `/result`

### 7. Essay (`/essay`)
- Essay questions
- AI feedback simulation
- Progress bar
- Navigate ke `/result`

### 8. Result (`/result`)
- Display score
- Options: retry, change level, new video
- Navigate based on selection

## State Flow

```typescript
// Get state and functions
const { 
  inputUrl, 
  setInputUrl,
  score,
  setScore,
  // ... other state
} = useQuiz();

// Use in component
<input 
  value={inputUrl}
  onChange={(e) => setInputUrl(e.target.value)}
/>
```

## Navigation Flow

```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();

// Navigate to page
router.push('/verify');

// Back button
<button onClick={() => router.push('/')}>
  ← Kembali
</button>
```

## Styling Approach

### Tailwind CSS
- Utility-first CSS framework
- Configured in `tailwind.config.ts`
- Custom colors and spacing maintained
- Responsive design with breakpoints

### Color Palette
- **Primary**: Indigo (indigo-600, indigo-700)
- **Nob Level**: Sky (sky-500, sky-600)
- **Legend Level**: Orange/Red gradient
- **Success**: Green (green-500, green-600)
- **Error**: Red (red-500, red-600)
- **Neutral**: Slate (slate-50 to slate-900)

## Development Workflow

### Start Development Server
```bash
pnpm dev
```
Access at http://localhost:3000

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Type Checking
TypeScript automatically checks types during development and build

## Adding New Features

### Add New Page
1. Create folder in `src/app/`
2. Add `page.tsx`
3. Use `useQuiz()` for state
4. Use `useRouter()` for navigation

### Add New Component
1. Create file in `src/components/`
2. Export component
3. Import where needed

### Add New State
1. Add to `QuizContext.tsx`
2. Add to interface
3. Add useState
4. Add to context value
5. Use via `useQuiz()` hook

## Best Practices

### 1. Component Structure
- Keep components small and focused
- Use TypeScript interfaces for props
- Use 'use client' directive for client components

### 2. State Management
- Use Context for global state
- Use local state for component-specific data
- Reset state when needed with `resetQuiz()`

### 3. Navigation
- Always use `useRouter()` from 'next/navigation'
- Provide back buttons for better UX
- Validate state before navigation

### 4. Styling
- Use Tailwind utility classes
- Keep consistent spacing and colors
- Use responsive design (sm:, md:, lg:)

### 5. Type Safety
- Define interfaces for all props
- Use TypeScript strict mode
- Avoid 'any' type when possible

## Performance Considerations

- Each page is code-split automatically
- Shared chunks are optimized by Next.js
- Images should use next/image for optimization
- Lazy load heavy components if needed

## Future Enhancements

Potential features to add:
- Real YouTube API integration
- AI-powered question generation
- User authentication
- Progress tracking/history
- Social sharing
- Multiple language support
- Accessibility improvements
- Dark mode

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
pnpm build
```

### Type Errors
```bash
# Check TypeScript
pnpm tsc --noEmit
```

### Dependency Issues
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Lucide Icons](https://lucide.dev)
