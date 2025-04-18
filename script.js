document.addEventListener('DOMContentLoaded', () => {
    const finalPopup = document.getElementById('final-popup');
    const finalScoreText = document.getElementById('final-score');
    const closePopupBtn = document.getElementById('close-popup');
    
    const endQuizAudio = new Audio('assets/audio/quiz-end.mp3');

    const flagContainer = document.getElementById('flag-container');
    const question = document.getElementById('question');
    const flagImg = document.getElementById('flag');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const resultText = document.getElementById('result');
    const scoreValue = document.getElementById('score-value');
    const totalQuestions = document.getElementById('total-questions');
    const startOverBtn = document.getElementById('start-over-button');
    const toggleButton = document.getElementById('toggle-button');
    let isOn = false;

    const maxQuestions = 10;
    let countries = [];
    let currentCountry = {};
    let score = 0;
    let questionsAsked = 0;

    const correctAudio = new Audio('assets/audio/correct.mp3');
    const wrongAudio = new Audio('assets/audio/wrong.mp3');

    async function fetchCountries() {
        const response = await fetch('https://restcountries.com/v3.1/all');
        countries = await response.json();
        newQuestion();
    }

    function changeFlag(newSrc) {
        // remove previous fade-in class if it exists
        flagImg.classList.remove("fade-in");
    
        // small trick: force reflow so animation restarts
        void flagImg.offsetWidth;
    
        // update the image source
        flagImg.src = newSrc;
    
        // re-add the fade-in class
        flagImg.classList.add("fade-in");
    }

    function resetGame() {
        score = 0;
        questionsAsked = 0;

        // reimpostare testo e stili
        resultText.textContent = '';
        resultText.style.color = '';

        // mostra il testo della domanda
        question.style.display = 'block';

        // mostra il contenitore della bandiera e l'immagine
        flagContainer.style.display = 'block';
        flagImg.style.display = 'block';
    
        // mostra il contenitore delle opzioni e cancella le opzioni precedenti
        optionsContainer.style.display = 'block';
        optionsContainer.innerHTML = '';
        
        // nascondi inizialmente i pulsanti
        nextBtn.style.display = 'none';
        startOverBtn.style.display = 'none';
        
        // nascondi il popup finale
        finalPopup.classList.add('hidden');

        updateScore();
        newQuestion();
    }

    function updateScore() {
        scoreValue.textContent = score;
        totalQuestions.textContent = questionsAsked;
    }

    function newQuestion() {
        resultText.textContent = '';
        nextBtn.style.display = 'none';
        optionsContainer.innerHTML = '';

        // assicurati che gli elementi del flag siano visibili quando mostri una nuova domanda
        flagContainer.style.display = 'block';
        flagImg.style.display = 'block';

        if (questionsAsked >= maxQuestions) {
            showFinalResults();
            return;
        }

        const randomCountries = getRandomCountries(4);
        currentCountry = randomCountries[Math.floor(Math.random() * randomCountries.length)];

        // imposta l'origine dell'immagine della bandiera
        changeFlag(currentCountry.flags.png);
        flagImg.alt = `Flag of ${currentCountry.name.common}`;

        randomCountries.forEach(country => {
            const button = document.createElement('button');
            button.textContent = country.name.common;
            button.addEventListener('click', () => checkAnswer(country));
            optionsContainer.appendChild(button);
        });

        updateScore();
    }

    function getRandomCountries(count) {
        const shuffled = [...countries].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function checkAnswer(selectedCountry) {
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.disabled = true;
            if (button.textContent === currentCountry.name.common) {
                button.style.backgroundColor = '#28a745';
            }
        });

        if (selectedCountry.name.common === currentCountry.name.common) {
            resultText.innerHTML = 'Correct!<br>'; // Using <br> to move to a new line
            resultText.style.color = 'green';
            correctAudio.play();
            score++;
        
            const capital = currentCountry.capital ? currentCountry.capital[0] : 'No capital information available';
            resultText.innerHTML += `The capital of <strong>${currentCountry.name.common}</strong> is <em>${capital}</em>.`;

        } else {
            resultText.innerHTML = `Wrong!<br>The correct answer was ${currentCountry.name.common}.`;
            resultText.style.color = 'red';
            wrongAudio.play();
        }

        questionsAsked++;
        updateScore();

    // controlla se questa è l'ultima domanda
    if (questionsAsked >= maxQuestions) {
        // se è l'ultima domanda, non mostrare il pulsante Next
        nextBtn.style.display = 'none';
        // mostra immediatamente i risultati finali o aggiungi un leggero ritardo
        setTimeout(showFinalResults, 1500); // 1.5 second delay before showing results
    } else {
        // mostra il pulsante next solo se abbiamo altre domande
        nextBtn.style.display = 'block';
    }
    
    startOverBtn.style.display = 'inline-block';

}

    function showFinalResults() {
        const percentage = Math.round((score / maxQuestions) * 100);
        resultText.textContent = `You scored ${score} out of ${maxQuestions} (${percentage}%)`;
        resultText.style.color = 'blue';
        
        finalScoreText.textContent = `You scored ${score} out of ${maxQuestions} (${percentage}%)`;
       
        endQuizAudio.volume = 0.5;
        endQuizAudio.play();

        // cancella l'immagine della bandiera
        flagImg.src = '';
        flagImg.alt = '';
        flagImg.style.display = 'none'; // nascondi l'immagine della bandiera

        // nascondi completamente il contenitore della bandiera
        flagContainer.style.display = 'none';
        
        // nascondere il testo della domanda
        question.style.display = 'none';
    
        // cancella e nascondi le opzioni
        optionsContainer.innerHTML = '';
        optionsContainer.style.display = 'none';
        
        // nascondi il pulsante Next
        nextBtn.style.display = 'none';

        // mostra il pulsante Start over
    startOverBtn.style.display = 'inline-block';
    
        // mostra il pop-up finale
        finalPopup.classList.remove('hidden');
    }

    // aggiorna il listener di eventi del pulsante di chiusura pop-up
    closePopupBtn.addEventListener('click', () => {
        finalPopup.classList.add('hidden');

    // assicurati che il pulsante Start over sia ancora visibile dopo la chiusura del pop-up
    startOverBtn.style.display = 'inline-block';

    // mantieni nascosto il testo della domanda e la segnalazione dopo la chiusura del pop-up
    questionText.style.display = 'none';
    flagContainer.style.display = 'none';
    });

    nextBtn.addEventListener('click', newQuestion);
    startOverBtn.addEventListener('click', resetGame);
    
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        isOn = !isOn;
        toggleButton.textContent = isOn ? "☀️" : "🌙";
    });
    
    // start fetching countries when page loads
    fetchCountries();
});