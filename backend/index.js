const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const mammoth = require('mammoth'); // For .docx
const PptxGenJS = require('pptxgenjs'); // For .pptx (will use for text extraction)
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Google Gemini API setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.get('/', (req, res) => {
    res.send('Narrato Backend is running!');
});

app.post('/narrate', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { tone, audience } = req.body;
    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split('.').pop();

    let extractedText = '';

    try {
        if (fileExtension === 'docx') {
            const result = await mammoth.extractRawText({ path: filePath });
            extractedText = result.value;
        } else if (fileExtension === 'pptx') {
            // PPTX text extraction is more complex. For MVP, we'll use a placeholder
            // or a simpler library if available. pptxgenjs is for creating, not parsing.
            // A dedicated parsing library like 'officegen' or 'extract-text-from-docx-pptx'
            // would be better, but might add complexity.
            // For now, we'll simulate extraction or use a very basic approach.
            extractedText = "Placeholder text from PPTX. PPTX parsing is complex and will be refined.";
            // In a real scenario, you'd use a library like 'extract-text-from-docx-pptx'
            // or a cloud service for robust PPTX parsing.
        } else {
            return res.status(400).send('Unsupported file type.');
        }

        // Step 1: Content Analysis with Gemini
        const analysisPrompt = `Analyze the following presentation slide text. Identify the key topics, data points, and the overall sentiment. Output a JSON object with the keys: "main_topic", "key_data", "sentiment".

        Text: "${extractedText}"`;

        const analysisResult = await model.generateContent(analysisPrompt);
        const analysisResponse = await analysisResult.response;
        const analysisJson = JSON.parse(analysisResponse.text());

        // Step 2: Narration Generation with Gemini
        const narrationPrompt = `You are a ${tone} presenter addressing a ${audience}. Your tone is ${tone} and concise. Based on the following analysis of a presentation slide, generate a narration script of 2-3 sentences. Do not just list the data; interpret it for the audience.

        Analysis: ${JSON.stringify(analysisJson)}
        User-defined Tone: "${tone}"
        Audience: "${audience}"

        Narration Script:`;

        const narrationResult = await model.generateContent(narrationPrompt);
        const narrationResponse = await narrationResult.response;
        const narrationScript = narrationResponse.text();

        // Step 3: Text-to-Speech with Speechify (or Web Speech API fallback)
        const speechifyApiKey = process.env.SPEECHIFY_API_KEY; // Assuming you get an API key for Speechify
        const speechifyApiUrl = 'https://api.speechify.com/v1/audio'; // Placeholder URL, check Speechify docs

        if (speechifyApiKey) {
            try {
                const speechifyResponse = await axios.post(speechifyApiUrl, {
                    text: narrationScript,
                    voice: 'default', // Or a specific voice ID if Speechify provides options
                    // Add other parameters as required by Speechify API
                }, {
                    headers: {
                        'Authorization': `Bearer ${speechifyApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer' // To handle audio binary data
                });

                // Assuming Speechify returns an audio file directly
                res.setHeader('Content-Type', 'audio/mpeg'); // Or appropriate audio type
                res.send(Buffer.from(speechifyResponse.data));

            } catch (speechifyError) {
                console.error('Speechify API Error:', speechifyError.response ? speechifyError.response.data : speechifyError.message);
                // Fallback to Web Speech API or a simpler response if Speechify fails
                res.status(500).json({
                    message: 'Failed to generate voiceover with Speechify. Using text fallback.',
                    narrationScript: narrationScript
                });
            }
        } else {
            // Fallback if no Speechify API key is provided
            res.status(200).json({
                message: 'Speechify API key not configured. Narration script generated (no audio).',
                narrationScript: narrationScript
            });
        }

    } catch (error) {
        console.error('Error processing file or generating narration:', error);
        res.status(500).send('Error processing file or generating narration.');
    } finally {
        // Clean up the uploaded file
        // fs.unlink(filePath, (err) => {
        //     if (err) console.error('Error deleting uploaded file:', err);
        // });
    }
});

app.listen(port, () => {
    console.log(`Narrato Backend listening at http://localhost:${port}`);
});
