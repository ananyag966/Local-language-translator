const startBtn = document.getElementById("start-btn");
const translateBtn = document.getElementById("translate-btn");
const speakBtn = document.getElementById("speak-btn");
const inputText = document.getElementById("input-text");
const translatedText = document.getElementById("translated-text");
const inputLanguageSelect = document.getElementById("input-language");
const languageSelect = document.getElementById("language");

let speechRecognition;

startBtn.addEventListener("click", () => {
    let inputLang = inputLanguageSelect.value;

translateBtn.addEventListener("click", async () => {
    let text = manualText.value.trim() || inputText.innerText;
    let targetLang = languageSelect.value;

    if (text && text !== "Listening... Please speak now.") {
        let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${inputLanguageSelect.value.split('-')[0]}|${targetLang}`;

        try {
            let response = await fetch(apiUrl);
            let data = await response.json();
            let translated = data.responseData.translatedText;
            translatedText.innerText = translated;
        } catch (error) {
            translatedText.innerText = "Error in translation.";
            console.error("Translation error:", error);
        }
    } else {
        alert("Please enter or speak some text before translating.");
    }
});



    // Initialize Speech Recognition with selected input language
    speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    speechRecognition.lang = inputLang;
    speechRecognition.interimResults = false;
    speechRecognition.continuous = false;  // Stops after one sentence

    speechRecognition.start();
    inputText.innerText = "Listening... Please speak now.";

    speechRecognition.onresult = (event) => {
        let text = event.results[0][0].transcript;
        inputText.innerText = text;
    };

    speechRecognition.onerror = (event) => {
        inputText.innerText = "Error recognizing speech. Try again!";
        console.error("Speech recognition error:", event.error);
    };

    speechRecognition.onend = () => {
        console.log("Speech recognition ended.");
    };
});

translateBtn.addEventListener("click", async () => {
    let text = inputText.innerText;
    let targetLang = languageSelect.value;

    if (text && text !== "Listening... Please speak now.") {
        let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${inputLanguageSelect.value.split('-')[0]}|${targetLang}`;

        try {
            let response = await fetch(apiUrl);
            let data = await response.json();
            let translated = data.responseData.translatedText;
            translatedText.innerText = translated;
        } catch (error) {
            translatedText.innerText = "Error in translation.";
            console.error("Translation error:", error);
        }
    } else {
        alert("Please speak something before translating.");
    }
});

speakBtn.addEventListener("click", () => {
    let speech = new SpeechSynthesisUtterance(translatedText.innerText);
    speech.lang = languageSelect.value;
    window.speechSynthesis.speak(speech);
});
const manualText = document.getElementById("manual-text");

translateBtn.addEventListener("click", async () => {
    let text = manualText.value.trim() || inputText.innerText;
    let targetLang = languageSelect.value;

    if (text && text !== "Listening... Please speak now.") {
        let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${inputLanguageSelect.value.split('-')[0]}|${targetLang}`;

        try {
            let response = await fetch(apiUrl);
            let data = await response.json();
            let translated = data.responseData.translatedText;
            translatedText.innerText = translated;
        } catch (error) {
            translatedText.innerText = "Error in translation.";
            console.error("Translation error:", error);
        }
    } else {
        alert("Please enter or speak some text before translating.");
    }
});
