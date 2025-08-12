# Narrato - AI-Powered Presentation Narrator

Transform your presentations into engaging, audience-specific narrations with AI-powered content customization and text-to-speech capabilities.

## Features

- **Multi-format Support**: Upload .pptx and .docx files
- **Audience Customization**: Tailor content for Students, Executives, Technical, or Layperson audiences
- **AI-Powered Rewriting**: Uses Google Gemini to rewrite content for maximum engagement
- **Text-to-Speech**: Converts rewritten content to natural-sounding audio using Deepgram
- **Rate Limiting**: Built-in safeguards to handle API rate limits gracefully
- **Fallback Processing**: Basic processing when AI services are unavailable
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Google Gemini API key
- Deepgram API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd narrato
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```bash
   cd ../backend
   touch .env
   ```
   
   Add your API keys to the `.env` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   DEEPGRAM_API_KEY=your_deepgram_api_key_here
   ```

5. **Start the backend server**
   ```bash
   npm start
   ```
   The backend will run on http://localhost:3001

6. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## Usage

1. **Upload a file**: Click "Choose File" and select a .pptx or .docx file
2. **Select audience**: Choose your target audience from the dropdown
3. **Generate narration**: Click "Generate Narration" to process your presentation
4. **Listen and navigate**: Use the audio player to listen to each slide, and navigate between slides with Previous/Next buttons

## API Endpoints

### POST /narrate
Upload a presentation file and receive AI-customized narrations.

**Request:**
- `file`: .pptx or .docx file
- `audience`: One of "Students", "Executives", "Technical", or "Layperson"

**Response:**
```json
{
  "success": true,
  "slides": [
    {
      "slideNumber": 1,
      "originalText": "Original slide content...",
      "rewrittenText": "AI-customized narration...",
      "audioBase64": "base64-encoded-audio-data...",
      "audioMimeType": "audio/wav",
      "usedFallback": false
    }
  ],
  "totalSlides": 5,
  "totalOriginalSlides": 12,
  "note": "Showing first 5 of 12 slides due to rate limits."
}
```

## Architecture

### Backend (Node.js/Express)
- **File Processing**: Extracts text from .pptx and .docx files
- **AI Integration**: Google Gemini API for content rewriting
- **Text-to-Speech**: Deepgram API for audio generation
- **Rate Limiting**: Prevents API abuse with built-in limits

### Frontend (React/Vite)
- **File Upload**: Drag-and-drop or click-to-upload interface
- **Audience Selection**: Dropdown for target audience
- **Audio Player**: Built-in audio controls with auto-advance
- **Responsive Design**: Mobile-friendly interface

## Error Handling

The application includes comprehensive error handling:

- **Rate Limiting**: Shows wait time when API limits are reached
- **File Processing**: Handles corrupted or empty files gracefully
- **API Failures**: Falls back to basic processing when AI services fail
- **Network Issues**: Provides clear error messages for connection problems

## Development

### Adding New File Formats

To support additional file formats, extend the file processing logic in `backend/index.js`:

```javascript
// Add new format handler
else if (fileExtension === 'pdf') {
    // Add PDF processing logic
}
```

### Customizing AI Prompts

Modify the prompt in `backend/index.js` to change how content is rewritten:

```javascript
const prompt = `Your custom prompt here...`;
```

### Styling

The application uses CSS modules for styling. Customize the appearance by modifying `frontend/src/App.css`.

## Troubleshooting

### Common Issues

1. **"Rate limit exceeded"**
   - Wait 60 seconds and try again
   - Consider upgrading your API plan

2. **"No text content found"**
   - Ensure your presentation contains actual text (not just images)
   - Check that the file isn't corrupted

3. **Audio not playing**
   - Check browser console for errors
   - Ensure audio format is supported by your browser

4. **File upload fails**
   - Check file size (large files may timeout)
   - Ensure file format is supported

### Debug Mode

Enable detailed logging by setting the environment variable:
```bash
DEBUG=true npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
