# DocNotes - AI-Powered Session Notes

A modern web application for therapists to record, transcribe, and manage client session notes using AI-powered speech-to-text technology.

## 🚀 Live Demo

**[View Live Demo](https://docnotes-ashen.vercel.app/)**

## ✨ Features

- **AI-Powered Transcription**: Uses OpenAI Whisper API for accurate speech-to-text conversion
- **Client Management**: View and select from a list of clients
- **Audio Recording**: Browser-based audio recording with mobile-friendly interface
- **Real-time Status**: Clear indicators for recording, processing, and saving states
- **Persistent Storage**: Notes are saved locally and persist after page refresh
- **Modern UI**: Responsive design that works on mobile, tablet, and desktop
- **Accessibility**: Keyboard navigation, screen reader support, and focus management

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (built on Radix UI)
- **State Management**: Zustand
- **Audio Recording**: Browser MediaRecorder API
- **AI Integration**: OpenAI Whisper API
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- OpenAI API key

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd nextjs-openai-whisper-starter
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 5. Open your browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Select a Client**: Choose from the list of available clients
2. **Start Recording**: Click the record button and allow microphone access
3. **Speak Your Notes**: The app will automatically detect speech and start recording
4. **Review & Edit**: After transcription, edit the generated text as needed
5. **Save**: Your notes are automatically saved and will persist after refresh

## 🏗️ Design & Technical Notes

### Component Library Choice: shadcn/ui
- **Rationale**: Chosen for its modern design system, excellent accessibility, and seamless Tailwind integration
- **Speed Benefits**: Pre-built, accessible components eliminate time spent on basic UI elements
- **Consistency**: Ensures uniform design patterns across the application
- **Customization**: Easy to customize while maintaining design system integrity

### Architecture Decisions
- **Next.js App Router**: Leverages the latest Next.js features for better performance and developer experience
- **Zustand State Management**: Lightweight, simple state management perfect for this scope
- **LocalStorage Persistence**: Meets minimum requirements while keeping the app simple and fast
- **Server-side API Integration**: Secure handling of OpenAI API key prevents client-side exposure

### Trade-offs & Considerations
- **LocalStorage Limitation**: Data is client-side only; production would need a database
- **No User Authentication**: Simplified for demo purposes; real app would need auth
- **Single-page Focus**: Concentrated on core functionality rather than extensive features
- **Mobile-first Design**: Prioritized mobile experience while ensuring desktop usability

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
├── lib/                    # Utilities and stores
├── public/                 # Static assets
└── components/ui/          # shadcn/ui components
```

### Key Components
- `RecordPage`: Main recording interface with audio controls
- `ClientSelector`: Client selection dropdown
- `List`: Displays saved transcriptions
- `RecordButton`: Audio recording controls with visual feedback

## 🚀 Deployment

### Vercel Deployment
This project is deployed on **Vercel** for the following reasons:

- **Next.js Integration**: Native support for Next.js with zero configuration
- **Performance**: Global CDN and edge functions for optimal speed
- **Developer Experience**: Automatic deployments from Git, preview deployments
- **Environment Variables**: Secure handling of API keys
- **Analytics**: Built-in performance monitoring and analytics

### Deployment Steps
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

## 🧪 Testing

The application includes comprehensive error handling for:
- Microphone permission denied
- Network connectivity issues
- API rate limiting
- Invalid API keys

## 📱 Responsive Design

- **Mobile**: 360px+ optimized interface
- **Tablet**: Responsive layout adjustments
- **Desktop**: Full-featured desktop experience

## 🔒 Security

- OpenAI API key is handled server-side only
- No sensitive data is exposed to the client
- Secure audio file handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- OpenAI for the Whisper API
- shadcn/ui for the excellent component library
- Vercel for the deployment platform
- Next.js team for the amazing framework
