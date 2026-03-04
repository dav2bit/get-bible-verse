/**
 * @file ThemeEngine.js
 * @description Manages dark and light mode switching for the application.
 */

class ThemeEngine {
  /**
   * Creates an instance of ThemeEngine.
   * @param {string} storageKey - The key used to store the theme preference in localStorage.
   * @param {Object} selectors - An object containing CSS variable names for different theme properties.
   */
  constructor(storageKey = "mode", selectors = {}) {
    this.storageKey = storageKey;
    this.root = document.documentElement;
    this.selectors = {
      mainBgColor: "--main-bg-color",
      buttonColor: "--button-color",
      wrapperColor: "--wrapper-color",
      textColor: "--text-color",
    };
    this.themes = {
      light: {
        [this.selectors.mainBgColor]: "#EBE3D5",
        [this.selectors.buttonColor]: "#776B5D",
        [this.selectors.wrapperColor]: "#F6F1E7",
        [this.selectors.textColor]: "#000000",
      },
      dark: {
        [this.selectors.mainBgColor]: "#171718",
        [this.selectors.buttonColor]: "#4acc7c",
        [this.selectors.wrapperColor]: "#1C1C1D",
        [this.selectors.textColor]: "#fff",
      },
    };

    this.applyStoredTheme();
  }

  /**
   * Retrieves the current theme from localStorage.
   * @returns {string} The stored theme ('light' or 'dark'), or 'light' if not set.
   */
  getThemePreference() {
    return localStorage.getItem(this.storageKey) || "light";
  }

  /**
   * Sets the theme preference in localStorage.
   * @param {string} theme - The theme to set ('light' or 'dark').
   */
  setThemePreference(theme) {
    localStorage.setItem(this.storageKey, theme);
  }

  /**
   * Applies the specified theme to the document by updating CSS custom properties.
   * @param {string} themeName - The name of the theme to apply ('light' or 'dark').
   */
  applyTheme(themeName) {
    const theme = this.themes[themeName];
    if (!theme) {
      console.warn(`Theme "${themeName}" not found.`);
      return;
    }
    for (const [property, value] of Object.entries(theme)) {
      this.root.style.setProperty(property, value);
    }
  }

  /**
   * Toggles between dark and light themes.
   * The new theme is saved to localStorage and applied immediately.
   */
  toggleTheme() {
    const currentTheme = this.getThemePreference();
    const newTheme = currentTheme === "light" ? "dark" : "light";
    this.setThemePreference(newTheme);
    this.applyTheme(newTheme);
  }

  /**
   * Applies the theme stored in localStorage on initialization.
   */
  applyStoredTheme() {
    this.applyTheme(this.getThemePreference());
  }
}

export default ThemeEngine;
