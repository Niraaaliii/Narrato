const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth'); // For .docx
const OpenAI = require('openai');
const { Deepgram } = require('@deepgram/sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// OpenAI API setup
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Deepgram API setup
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

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

app.get('/', (req, res) => {
    res.send('Narrato Backend is running!');
});

app.post('/narrate', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
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
        } else {
            return res.status(400).send('Unsupported file type. Please upload .docx or .pptx files.');
        }

        if (extractedSlides.length === 0) {
            return res.status(400).send('No text content found in the uploaded file.');
        }

        // Process each slide with OpenAI
        const processedSlides = [];
        
        for (let i = 0; i < extractedSlides.length; i++) {
            const slideText = extractedSlides[i];
            
            // LLM-Powered Content Customization
            const prompt = `You are a professional presenter. Rewrite the following slide content for a ${audience} audience, making it engaging, clear, and concise. Keep it to 2-3 sentences.

Slide content: ${slideText}

Rewritten content:`;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful assistant that rewrites presentation content for specific audiences." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 150
            });

            const rewrittenText = completion.choices[0].message.content.trim();
            
            // Text-to-Speech Conversion with Deepgram
            const ttsResult = await deepgram.speak.request(
                { text: rewrittenText },
                {
                    model: "aura-asteria-en",
                    encoding: "linear16",
                    container: "wav"
                }
            );

            const audioBuffer = await ttsResult.getStream();
            const audioData = Buffer.from(await audioBuffer.arrayBuffer());
            const audioBase64 = audioData.toString('base64');

            processedSlides.push({
                slideNumber: i + 1,
                originalText: slideText,
                rewrittenText: rewrittenText,
                audioBase64: audioBase64,
                audioMimeType: 'audio/wav'
            });
        }

        res.json({
            success: true,
            slides: processedSlides,
            totalSlides: processedSlides.length
        });

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({
            success: false,
            error: 'Error processing file: ' + error.message
        });
    } finally {
        // Clean up uploaded file
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting uploaded file:', err);
        });
    }
});

app.listen(port, () => {
    console.log(`Narrato Backend listening at http://localhost:${port}`);
});
