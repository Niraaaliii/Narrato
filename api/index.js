import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import JSZip from 'jszip';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@deepgram/sdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// --- API Key Validation ---
if (!process.env.GEMINI_API_KEY || !process.env.DEEPGRAM_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY or DEEPGRAM_API_KEY is not defined in the environment.");
}

const app = express();

// Configure CORS for Vercel
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://narrato-ai.vercel.app', 'https://narrato-ai-git-main-niraaaliii.vercel.app', 'https://narrato-niraaaliii.vercel.app']
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

// Deepgram API setup
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// Rate limiting for Gemini API
let requestCount = 0;
const MAX_REQUESTS_PER_MINUTE = 10;
let resetTime = Date.now() + 60000;

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
    const prefixes = {
        'Students': 'For students, ',
        'Executives': 'For executives, ',
        'Technical': 'From a technical perspective, ',
        'Layperson': 'In simple terms, '
    };

    const prefix = prefixes[audience] || '';
    const sentences = slideText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const processed = sentences.slice(0, 2).join('. ') + '.';
    return prefix + processed;
}

// Health check endpoint
app.get('/api', (req, res) => {
    res.json({ message: 'Narrato API is running!', env: process.env.NODE_ENV || 'development' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main narration endpoint
app.post('/api/narrate', upload.single('file'), (req, res) => {
    // Use a self-executing async function to handle streaming
    (async () => {
        const filePath = req.file ? req.file.path : null;
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, error: 'No file uploaded.' });
            }

            const { audience } = req.body;
            const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

            let extractedSlides = [];
            if (fileExtension === 'docx') {
                const result = await mammoth.extractRawText({ path: filePath });
                extractedSlides = result.value.split(/\n\n+/).filter(text => text.trim().length > 0);
            } else if (fileExtension === 'pptx') {
                extractedSlides = await extractTextFromPPTX(filePath);
            } else if (fileExtension === 'txt') {
                const fullText = fs.readFileSync(filePath, 'utf8');
                extractedSlides = fullText.split(/\n\n+/).filter(text => text.trim().length > 0);
            } else {
                return res.status(400).json({ success: false, error: 'Unsupported file type. Please upload .docx, .pptx, or .txt files.' });
            }

            if (extractedSlides.length === 0) {
                return res.status(400).json({ success: false, error: 'No text content found.' });
            }

            // Set headers for NDJSON streaming
            res.setHeader('Content-Type', 'application/x-ndjson');
            res.setHeader('Transfer-Encoding', 'chunked');

            const slidesToProcess = extractedSlides.slice(0, 5);

            // First, send a metadata object
            const metadata = {
                type: 'metadata',
                success: true,
                totalSlides: slidesToProcess.length,
                totalOriginalSlides: extractedSlides.length,
                note: slidesToProcess.length < extractedSlides.length ?
                    `Showing first ${slidesToProcess.length} of ${extractedSlides.length} slides due to rate limits.` : null
            };
            res.write(JSON.stringify(metadata) + '\n');

            for (let i = 0; i < slidesToProcess.length; i++) {
                const slideText = slidesToProcess[i];
                let rewrittenText;
                let usedFallback = false;

                try {
                    checkRateLimit();
                    const prompt = `You are an expert presentation coach. Transform the following slide content into a compelling, 2-3 sentence narrative for a ${audience} audience. Focus on clarity, key insights, and a conversational tone. Slide content: ${slideText}`;
                    rewrittenText = (await model.generateContent(prompt)).response.text().trim();
                } catch (aiError) {
                    console.warn('AI processing failed, using fallback:', aiError.message);
                    rewrittenText = processTextWithoutAI(slideText, audience);
                    usedFallback = true;
                }

                const { result: ttsResult, error } = await deepgram.speak.request(
                    { text: rewrittenText },
                    { model: "aura-asteria-en", encoding: "linear16", container: "wav" }
                );

                if (error) throw new Error(`Deepgram TTS error: ${error}`);

                const audioBuffer = await ttsResult.arrayBuffer();
                const audioBase64 = Buffer.from(audioBuffer).toString('base64');

                const slideData = {
                    type: 'slide',
                    slide: {
                        slideNumber: i + 1,
                        originalText: slideText,
                        rewrittenText: rewrittenText,
                        audioBase64: audioBase64,
                        audioMimeType: 'audio/wav',
                        usedFallback: usedFallback
                    }
                };

                res.write(JSON.stringify(slideData) + '\n');
            }

            res.end();

        } catch (error) {
            console.error('Error processing file:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: error.message || 'Error processing file'
                });
            } else {
                res.end();
            }
        } finally {
            if (filePath) {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting uploaded file:', err);
                });
            }
        }
    })();
});

// Start the server for local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless function
export default app;
