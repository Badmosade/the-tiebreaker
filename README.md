# ⚖️ The Tiebreaker

> **AI-Powered Decision Intelligence & Dilemma Solver**  
> Dissect complex choices, evaluate trade-offs, and break decision paralysis with structured AI analysis.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite%208-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS%204-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini%20API-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](LICENSE)

---

## 🌟 Overview

**The Tiebreaker** is a full-stack decision-making application engineered to transform overwhelming dilemmas into clear, actionable paths. Whether you are weighing job offers, deliberating on home ownership vs. renting, evaluating technical architectures, or deciding on personal relocations, The Tiebreaker brings executive-level rigor to your thought process.

Built with a clean white and blue interface designed to minimize cognitive overload, the app provides three distinct analytical frameworks alongside a final synthesized verdict.

---

## ✨ Features

### 1. 🔀 Three Dedicated Analysis Modes
Switch seamlessly between three distinct analytical lenses depending on your personal decision-making style:

- **📋 Pros & Cons List**:
  - Highlights advantages and drawbacks categorized by impact level (**High**, **Medium**, **Low**).
  - Categorizes factors (Financial, Career, Time, Well-being, etc.).
  - **AI Risk Mitigations**: Every drawback is paired with a concrete, actionable de-risking strategy.
  - **Custom Factors**: Add your own pros or cons inline to include personal constraints.

- **📊 Multi-Criteria Comparison Matrix**:
  - Compares options across 4–6 core dimensions (e.g., Risk, Financial Upside, Daily Well-being, Long-term Growth).
  - **Interactive Weight Sliders**: Adjust criteria importance (1–5x) and watch weighted composite scores recalculate in real-time.
  - Add your own evaluation dimensions with custom weights.

- **🧭 Strategic SWOT Analysis**:
  - 4-quadrant breakdown: **Strengths** (internal upsides), **Weaknesses** (internal vulnerabilities), **Opportunities** (external growth), and **Threats** (external risks).
  - Includes a tailored strategic playbook takeaway for each candidate option.

---

### 2. 🏆 The Tiebreaker Verdict
An objective, synthesized recommendation that cuts through analysis paralysis:
- **Confidence Meter**: Percentage confidence in the winning option based on risk asymmetry.
- **The Crux Question (Litmus Test)**: A single diagnostic question that targets your core intuition.
- **Reversibility Framework (Jeff Bezos Model)**: Classifies whether your choice is a **Type 1** (irreversible, one-way door) or **Type 2** (reversible, two-way door) decision.
- **Devil's Advocate**: Uncovers hidden blind spots and counter-arguments to protect against confirmation bias.
- **3 Immediate Action Steps**: Practical steps to execute the decision with peace of mind.
- **Audio Briefing**: Read aloud the synthesis using browser-native speech synthesis.
- **Commitment Tracker**: Lock in your final choice to mark the dilemma as resolved.

---

### 3. ⚖️ Interactive Balance Scale
- An animated fulcrum and balance beam that dynamically tilts based on real-time criteria weights and score differentials between options.

---

### 4. 🪙 Coin Flip Gut-Check
- A virtual coin flip tool based on psychology: when the coin lands, notice whether you feel **relief** or **disappointment**—revealing your subconscious preference before rationalization takes over.

---

### 5. 📚 Decision Journal & Local Storage
- Automatically saves your evaluations to `localStorage`.
- Search through past dilemmas by keywords, tags, or options.
- Filter by status (**In Progress** vs. **Resolved**).

---

### 6. 📄 Clean Export & Sharing
- Export a clean, formatted Markdown executive summary.
- Download as a `.md` document or print directly to PDF.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite 8
- **Backend**: Express (Node.js), TypeScript (`tsx`)
- **AI Engine**: `@google/genai` TypeScript SDK (Google Gemini Flash models) with multi-model fallback resilience
- **Storage**: Client-side `localStorage` persistence

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- A Google Gemini API Key (get one from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the repository
```bash
git clone https://github.com/your-username/the-tiebreaker.git
cd the-tiebreaker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory (refer to `.env.example`):
```bash
cp .env.example .env
```

Add your Gemini API key:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
PORT=3000
```

### 4. Start the development server
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

### 5. Build for production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── .env.example             # Template for required environment variables
├── index.html               # Main HTML entry point
├── package.json             # Project dependencies and scripts
├── server.ts                # Express server with Gemini API proxy & Vite middleware
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration with Tailwind CSS v4
└── src/
    ├── main.tsx             # React application entry point
    ├── App.tsx              # Main dashboard orchestration and tab state
    ├── index.css            # Global Tailwind styling and typography
    ├── types/
    │   └── decision.ts      # TypeScript interfaces for decisions, SWOT, and metrics
    └── components/
        ├── Header.tsx               # Navigation, history counter, and actions
        ├── DecisionForm.tsx         # Dilemma input form with 3 analysis selectors
        ├── ProsConsView.tsx         # Pros and cons with impact badges and mitigations
        ├── ComparisonMatrixView.tsx # Multi-criteria table with live weight sliders
        ├── SwotAnalysisView.tsx     # 4-quadrant SWOT matrix
        ├── VerdictView.tsx          # Synthesized verdict, litmus test, and reversibility
        ├── TiebreakerScale.tsx      # Dynamic pivoting balance scale
        ├── GutCheckModal.tsx        # Virtual coin flip psychological reality test
        ├── HistoryDrawer.tsx        # Searchable past decisions drawer
        └── ExportModal.tsx          # Markdown summary copy, download, and print modal
```

---

## 🔒 Security & Privacy

- **Server-Side API Calls**: Gemini API keys are kept strictly on the backend (`server.ts`) and are never exposed to the client bundle.
- **Local Data**: All saved decisions remain in your browser's `localStorage` and are not sent to any external tracking database.

---

## 📄 License

This project is licensed under the [Apache License 2.0](LICENSE).
