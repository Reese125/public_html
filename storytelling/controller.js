import Model from "./model.js";
import View from "./view.js";

const recognition = new (window.SpeechRecognition|| window.webkitSpeechRecognition)();
recognition.lang = Model.getLanguage().lang;

let aiRequestInProgress = false;

async function handleVoiceInput(event) {
    const userText = event.results[0][0].transcript;
    const updateStory = Model.appendLine("player", userText);
    View.updateStory(updateStory);
    View.toggleLoading(true);
    aiRequestInProgress = true;
    const aiResponse = await Model.generateStory(updateStory + "\nNarrate:");
    aiRequestInPreogress = false;
    View.toggleLoading(false);
    const finalStory = Model.appendLine("Narrator", aiResponse);
    View.updateStory(finalStory);
    View.speakText(aiResponse, Model.getLanguage().lang);
}

function handleLanguageInput() {
    const selectionOption = View.getLanguageSelect().selectedOption[0];
    const newLang = selectOption.value;
    const newLangName = selectOption.dateset.name;
    Model.setLanguage(newLang, newLangName);
    recognition.lang = newLang;
}

function handleStopSpeaking() {
    View.stopSpeaking();
    if (aiRequestInProgress) {
        View.toggleLoading(false);
        aiRequestInProgress = false;
    }

    const resetStory = Model.resetStory();
    View.updateStory(resetStory);

    setTimeout(() => {
    View.speakText("Story reset! Help me build a story! Start a sentence and I will continue it.",
        Model.getrLanguage().lang)
    }, 500);
}

function handlePauseResume(e) {
    const newState = View.pauseOrResumeSpeaking();
    e.target.textContent = newState ==="Pause" ? "⏸️Pause" : "▶️Resume";
}

function init() {
    window.speechSynthesis.onvoiceschanged = () => {};
    const initializeStoryContent = View.getInitialStoryContent();
    Model.initializeStory(initializeStoryContent);
    View.updateStory(Model.getStory());

    setTimeout(() => {
        View.speakText("story rest! Help me build a story! Start a sentence and I will continue it.",
            Model.getLanguage().lang)
        }, 500);

        View.getSpeakButton().onclick = () => {
        }
            try {
                recognition.start();
            }
            catch (error) {
                console.error("Speech recognition error", error.error);
                View.toggleLoading(false);
                aiResquestInProgress = false;
            };

            View.getLanguageSelect().addEventListener("change", handleLanguageInput);

            View.getStopSpeakBtn().onclick = handleStopSpeaking;

            View.getPauseSpeakbutton().onclock = handlePauseResume;
        }

        init();
