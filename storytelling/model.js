// MODEL.JS - Data Management Layer
// This module handles all data operations, API calls, and business logic
// Following MVC pattern: Model manages data, doesn't interact with DOM

// =============================================================================
// DATA STORAGE
// =============================================================================

// Current story content - builds up as user and AI interact
let story = ""; // Will be initialized by the controller from HTML content

// Original story content for reset functionality
let initialStory = "";

// Current language settings for speech recognition and synthesis
let currentLanguage = "en-US";      // Language code (e.g., "en-US", "fr-FR")
let currentLanguageName = "English"; // Human-readable language name

// =============================================================================
// API CONFIGURATION
// =============================================================================

// Google Gemini AI API credentials and endpoint
let GEMINI_API_KEY = "";



// =============================================================================
// AI STORY GENERATION
// =============================================================================

/**
 * Generates AI story continuation using Google Gemini API
 * @param {string} prompt - The current story context to continue
 * @returns {Promise<string>} - AI-generated story continuation
 */
async function generateStory(prompt) {
  // Prepare request body with context about current language and story
  GEMINI_API_KEY = document.getElementById("apiKey").value;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const body = { 
    contents: [{ 
      parts: [{ 
        text: `Continue the story in ${currentLanguageName}:\n${prompt}` 
      }] 
    }] 
  };
  
  // Make API request to Gemini
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  
  // Parse response and extract generated text
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "(no response)";
}

// =============================================================================
// STORY MANAGEMENT
// =============================================================================

/**
 * Adds a new line to the story with speaker role
 * @param {string} role - Who is speaking ("Player", "Narrator", etc.)
 * @param {string} text - What they said
 * @returns {string} - Updated complete story
 */
function appendLine(role, text) {
  story += `\n${role}: ${text}`;
  return story;
}

/**
 * Gets the current complete story
 * @returns {string} - Current story content
 */
function getStory() {
  return story;
}

// =============================================================================
// LANGUAGE MANAGEMENT
// =============================================================================

/**
 * Updates the current language for AI responses and speech
 * @param {string} lang - Language code (e.g., "fr-FR")
 * @param {string} name - Human-readable language name (e.g., "French")
 */
function setLanguage(lang, name) {
  currentLanguage = lang;
  currentLanguageName = name;
}

/**
 * Gets current language settings
 * @returns {Object} - Object with lang and name properties
 */
function getLanguage() {
  return { lang: currentLanguage, name: currentLanguageName };
}

// =============================================================================
// STORY RESET FUNCTIONALITY
// =============================================================================

/**
 * Resets story back to original starting content
 * @returns {string} - Reset story content
 */
function resetStory() {
  story = initialStory;
  return story;
}

/**
 * Initializes the story with content from HTML (called by controller)
 * @param {string} initialText - Starting story text from HTML
 * @returns {string} - Initialized story content
 */
function initializeStory(initialText) {
 
  story = initialText;
  initialStory = initialText; // Store for reset functionality
  return story;
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

// Export all public functions for use by other modules
export default {
  generateStory,     // AI story generation
  appendLine,        // Add new story lines
  getStory,          // Get current story
  setLanguage,       // Update language settings
  getLanguage,       // Get current language
  resetStory,        // Reset to original story
  initializeStory    // Initialize from HTML content
};
