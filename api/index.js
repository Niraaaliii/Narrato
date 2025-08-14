const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth'); // For .docx
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@deepgram/sdk');
require('dotenv').config();

const app = express();

// Configure CORS for Vercel
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://narrato-ai.vercel.app', 'https://narrato-ai-git-main-niraaaliii.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Configure multer for Vercel serverless
const upload = multer({ 
  dest: '/tmp/uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Google Gemini API setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Deepgram API setup (v3 format)
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// Rate limiting for Gemini API
let requestCount = 0;
const MAX_REQUESTS_PER_MINUTE = 10;
let resetTime = Date.now() + 60000;

// Helper function to check rate limit
function checkRateLimit() {
    const now = Date.now();
    if (now > resetTime) {
        requestCount = 0;
        resetTime = now + 60000;
    }
    
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
        const waitTime = Math.ceil((resetTime - now) / 1000);
        throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds before trying again.`);
    }
    
    requestCount++;
}

// Helper function to extract text from PPTX
async function extractTextFromPPTX(filePath) {
    try {
        const JSZip = require('jszip');
        const zip = new JSZip();
        const data = fs.readFileSync(filePath);
        const zipContent = await zip.loadAsync(data);
        
        const slideTexts = [];
        const slideFiles = Object.keys(zipContent.files).filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'));
        
        for (const slideFile of slideFiles) {
            const slideXml = await zipContent.files[slideFile].async('text');
            const textMatches = slideXml.match(/<a:t[^>]*>(.*?)<\/a:t>/g);
            if (textMatches) {
                const slideText = textMatches.map(match => match.replace(/<a:t[^>]*>(.*?)<\/a:t>/, '$1')).join(' ');
                if (slideText.trim()) {
                    slideTexts.push(slideText.trim());
                }
            }
        }
        
        return slideTexts;
    } catch (error) {
        console.error('Error extracting text from PPTX:', error);
        throw error;
    }
}

// Fallback text processing without AI
function processTextWithoutAI(slideText, audience) {
    // Simple fallback that adds audience-appropriate prefixes
    const prefixes = {
        'Students': 'For students, ',
        'Executives': 'For executives, ',
        'Technical': 'From a technical perspective, ',
        'Layperson': 'In simple terms, '
    };
    
    const prefix = prefixes[audience] || '';
    const sentences = slideText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Take first 2-3 sentences and add prefix
    const processed = sentences.slice(0, 2).join('. ') + '.';
    return prefix + processed;
}

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Narrato API is running!' });
});

// Main narration endpoint
app.post('/narrate', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    const { audience } = req.body;
    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

    try {
        let extractedSlides = [];

        if (fileExtension === 'docx') {
            const result = await mammoth.extractRawText({ path: filePath });
            const fullText = result.value;
            // Split document into paragraphs for processing as "slides"
            extractedSlides = fullText.split(/\n\n+/).filter(text => text.trim().length > 0);
        } else if (fileExtension === 'pptx') {
            extractedSlides = await extractTextFromPPTX(filePath);
        } else if (fileExtension === 'txt') {
            const fullText = fs.readFileSync(filePath, 'utf8');
            extractedSlides = fullText.split(/\n\n+/).filter(text => text.trim().length > 0);
        }
        else {
            return res.status(400).json({ success: false, error: 'Unsupported file type. Please upload .docx, .pptx, or .txt files.' });
        }

        if (extractedSlides.length === 0) {
            return res.status(400).json({ success: false, error: 'No text content found in the uploaded file.' });
        }

        // Limit processing to first 5 slides to avoid rate limits
        const slidesToProcess = extractedSlides.slice(0, 5);
        const processedSlides = [];
        
        for (let i = 0; i < slidesToProcess.length; i++) {
            const slideText = slidesToProcess[i];
            let rewrittenText;
            let usedFallback = false;
            
            try {
                checkRateLimit();
                
                // LLM-Powered Content Customization
                const prompt = `You are an expert presentation coach and content strategist. Transform the following slide content into a compelling, audience-specific narrative that captures key insights and actionable takeaways. 

Requirements:
- Create a concise 2-3 sentence summary that highlights the most important points
- Use language and tone appropriate for ${audience} audience
- Include specific examples or analogies when helpful
- Focus on clarity and memorability
- Make it sound natural and conversational, not robotic
- If the slide has data or statistics, emphasize the key insight or implication
- If the slide has a process or concept, explain the "why" behind it

Slide content: ${slideText}

Transform this into an engaging narrative:`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                rewrittenText = response.text().trim();
                
            } catch (aiError) {
                console.warn('AI processing failed, using fallback:', aiError.message);
                // Use fallback processing when AI fails
                rewrittenText = processTextWithoutAI(slideText, audience);
                usedFallback = true;
            }
            
            // Text-to-Speech Conversion with Deepgram v3
            const { result: ttsResult, error } = await deepgram.speak.request(
                { text: rewrittenText },
                {
                    model: "aura-asteria-en",
                    encoding: "linear16",
                    container: "wav"
                }
            );

            if (error) {
                throw new Error(`Deepgram TTS error: ${error}`);
            }

            const audioBuffer = await ttsResult.arrayBuffer();
            const audioData = Buffer.from(audioBuffer);
            const audioBase64 = audioData.toString('base64');

            processedSlides.push({
                slideNumber: i + 1,
                originalText: slideText,
                rewrittenText: rewrittenText,
                audioBase64: audioBase64,
                audioMimeType: 'audio/wav',
                usedFallback: usedFallback
            });
        }

        res.json({
            success: true,
            slides: processedSlides,
            totalSlides: processedSlides.length,
            totalOriginalSlides: extractedSlides.length,
            note: processedSlides.length < extractedSlides.length ? 
                `Showing first ${processedSlides.length} of ${extractedSlides.length} slides due to rate limits.` : null
        });

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error processing file'
        });
    } finally {
        // Clean up uploaded file
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting uploaded file:', err);
        });
    }
});

// Export for Vercel serverless function
module.exports = app;
