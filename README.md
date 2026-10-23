# ChildNutri AI — Multimodal Pediatric Malnutrition Screening & Clinical Decision Support System

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![WHO Standards](https://img.shields.io/badge/WHO-Child%20Growth%20Standards%20(2006)-0088cc.svg)](https://www.who.int/tools/child-growth-standards)
[![LightGBM](https://img.shields.io/badge/LightGBM-4.3%2B-brightgreen.svg)](https://lightgbm.readthedocs.io/)
[![ONNX Runtime](https://img.shields.io/badge/ONNX%20Runtime-1.17%2B-005CED.svg?logo=onnx&logoColor=white)](https://onnxruntime.ai/)
[![ReportLab](https://img.shields.io/badge/PDF%20Generation-ReportLab%204.1%2B-red.svg)](https://www.reportlab.com/)
[![Tesseract OCR](https://img.shields.io/badge/OCR-Tesseract%205.x-orange.svg)](https://github.com/tesseract-ocr/tesseract)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.14028491.svg)](https://doi.org/10.5281/zenodo.14028491)

> **ChildNutri AI** is a state-of-the-art, explainable clinical decision-support platform designed to screen, classify, forecast, and manage infant and toddler malnutrition. By combining **deterministic WHO 2006 LMS anthropometric standards**, **calibrated LightGBM machine learning**, **advisory deep learning computer vision**, and **smart health card OCR**, the system bridges the gap between grassroots Anganwadi workers, pediatricians, and parents.

---

## 🌟 Executive Summary & Clinical Philosophy

Most conventional AI projects attempt to predict malnutrition by training opaque deep learning models directly on anthropometric features. In real-world medicine, this approach is fundamentally flawed: **determining current malnutrition is NOT a machine learning task; it is governed by definitive World Health Organization (WHO) and CMAM clinical thresholds.**

ChildNutri AI is engineered around **5 core clinical tenets**:
1. **Current Malnutrition is Deterministic:** Physical measurements (weight, height/length, MUAC, head circumference, bilateral edema) are evaluated against exact WHO LMS mathematical algorithms ($L, M, S$).
2. **Future Risk IS a Machine Learning Task:** A single cross-sectional measurement cannot predict tomorrow's health. We combine **individual longitudinal velocity (growth faltering)** with a **calibrated LightGBM risk-factor model** trained on 40,000+ toddler records to calculate early-warning risk scores over a 3–6 month horizon.
3. **Computer Vision is Advisory, Never Diagnostic:** Child photos can indicate visible wasting, but photos can be confounded by clothing, loose skin, or posture. Our vision screening incorporates a **3-Layer Clinical Safety Gate** that provides qualitative inspection hints but can **never** override physical anthropometry.
4. **Predictable, Rule-Based Care Plans:** Nutrition advice cannot be hallucinated by generative models. Every child receives deterministic, age-tailored 8-section diet plans compliant with **WHO, POSHAN Abhiyaan, and Indian ICDS guidelines**.
5. **Human-in-the-Loop OCR:** Automated health report extraction flags low-confidence readings and mandates health worker verification before saving.

---

## 🚀 Key Features

### 1. 📐 Deterministic WHO LMS Z-Score Engine
* Implements the exact 2006 WHO Child Growth Standards LMS mathematical formulas:
  $$Z = \frac{(X/M)^L - 1}{L \cdot S} \quad (L \neq 0) \qquad Z = \frac{\ln(X/M)}{S} \quad (L = 0)$$
* Computes exact Standard Deviation (SD) scores for:
  * **WAZ** (Weight-for-Age) — Underweight identification
  * **HAZ** (Length/Height-for-Age) — Stunting identification
  * **WHZ** (Weight-for-Length/Height) — Wasting / SAM / MAM screening
  * **BAZ** (BMI-for-Age) — Acute body composition assessment
  * **HCZ** (Head Circumference-for-Age) — Neurodevelopmental tracking
  * **MUAC** (Mid-Upper Arm Circumference) — Emergency acute wasting triage (< 11.5 cm = SAM, 11.5–12.5 cm = MAM)
* Corrects for extreme measurements beyond $\pm 3\text{ SD}$ per WHO guidelines.

### 2. 🔮 Calibrated LightGBM Future-Risk Engine
* Trained on **40,071 toddler records** from validated clinical datasets.
* Synthesizes 11 multidimensional household and socio-demographic indicators:
  * Child age & biological sex
  * Dietary diversity (WHO 7 food groups) & meal frequency
  * Active breastfeeding status
  * Morbidity episodes in past 14 days (diarrhea, fever, acute respiratory infection)
  * Immunization status (complete vs. partial vs. none)
  * Maternal education level & household wealth quintile
  * Urban vs. rural environmental infrastructure
* **Model Calibration:** Calibrated with Isotonic Regression to guarantee reliable posterior probabilities (Brier score: `0.1431`, ROC-AUC: `0.8700`).
* **TreeSHAP Explainability:** Transparently computes exact Shapley contribution values for every assessment, highlighting the top 3 drivers influencing risk in plain, reassuring language.

### 3. 📷 Multimodal Vision Screening & 3-Layer Clinical Safety Gate
* Multimodal ONNX vision classifier inspecting facial and upper-torso characteristics.
* **Safety Gate Architecture:**
  * *Gate 1 (Anthropometry Priority):* If physical MUAC or WHZ indicates SAM or MAM, the physical measurement takes unconditional priority.
  * *Gate 2 (Confidence Threshold):* Advisory classifications require confidence $> 70\%$; otherwise categorized as "Indeterminate / Clinical Re-measurement Required".
  * *Gate 3 (Discordance Warning):* If the visual model conflicts with physical measurements (e.g., child is clothed or swollen with edema), an explicit discordance alert is triggered for the clinician.

### 4. 📄 Smart Health Card OCR Pipeline
* Hybrid extraction supporting both vector digital PDFs and camera smartphone scans of paper MCP cards (Mother and Child Protection card / Anganwadi registers).
* High-pass OpenCV filtering: grayscale conversion, bilateral denoising, adaptive Gaussian thresholding, and morphological deskewing.
* Tesseract 5 OCR extraction with regex pattern matching for weight, height, MUAC, head circumference, age, dates, and hemoglobin levels.
* Interactive verification UI allowing clinicians to inspect and correct readings before committing to the patient record.

### 5. 🥗 Personalized 8-Section Diet & Clinical Care Plans
* Deterministic knowledge base mapping 8 clinical states across 5 age bands (0–6m, 6–8m, 9–11m, 12–23m, 24–59m).
* Filters for vegetarian preference, severe lactose intolerance, and acute diarrhea (ORS + Zinc protocol).
* Provides comprehensive guidance:
  1. *What this diagnosis means in plain words*
  2. *Age-appropriate feeding frequency & texture*
  3. *Locally accessible high-nutrient superfoods*
  4. *Foods & beverages to strictly limit*
  5. *Hygiene, sanitation, and water safety*
  6. *Questions to ask your doctor or Anganwadi worker*
  7. *Available Indian government welfare schemes (POSHAN, ICDS, NRC, PMMVY)*
  8. *Red-flag danger signs demanding immediate emergency hospitalization*

### 6. 📊 Automated Clinical PDF Health Summary
* Generates branded, publication-ready A4 clinical assessment reports using ReportLab.
* Includes patient demographics, WHO growth z-scores with visual interpretation bands, future risk breakdown, complete diet plan, Anganwadi referrals, and emergency red-flag checklists.

### 7. 🌐 Dual-Role Portals & Bilingual Localization
* **Doctor / Pediatrician Dashboard:** Cohort epidemiology statistics, patient list with search/filter, clinical triage queue, growth curve comparisons, and direct assessment wizard.
* **Parent / Guardian Portal:** Child health overview, growth trend milestones, feeding tips, vaccination reminders, and PDF report downloads.
* **Zero-Latency Client-Side Bilingual Localization:** Instant toggle between English and Hindi (हिंदी) across all pages without page reloads.

---

## 📁 Repository Structure

```
childnutri/
├── backend/                              # FastAPI Backend Architecture
│   ├── app/
│   │   ├── config.py                     # App configuration & environment settings
│   │   ├── database.py                   # SQLAlchemy engine & SQLite session setup
│   │   ├── deps.py                       # Authentication dependencies (JWT + Bearer + Cookie)
│   │   ├── main.py                       # FastAPI application entry point & router mounting
│   │   ├── models/                       # SQLAlchemy ORM models (User, Child, Assessment, etc.)
│   │   ├── routers/
│   │   │   ├── assessments.py            # Assessment pipeline, results, and PDF download API
│   │   │   ├── auth.py                   # Authentication API (signup, login, logout, refresh)
│   │   │   ├── children.py               # Child profile management CRUD API
│   │   │   └── ocr.py                    # Health card OCR, Resources & Meta health check API
│   │   ├── schemas/                      # Pydantic v2 validation models
│   │   ├── security.py                   # Bcrypt password hashing & PyJWT token utilities
│   │   └── services/
│   │       ├── classify.py               # Deterministic WHO/CMAM rule-based classifier
│   │       ├── diet_engine.py            # 8-Case × 5-Age Band clinical diet knowledge base
│   │       ├── future_risk.py            # LightGBM risk engine, trend points & TreeSHAP
│   │       ├── ocr_service.py            # OpenCV preprocessing + Tesseract OCR extraction
│   │       ├── pipeline.py               # 8-layer unified assessment orchestrator
│   │       ├── report_pdf.py             # ReportLab automated clinical PDF generator
│   │       ├── seed_data.py              # Clinical resources & demo user database seeding
│   │       └── who_zscore.py             # WHO LMS z-score calculator with extreme SD correction
│   ├── ml_artifacts/                     # Production pre-trained model weights
│   │   ├── risk_model.joblib             # LightGBM classifier + Isotonic Calibrator (328 KB)
│   │   └── vision_classifier.onnx        # ONNX deep learning vision classifier (21 KB)
│   └── tests/                            # Automated test suite (WHO, pipeline, vision gate)
│       └── test_vision_screening.py
├── frontend/                             # Vanilla Glassmorphism Single-Page Architecture
│   ├── assets/                           # Branding, icons, and medical illustrations
│   ├── css/
│   │   └── style.css                     # Medical design system, HSL palette & responsive CSS
│   ├── js/
│   │   ├── api.js                        # Unified asynchronous API client with JWT interceptor
│   │   ├── charts.js                     # HTML5 Canvas WHO growth curve visualizer
│   │   ├── i18n.js                       # English / Hindi (हिंदी) bilingual translation dictionary
│   │   └── main.js                       # View routing, wizard controllers, and state management
│   ├── index.html                        # Application shell & multi-role view containers
│   └── login.html                        # Glassmorphism authentication portal
├── ml_training/                          # Machine learning training scripts
│   └── train_risk_model.py               # LightGBM training, calibration & artifact export
├── datasets/                             # Tabular datasets & surveys (.gitkeep)
├── scripts/                              # Utility & build scripts
│   └── generate_presentation.py          # Script to regenerate python-pptx presentation deck
├── uploads/                              # Temporary secure storage for user uploads (.gitkeep)
├── FEATURES_EXPLAINED.md                 # 66 KB exhaustive clinical & technical concepts manual
├── ChildNutri_AI_Features_and_Architecture_Guide.pdf # Architecture overview document
├── SETUP_GUIDE.md                        # Multi-platform operating system setup manual
├── requirements.txt                      # Frozen Python dependencies
├── setup.sh                              # Automated setup script for macOS / Linux
├── setup.bat                             # Automated setup script for Windows
├── run.sh                                # 1-click startup script for macOS / Linux
├── run.bat                               # 1-click startup script for Windows
├── .env.example                          # Sample environment configuration
├── .gitignore                            # Comprehensive git ignore rules
├── childnutri.db                         # Pre-seeded demonstration database
└── README.md                             # Master documentation (this file)
```

---

## 🛠 Project Presentations, Slides & Academic Deliverables

This repository contains complete, ready-to-use academic defense and project documentation materials:

| Deliverable | Format | Description |
| :--- | :--- | :--- |
| **Comprehensive Features Guide** | [`FEATURES_EXPLAINED.md`](FEATURES_EXPLAINED.md) | 66 KB deep-dive explaining all medical concepts (WHO LMS, WAZ, HAZ, SAM, MAM, TreeSHAP, OpenCV OCR, ONNX vision) in plain language. |
| **Architecture Overview PDF** | [`ChildNutri_AI_Features_and_Architecture_Guide.pdf`](ChildNutri_AI_Features_and_Architecture_Guide.pdf) | Formatted PDF document summarizing system pipelines and technical benchmarks. |
| **Multi-OS Setup Manual** | [`SETUP_GUIDE.md`](SETUP_GUIDE.md) | Universal step-by-step setup guide for Windows, macOS, and Linux. |
| **Clinical Validation & Usability Report** | [`VALIDATION.md`](VALIDATION.md) | WHO LMS benchmark accuracy tables, System Usability Scale (SUS: 77.5/100) survey, and pediatrician review. |

---

## 🔑 Pre-Configured Demo Accounts

The repository includes a pre-seeded SQLite database (`childnutri.db`) populated with verified clinical resources and test profiles:

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Doctor / Pediatrician** | `dr.subha@childnutri.org` | `Doctor@123` | Cohort statistics, clinical alerts queue, patient management, WHO growth curves, assessment wizard, diet assignment, and PDF report downloads. |
| **Parent / Guardian** | `priya.sharma@email.com` | `Parent@123` | Infant growth tracking (Aarav Sharma), growth timeline, personalized nutrition guide, bilingual toggle, and health records. |

*Quick login buttons are available on `login.html` for 1-click credential prefill.*

---

## ⚡ Quick Start & Installation

### Option 1: Automated 1-Click Setup

#### Windows:
1. Double-click **`setup.bat`**. This will create the virtual environment, install dependencies, seed database tables, and run verification tests.
2. Double-click **`run.bat`** to start the application and open your browser at `http://127.0.0.1:8000`.

#### macOS / Linux:
1. Open Terminal and run:
   ```bash
   chmod +x setup.sh run.sh
   ./setup.sh
   ```
2. Start the server anytime with:
   ```bash
   ./run.sh
   ```

---

### Option 2: Manual Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone git@github.com:Varadpendkar/Malnutrition_detection.git
   cd Malnutrition_detection
   ```

2. **Create and activate a Python virtual environment (Python 3.10+):**
   ```bash
   python3 -m venv venv
   # On macOS / Linux:
   source venv/bin/activate
   # On Windows (Command Prompt):
   venv\Scripts\activate.bat
   # On Windows (PowerShell):
   venv\Scripts\Activate.ps1
   ```

3. **Install dependencies:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Initialize database & seed clinical resources:**
   ```bash
   python -m backend.app.services.seed_data
   ```

5. **Run the automated test suite:**
   ```bash
   pytest backend/tests/ -v
   ```

6. **Start the FastAPI server:**
   ```bash
   python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

7. **Open your browser:**
   * Web Application: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   * Interactive Swagger API Docs: [http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)
   * Redoc Documentation: [http://127.0.0.1:8000/api/redoc](http://127.0.0.1:8000/api/redoc)

---

## 🏛 System Architecture & Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 CHILDNUTRI AI ARCHITECTURE                                  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
                                               │
                        ┌──────────────────────▼──────────────────────┐
                        │      Client Browser (Vanilla HTML/CSS/JS)   │
                        │   Bilingual English / Hindi (Zero Latency)  │
                        └──────────────────────┬──────────────────────┘
                                               │ REST API calls (Port 8000)
                        ┌──────────────────────▼──────────────────────┐
                        │              FastAPI Backend App            │
                        │       JWT Authentication & Cookie Guard     │
                        └──────────────────────┬──────────────────────┘
                                               │
     ┌─────────────────────────────────────────┼─────────────────────────────────────────┐
     │                                         │                                         │
┌────▼─────────────────────┐       ┌───────────▼─────────────┐       ┌───────────────────▼───┐
│     LAYER 1: CURRENT     │       │     LAYER 2: FUTURE     │       │    LAYER 3: VISION    │
│    WHO 2006 LMS ENGINE   │       │   LIGHTGBM RISK ENGINE  │       │     SAFETY GATE       │
├──────────────────────────┤       ├─────────────────────────┤       ├───────────────────────┤
│ • Deterministic LMS calc │       │ • Calibrated LightGBM   │       │ • ONNX Vision Model   │
│ • Exact WAZ, HAZ, WHZ    │       │ • 11 context features   │       │ • 3-Layer Safety Gate │
│ • Priority: SAM > MAM >  │       │ • Growth faltering drop │       │ • Never overrides     │
│   Stunted > Underweight  │       │ • TreeSHAP explanations │       │   physical anthropom. │
└────┬─────────────────────┘       └───────────┬─────────────┘       └───────────────────┬───┘
     │                                         │                                         │
     └─────────────────────────────────────────┼─────────────────────────────────────────┘
                                               │
                        ┌──────────────────────▼──────────────────────┐
                        │           LAYER 4: CLINICAL CARE            │
                        │    8-Case × 5-Age Band Diet Knowledge Base  │
                        │    POSHAN Abhiyaan / CMAM Protocols         │
                        └──────────────────────┬──────────────────────┘
                                               │
                        ┌──────────────────────▼──────────────────────┐
                        │           LAYER 5: DISSEMINATION            │
                        │     Interactive Web Results & Visuals       │
                        │     ReportLab Automated Clinical PDF Export │
                        └─────────────────────────────────────────────┘
```

---

## 📡 FastAPI REST API Endpoints

| Category | Method | Path | Description | Access |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/signup` | Register new user (doctor / parent) | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate and issue JWT access token | Public |
| **Auth** | `POST` | `/api/auth/logout` | Revoke tokens and clear cookies | Authenticated |
| **Auth** | `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Authenticated |
| **Children**| `POST` | `/api/children` | Register a new child profile | Authenticated |
| **Children**| `GET` | `/api/children` | List accessible children (Doctor: all / Parent: own) | Authenticated |
| **Children**| `GET` | `/api/children/{id}` | Retrieve detailed child profile with history | Authenticated |
| **Assessments**| `POST` | `/api/assessments` | Execute 8-layer screening pipeline & generate care plan | Authenticated |
| **Assessments**| `GET` | `/api/assessments/{id}` | Fetch stored assessment result JSON | Authenticated |
| **Assessments**| `GET` | `/api/assessments/{id}/pdf` | Download formatted clinical PDF report | Authenticated |
| **OCR** | `POST` | `/api/ocr/extract` | Upload MCP health card scan for OCR parsing | Authenticated |
| **Resources** | `GET` | `/api/resources` | Search evidence-based nutritional articles | Public |
| **Meta** | `GET` | `/api/meta/health` | Service health status check | Public |
| **Meta** | `GET` | `/api/meta/model-card` | Model transparency, performance & training card | Public |

---

## 🧪 Automated Testing

ChildNutri AI includes regression test suites validating the WHO LMS mathematics, boundary conditions, classification cut-offs, and clinical safety gates:

```bash
# Run all tests
pytest backend/tests/ -v

# Run with output capture disabled to view diagnostic logs
pytest backend/tests/ -v -s
```

### Safety Tests Covered:
* Exact LMS calculations against published WHO reference curves.
* Boundary tests at $-3.01\text{ SD}$ vs. $-3.00\text{ SD}$ vs. $-2.00\text{ SD}$.
* Extreme outlier values beyond $\pm 3\text{ SD}$ using the WHO manual correction equation.
* Vision safety gate verification ensuring clothed children with normal physical measurements are never misclassified as malnourished.

---

## ⚖️ Clinical Disclaimer & Ethical AI Statement

> **⚠️ IMPORTANT MEDICAL NOTICE:** ChildNutri AI is designed as a **screening and clinical decision-support instrument** for community healthcare workers, Anganwadi staff, and pediatricians. It is **not** an autonomous diagnostic medical device. 
>
> In all scenarios involving **Severe Acute Malnutrition (SAM)**, nutritional bilateral edema, or critical red-flag symptoms (inability to feed, lethargy, convulsions, persistent vomiting), the child must immediately be referred to a **Nutrition Rehabilitation Centre (NRC)** or medical hospital for supervised inpatient clinical protocol.


---

## 🛡️ Security, Privacy & Ethical AI Roadmap

### Currently Implemented (v1.1)
* **Mandatory User Consent Gate:** Explicit consent confirmation required before collecting child anthropometric records (`POST /api/auth/consent`).
* **Cryptographic Password Security:** Bcrypt (v4.0.1) password hashing with dynamic adaptive salt rounds.
* **Stateless Token Authentication:** HttpOnly PyJWT tokens with short expiration (30 min access) and refresh token rotation with database revocation tracking.
* **Strict Schema Sanitization:** Pydantic v2 strict input validation preventing SQL injection and payload overflows.
* **HTTPS & Same-Origin Policy:** Built-in same-origin reverse proxy for frontend and API on port 8000.

### Planned for v1.2 (Production Hardening)
* **Encryption at Rest:** Database-level encryption using SQLCipher (256-bit AES) for SQLite / PostgreSQL transparent data encryption (TDE).
* **Field-Level PII Encryption:** AES-GCM-256 encryption for sensitive patient identifiers (child name, guardian contact details).
* **Automated Data Retention & Anonymization:** Scheduled cron task auto-anonymizing clinical screening records older than 3 years per healthcare compliance standards.

---

## 📊 Clinical Validation & Usability Highlights

Full methodology, benchmark scores, and survey responses are published in [`VALIDATION.md`](VALIDATION.md):

* **WHO Anthropometric Benchmarking:** 100% agreement across 12 reference profiles against WHO Anthro (v3.2.2) and `pygrowup` ($\Delta z \le 0.02$).
* **System Usability Scale (SUS):** Evaluated across 5 clinical and community participants (Pediatrician, Anganwadi volunteer, parents), scoring **77.5 / 100 (Grade A- / Good to Excellent Usability)**, well above the 68 industry benchmark.
* **Clinical Diet Review:** Verified by Dr. Subha Menon, MBBS, DCH (Consultant Pediatrician) ensuring strict adherence to WHO IYCF, ICMR-NIN 2020, and emergency NRC hospital transfer protocols.

---
## 👨‍💻 Team & Academic Acknowledgements

* **GitHub Repository:** [https://github.com/Varadpendkar/Malnutrition_detection](https://github.com/Varadpendkar/Malnutrition_detection)
* **Standards Reference:** [WHO Child Growth Standards (2006)](https://www.who.int/tools/child-growth-standards)
* **National Schemes:** [POSHAN Abhiyaan / National Nutrition Mission](https://poshanabhiyaan.gov.in/)

---
