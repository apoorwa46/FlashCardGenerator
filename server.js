const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const natural = require('natural');
const path = require('path');
const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static(path.join(__dirname, '/'))); 

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('/api/upload', upload.single('pdf'), async (req, res) => {
    console.log("Received upload request");

    try {
        if (!req.file) {
            console.log("No file uploaded.");
            return res.status(400).send('No file uploaded.');
        }

        console.log("File uploaded:", req.file.originalname);

        const pdfBuffer = req.file.buffer;
        const data = await pdf(pdfBuffer);
        const text = data.text;

        const flashcards = generateFlashcards(text);
        res.json(flashcards);
    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).send('Error processing PDF.');
    }
});

function generateFlashcards(text) {
    const tokenizer = new natural.SentenceTokenizer();
    const sentences = tokenizer.tokenize(text);
    const flashcards = [];

    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i].trim();
        if (sentence) {
            const words = new natural.WordTokenizer().tokenize(sentence);
            const meaningfulWords = words.filter(word => word.length > 3);

            if (meaningfulWords.length > 0) {
                const question = `What is the key concept in: "${sentence}"?`;
                const answer = meaningfulWords.join(', ');
                flashcards.push({ question, answer });
            } else {
                flashcards.push({ question: `Explain this: "${sentence}"`, answer: sentence });
            }
        }
    }

    return flashcards;
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});