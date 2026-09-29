# LabLens 🔬
### Turning confusing lab reports into a clear, personalised care plan.

> **Built for MLH Hack Day @ DTU** · Powered by Google Gemini AI

---

## What is LabLens?

LabLens is an AI-powered web application that helps patients understand their medical lab reports. Upload a PDF or image of your lab report and receive:

- **Plain-language explanations** of every test parameter
- **Status indicators** (Normal / High / Low / Critical) based on the lab's own reference ranges
- **Important findings** highlighted with clear next steps
- **Personalised care plan** — diet, activity, sleep, follow-up
- **English and Hindi** output
- **AI chat** to ask questions about your results
- **Report history** with parameter trend comparison
- **PDF export** of your full analysis

---

## Quick Start

### Prerequisites
- Node.js 18+
- A Google Gemini API key (get one at [Google AI Studio](https://aistudio.google.com))

### 1. Install dependencies

```bash
# From the project root (lablens/)
cd server && npm install
cd ../client && npm install
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

Your `server/.env` should contain:
```
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_actual_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

### 3. Run the application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

The app will be available at **http://localhost:5173**

---

## Using LabLens

### With a Gemini API Key
1. Open http://localhost:5173
2. Click **"Decode My Report"**
3. Upload a PDF, JPG, or PNG of your lab report (max 10 MB)
4. Select English or Hindi output
5. Click **"Analyse My Report"**
6. Wait ~15–30 seconds for Gemini to process
7. Explore the full analysis dashboard

### Demo Mode (No API Key Required)
1. Open http://localhost:5173
2. Click **"See Demo Report"** or **"Try the Demo Report"** on the upload page
3. Explore the complete analysis of a fictional sample report

---

## Project Structure

```
lablens/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── api/client.js       # Axios API client
│   │   ├── components/         # Shared UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ParameterTable.jsx
│   │   │   ├── FindingsCard.jsx
│   │   │   ├── CarePlan.jsx
│   │   │   └── ChatPanel.jsx
│   │   ├── data/demoReport.js  # Fictional demo data
│   │   ├── pages/              # Route pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── UploadPage.jsx
│   │   │   ├── AnalysisPage.jsx
│   │   │   └── HistoryPage.jsx
│   │   ├── styles/style.css    # Global CSS + Tailwind
│   │   └── main.jsx            # Router entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                     # Express backend
    ├── src/
    │   ├── services/
    │   │   ├── geminiService.js     # Gemini AI integration
    │   │   ├── documentService.js   # PDF text extraction
    │   │   └── storageService.js    # In-memory report storage
    │   ├── controllers/
    │   │   ├── reportController.js
    │   │   ├── chatController.js
    │   │   └── healthController.js
    │   ├── routes/apiRoutes.js
    │   ├── utils/medicalSafety.js   # Critical value detection
    │   └── index.js                 # Express app
    ├── .env.example
    └── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/reports/analyze` | Upload and analyse a report |
| GET | `/api/reports` | List all saved reports |
| GET | `/api/reports/:id` | Get a specific report |
| DELETE | `/api/reports/:id` | Delete a report |
| POST | `/api/chat` | Ask a question about a report |

### POST /api/reports/analyze
**Form data:**
- `report` (file) — PDF, JPG, or PNG
- `language` (string) — `en` or `hi`
- `reportDate` (string, optional) — YYYY-MM-DD

---

## Important Notes

### Medical Disclaimer
LabLens is an **informational tool only**. It is not a medical device and does not provide medical diagnoses, medical advice, or treatment recommendations. Always consult a qualified healthcare professional.

### Data Storage
Reports are stored **in memory only** — they do not persist when the server restarts. No medical files are stored permanently. This is intentional for the hackathon MVP.

### Demo Mode
The demo report uses entirely fictional data for "Rahul Demo". It is clearly labelled throughout the application.

---

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repo to Vercel
3. Set build command: `cd client && npm run build`
4. Set output directory: `client/dist`
5. Add env var: `VITE_API_BASE_URL=https://your-backend.railway.app`

### Backend (Railway / Render)
1. Deploy the `server/` directory
2. Add environment variables: `GEMINI_API_KEY`, `GEMINI_MODEL`, `PORT`

---

## Features

- [x] Landing page with demo dashboard preview
- [x] Drag-and-drop file upload (PDF, JPG, PNG)
- [x] Gemini-powered document extraction
- [x] Structured interpretation with status badges
- [x] Important findings dashboard
- [x] Searchable/filterable/expandable parameter table
- [x] Personalised care plan (diet, activity, sleep, follow-up)
- [x] English and Hindi language support
- [x] Medical red-flag detection
- [x] Report-grounded AI chat with suggested questions
- [x] Report history with parameter trend comparison
- [x] PDF export (jsPDF)
- [x] Demo mode with fictional data (no API key needed)
- [x] Comprehensive error handling
- [x] Medical disclaimer throughout

---

*Built with ❤️ at MLH Hack Day @ DTU*
