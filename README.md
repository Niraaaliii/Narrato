<div align="center">

# 🎤 Narrato AI

**Transform your presentations into engaging AI-powered audio narrations**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://narrato-ai.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **Multi-format Support** | Upload PPTX, DOCX, or TXT files |
| 🎯 **Smart Audience Targeting** | Choose from Students, Executives, Technical, or Layperson |
| 🤖 **AI Content Rewriting** | Google Gemini transforms content for your specific audience |
| 🔊 **High-Quality TTS** | Deepgram Aura generates natural-sounding narration |
| ⚡ **Real-time Processing** | Streaming response shows slides as they're generated |
| 🎨 **Modern UI** | Glassmorphism design with responsive mobile layout |
| 🌐 **Production Ready** | Deployed on Vercel with serverless functions |

---

## 🚀 Quick Start

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

> 🔐 **Never commit your `.env` file!** It's already in `.gitignore`.

---

## 🏗️ Project Structure

```
Narrato/
├── 📁 api/                     # Backend API (Vercel Serverless)
│   ├── index.js               # Express server with ES modules
│   └── .env                   # API keys (gitignored)
├── 📁 src/                     # Frontend React app
│   ├── App.jsx                # Main application
│   ├── App.css                # Styles
│   ├── main.jsx               # Entry point
│   └── assets/                # Static assets
├── 📁 public/                  # Public assets
├── 📁 test/                    # Test files & samples
├── 📄 index.html               # HTML template
├── 📄 package.json             # Dependencies
├── 📄 vite.config.js           # Vite configuration
├── 📄 vercel.json              # Vercel deployment config
└── 📄 eslint.config.js         # ESLint rules
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool & dev server
- **ESLint** - Code linting

### Backend
- **Express 5** - Web framework (ES modules)
- **Multer** - File upload handling
- **Mammoth** - DOCX text extraction
- **JSZip** - PPTX text extraction

### AI & APIs
- **Google Gemini 1.5 Flash** - Content rewriting
- **Deepgram Aura** - Text-to-speech

### Deployment
- **Vercel** - Hosting & serverless functions

---

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (frontend only) |
| `npm start` | Start Express API server (backend only) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run vercel-build` | Build command for Vercel |

---

## 🚢 Deployment

This project is optimized for **Vercel** deployment:

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

> 📖 See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📸 Screenshots

<div align="center">

| Upload Interface | Presentation Player |
|:----------------:|:-------------------:|
| *Upload your document* | *View slides with audio* |

</div>

---

## 📋 Documentation

| Document | Description |
|----------|-------------|
| [MVP Requirements](./MVP%20Requirement%20Document%20for%20AI%20Presentator%20Projec.md) | Original project requirements & features |
| [Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md) | Step-by-step Vercel deployment |
| [Improvements & Roadmap](./IMPROVEMENTS_AND_NEW_FEATURES.md) | Future features & enhancement ideas |

---

## ⚠️ Known Limitations

- **5 slide limit** per presentation (rate limit protection)
- **PDF not supported** yet (DOCX, PPTX, TXT only)
- **No persistent storage** (refresh clears data)
- **English only** (multi-language support planned)

---

## 🗺️ Roadmap

- [x] MVP with PPTX, DOCX, TXT support
- [x] Vercel deployment with serverless functions
- [x] ES modules architecture
- [ ] PDF support
- [ ] Audio download feature
- [ ] Voice selection
- [ ] Auto-play mode
- [ ] User authentication
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using React, Vite, and AI**

[Live Demo](https://narrato-ai.vercel.app) • [Report Bug](../../issues) • [Request Feature](../../issues)

</div>
