// VIEW.JS - User Interface Layer
// This module handles all DOM interactions, visual updates, and user interface
// Following MVC pattern: View manages UI, doesn't contain business logic

// =============================================================================
// DOM ELEMENT REFERENCES
// =============================================================================

// Get references to all UI elements we need to interact with
const storyDiv = document.getElementById("story");           // Story display area
const speakBtn = document.getElementById("speakBtn");        // Voice input button
const stopSpeakBtn = document.getElementById("stopSpeakBtn"); // Stop/reset button
const pauseSpeakBtn = document.getElementById("pauseSpeakBtn"); // Pause/resume button
const loadingDiv = document.getElementById("loading");       // AI thinking indicator
const languageSelect = document.getElementById("languageSelect"); // Language dropdown

// =============================================================================
// STORY DISPLAY FUNCTIONS
// =============================================================================

/**
 * Updates the story display with new text content
 * @param {string} text - The story text to display
 */
function updateStory(text) {
  // Safety check - ensure DOM element exists before updating
  if (storyDiv) {
    storyDiv.textContent = text;
  }
}

/**
 * Shows or hides the loading indicator while AI is thinking
 * @param {boolean} show - True to show loading, false to hide
 */
function toggleLoading(show) {
  // Safety check - ensure DOM element exists before updating
  if (loadingDiv) {
    loadingDiv.style.display = show ? "block" : "none";
  }
}

/**
 * Gets the initial story content from the HTML DOM
 * This allows the Model to initialize with whatever text is in the HTML
 * @returns {string} - Initial story text from HTML, or fallback text
 */
function getInitialStoryContent() {
  return storyDiv ? storyDiv.textContent.trim() : "Narrator: Help me build a story! Start with a sentence and I will continue it.";
}

// =============================================================================
// UI ELEMENT ACCESSOR FUNCTIONS
// =============================================================================

/**
 * Returns reference to the speak button for event binding
 * @returns {HTMLElement} - The speak button element
 */
function getSpeakButton() {
  return speakBtn;
}

/**
 * Returns reference to the stop button for event binding
 * @returns {HTMLElement} - The stop button element
 */
function getStopSpeakButton() {
  return stopSpeakBtn;
}

/**
 * Returns reference to the pause button for event binding
 * @returns {HTMLElement} - The pause button element
 */
function getPauseSpeakButton() {
  return pauseSpeakBtn;
}

/**
 * Returns reference to the language selector for event binding
 * @returns {HTMLElement} - The language select element
 */
function getLanguageSelect() {
  return languageSelect;
}

// =============================================================================
// SPEECH SYNTHESIS (TEXT-TO-SPEECH) FUNCTIONS
// =============================================================================

/**
 * Converts text to speech using Web Speech API
 * @param {string} text - Text to speak
 * @param {string} lang - Language code for speech synthesis
 */
function speakText(text, lang) {
  try {
    // Create speech utterance object
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Get available voices from browser
    const voices = speechSynthesis.getVoices();
    
    // If no voices loaded yet, wait and try again
    if (voices.length === 0) {
      // Recursive call after brief delay to wait for voice loading
      setTimeout(() => speakText(text, lang), 100);
      return;
    }
    
    // Find best voice for selected language
    const voice = voices.find(v => v.lang.startsWith(lang));
    if (voice) utterance.voice = voice;
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    // Log errors but don't break the application
    console.error("Speech synthesis error:", error);
  }
}

/**
 * Immediately stops all speech synthesis
 */
function stopSpeaking() {
  window.speechSynthesis.cancel();
}

/**
 * Toggles between pause and resume for speech synthesis
 * @returns {string} - New state ("Pause" or "Resume")
 */
function pauseOrResumeSpeaking() {
  // Check if speech is currently active
  if (window.speechSynthesis.speaking) {
    if (window.speechSynthesis.paused) {
      // Currently paused, so resume
      window.speechSynthesis.resume();
      return "Pause"; // Button should now show "Pause"
    } else {
      // Currently speaking, so pause
      window.speechSynthesis.pause();
      return "Resume"; // Button should now show "Resume"
    }
  }
  // Default state
  return "Pause";
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

// Export all public functions for use by the Controller
export default {
  updateStory,              // Update story display
  toggleLoading,            // Show/hide loading indicator
  getSpeakButton,           // Get button references for event binding
  getStopSpeakButton,
  getPauseSpeakButton,
  getLanguageSelect,
  speakText,                // Text-to-speech functionality
  stopSpeaking,             // Stop speech
  pauseOrResumeSpeaking,    // Pause/resume speech
  getInitialStoryContent    // Get starting story from HTML
};
