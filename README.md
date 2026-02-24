# Narrato AI

Transform your presentations into engaging AI-powered audio narrations tailored for any audience.

[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?style=flat&logo=vercel)](https://narrato-ai.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat&logo=express)](https://expressjs.com)

## Overview

Narrato AI is an intelligent presentation tool that converts uploaded documents into audience-specific audio narrations. Upload a PPTX, DOCX, or TXT file, select your target audience, and let AI generate tailored narration with high-quality text-to-speech.

## Features

- **Multi-format Support** - Upload PPTX, DOCX, or TXT files
- **Smart Audience Targeting** - Choose from Students, Executives, Technical, or Layperson
- **AI Content Rewriting** - Google Gemini transforms content for your specific audience
- **High-Quality TTS** - Deepgram Aura generates natural-sounding narration
- **Real-time Processing** - Streaming response shows slides as they're generated
- **Modern UI** - Responsive glassmorphism design
- **Production Ready** - Deployed on Vercel with serverless functions

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key
- Deepgram API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Niraaaliii/Narrato.git
cd Narrato

# Install dependencies
npm install

# Set up environment variables
cp api/.env.example api/.env
# Edit api/.env and add your API keys

# Start development server
npm run dev
```

### Environment Variables

Create `api/.env` with the following:

```env
GEMINI_API_KEY=your_google_gemini_key_here
DEEPGRAM_API_KEY=your_deepgram_key_here
```

**Never commit your `.env` file.** It is already in `.gitignore`.

## Project Structure

```
Narrato/
├── api/                     # Backend API (Vercel Serverless)
│   ├── index.js            # Express server
│   └── .env                # API keys (gitignored)
├── src/                     # Frontend React app
│   ├── App.jsx             # Main application
│   ├── App.css             # Styles
│   ├── main.jsx            # Entry point
│   └── assets/             # Static assets
├── public/                  # Public assets
├── test/                    # Test files
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel deployment config
└── eslint.config.js         # ESLint rules
```

## Tech Stack

### Frontend
- React 19 - UI library
- Vite 7 - Build tool
- ESLint - Code linting

### Backend
- Express 5 - Web framework
- Multer - File upload handling
- Mammoth - DOCX text extraction
- JSZip - PPTX text extraction

### AI & APIs
- Google Gemini 1.5 Flash - Content rewriting
- Deepgram Aura - Text-to-speech

### Deployment
- Vercel - Hosting & serverless functions

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm start` | Start Express API server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Deployment

This project is optimized for Vercel deployment:

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.

## Documentation

| Document | Description |
|----------|-------------|
| [MVP Requirements](./MVP%20Requirement%20Document%20for%20AI%20Presentator%20Projec.md) | Original project requirements |
| [Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md) | Step-by-step Vercel deployment |
| [Improvements & Roadmap](./IMPROVEMENTS_AND_NEW_FEATURES.md) | Future features & enhancements |

## License

MIT License - see the [LICENSE](./LICENSE) file for details.

---

Built with React, Vite, and AI.

[Live Demo](https://narrato-ai.vercel.app)
