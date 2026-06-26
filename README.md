# ⚖️ LegalSimplifier — AI Legal Document Analyzer

Upload any legal document and AI explains every clause in simple language.

## 🔍 What it does
- Upload PDF or paste legal text
- AI reads every clause and explains it simply
- Highlights DANGER clauses in red, warnings in yellow
- Gives an Overall Risk Score (Low / Medium / High)
- Lists key things to know before signing
- Saves analysis history for logged-in users

## 💡 Real problem it solves
Millions of Indians sign rental agreements, job bonds, and loan documents without understanding what they're agreeing to. This app makes legal language accessible to everyone.

## 🛠️ Tech Stack
- **Frontend:** React.js, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI:** Groq API (LLaMA 3.3 70B)
- **Auth:** JWT
- **PDF Parsing:** pdf-parse

## 🚀 How to run locally
1. Clone the repo
2. `cd backend && npm install && npm run dev`
3. `cd frontend && npm install && npm start`
4. Add `.env` with MONGO_URI, JWT_SECRET, GROQ_API_KEY
