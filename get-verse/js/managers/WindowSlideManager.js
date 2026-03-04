/**
 * @file WindowSlideManager.js
 * @description Manages the dual-window setup and slide projection using BroadcastChannel API.
 */

class WindowSlideManager {
  /**
   * Creates an instance of WindowSlideManager.
   * @param {string} channelName - The name of the BroadcastChannel to use.
   * @param {string} slideWindowUrl - The URL of the slide display window (e.g., 'slide.html').
   */
  constructor(channelName = "my_app_channel", slideWindowUrl = "slide.html") {
    this.broadcastChannel = new BroadcastChannel(channelName);
    this.slideWindow = null;
    this.slideWindowUrl = slideWindowUrl;
    this.popupStorageKey = "popupActive";

    // Event listener for messages from the slide window (if any)
    this.broadcastChannel.onmessage = this._handleBroadcastMessage.bind(this);
  }

  /**
   * Opens the slide projection window if it's not already open.
   * Stores a flag in localStorage to remember the window state.
   * @returns {Window|null} The opened window object, or null if it couldn't be opened.
   */
  openSlideWindow() {
    try {
      const popupStatus = localStorage.getItem(this.popupStorageKey);

      if (!popupStatus || (this.slideWindow && this.slideWindow.closed)) {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;

        this.slideWindow = window.open(
          this.slideWindowUrl,
          "_blank",
          `width=${screenWidth},height=${screenHeight},left=${screenWidth},top=0,resizable=yes,scrollbars=yes`,
        );
        if (this.slideWindow) {
          localStorage.setItem(this.popupStorageKey, "true");
          // Add event listener to detect when the popup is closed manually
          this.slideWindow.addEventListener('beforeunload', () => {
            localStorage.removeItem(this.popupStorageKey);
            this.slideWindow = null;
          });
        } else {
            throw new Error("Failed to open slide window. Please check popup blockers.");
        }
      }
      return this.slideWindow;
    } catch (error) {
      console.error("Error opening slide window:", error);
      // Optionally, notify the user via a UI element
      return null;
    }
  }

  /**
   * Closes the slide projection window if it's open.
   */
  closeSlideWindow() {
    if (this.slideWindow && !this.slideWindow.closed) {
      this.slideWindow.close();
      this.slideWindow = null;
    }
    localStorage.removeItem(this.popupStorageKey);
  }

  /**
   * Sends a message to the slide window to call a specific function.
   * @param {string} funcName - The name of the function to call in the slide window context.
   * @param {Object} [params={}] - Parameters to pass to the function.
   */
  callSlideWindowFunction(funcName, params = {}) {
    try {
      this.broadcastChannel.postMessage({
        type: "CALL_FUNCTION",
        payload: { name: funcName, args: params },
      });
    } catch (error) {
      console.error(`Error sending message to slide window for function ${funcName}:`, error);
      // Optionally, notify the user
    }
  }

  /**
   * Initializes slides in the projection window.
   * This typically involves sending the verse content to the slide window.
   * @param {Array<string>} slidesContent - An array of strings, where each string is a slide's content.
   * @param {string} address - The biblical reference address.
   */
  initSlides(slidesContent, address) {
    this.callSlideWindowFunction("addSlides", { verse: slidesContent, addres: address });
    this.callSlideWindowFunction("showSlides", { id: 1 }); // Show the first slide
  }

  /**
   * Changes the current slide index in the projection window.
   * @param {number} index - The index of the slide to show.
   */
  changeSlideIndex(index) {
    this.callSlideWindowFunction("changeSlideIndex", { id: index });
  }

  /**
   * Navigates to the next or previous slide in the projection window.
   * @param {number} step - The step for navigation (e.g., 1 for next, -1 for previous).
   */
  navigateSlides(step) {
    this.callSlideWindowFunction("plusSlides", { id: step });
  }

  /**
   * Handles incoming messages from the BroadcastChannel.
   * This method is primarily for the main window to react to messages from the slide window, if any.
   * @param {MessageEvent} event - The message event.
   * @private
   */
  _handleBroadcastMessage(event) {
    // Currently, no specific messages are expected from the slide window back to the main window.
    // This can be extended if bidirectional communication is needed.
    // console.log("Message received in main window from slide window:", event.data);
  }

  /**
   * Sets up event listeners for the main window to manage the slide window lifecycle.
   * This should be called once when the main application initializes.
   */
  setupMainWindowListeners() {
    window.addEventListener("load", () => this.openSlideWindow());
    window.addEventListener("beforeunload", () => this.closeSlideWindow());
  }

  /**
   * Checks if the popup window is currently active (open).
   * @returns {boolean} True if the popup is active, false otherwise.
   */
  isSlideWindowActive() {
    return localStorage.getItem(this.popupStorageKey) === "true" && this.slideWindow && !this.slideWindow.closed;
  }
}

export default WindowSlideManager;
