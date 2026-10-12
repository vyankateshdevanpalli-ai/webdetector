# BrandGuard AI - Enterprise Impersonation & Brand Security Platform

BrandGuard AI is a real-time threat intelligence and brand protection web application designed to detect typosquatting, homoglyph attacks, fake app listings, and profile impersonations against enterprise brands.

## 🚀 Features

- **Real-Time AI Detector:** Instant heuristic analysis using Levenshtein distance, domain entropy, and visual character mapping.
- **3,000+ Brand Threat Database:** Interactive exploration of authentic and mock-impersonated brand vectors across multiple industries.
- **Threat Intelligence Dashboard:** Visual analytics powered by Chart.js tracking attack vector distributions and targeted industries.
- **ML Model Weights & Sensitivity Tuner:** Adjustable parameters for fine-tuning detection thresholds.
- **Automated Takedown Manager:** Centralized tracking and generation of DMCA/platform enforcement notices.

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS (via CDN)
- **Icons & Styling:** Lucide Icons, Google Fonts (Inter & JetBrains Mono)
- **Data Visualization:** Chart.js
- **Logic:** Vanilla JavaScript (`app.js`)

## 📦 Project Structure

```text
├── index.html       # Main user interface layout
├── style.css        # Custom CSS rules and scrollbar styling
├── app.js           # Core detection engine, dataset generator, and UI controllers
├── server.py        # Optional Python local web server script
└── README.md        # Project documentation