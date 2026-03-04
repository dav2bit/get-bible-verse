/**
 * @file BibleService.js
 * @description Service for fetching and parsing Biblical data.
 */

class BibleService {
  /**
   * Creates an instance of BibleService.
   * @param {string} bibleDataPath - The path to the JSON file containing Bible data.
   */
  constructor(bibleDataPath = '../bible.json') {
    this.bibleDataPath = bibleDataPath;
    this.bibleData = null;
  }

  /**
   * Fetches the Bible data from the specified JSON file.
   * @returns {Promise<Object>} A promise that resolves with the Bible data.
   * @throws {Error} If the network request fails or the data cannot be parsed.
   */
  async fetchBibleData() {
    try {
      if (this.bibleData) {
        return this.bibleData;
      }
      const response = await fetch(this.bibleDataPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.bibleData = await response.json();
      return this.bibleData;
    } catch (error) {
      console.error("Error fetching Bible data:", error);
      throw new Error("Could not fetch Bible data.");
    }
  }

  /**
   * Parses a Biblical reference string and fetches the corresponding verses.
   * @param {string} referenceString - The raw Biblical reference string (e.g., "Ծննդոց 1", "Ծննդոց 1։5", "Ծննդոց 1։5-10").
   * @returns {Promise<Array>} A promise that resolves with an array of verse objects.
   * @throws {Error} If the reference string is invalid or verses cannot be found.
   */
  async getVerses(referenceString) {
    const cleanedReferenceString = referenceString.replace(/։/g, ':');
    const referenceRegex = /^([\p{Script=Armenian}\s\d]+?)\s*(\d+)(?::(\d+)(?:-(\d+))?)?$/u;
    const match = cleanedReferenceString.match(referenceRegex);

    if (!match) {
      throw new Error("Incorrect biblical reference syntax.");
    }

    const [, bookNameRaw, chapterRaw, startVerseRaw, endVerseRaw] = match;

    const bookName = bookNameRaw.toLowerCase().trim();
    const chapter = parseInt(chapterRaw, 10) - 1;
    const startVerse = startVerseRaw ? parseInt(startVerseRaw, 10) - 1 : null;
    const endVerse = endVerseRaw ? parseInt(endVerseRaw, 10) : null;

    await this.fetchBibleData();

    if (!this.bibleData[bookName]) {
      throw new Error(`Book '${bookNameRaw}' not found.`);
    }
    if (!this.bibleData[bookName].content[chapter]) {
      throw new Error(`Chapter ${chapterRaw} not found in book '${bookNameRaw}'.`);
    }

    let verses = [];
    const chapterContent = this.bibleData[bookName].content[chapter];

    if (startVerse !== null && endVerse !== null) {
      verses = chapterContent.slice(startVerse, endVerse);
    } else if (startVerse !== null) {
      verses = [chapterContent[startVerse]];
    } else {
      verses = chapterContent;
    }
    
    if (verses.length === 0) {
      throw new Error("No verses found for the given reference.");
    }

    return verses;
  }

  /**
   * Formats an array of verse objects into an HTML string.
   * @param {Array<Object>} verses - An array of verse objects, each with 'num' and 'verse' properties.
   * @returns {string} An HTML string representing the formatted verses.
   */
  formatVersesAsHtml(verses) {
    return verses.map(verse => `<span><span>${verse.num}</span> ${verse.verse}</span>`).join('');
  }

  /**
   * Gets the formatted address for a given biblical reference.
   * @param {string} referenceString - The raw Biblical reference string.
   * @returns {string} The formatted address (e.g., "Ծննդոց 1:5-10").
   */
  getFormattedAddress(referenceString) {
    const cleanedReferenceString = referenceString.replace(/։/g, ':');
    const referenceRegex = /^([\p{Script=Armenian}\s\d]+?)\s*(\d+)(?::(\d+)(?:-(\d+))?)?$/u;
    const match = cleanedReferenceString.match(referenceRegex);

    if (!match) {
      return referenceString; // Return original if cannot parse
    }

    const [, bookName, chapter, startVerse, endVerse] = match;
    let address = `${bookName} ${chapter}`;
    if (startVerse) {
      address += `:${startVerse}`;
      if (endVerse) {
        address += `-${endVerse}`;
      }
    }
    return address;
  }

  /**
   * Splits a long text into chunks suitable for slides, ensuring readability.
   * This improved logic aims for more balanced text distribution per slide.
   * @param {Array<Object>} verses - Array of verse objects.
   * @param {number} maxCharsPerSlide - Maximum characters allowed per slide.
   * @returns {Array<string>} An array of strings, where each string is a slide's content.
   */
  splitVersesIntoSlides(verses, maxCharsPerSlide = 400) {
    const slides = [];
    let currentSlideVerses = [];
    let currentSlideCharCount = 0;

    for (const verse of verses) {
      const verseText = `${verse.num}.${verse.verse} `;

      if (currentSlideCharCount + verseText.length > maxCharsPerSlide && currentSlideVerses.length > 0) {
        slides.push(currentSlideVerses.map(v => `${v.num}.${v.verse}`).join(' '));
        currentSlideVerses = [];
        currentSlideCharCount = 0;
      }

      currentSlideVerses.push(verse);
      currentSlideCharCount += verseText.length;
    }

    // Push any remaining verses as the last slide
    if (currentSlideVerses.length > 0) {
      slides.push(currentSlideVerses.map(v => `${v.num}.${v.verse}`).join(' '));
    }

    return slides;
  }
}

export default BibleService;
