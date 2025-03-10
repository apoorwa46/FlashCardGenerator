const uploadButton = document.getElementById('uploadButton');
const pdfUpload = document.getElementById('pdfUpload');
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const showAnswerBtn = document.getElementById('showAnswerBtn');

let flashcards = [];
let currentCardIndex = 0;

uploadButton.addEventListener('click', () => {
    console.log("Upload button clicked");
    pdfUpload.click();
});

pdfUpload.addEventListener('change', async (event) => {
    console.log("File input changed");

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('pdf', file);

    console.log("FormData:", formData);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            flashcards = await response.json();
            console.log("Flashcards received:", flashcards); 
            displayFlashcard();
        } else {
            console.error('Upload failed:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function displayFlashcard() {
    if (flashcards.length > 0) {
        const flashcard = flashcards[currentCardIndex];
        questionElement.textContent = flashcard.question;
        answerElement.textContent = flashcard.answer;
        answerElement.style.display = 'none';
    }
}

showAnswerBtn.addEventListener('click', () => {
    if (answerElement.style.display === 'none') {
        answerElement.style.display = 'block';
    } else {
        answerElement.style.display = 'none';
    }
});

nextBtn.addEventListener('click', () => {
    if (currentCardIndex < flashcards.length - 1) {
        currentCardIndex++;
        displayFlashcard();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        displayFlashcard();
    }
});