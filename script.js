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

// Function to list all available voices in the browser
const listVoices = () => {
    const voices = speechSynthesis.getVoices();
    console.log("Available voices in your browser:");
    voices.forEach((voice, index) => {
        console.log(`${index + 1}: ${voice.name} - ${voice.lang}`);
    });
};

// Call listVoices immediately after initializing speechSynthesis
listVoices();

// Speak Translation Button
speakBtn.addEventListener("click", () => {
    let text = translatedText.innerText.trim();
    if (!text) return;

    let langCode = langMap[languageSelect.value] || "en-US"; // Default to "en-US" if no matching code
    const synth = window.speechSynthesis;

    console.log(`Selected language code: ${langCode}`);
    console.log("Available voices:", synth.getVoices()); // Log available voices

    // Ensure voices are available before proceeding
    const loadVoices = () => {
        const voices = synth.getVoices();
        console.log("Loaded voices:", voices);  // Log all loaded voices

        // If voices are not yet available, wait for them to load
        if (voices.length === 0) {
            console.log("No voices available, waiting...");
            synth.onvoiceschanged = () => {
                const updatedVoices = synth.getVoices();
                console.log("Updated voices:", updatedVoices);
                speakNow(updatedVoices);
            };
        } else {
            speakNow(voices);  // Speak now if voices are available
        }
    };

    // Function to handle the speaking process
    const speakNow = (voices) => {
        let matchedVoice = voices.find(voice => voice.lang === langCode);
        console.log("Matched voice:", matchedVoice);  // Log the matched voice

        // If no voice is found, fall back to Hindi, then English
        if (!matchedVoice) {
            console.error(`No voice found for language: ${langCode}`);
            //alert(`No voice found for language: ${langCode}. Falling back to Hindi (hi-IN)`);
            langCode = "hi-IN";  // Fallback to Hindi if no voice is found
            matchedVoice = voices.find(voice => voice.lang === langCode);  // Try to find Hindi voice
        }

        if (!matchedVoice) {
            console.error(`No voice found for Hindi (hi-IN), falling back to English (en-US)`);
            alert(`No voice found for Hindi. Falling back to English (en-US)`);
            langCode = "en-US";  // Fallback to English if Hindi is not found
            matchedVoice = voices.find(voice => voice.lang === langCode);  // Try to find English voice
        }

        if (!matchedVoice) {
            alert(`No voice found for fallback language: ${langCode}`);
            return;
        }

        let speech = new SpeechSynthesisUtterance(text);
        speech.voice = matchedVoice;
        speech.lang = langCode;
        console.log("Speaking the translated text:", text);
        synth.speak(speech);
    };

    // Ensure that voices are loaded and then speak
    loadVoices();
});
