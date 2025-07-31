// CONTROLLER.JS - Application Logic Layer
// This module coordinates between Model and View, handles user interactions
// Following MVC pattern: Controller manages flow, connects Model and View

// =============================================================================
// MODULE IMPORTS
// =============================================================================

// Import Model and View modules using ES6 syntax
import Model from "./model.js";  // Data management and AI API calls
import View from "./view.js";    // UI updates and DOM interactions

// =============================================================================
// SPEECH RECOGNITION SETUP
// =============================================================================

// Initialize Web Speech API for voice input
// Support both standard and webkit-prefixed versions for browser compatibility
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = Model.getLanguage().lang; // Set initial language from model

// Global state tracking for AI requests
let aiRequestInProgress = false; // Prevents multiple simultaneous AI calls

// =============================================================================
// CORE EVENT HANDLERS
// =============================================================================

/**
 * Handles voice input from user speech recognition
 * This is the main interaction flow of the application
 * @param {Object} event - Speech recognition result event
 */
async function handleVoiceInput(event) {
  // Extract user's spoken text from recognition result
  const userText = event.results[0][0].transcript;
  
  // Add user input to story and update display immediately
  const updatedStory = Model.appendLine("Player", userText);
  View.updateStory(updatedStory);

  // Show loading indicator and set request flag
  View.toggleLoading(true);
  aiRequestInProgress = true;

  // Generate AI response by sending current story + prompt for narrator
  const aiResponse = await Model.generateStory(updatedStory + "\nNarrator:");
  
  // Clear loading state
  aiRequestInProgress = false;
  View.toggleLoading(false);

  // Add AI response to story and update display
  const finalStory = Model.appendLine("Narrator", aiResponse);
  View.updateStory(finalStory);
  
  // Speak the AI response aloud
  View.speakText(aiResponse, Model.getLanguage().lang);
}

/**
 * Handles language change from dropdown selection
 * Updates both Model state and speech recognition language
 */
function handleLanguageChange() {
  // Get selected option with language code and display name
  const selectedOption = View.getLanguageSelect().selectedOptions[0];
  const newLang = selectedOption.value;        // e.g., "fr-FR"
  const newLangName = selectedOption.dataset.name; // e.g., "French"
  
  // Update model with new language settings
  Model.setLanguage(newLang, newLangName);
  
  // Update speech recognition to use new language
  recognition.lang = newLang;
}

/**
 * Handles stop button click - stops speech AND resets story
 * This provides a "fresh start" functionality
 */
function handleStopSpeaking() {
  // Stop any currently playing speech immediately
  View.stopSpeaking();
  
  // Cancel any pending AI requests and hide loading
  if (aiRequestInProgress) {
    View.toggleLoading(false);
    aiRequestInProgress = false;
  }
  
  // Reset story back to original starting content
  const resetStory = Model.resetStory();
  View.updateStory(resetStory);
  
  // Announce the reset with spoken feedback
  setTimeout(() => {
    View.speakText("Story reset! Help me build a story! Start with a sentence and I will continue it.", Model.getLanguage().lang);
  }, 500);
}

/**
 * Handles pause/resume button for speech control
 * Toggles between pausing and resuming text-to-speech
 * @param {Object} e - Click event object
 */
function handlePauseResume(e) {
  // Toggle pause/resume state and get new state
  const newState = View.pauseOrResumeSpeaking();
  
  // Update button text to reflect current state
  e.target.textContent = newState === "Pause" ? "⏸ Pause" : "▶ Resume";
}

// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================

/**
 * Initializes the entire application
 * Sets up event listeners, initializes data, starts first interaction
 */
function init() {
  // Preload speech synthesis voices (browser compatibility)
  window.speechSynthesis.onvoiceschanged = () => {};
  
  // Initialize story with content from HTML DOM
  const initialStoryContent = View.getInitialStoryContent();
  Model.initializeStory(initialStoryContent);
  View.updateStory(Model.getStory());
  
  // Speak welcome message after brief delay (ensures voices are loaded)
  setTimeout(() => {
    View.speakText("Help me build a story! Start with a sentence and I will continue it.", Model.getLanguage().lang);
  }, 500);

  // =============================================================================
  // EVENT LISTENER SETUP
  // =============================================================================

  // Speak button - starts voice recognition
  View.getSpeakButton().onclick = () => {
    try {
      recognition.start(); // Begin listening for user speech
    } catch (error) {
      console.error("Speech recognition error:", error);
    }
  };
  
  // Speech recognition event handlers
  recognition.onresult = handleVoiceInput; // Process recognized speech
  recognition.onerror = (event) => {
    // Handle recognition errors (mic access, network, etc.)
    console.error("Speech recognition error:", event.error);
    View.toggleLoading(false);
    aiRequestInProgress = false;
  };
  
  // Language selector - changes language for AI and speech
  View.getLanguageSelect().addEventListener("change", handleLanguageChange);
  
  // Stop button - stops speech and resets story
  View.getStopSpeakButton().onclick = handleStopSpeaking;
  
  // Pause/Resume button - controls speech playback
  View.getPauseSpeakButton().onclick = handlePauseResume;
}

// =============================================================================
// APPLICATION STARTUP
// =============================================================================

// Start the application when this module loads
init();

/* 
 * =============================================================================
 * APPLICATION FLOW SUMMARY
 * =============================================================================
 * 
 * 1. User clicks "🎙️ Speak" button
 * 2. Speech recognition activates and listens
 * 3. User speaks their story contribution
 * 4. Speech is converted to text and added to story
 * 5. Story display updates immediately
 * 6. AI request sent to Gemini API with current story
 * 7. AI generates continuation in selected language
 * 8. AI response added to story and displayed
 * 9. AI response spoken aloud using text-to-speech
 * 10. Process repeats for collaborative storytelling
 * 
 * Additional features:
 * - Language switching affects both AI responses and speech
 * - Pause/Resume controls speech playback
 * - Stop button resets entire story for fresh start
 * - Loading indicators show when AI is processing
 * - Error handling for speech recognition and synthesis
 */
