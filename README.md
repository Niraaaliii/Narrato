# Narrato AI Presenter

Narrato is an AI-powered presentation narrator that transforms static presentations into engaging, audience-specific audio experiences. This project demonstrates advanced AI integration, LLM prompting techniques, and real-time text-to-speech capabilities.

## 🚀 Features

- **Multi-format Support**: Upload DOCX and PPTX files
- **AI-Powered Content Adaptation**: Uses GPT-4o-mini to rewrite content for specific audiences
- **Professional Voice Synthesis**: High-quality text-to-speech using Deepgram's Aura models
- **Interactive Player**: Navigate through slides with synchronized audio
- **Audience Customization**: Tailor content for Students, Executives, Technical, or Layperson audiences
- **Real-time Processing**: Instant generation of narrated presentations

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js for REST API
- **OpenAI GPT-4o-mini** for content rewriting and audience adaptation
- **Deepgram** for professional text-to-speech synthesis
- **Mammoth** for DOCX text extraction
- **JSZip** for PPTX text extraction

### Frontend
- **React 19** with Vite for fast development
- **Modern CSS** with responsive design
- **Real-time audio playback** with HTML5 audio controls

## 🎯 AI Capabilities Demonstrated

### 1. Advanced Prompting Techniques
- **Context-aware content rewriting**: Adapts technical content for different audience levels
- **Tone adaptation**: Adjusts language complexity and formality
- **Conciseness optimization**: Transforms verbose slides into engaging 2-3 sentence narrations

### 2. Multi-step AI Pipeline
1. **Content Extraction**: Intelligent parsing of presentation formats
2. **Context Analysis**: Understanding slide structure and key messages
3. **Audience Adaptation**: Dynamic rewriting based on target audience
4. **Voice Synthesis**: Professional-grade audio generation

### 3. Real-time Processing
- **Streaming audio**: Base64-encoded audio delivery
- **Progressive enhancement**: Immediate feedback during processing
- **Error handling**: Robust error recovery and user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- OpenAI API key
- Deepgram API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Niraaaliii/Narrato.git
cd Narrato
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Environment Configuration**
Create a `.env` file in the backend directory:
```bash
# OpenAI API Key (for GPT-4o-mini)
OPENAI_API_KEY=your_openai_api_key_here

# Deepgram API Key (for TTS)
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

5. **Start the Application**
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 📖 Usage Guide

1. **Upload a Presentation**: Select a DOCX or PPTX file
2. **Choose Audience**: Select from Students, Executives, Technical, or Layperson
3. **Generate Narration**: Click "Generate Presentation"
4. **Experience**: Navigate through slides with synchronized audio

## 🔧 API Endpoints

### POST /narrate
Upload a presentation file and receive AI-generated narration.

**Request:**
- `file`: DOCX or PPTX file
- `audience`: Target audience (Students, Executives, Technical, Layperson)

**Response:**
```json
{
  "success": true,
  "slides": [
    {
      "slideNumber": 1,
      "originalText": "Original slide content...",
      "rewrittenText": "AI-optimized narration...",
      "audioBase64": "base64-encoded-audio...",
      "audioMimeType": "audio/wav"
    }
  ],
  "totalSlides": 5
}
```

## 🎯 Demo Scenarios

### Scenario 1: Technical to Layperson
Upload a technical presentation and watch how complex jargon is transformed into accessible language for general audiences.

### Scenario 2: Academic to Executive
See how academic content is adapted for busy executives with concise, action-oriented language.

### Scenario 3: Multi-format Processing
Experience seamless processing of both Word documents and PowerPoint presentations.

## 🏗️ Architecture Highlights

### Scalable Design
- **Modular extraction**: Easy to add new file formats
- **Configurable AI models**: Swap between different LLMs and TTS providers
- **Extensible audience types**: Add new audience profiles easily

### Performance Optimizations
- **Efficient file processing**: Streaming extraction and processing
- **Optimized audio delivery**: Base64 encoding for immediate playback
- **Responsive UI**: Progressive loading and error states

## 🎭 Advanced Prompting Examples

### Content Rewriting Prompt
```
You are a professional presenter. Rewrite the following slide content for a {audience} audience, making it engaging, clear, and concise. Keep it to 2-3 sentences.

Slide content: {content}
```

### Audience Adaptation Logic
- **Students**: Educational tone with examples and explanations
- **Executives**: Concise, action-oriented language with key takeaways
- **Technical**: Precise terminology with technical depth
- **Layperson**: Simplified language with analogies and context

## 🛡️ Error Handling

- **File validation**: Checks for supported formats and non-empty content
- **API resilience**: Graceful handling of API failures with user feedback
- **Content validation**: Ensures meaningful content extraction before processing

## 🚀 Future Enhancements

- **Multi-language support**: Expand to additional languages
- **Voice selection**: Multiple voice options and accents
- **Cloud storage**: Save and share narrated presentations
- **Real-time collaboration**: Multi-user editing and narration
- **Advanced analytics**: Track engagement and comprehension metrics

## 📊 Development Timeline

This project was completed in **48 hours** as a portfolio demonstration of AI integration capabilities.

### Day 1: Foundation
- Backend API setup and file processing
- AI integration with OpenAI and Deepgram
- Basic frontend structure

### Day 2: Polish
- Advanced UI/UX implementation
- Error handling and edge cases
- Performance optimization and testing

## 🤝 Contributing

This is a portfolio project, but suggestions and improvements are welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License - feel free to use this project as a reference for your own AI integrations.
