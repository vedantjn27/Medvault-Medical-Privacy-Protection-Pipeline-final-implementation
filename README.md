<div align="center">

# 🏥 MedVault

### Healthcare Document Privacy Pipeline
**AI-Powered · HIPAA Compliant · Medical-Grade Redaction**

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-00D4FF?style=for-the-badge&logoColor=white)](https://medvault-medical-privacy-protection-pipeline-final-adm7pemqz.vercel.app/)
[![Setup Guide](https://img.shields.io/badge/📖_Setup_Guide-Read_Docs-6C63FF?style=for-the-badge&logoColor=white)](./SETUP_GUIDE.md)
[![Python](https://img.shields.io/badge/Python-3.12.5-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-00C853?style=for-the-badge&logoColor=white)](#compliance)

<br/>

> *"Privacy is not a barrier to Progress — It is the Foundation of Trust in Healthcare."*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Processing Workflow](#-processing-workflow)
- [Tech Stack](#-tech-stack)
- [HIPAA Compliance](#-hipaa-compliance)
- [Integration Ecosystem](#-integration-ecosystem)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)

---

## 🏥 Overview

**MedVault** is an enterprise-grade healthcare document privacy platform that transforms how medical organizations handle sensitive patient information. By combining **advanced AI**, **computer vision**, and **NLP pipelines**, MedVault eliminates the error-prone manual redaction processes that threaten patient privacy and HIPAA compliance.

<div align="center">

| 🔒 Privacy-First | ⚡ AI-Powered | 🔗 EHR Integration | 📊 Audit Trails |
|:---:|:---:|:---:|:---:|
| Full HIPAA Safe Harbor | NLP + Computer Vision | Epic, Cerner, FHIR | Immutable Logs |

</div>

---

## ✨ Key Features

### 📄 Document Processing

<table>
<tr>
<td width="50%">

**Multi-Format Ingestion**
- 📑 PDFs (searchable & scanned)
- 🖼️ Images — JPEG, PNG, TIFF, BMP
- 🩺 DICOM medical imaging files
- 📝 Word, Excel & Email archives

</td>
<td width="50%">

**Intelligent Classification**
- 🏷️ Auto-detect discharge summaries
- 🧪 Lab reports & insurance claims
- 📋 Consent forms & clinical notes
- 📦 Batch processing with tracking

</td>
</tr>
</table>

---

### 🔬 AI-Powered Entity Recognition

<table>
<tr>
<td width="33%">

**🧠 PII Detection**
- All 18 HIPAA identifiers
- Medical-context awareness
- Insurance info extraction
- Date & time intelligence

</td>
<td width="33%">

**👁️ Computer Vision**
- Face detection & blurring
- Signature identification
- Medical scan processing
- ID card recognition

</td>
<td width="33%">

**🔤 OCR & NLP**
- Medical-enhanced OCR
- Handwriting recognition
- Multi-language support
- Prescription parsing

</td>
</tr>
</table>

---

### 🛡️ Privacy Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| 🏥 **Patient Portal** | Removes other patients' info, preserves own | Patient self-service portals |
| 🔬 **Research Sharing** | Full de-identification + synthetic demographics | Clinical research datasets |
| 💼 **Insurance Processing** | Keeps claim-relevant data only | Insurance adjudication |
| ⚖️ **Legal Discovery** | Comprehensive redaction + privilege protection | Legal proceedings |
| ⚙️ **Custom** | Fully configurable privacy levels | Enterprise use cases |

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph CLIENT["🖥️ Client Layer"]
        UI["Next.js Frontend<br/>Vercel Deployment"]
    end

    subgraph API["⚙️ API Layer"]
        GW["FastAPI Gateway<br/>Render Deployment"]
        AUTH["🔐 Auth & OTP<br/>Twilio SMS"]
    end

    subgraph PROC["🧠 Processing Engine"]
        direction LR
        OCR["Medical OCR<br/>Tesseract + Custom"]
        NLP["NLP Pipeline<br/>spaCy + SciSpaCy"]
        CV["Computer Vision<br/>OpenCV + YOLO"]
        RED["Redaction Engine<br/>PyMuPDF + Pillow"]
    end

    subgraph FORMATS["📄 Document Formats"]
        PDF["PDF / DICOM"]
        IMG["Images<br/>JPEG · PNG · TIFF"]
        DOC["Word / Excel<br/>Email Archives"]
    end

    subgraph OUTPUT["✅ Output Layer"]
        REDACTED["Redacted Documents"]
        AUDIT["Audit Trail Logs"]
        REPORT["Compliance Reports"]
    end

    UI -->|HTTPS| GW
    GW --> AUTH
    GW --> PROC
    FORMATS --> OCR
    OCR --> NLP
    NLP --> CV
    CV --> RED
    RED --> OUTPUT

    style CLIENT fill:#0d1117,stroke:#00D4FF,color:#00D4FF
    style API fill:#0d1117,stroke:#6C63FF,color:#6C63FF
    style PROC fill:#0d1117,stroke:#00C853,color:#00C853
    style FORMATS fill:#0d1117,stroke:#FF6B35,color:#FF6B35
    style OUTPUT fill:#0d1117,stroke:#FFD700,color:#FFD700
```

---

## 🔄 Processing Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 User
    participant FE as 🖥️ Frontend<br/>(Next.js)
    participant API as ⚙️ FastAPI
    participant OCR as 🔤 OCR Engine
    participant NLP as 🧠 NLP Pipeline
    participant CV as 👁️ Vision Engine
    participant RED as 🛡️ Redactor

    User->>FE: Upload medical document
    FE->>API: POST /upload (multipart)
    API->>API: Validate & classify document
    API->>OCR: Extract text (Tesseract + pdfplumber)
    OCR-->>NLP: Raw text + coordinates
    NLP->>NLP: spaCy NER — detect 18 HIPAA identifiers
    NLP-->>CV: Identified entities + bounding boxes
    CV->>CV: OpenCV — detect faces, signatures, barcodes
    CV-->>RED: All PII regions marked
    RED->>RED: Apply redaction (PyMuPDF / Pillow)
    RED-->>API: Redacted document + audit log
    API-->>FE: Download link + compliance report
    FE-->>User: ✅ Redacted file ready
```

---

## 🔒 HIPAA Compliance Pipeline

```mermaid
flowchart LR
    A["📥 Input Document"] --> B{"Document<br/>Type?"}
    B -->|PDF| C["PDF Plumber<br/>+ PyMuPDF"]
    B -->|Image| D["Tesseract OCR<br/>+ OpenCV"]
    B -->|DICOM| E["PyDICOM<br/>Parser"]
    B -->|Word/Excel| F["python-docx<br/>+ pandas"]

    C & D & E & F --> G["🧠 spaCy NER<br/>Medical Context"]

    G --> H{{"18 HIPAA<br/>Identifiers"}}

    H --> I["Names & Dates"]
    H --> J["IDs & Numbers"]
    H --> K["Locations & Contact"]
    H --> L["Biometric Data"]

    I & J & K & L --> M["🛡️ Redaction Engine"]
    M --> N["📋 Audit Log<br/>Generation"]
    M --> O["✅ HIPAA-Compliant<br/>Output"]
    N --> P["📊 Compliance<br/>Report"]

    style A fill:#1a1a2e,stroke:#00D4FF,color:#fff
    style O fill:#1a1a2e,stroke:#00C853,color:#fff
    style G fill:#1a1a2e,stroke:#6C63FF,color:#fff
    style M fill:#1a1a2e,stroke:#FF6B35,color:#fff
```

---

## 🛠️ Tech Stack

<div align="center">

### Backend
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python_3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![spaCy](https://img.shields.io/badge/spaCy-09A3D5?style=flat-square&logo=spacy&logoColor=white)](https://spacy.io/)
[![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=flat-square&logo=opencv&logoColor=white)](https://opencv.org/)
[![Uvicorn](https://img.shields.io/badge/Uvicorn-499848?style=flat-square&logo=gunicorn&logoColor=white)](https://www.uvicorn.org/)
[![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=flat-square&logo=twilio&logoColor=white)](https://twilio.com/)

### Frontend
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)](https://recharts.org/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)](https://axios-http.com/)

### Deployment & Services
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com/)
[![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy-D71F00?style=flat-square&logo=python&logoColor=white)](https://sqlalchemy.org/)

</div>

---

## 🔗 Integration Ecosystem

```mermaid
mindmap
  root((🏥 MedVault))
    EHR Systems
      Epic EMR
      Cerner
      Allscripts
    Standards
      HL7 FHIR
      HIPAA Safe Harbor
      Expert Determination
    Imaging
      PACS Integration
      DICOM Processing
      X-Ray & MRI
    Lab Systems
      LIS Integration
      Lab Result APIs
      CBC & Vital Signs
    Deployment
      Render Backend
      Vercel Frontend
      Twilio OTP Auth
```

---

## ⚡ Quick Start

> 📖 **For detailed step-by-step instructions with screenshots, visit the [📋 Full Setup Guide](./SETUP_GUIDE.md)**

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Python | `3.12.5` | See `.python-version` |
| Node.js | `18+` | LTS recommended |
| Poppler | Latest | Required for `pdf2image` |
| Tesseract OCR | Latest | Required for image OCR |
| Twilio Account | — | For OTP SMS authentication |

### 1️⃣ Clone & Setup Backend

```bash
# Clone the repository
git clone https://github.com/your-org/medvault.git
cd medvault/backend

# Install Python dependencies
pip install -r requirements.txt

# Download spaCy language models
python -m spacy download en_core_web_sm
python -m spacy download en_core_web_md

# Configure environment variables
cp .env .env.local   # Fill in your Twilio credentials

# Start the backend server
python main.py
```

### 2️⃣ Setup Frontend

```bash
cd ../frontend

# Install all dependencies
npm install

# Start the development server
npm run dev
```

### 3️⃣ Access the Application

| Service | URL |
|---------|-----|
| 🖥️ Frontend | `http://localhost:3000` |
| ⚙️ Backend API | `http://localhost:8000` |
| 📖 API Docs | `http://localhost:8000/docs` |

> 💡 **Need the full `.env` variable list?** Check [`backend/.env`](./backend/.env) and the [Setup Guide](./SETUP_GUIDE.md).

---

## 🌐 Deployment

| Layer | Platform | Status |
|-------|----------|--------|
| 🖥️ Frontend | [Vercel](https://vercel.com) | [![Live](https://img.shields.io/badge/status-live-00C853?style=flat-square)](https://medvault-medical-privacy-protection-pipeline-final-adm7pemqz.vercel.app/) |
| ⚙️ Backend | [Render](https://render.com) | [![Live](https://img.shields.io/badge/status-live-00C853?style=flat-square)](#) |

### 🚀 Try the Live Demo

<div align="center">

[![Open Live Demo](https://img.shields.io/badge/🌐_Open_Live_Demo-MedVault_App-00D4FF?style=for-the-badge&logoColor=white&labelColor=0d1117)](https://medvault-medical-privacy-protection-pipeline-final-adm7pemqz.vercel.app/)

</div>

---

## 📂 Project Structure

```
medvault/
├── 📁 backend/
│   ├── main.py                  # FastAPI application entry point
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variable template
│   ├── .python-version          # Python version pin (3.12.5)
│   ├── Procfile                 # Render deployment config
│   ├── apt.txt                  # System-level dependencies
│   ├── test_doc_create.py       # Test document generator
│   └── 📁 medvault_test_files/  # Sample documents for testing
│
├── 📁 frontend/
│   ├── 📁 app/                  # Next.js app directory
│   ├── 📁 components/           # Reusable UI components
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 lib/                  # Utility functions
│   ├── 📁 styles/               # Global styles
│   ├── 📁 types/                # TypeScript type definitions
│   └── package.json             # Node.js dependencies
│
├── QR.png                       # QR code for live demo
├── setup.txt                    # Quick setup reference
├── SETUP_GUIDE.md               # 📖 Full detailed setup guide
└── README.md                    # This file
```

---

## 🧪 Testing

```bash
# Generate test documents (PDFs, Word, images)
cd backend
python test_doc_create.py

# Sample test files are available in:
# backend/medvault_test_files/
```

---

---

<div align="center">

**🏥 MedVault** · Built with ❤️ for Healthcare Privacy

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-00D4FF?style=for-the-badge)](https://medvault-medical-privacy-protection-pipeline-final-adm7pemqz.vercel.app/)
[![Setup Guide](https://img.shields.io/badge/📖_Setup_Guide-Read_Docs-6C63FF?style=for-the-badge)](./SETUP_GUIDE.md)

*"Privacy is not a barrier to Progress — It is the Foundation of Trust in Healthcare."*

</div>
