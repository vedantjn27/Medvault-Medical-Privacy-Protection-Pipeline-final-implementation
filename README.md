<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00D4FF,50:6C63FF,100:00C853&height=180&section=header&text=MedVault&fontSize=56&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=Healthcare%20Document%20Privacy%20Pipeline&descAlignY=60&descSize=18" alt="MedVault animated header" />

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=22&pause=1200&color=00D4FF&center=true&vCenter=true&width=900&lines=AI-powered+medical+document+redaction;OCR+%2B+NLP+%2B+Computer+Vision;HIPAA-aware+privacy+workflows;Audit-ready+healthcare+document+processing" alt="Animated MedVault highlights" />

<br/>

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Now-00D4FF?style=for-the-badge&logo=vercel&logoColor=white&labelColor=0D1117)](https://medvault-medical-privacy-protection-pipeline-final-adm7pemqz.vercel.app/)
[![Setup Guide](https://img.shields.io/badge/Setup_Guide-Read_Docs-6C63FF?style=for-the-badge&logo=readthedocs&logoColor=white&labelColor=0D1117)](./SETUP_GUIDE.md)
[![Python](https://img.shields.io/badge/Python-3.12.5-3776AB?style=for-the-badge&logo=python&logoColor=white&labelColor=0D1117)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white&labelColor=0D1117)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?style=for-the-badge&logo=next.js&logoColor=white&labelColor=0D1117)](https://nextjs.org/)

<br/>

**Privacy is not a barrier to progress. It is the foundation of trust in healthcare.**

</div>

---

## Preview

<div align="center">

<a href="https://medvault-medical-privacy-protection-pipeline-final-adm7pemqz.vercel.app/">
  <img src="./frontend/public/images/health-hero.png" alt="MedVault visual preview" width="900" />
</a>

<br/>

<sub>Click the preview to open the live deployment.</sub>

</div>

---

## What Is MedVault?

**MedVault** is an AI-powered healthcare document privacy platform for redacting sensitive patient information from medical documents. It combines OCR, NLP, computer vision, and a FastAPI/Next.js application stack to help process healthcare files while preserving auditability and document usability.

It is designed for workflows such as patient portal sharing, clinical research preparation, insurance processing, legal discovery, and internal healthcare compliance review.

<div align="center">

| Privacy-first | AI-powered | Healthcare-aware | Audit-ready |
|:--:|:--:|:--:|:--:|
| HIPAA Safe Harbor workflow support | OCR + NLP + vision | PDFs, images, DICOM, clinical files | Processing logs and reports |

</div>

---

## Highlights

<table>
<tr>
<td width="50%">

### Document Intelligence

- PDF, scanned image, DICOM, Word, Excel, and email archive support
- Automatic document classification for clinical notes, lab reports, claims, and consent forms
- Multi-page and batch document processing
- Layout-preserving redaction output

</td>
<td width="50%">

### AI Redaction Pipeline

- Detection for HIPAA identifiers and medical-specific PII
- OCR for scanned documents and image-based files
- NLP entity recognition with medical context
- Computer vision for faces, signatures, IDs, barcodes, and overlays

</td>
</tr>
<tr>
<td width="50%">

### Privacy Modes

- Patient portal mode
- Research sharing mode
- Insurance processing mode
- Legal discovery mode
- Custom privacy rules for enterprise workflows

</td>
<td width="50%">

### Compliance Support

- Safe Harbor identifier checks
- Audit trail generation
- Redaction reports
- Date shifting and synthetic replacement workflows
- Disclosure-risk review support

</td>
</tr>
</table>

---

## Privacy Modes

| Mode | What it does | Best for |
|---|---|---|
| **Patient Portal** | Removes unrelated patient data while preserving the requesting patient's useful context | Patient self-service records |
| **Research Sharing** | Applies stronger de-identification and synthetic demographic replacement | Clinical research datasets |
| **Insurance Processing** | Keeps claim-relevant data and removes excess clinical detail | Payer and claim workflows |
| **Legal Discovery** | Adds comprehensive redaction and privilege-aware handling | Legal review and discovery |
| **Custom** | Allows configurable privacy rules | Organization-specific workflows |

---

## Architecture

```mermaid
graph TB
    subgraph CLIENT["Client Layer"]
        UI["Next.js Frontend<br/>Vercel Deployment"]
    end

    subgraph API["API Layer"]
        GW["FastAPI Gateway<br/>Render Deployment"]
        AUTH["Auth + OTP<br/>Twilio SMS"]
    end

    subgraph PROC["Processing Engine"]
        direction LR
        OCR["Medical OCR<br/>Tesseract + pdfplumber"]
        NLP["NLP Pipeline<br/>spaCy + medical rules"]
        CV["Computer Vision<br/>OpenCV + image analysis"]
        RED["Redaction Engine<br/>PyMuPDF + Pillow"]
    end

    subgraph FORMATS["Document Formats"]
        PDF["PDF / DICOM"]
        IMG["Images<br/>JPEG / PNG / TIFF"]
        DOC["Word / Excel<br/>Email archives"]
    end

    subgraph OUTPUT["Output Layer"]
        REDACTED["Redacted documents"]
        AUDIT["Audit trail logs"]
        REPORT["Compliance reports"]
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
    style OUTPUT fill:#0d1117,stroke:#FFD166,color:#FFD166
```

---

## Processing Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend<br/>(Next.js)
    participant API as FastAPI
    participant OCR as OCR Engine
    participant NLP as NLP Pipeline
    participant CV as Vision Engine
    participant RED as Redactor

    User->>FE: Upload medical document
    FE->>API: POST /upload
    API->>API: Validate and classify document
    API->>OCR: Extract text and coordinates
    OCR-->>NLP: Raw text + layout data
    NLP->>NLP: Detect HIPAA identifiers and entities
    NLP-->>CV: Entities + bounding boxes
    CV->>CV: Detect faces, signatures, barcodes, overlays
    CV-->>RED: Mark sensitive regions
    RED->>RED: Apply irreversible redaction
    RED-->>API: Redacted document + audit log
    API-->>FE: Download link + compliance report
    FE-->>User: Redacted file ready
```

---

## HIPAA-Aware Redaction Flow

```mermaid
flowchart LR
    A["Input document"] --> B{"Document type?"}
    B -->|PDF| C["pdfplumber + PyMuPDF"]
    B -->|Image| D["Tesseract OCR + OpenCV"]
    B -->|DICOM| E["PyDICOM parser"]
    B -->|Word / Excel| F["python-docx + pandas"]

    C & D & E & F --> G["Medical NLP + rules"]
    G --> H{{"Identifier detection"}}

    H --> I["Names and dates"]
    H --> J["IDs and numbers"]
    H --> K["Locations and contacts"]
    H --> L["Biometric and visual data"]

    I & J & K & L --> M["Redaction engine"]
    M --> N["Audit log"]
    M --> O["Redacted output"]
    N --> P["Compliance report"]

    style A fill:#1a1a2e,stroke:#00D4FF,color:#fff
    style O fill:#1a1a2e,stroke:#00C853,color:#fff
    style G fill:#1a1a2e,stroke:#6C63FF,color:#fff
    style M fill:#1a1a2e,stroke:#FF6B35,color:#fff
```

---

## Tech Stack

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
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)](https://recharts.org/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)](https://axios-http.com/)

### Deployment

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com/)
[![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy-D71F00?style=flat-square&logo=python&logoColor=white)](https://sqlalchemy.org/)

</div>

---

## Integration Ecosystem

```mermaid
mindmap
  root((MedVault))
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
      X-Ray and MRI
    Lab Systems
      LIS Integration
      Lab Result APIs
      CBC and Vital Signs
    Deployment
      Render Backend
      Vercel Frontend
      Twilio OTP Auth
```

---

## Quick Start

For detailed setup instructions, see the [full setup guide](./SETUP_GUIDE.md).

### Prerequisites

| Requirement | Version | Notes |
|---|---:|---|
| Python | `3.12.5` | See `.python-version` |
| Node.js | `18+` | LTS recommended |
| Poppler | Latest | Required for `pdf2image` |
| Tesseract OCR | Latest | Required for image OCR |
| Twilio account | Any active account | Required for OTP SMS authentication |

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python -m spacy download en_core_web_md
python main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Local URLs

| Service | URL |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:8000` |
| API Docs | `http://localhost:8000/docs` |

---

## Project Structure

```text
medvault/
|-- backend/
|   |-- main.py
|   |-- requirements.txt
|   |-- Procfile
|   |-- apt.txt
|   |-- test_doc_create.py
|   `-- medvault_test_files/
|
|-- frontend/
|   |-- app/
|   |-- components/
|   |-- hooks/
|   |-- lib/
|   |-- styles/
|   |-- types/
|   `-- package.json
|
|-- SETUP_GUIDE.md
|-- setup.txt
|-- requirements.txt
`-- README.md
```

---

## Testing

Generate sample healthcare test files:

```bash
cd backend
python test_doc_create.py
```

Sample files are available in:

```text
backend/medvault_test_files/
```

---

## Deployment

| Layer | Platform | Link |
|---|---|---|
| Frontend | Vercel | [Live demo](https://medvault-medical-privacy-protection-pipeline-final-adm7pemqz.vercel.app/) |
| Backend | Render | See `backend/deployed.txt` |

<div align="center">

[![Open Live Demo](https://img.shields.io/badge/Open_Live_Demo-MedVault_App-00D4FF?style=for-the-badge&logo=vercel&logoColor=white&labelColor=0D1117)](https://medvault-medical-privacy-protection-pipeline-final-adm7pemqz.vercel.app/)
[![Read Setup Guide](https://img.shields.io/badge/Read_Setup_Guide-Documentation-6C63FF?style=for-the-badge&logo=readthedocs&logoColor=white&labelColor=0D1117)](./SETUP_GUIDE.md)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00C853,50:6C63FF,100:00D4FF&height=120&section=footer&animation=twinkling" alt="Animated footer wave" />

</div>
