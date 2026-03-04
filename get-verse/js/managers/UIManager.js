/**
 * @file UIManager.js
 * @description Manages user interface interactions, DOM manipulations, and event listeners.
 */

class UIManager {
  /**
   * Creates an instance of UIManager.
   * @param {Object} options - Configuration options for the UIManager.
   * @param {HTMLElement} options.searchInput - The input element for searching verses.
   * @param {HTMLElement} options.autocompleteList - The UL element for displaying autocomplete suggestions.
   * @param {HTMLElement} options.verseBox - The element where formatted verses are displayed.
   * @param {HTMLElement} options.searchButton - The button to trigger verse search.
   * @param {HTMLElement} options.copyButton - The button to copy verse text.
   * @param {HTMLElement} options.makePptxButton - The button to generate PowerPoint.
   * @param {HTMLElement} options.makeSlideButton - The button to open/initiate slide window.
   * @param {HTMLElement} options.nextSlideButton - The button to navigate to the next slide.
   * @param {HTMLElement} options.prevSlideButton - The button to navigate to the previous slide.
   * @param {HTMLElement} options.modeChangerButton - The button to toggle dark/light mode.
   * @param {HTMLElement} options.notificationElement - The element to display notifications.
   * @param {Array<string>} options.suggestions - An array of book names for autocomplete suggestions.
   */
  constructor(options) {
    const { 
      searchInput, 
      autocompleteList, 
      verseBox, 
      searchButton, 
      copyButton, 
      makePptxButton, 
      makeSlideButton, 
      nextSlideButton, 
      prevSlideButton, 
      modeChangerButton, 
      notificationElement,
      suggestions // Array of biblical book names for autocomplete
    } = options;

    this.searchInput = searchInput;
    this.autocompleteList = autocompleteList;
    this.verseBox = verseBox;
    this.searchButton = searchButton;
    this.copyButton = copyButton;
    this.makePptxButton = makePptxButton;
    this.makeSlideButton = makeSlideButton;
    this.nextSlideButton = nextSlideButton;
    this.prevSlideButton = prevSlideButton;
    this.modeChangerButton = modeChangerButton;
    this.notificationElement = notificationElement;
    this.suggestions = suggestions;

    // Bind handlers to the instance for proper 'this' context
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleCopyClick = this.handleCopyClick.bind(this);
    this.handleMakePptxClick = this.handleMakePptxClick.bind(this);
    this.handleMakeSlideClick = this.handleMakeSlideClick.bind(this);
    this.handleNextSlideClick = this.handleNextSlideClick.bind(this);
    this.handlePrevSlideClick = this.handlePrevSlideClick.bind(this);
    this.handleModeChangerClick = this.handleModeChangerClick.bind(this);
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);

    this.onSearch = () => {}; // Placeholder for search action
    this.onGeneratePptx = () => {}; // Placeholder for PPTX generation action
    this.onInitSlideWindow = () => {}; // Placeholder for slide window initialization action
    this.onNavigateSlides = () => {}; // Placeholder for slide navigation action
    this.onToggleTheme = () => {}; // Placeholder for theme toggle action
  }

  /**
   * Initializes all event listeners for UI elements.
   */
  initEventListeners() {
    this.searchInput.addEventListener("input", this.handleSearchInput);
    this.searchButton.addEventListener("click", this.handleSearchButtonClick);
    this.copyButton.addEventListener("click", this.handleCopyClick);
    this.makePptxButton.addEventListener("click", this.handleMakePptxClick);
    this.makeSlideButton.addEventListener("click", this.handleMakeSlideClick);
    this.nextSlideButton.addEventListener("click", this.handleNextSlideClick);
    this.prevSlideButton.addEventListener("click", this.handlePrevSlideClick);
    this.modeChangerButton.addEventListener("click", this.handleModeChangerClick);
    document.addEventListener("click", this.handleDocumentClick);
    document.addEventListener("keydown", this.handleKeydown);
    document.addEventListener("keydown", this.handleAltCKeydown);
  }

  /**
   * Handles input changes in the search input field for autocomplete.
   * @param {Event} event - The input event.
   */
  handleSearchInput(event) {
    const searchTerm = event.target.value.trim().toLowerCase();
    if (searchTerm === "") {
      this.hideAutocompleteList();
      return;
    }

    const startsWithLetter = this.suggestions.filter((suggestion) =>
      suggestion.toLowerCase().startsWith(searchTerm),
    );
    const containsLetter = this.suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(searchTerm) &&
        !startsWithLetter.includes(suggestion),
    );
    const filteredSuggestions = startsWithLetter.concat(containsLetter);

    this.displaySuggestions(filteredSuggestions);
  }

  /**
   * Handles click events on the document to hide the autocomplete list.
   * @param {Event} event - The click event.
   */
  handleDocumentClick(event) {
    if (!event.target.closest(".search")) {
      this.hideAutocompleteList();
    }
  }

  /**
   * Handles keydown events for Tab, Enter, and Alt+C.
   * @param {Event} event - The keydown event.
   */
  async handleKeydown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      const firstSuggestion = this.autocompleteList.querySelector("li:first-child");
      if (firstSuggestion) {
        this.searchInput.value = firstSuggestion.textContent;
        this.hideAutocompleteList();
        this.searchInput.focus();
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      this.onSearch(this.searchInput.value);
      this.hideAutocompleteList();
    }
  }

  /**
   * Handles Alt+C keydown event to copy verse text.
   * @param {Event} event - The keydown event.
   */
  async handleAltCKeydown(event) {
    if (event.altKey && (event.key === "c" || event.code === "KeyC")) {
      const textToCopy = this.verseBox.textContent.trim();
      if (textToCopy === "") {
        return;
      }
      try {
        await navigator.clipboard.writeText(textToCopy);
        this.showNotification("Text copied!");
      } catch (err) {
        console.error("Failed to copy text: ", err);
        this.showNotification("Failed to copy text.");
      }
    }
  }

  /**
   * Handles click event on the search button.
   * @param {Event} event - The click event.
   */
  handleSearchButtonClick() {
    this.onSearch(this.searchInput.value);
    this.hideAutocompleteList();
  }

  /**
   * Handles click event on the copy button.
   * @param {Event} event - The click event.
   */
  async handleCopyClick() {
    const textToCopy = this.verseBox.textContent.trim();
    if (textToCopy === "") {
      return;
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      this.showNotification("Text copied!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      this.showNotification("Failed to copy text.");
    }
  }

  /**
   * Handles click event on the make PPTX button.
   * @param {Event} event - The click event.
   */
  handleMakePptxClick() {
    if (this.verseBox.innerText.trim() !== "") {
      this.onGeneratePptx();
    } else {
      this.showNotification("Please search for a verse first.");
    }
  }

  /**
   * Handles click event on the make slide button.
   * @param {Event} event - The click event.
   */
  handleMakeSlideClick() {
    try {
      if (this.verseBox.innerText.trim() === "") {
        throw new Error("Please search for a verse first.");
      }
      this.onInitSlideWindow();
      this.toggleSlideNavigation(true);
    } catch (error) {
      this.showNotification(error.message);
    }
  }

  /**
   * Handles click event on the next slide button.
   * @param {Event} event - The click event.
   */
  handleNextSlideClick() {
    this.onNavigateSlides(1);
  }

  /**
   * Handles click event on the previous slide button.
   * @param {Event} event - The click event.
   */
  handlePrevSlideClick() {
    this.onNavigateSlides(-1);
  }

  /**
   * Handles click event on the mode changer button.
   * @param {Event} event - The click event.
   */
  handleModeChangerClick() {
    this.onToggleTheme();
  }

  /**
   * Displays autocomplete suggestions in the autocomplete list.
   * @param {Array<string>} suggestions - An array of suggestion strings.
   */
  displaySuggestions(suggestions) {
    this.autocompleteList.innerHTML = "";
    if (suggestions.length === 0) {
      this.hideAutocompleteList();
      return;
    }

    suggestions.forEach((suggestion) => {
      const listItem = document.createElement("li");
      listItem.classList.add("autocomplete-item");
      listItem.textContent = suggestion;
      listItem.addEventListener("click", () => {
        this.searchInput.value = suggestion;
        this.hideAutocompleteList();
        this.onSearch(suggestion); // Trigger search on selection
      });
      this.autocompleteList.appendChild(listItem);
    });
    this.autocompleteList.style.display = "block";
  }

  /**
   * Hides the autocomplete suggestion list.
   */
  hideAutocompleteList() {
    this.autocompleteList.style.display = "none";
  }

  /**
   * Displays a temporary notification message to the user.
   * @param {string} message - The message to display.
   * @param {number} duration - The duration in milliseconds to display the notification.
   */
  showNotification(message, duration = 3000) {
    if (this.notificationElement) {
      this.notificationElement.innerText = message;
      this.notificationElement.style.display = "block";
      setTimeout(() => {
        this.notificationElement.innerText = "";
        this.notificationElement.style.display = "none";
      }, duration);
    }
  }

  /**
   * Sets the HTML content of the verse display box.
   * @param {string} htmlContent - The HTML string to set.
   */
  setVerseBoxContent(htmlContent) {
    this.verseBox.innerHTML = htmlContent;
  }

  /**
   * Toggles the visibility of slide navigation buttons.
   * @param {boolean} show - Whether to show (true) or hide (false) the navigation buttons.
   */
  toggleSlideNavigation(show) {
    this.nextSlideButton.style.display = show ? "flex" : "none";
    this.prevSlideButton.style.display = show ? "flex" : "none";
  }
}

export default UIManager;
