/**
 * @file index.js
 * @description Main application entry point. Initializes all services and managers.
 */

import BibleService from "./services/BibleService.js";
import SlideManager from "./managers/SlideManager.js";
import WindowSlideManager from "./managers/WindowSlideManager.js";
import ThemeEngine from "./engines/ThemeEngine.js";
import UIManager from "./managers/UIManager.js";
import { BIBLICAL_SUGGESTIONS } from "./utils/constants.js";

// Initialize Services and Managers
const bibleService = new BibleService();
const slideManager = new SlideManager();
const windowSlideManager = new WindowSlideManager();
const themeEngine = new ThemeEngine();

// Initialize UIManager with DOM elements and suggestions
const uiManager = new UIManager({
  searchInput: document.querySelector(".serchInput > input"),
  autocompleteList: document.getElementById("autocomplete-list"),
  verseBox: document.querySelector(".verseBox"),
  searchButton: document.querySelector(".search > button"),
  copyButton: document.querySelector(".copy"),
  makePptxButton: document.querySelector(".make_pptx"),
  makeSlideButton: document.querySelector(".make_slide"),
  nextSlideButton: document.querySelector(".slide_nav > .next"),
  prevSlideButton: document.querySelector(".slide_nav > .prev"),
  modeChangerButton: document.querySelector(".mode"),
  notificationElement: document.querySelector(".notify"),
  suggestions: BIBLICAL_SUGGESTIONS,
});

/**
 * Handles the search action, fetches verses, updates UI, and prepares slides.
 * @param {string} referenceString - The biblical reference string from the search input.
 */
async function handleSearchAction(referenceString) {
  try {
    const verses = await bibleService.getVerses(referenceString);
    const formattedHtml = bibleService.formatVersesAsHtml(verses);
    uiManager.setVerseBoxContent(formattedHtml);

    // Prepare slide content for both PPTX and window projection
    const address = bibleService.getFormattedAddress(referenceString);
    const pptxSlides = bibleService.splitVersesIntoSlides(verses, 400);
    const windowSlides = bibleService.splitVersesIntoSlides(verses, 900);

    // Store prepared slide data for later use by managers
    uiManager.onGeneratePptx = () => slideManager.generatePresentation(pptxSlides, address);
    uiManager.onInitSlideWindow = () => {
      windowSlideManager.initSlides(windowSlides, address);
    };
    
    // Initially hide slide navigation if the window isn't open or no slides are prepared
    uiManager.toggleSlideNavigation(windowSlideManager.isSlideWindowActive() && windowSlides.length > 0);

  } catch (error) {
    uiManager.showNotification(error.message);
    uiManager.setVerseBoxContent(""); // Clear verse box on error
    uiManager.toggleSlideNavigation(false); // Hide navigation on error
  }
}

// Connect UIManager actions to service/manager methods
uiManager.onSearch = handleSearchAction;
uiManager.onNavigateSlides = (step) => windowSlideManager.navigateSlides(step);
uiManager.onToggleTheme = () => themeEngine.toggleTheme();

// Setup initial listeners and theme
uiManager.initEventListeners();
windowSlideManager.setupMainWindowListeners();

// Handle initial URL parameters or other startup logic if needed
document.addEventListener("DOMContentLoaded", () => {
  // Example: Check if a popup was active and try to reopen/re-sync
  if (localStorage.getItem("popupActive") === "true") {
    windowSlideManager.openSlideWindow();
  }
});

// Export instances if they need to be accessed globally (e.g., for debugging in console)
export { bibleService, slideManager, windowSlideManager, themeEngine, uiManager };
