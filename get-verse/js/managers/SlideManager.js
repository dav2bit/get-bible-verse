/**
 * @file SlideManager.js
 * @description Manages the generation of PowerPoint presentations using PptxGenJS.
 */

// PptxGenJS is expected to be loaded globally via a script tag in index.html
// For modularity, consider importing it if available as an ES module.

class SlideManager {
  /**
   * Creates an instance of SlideManager.
   */
  constructor() {
    if (typeof PptxGenJS === "undefined") {
      console.error("PptxGenJS is not loaded. Please ensure pptxgen.bundle.min.js is included.");
      throw new Error("PptxGenJS library not found.");
    }
  }

  /**
   * Generates and downloads a PowerPoint presentation with the provided slides.
   * @param {Array<string>} slidesContent - An array of strings, where each string is the content for a slide.
   * @param {string} address - The biblical reference address to be displayed on each slide.
   * @param {string} fileName - The desired file name for the PowerPoint presentation.
   */
  generatePresentation(slidesContent, address, fileName = "Bible_Verses.pptx") {
    try {
      let pptx = new PptxGenJS();

      const defaultOpts = {
        x: 0.34,
        y: 1,
        w: 9.32,
        h: 3.93,
        align: "left",
        fontSize: 24,
        color: "000000", // Black color
      };

      const addressOpts = {
        x: 0.34,
        y: 0.14,
        w: 9.32,
        h: 0.63,
        align: "left",
        fontSize: 24,
        color: "000000", // Black color
      };

      slidesContent.forEach((slideText) => {
        let slide = pptx.addSlide();
        slide.addText(address, addressOpts);
        slide.addText(slideText, defaultOpts);
      });

      pptx.writeFile({ fileName });
    } catch (error) {
      console.error("Error generating PowerPoint presentation:", error);
      throw new Error("Could not generate PowerPoint file.");
    }
  }
}

export default SlideManager;
