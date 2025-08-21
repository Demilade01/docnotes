# DocNotes
Professional audio note-taking for therapists. Record, transcribe, and manage client session notes with AI-powered speech recognition.

Live demo at [Vercel](https://docnotes-ashen.vercel.app/)

## Features
- **Audio Recording**: Browser-based recording with automatic silence detection
- **AI Transcription**: OpenAI Whisper integration for accurate speech-to-text
- **Session Management**: Organize and manage client session notes
- **Professional UI**: Clean, accessible interface designed for therapists

## Tech Stack
- [NextJS](https://nextjs.org/) with [TailwindCSS](https://tailwindcss.com/)
- [OpenAI API](https://platform.openai.com/) for speech recognition
- [Zustand State Management](https://zustand-demo.pmnd.rs/) for state persistence
- [Lucide Icons](https://lucide.dev/) for consistent iconography

## Getting Started

Install dependencies.

Rename `.env.example` to `.env.local` and add your OpenAI API secret key.

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
