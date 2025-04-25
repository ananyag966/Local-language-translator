const startBtn = document.getElementById("start-btn");
const translateBtn = document.getElementById("translate-btn");
const speakBtn = document.getElementById("speak-btn");
const inputText = document.getElementById("input-text");
const translatedText = document.getElementById("translated-text");
const inputLanguageSelect = document.getElementById("input-language");
const languageSelect = document.getElementById("language");
const manualText = document.getElementById("manual-text");

let speechRecognition;

startBtn.addEventListener("click", () => {
    let inputLang = inputLanguageSelect.value;

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

const langMap = {
    en: "en-US",
    hi: "hi-IN",
    te: "te-IN",
    ta: "ta-IN",
    kn: "kn-IN"
};

speakBtn.addEventListener("click", () => {
    let text = translatedText.innerText.trim();
    if (!text) return;

    const langCode = langMap[languageSelect.value] || "en-US";
    const synth = window.speechSynthesis;

    const speakNow = () => {
        const voices = synth.getVoices();
        const matchedVoice = voices.find(voice => voice.lang === langCode);

        let speech = new SpeechSynthesisUtterance(text);
        if (matchedVoice) {
            speech.voice = matchedVoice;
        }
        speech.lang = langCode;
        synth.speak(speech);
    };

    if (synth.getVoices().length === 0) {
        synth.onvoiceschanged = speakNow;
    } else {
        speakNow();
    }
});
