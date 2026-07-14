# ResearchMate — AI-Powered Multi-Paper Research Workspace

<div align="center">
  <h3>Created by Jessica and Kezha</h3>
  <p><strong>A Modern, Glassmorphic AI Assistant for Academic Research, Paper Comparison, and Intelligent Summarization.</strong></p>
</div>

---

## 🌌 Overview

**ResearchMate** is an advanced AI-powered research workspace designed for students, researchers, and academic scholars. It enables users to upload local PDF papers, search and import official papers directly from **arXiv.org**, pull repositories from **GitHub**, generate structured summaries, perform multi-paper comparative analytics, and chat interactively with documents using Google Gemini.

The application features a premium, interactive **Cosmic Space UI** with floating starfield particles, draggable resizable sidebars, and an interactive 3D planet globe with orbiting satellite bodies.

---

## 🚀 Key Features

* **Draggable Resizable Workspace**: A custom-built, responsive panel resizer allows users to drag and expand/contract the navigation sidebar, caching user preferences in `localStorage`.
* **Interactive 3D Cosmic Background**: High-performance canvas-based star particles backdrop and a drag-interactive 3D coordinates globe with three orbiting satellite planets demonstrating gravity physics.
* **AI Research Chat (Gemini API)**: Natural language conversational module to analyze, query, and dissect individual or multiple academic papers at once.
* **Multi-Paper Comparative Analytics**: Side-by-side parameter analysis mapping methodologies, key results, and similarities with dynamic vector charts.
* **Intelligent Summarization**: Automatically extracts abstracts, methodologies, findings, and lists potential research gaps to help guide thesis direction.
* **Nodemailer SMTP Feedback Modal**: A sleek modal dialog allowing users to send upgrade requests or bug reports. Configured to dispatch live HTML email notifications directly to `kezhanguukruse@gmail.com` with synthesized chime pop sound feedback.
* **Supabase Search Memories Hook**: Automatically logs arXiv search queries, timestamp markers, and result counts into a Supabase database table.
* **6 Premium Custom Themes**: Toggle between high-contrast, contrast-legibility-guaranteed themes:
  1. `🌌 Indigo Space` (Default)
  2. `🌌 Nordic Slate` (Minimalist)
  3. `🌿 Emerald Mint` (Aesthetic light mode)
  4. `🌋 Volcanic Amber` (Warm dark mode)
  5. `⚡ Midnight Neon` (Electric dark mode with glowing pink details)
  6. `🤖 Cyberpunk Glow` (Sci-Fi dark mode with glowing yellow outlines)

---

## 🛠️ Technology Stack

* **Frontend**: React 18, TypeScript, Vite, Vanilla CSS (Custom Inset Bevel Shadows & Glassmorphism variables).
* **Backend**: Node.js, Express, `tsx` runner.
* **AI Integration**: Google Gemini API via `@google/generative-ai`.
* **Database**: Supabase Client (`@supabase/supabase-js`).
* **Email System**: Nodemailer SMTP Client.
* **Icons**: Lucide React.

---

## 📥 Getting Started & Running Locally

### 1. Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/Zhangu1235/ResearchMate1.git
cd ResearchMate---Multi-Paper-Analyzer
npm install
```

### 3. Configure Environment Variables (`.env`)
Create a `.env` file in the root folder and add the following keys:

```env
# Google Gemini AI Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Admin Email Feedback SMTP (Gmail App Password)
SMTP_USER="kezhanguukruse@gmail.com"
SMTP_PASS="YOUR_16_CHARACTER_GOOGLE_APP_PASSWORD"

# Supabase Configurations (Optional)
VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
```

> [!TIP]
> If `SMTP_USER` and `SMTP_PASS` are omitted, the feedback forms will fall back automatically to writing JSON tickets inside the local `feedback/` folder and print the email log trace in the terminal console.
> Similarly, if Supabase configuration values are missing, the search memories system will run offline using safe stub fallbacks to ensure grading is never interrupted.

### 4. Running the Application
```bash
# Start development server (Frontend on http://localhost:5173, Backend on http://localhost:3000)
npm run dev

# Build the project for production
npm run build
```

---

## 🌐 Deployment

ResearchMate is configured for split-client-server production hosting:

* **Frontend Client (Vercel)**:
  * The interactive React SPA frontend is deployed on **Vercel** for high-availability page load speeds and automatic client-side route fallbacks.
* **Backend API Server (Render)**:
  * The Node/Express server is hosted on **Render** to run backend processing, manage local PDF files, run Gemini AI queries, and dispatch Nodemailer SMTP emails securely.

---

## 🗄️ Supabase Database Schema

To support the search memory recording capability, create a table in your Supabase SQL editor with the following definition:

```sql
create table search_memories (
  id bigint generated by default as identity primary key,
  query text not null,
  results_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 👥 Authors & Credits

* **Developed By**: Jessica and Kezha
* **Assignment Project**: Developed for the final academic term evaluation. All UI styles, resizers, and animations are built from scratch without pre-made design libraries.
