<div align="center"> 

# 📋 MedVault — Full Setup Guide

[![Back to README](https://img.shields.io/badge/←_Back_to_README-MedVault-00D4FF?style=for-the-badge)](./README.md)
[![Live Demo](https://img.shields.io/badge/🚀_Skip_Setup-Use_Live_Demo-00C853?style=for-the-badge)](https://medvault-medical-privacy-protection-pipeline-final-adm7pemqz.vercel.app/)
 
</div>

---

## 📑 Table of Contents

- [Prerequisites](#-prerequisites)
- [System Dependencies](#-system-dependencies)
- [Backend Setup](#-backend-setup)
- [Environment Variables](#-environment-variables)
- [Frontend Setup](#-frontend-setup)
- [Running the App](#-running-the-application)
- [Testing](#-testing)
- [Deployment Reference](#-deployment-reference)
- [Troubleshooting](#-troubleshooting)

---

## ✅ Prerequisites

Before you begin, make sure you have the following installed:

| Tool | Required Version | Download |
|------|-----------------|----------|
| **Python** | `3.12.5` (exact) | [python.org](https://python.org/downloads/) |
| **Node.js** | `18.x` or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | `9.x` or higher | Bundled with Node.js |
| **Git** | Any recent version | [git-scm.com](https://git-scm.com/) |
| **Poppler** | Latest | See below |
| **Tesseract OCR** | `5.x` | See below |
| **Twilio Account** | — | [twilio.com](https://twilio.com) |

> **💡 Tip:** Check your versions by running `python --version`, `node --version`, `npm --version`

---

## 🔧 System Dependencies

### 1. Poppler (Required for `pdf2image`)

<details>
<summary>🪟 Windows</summary>

1. Download the latest Poppler for Windows from [oschwartz10612/poppler-windows](https://github.com/oschwartz10612/poppler-windows/releases)
2. Extract to `C:\poppler`
3. Add `C:\poppler\Library\bin` to your **System PATH**
4. Verify: `pdftoppm -v`

</details>

<details>
<summary>🍎 macOS</summary>

```bash
brew install poppler
```

</details>

<details>
<summary>🐧 Linux (Ubuntu/Debian)</summary>

```bash
sudo apt-get install -y poppler-utils
```

</details>

---

### 2. Tesseract OCR (Required for image-based OCR)

<details>
<summary>🪟 Windows</summary>

1. Download installer from [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki)
2. During install, select **"Add to PATH"**
3. Verify: `tesseract --version`

</details>

<details>
<summary>🍎 macOS</summary>

```bash
brew install tesseract
```

</details>

<details>
<summary>🐧 Linux (Ubuntu/Debian)</summary>

```bash
sudo apt-get install -y tesseract-ocr
```

</details>

---

## 🐍 Backend Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-org/medvault.git
cd medvault
```

### Step 2 — Navigate to Backend

```bash
cd backend
```

### Step 3 — Create a Virtual Environment *(recommended)*

```bash
# Create virtual environment
python -m venv venv

# Activate — Windows
venv\Scripts\activate

# Activate — macOS/Linux
source venv/bin/activate
```

### Step 4 — Install Python Dependencies

```bash
pip install -r requirements.txt
```

> **⚠️ Note:** This installs all packages listed in `requirements.txt` including FastAPI, spaCy, OpenCV, PyMuPDF, Tesseract bindings, and more.

### Step 5 — Download spaCy Language Models

```bash
# Small model (faster, less accurate)
python -m spacy download en_core_web_sm

# Medium model (recommended for production)
python -m spacy download en_core_web_md
```

---

## 🔑 Environment Variables

The backend requires a `.env` file in the `backend/` directory.

### Required Variables

Create or edit `backend/.env` with the following:

```env
# ─── Twilio (OTP SMS Authentication) ──────────────────────────────
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# ─── Application ──────────────────────────────────────────────────
SECRET_KEY=your_secret_key_here
DEBUG=False
ALLOWED_ORIGINS=http://localhost:3000
```

### How to Get Twilio Credentials

1. Sign up at [twilio.com](https://www.twilio.com/try-twilio)
2. Go to **Console > Account Info**
3. Copy **Account SID** and **Auth Token**
4. Get or buy a **Twilio Phone Number** for SMS

---

## 🌐 Frontend Setup

### Step 1 — Navigate to Frontend

```bash
cd ../frontend
```

### Step 2 — Install All Dependencies

```bash
npm install
```

This single command installs everything from `package.json`, including:

| Package | Purpose |
|---------|---------|
| `next` | React framework |
| `react` / `react-dom` | UI library |
| `typescript` | Type safety |
| `tailwindcss` | Styling |
| `@radix-ui/react-icons` | Icon set |
| `lucide-react` | Icon components |
| `recharts` | Data visualization |
| `axios` | HTTP client |
| `clsx` | Class merging utility |

> **💡 Note:** If you encounter peer dependency conflicts, try `npm install --legacy-peer-deps`

---

## 🚀 Running the Application

You need **two terminals** running simultaneously:

### Terminal 1 — Backend

```bash
cd backend

# Activate virtual environment first (if using one)
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

python main.py
```

✅ Backend starts at: **`http://localhost:8000`**
📖 Interactive API docs: **`http://localhost:8000/docs`**

---

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

✅ Frontend starts at: **`http://localhost:3000`**

---

### Access Points Summary

| Service | URL | Description |
|---------|-----|-------------|
| 🖥️ Web App | `http://localhost:3000` | Main user interface |
| ⚙️ API Server | `http://localhost:8000` | REST API backend |
| 📖 Swagger UI | `http://localhost:8000/docs` | Interactive API documentation |
| 📄 ReDoc | `http://localhost:8000/redoc` | Alternative API docs |

---

## 🧪 Testing

### Generate Test Documents

A helper script is included to create sample test files (PDFs, Word docs, images):

```bash
cd backend
python test_doc_create.py
```

Generated files are saved to `backend/medvault_test_files/`.

### Sample Test Files

Pre-made sample documents are already available in:

```
backend/medvault_test_files/
```

Use these to test the redaction pipeline without needing real medical documents.

---

## ☁️ Deployment Reference

### Frontend — Vercel

The frontend is deployed on **Vercel**:

```
https://medvault-medical-privacy-protection-pipeline-final-adm7pemqz.vercel.app/
```

To deploy your own:

```bash
cd frontend
npx vercel --prod
```

### Backend — Render

The backend is deployed on **Render** using the included `Procfile`:

```
# Procfile
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

System-level dependencies are listed in `apt.txt`:

```
# apt.txt (auto-installed by Render)
poppler-utils
tesseract-ocr
```

---

## 🩺 Troubleshooting

### ❌ `pdf2image` errors — "poppler not found"

**Solution:** Ensure Poppler is installed and its `bin/` directory is in your system `PATH`.

```bash
# Verify Poppler is accessible
pdftoppm -v
```

---

### ❌ `pytesseract` errors — "tesseract is not installed"

**Solution:** Install Tesseract OCR and ensure it's in your `PATH`.

```bash
# Verify Tesseract is accessible
tesseract --version
```

---

### ❌ spaCy model not found

**Solution:** Download the required model explicitly:

```bash
python -m spacy download en_core_web_sm
python -m spacy download en_core_web_md
```

---

### ❌ npm install fails with peer dependency errors

**Solution:** Use the legacy peer deps flag:

```bash
npm install --legacy-peer-deps
```

---

### ❌ CORS errors in browser

**Solution:** Make sure your `ALLOWED_ORIGINS` in `.env` matches the frontend URL:

```env
ALLOWED_ORIGINS=http://localhost:3000
```

---

### ❌ Twilio SMS not sending

**Solution:** Verify these in your Twilio console:
- Account SID and Auth Token are correct
- Your Twilio phone number is SMS-capable
- Your Twilio trial account is verified for the destination number

---

## 📌 Quick Reference

```bash
# ── One-shot backend startup ──────────────────────────────
cd backend && pip install -r requirements.txt && \
python -m spacy download en_core_web_sm && \
python -m spacy download en_core_web_md && \
python main.py

# ── One-shot frontend startup ─────────────────────────────
cd frontend && npm install && npm run dev
```

---

<div align="center">

[![Back to README](https://img.shields.io/badge/←_Back_to_README-MedVault-00D4FF?style=for-the-badge)](./README.md)
[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Try_It_Now-00C853?style=for-the-badge)](https://medvault-medical-privacy-protection-pipeline-final-adm7pemqz.vercel.app/)

*Need help? Open an issue on GitHub.*

</div>
