# 📖 Get-Bible-Verse

A specialized, high-performance web ecosystem designed for church presentation workflows. It enables rapid biblical text querying, dynamic visualization, and automated multi-window slide generation.

---

## 🚀 Key Features

* **Advanced Search Logic:** Built-in Regex-powered search engine that supports complex textual queries with integrated Autocomplete mechanics for instantaneous navigation.
* **Cross-Window Projection:** Leverages the `BroadcastChannel API` to seamlessly dispatch state and payload data from the control window to a secondary projection screen, enabling real-time, zero-latency slide management.
* **Automated PPTX Generation:** Integrated with `PptxGenJS` to dynamically compile and export selected verses into structured, production-ready PowerPoint presentations directly from the browser.
* **Intelligent Slide Splitting:** Implements a custom text-chunking algorithm that evaluates character length and dynamically splits long passages into perfectly proportioned slides to guarantee maximum screen readability.
* **Custom Theme Engine:** Features reactive Light and Dark modes with state persistence managed via `localStorage`.

---

## 🛠️ Technical Stack

* **Frontend Architecture:** Pure JavaScript (ES6+), HTML5, CSS3.
* **Core Libraries:** PptxGenJS (Client-side PowerPoint generation).
* **Web APIs:** BroadcastChannel API (Multi-window state synchronization).
* **Data Pipelines:** Python automation scripts used for raw text extraction, structural reverse engineering, and conversion into high-performance relational JSON schemas.

---

## ⚙️ Architectural Workflow

1. **Data Engineering & Extraction:** Solved missing database structures via customized Python scripts that perform sequence-matching algorithms across verses to automatically map chapters and biblical book schemas.
2. **Query Processing:** User input is parsed via granular Regular Expressions (Regex) and instantly matched against the local performance-optimized JSON data layers.
3. **Synchronization & Projection:** The ecosystem utilizes a unidirectional `BroadcastChannel` pipeline to broadcast rendering instructions to an isolated display window designed specifically for projectors or church screens.

---

## 🌐 Live Demo

🔗 **Production Link:** https://get-bible-verse.netlify.app
