# 🎮 VR Game Web Platform

An interactive, multi-language web application built to support the VR Game platform. It features dynamic content rendering, multilingual support across 7 languages, custom particle animations, secure authentication modal flows, and an integrated PHP/SQLite backend.

## 📋 Table of Contents

* [Overview](#-overview)
* [Key Features](#-key-features)
* [Tech Stack & Dependencies](#-tech-stack--dependencies)
* [Project Architecture](#-project-architecture)
* [Detailed Component & Page Breakdown](#-detailed-component--page-breakdown)
* [Input Validation & Character Limits](#-input-validation--character-limits)
* [Managing Downloadable Files & Localized Buttons](#-managing-downloadable-files--localized-buttons)
* [Getting Started](#-getting-started)
* [Environment Configuration](#-environment-configuration)
* [Internationalization (i18n) & Translation Proxy](#-internationalization-i18n--translation-proxy)
* [Backend Architecture & API Endpoints](#-backend-architecture--api-endpoints)
* [Database Schema Specifications](#-database-schema-specifications)
* [Styling, Design Tokens & Custom Fonts](#-styling-design-tokens--custom-fonts)
* [Build Configuration & Target Setup](#-build-configuration--target-setup)
* [Running Built & Production Versions](#-running-built--production-versions)
* [Scripts & Deployment Guidelines](#-scripts--deployment-guidelines)
* [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🌟 Overview

The **VR Game Web Platform** is the digital hub for the VR Game project. It provides an intuitive, high-performance user interface for users, researchers, and partners across international regions.

The application serves several core functions:

1. **Educational & Promotional Showcase:** Demonstrates VR game concepts, gameplay mechanics, hardware requirements, and interactive media.
2. **Project Updates Feed:** Displays categorized news items, announcements, and press releases.
3. **Multilingual Access:** Delivers real-time localized content in 7 European languages.
4. **User Engagement & Lead Generation:** Collects feedback, contact forms, and authentication requests processed via a lightweight serverless-ready PHP/SQLite pipeline.
5. **Asset Distribution Hub:** Delivers documentation downloads, research papers, and promotional media.

---

## ✨ Key Features

* **Multilingual Localization (i18n):** Real-time switching between 7 languages (`CZ`, `EN`, `HR`, `PT`, `SK`, `SQ`, `TR`) with zero page reloads.
* **Custom Translation Proxy:** Custom React hook `useTranslationProxy` ensuring graceful fallbacks to English when keys are missing or malformed.
* **Interactive Canvas Animations:** Hardware-accelerated dynamic particle visualizer (`ParticleBackground.tsx`) configured via standard HTML5 Canvas 2D API.
* **Strict Input Validation & Real-Time Limits:** Enforced character limits for admin post creation (`Page06.tsx`) and general contact inquiries (`ContactForm.tsx`) with real-time UI counters.
* **Hybrid Styling Strategy:** Combines Tailwind CSS utility classes with structured SCSS files using brand variables (`_variables.scss`) and cross-browser mixins (`_mixins.scss`).
* **Lightweight Embedded API:** Dedicated `api.php` handler allowing direct interactions with a zero-configuration SQLite database (`testchc.sqlite`).
* **Accessible Modal Workflows:** Accessible, high-contrast modal windows for user sign-in (`LoginModal.tsx`) and general inquiries (`ContactForm.tsx`).
* **EU Compliance & Disclaimers:** Integrated banner component (`EuDisclaimer.tsx`) to fulfill co-funding disclosure and data privacy regulatory requirements.

---

## 🛠️ Tech Stack & Dependencies

### Frontend Core
* **Framework:** [React 18.x](https://react.dev/)
* **Language:** [TypeScript 5.x](https://www.typescriptlang.org/) (Strict mode enabled)
* **Build Tool:** [Vite 5.x](https://vitejs.dev/)
* **Animation Engine:** [GSAP 3.x](https://gsap.com/) & `@gsap/react`
* **CSS Processor:** [Tailwind CSS 3.x](https://tailwindcss.com/) & [SASS / SCSS 1.x](https://sass-lang.com/)
* **Iconography & UI Helpers:** Custom SVG icons & Lucide React icons

### Localization & Utilities
* **i18n Library:** `i18next` & `react-i18next`
* **HTTP Client:** Native `fetch` wrapper in `src/utils/api.ts`

### Backend & Storage
* **Server Runtime:** PHP 8.x+
* **Database Management:** SQLite 3 (`PDO_SQLITE` driver)
* **Web Server Compatibility:** Apache 2.4 / Nginx 1.2x / IIS

---

## 📁 Project Architecture

```
VR-Game-Web/
├── package.json               # Dependencies, scripts, and build target settings
├── package-lock.json          # Node module version tree lockfile
├── tsconfig.json              # Base TypeScript compiler settings
├── tsconfig.app.json          # Frontend application TS configuration
├── tsconfig.node.json         # Build tool / Vite TS configuration
├── vite.config.ts             # Vite server, plugin, and path alias settings
├── tailwind.config.js         # Tailwind theme, plugins, and content paths
├── eslint.config.js           # ESLint rules and style enforcement
├── index.html                 # Main HTML application entry point
├── api.php                    # PHP Backend entry point & routing handler
├── testchc.sqlite             # Primary SQLite database file
├── .env                       # Local environment variables
├── .env.example               # Example template for environment configuration
│
├── public/                    # Static public directory (served at root /)
│   └── downloadable/          # Public downloadable assets (PDFs, ZIPs)
│
├── src/                       # Frontend Source Application
│   ├── main.tsx               # DOM mount point and root providers
│   ├── App.tsx                # Main application layout & page orchestration
│   ├── i18n.ts                # i18next instance configuration and setup
│   │
│   ├── pages/                 # Full-width page view sections
│   │   ├── Page01.tsx / .scss # Section 1: Hero & Primary CTA
│   │   ├── Page02.tsx / .scss # Section 2: Game Overview & Features Showcase
│   │   ├── Page03.tsx / .scss # Section 3: VR Hardware & Immersion Tech
│   │   ├── Page04.tsx / .scss # Section 4: News Feed & Latest Updates
│   │   ├── Page05.tsx / .scss # Section 5: Partner Network & Academic Links
│   │   └── Page06.tsx / .scss # Section 6: Admin Portal, Content Management & Contact
│   │
│   ├── objects/               # Reusable modular components
│   │   ├── ContactForm.tsx     # Interactive message submission form with length limits
│   │   ├── EuDisclaimer.tsx    # European Union funding project disclosure
│   │   ├── Footer.tsx / .scss  # Global footer with navigation links
│   │   ├── LanguageSwitcher.tsx # Interactive drop-down language picker
│   │   ├── LoginModal.tsx      # Modal authentication dialog
│   │   ├── Navbar.tsx / .scss  # Header navigation bar with scroll links
│   │   ├── NewsCard.tsx / .scss# News article preview cards
│   │   ├── ParticleBackground.tsx # Background canvas particle engine
│   │   └── PartnerGrid.tsx    # Responsive grid layout for partner logos
│   │
│   ├── hooks/                 # Custom React hooks
│   │   └── useTranslationProxy.ts # Safe fallback translation wrapper hook
│   │
│   ├── utils/                 # Utility functions & API helpers
│   │   └── api.ts             # HTTP client for communicating with api.php
│   │
│   ├── langs/                 # JSON translation dictionaries
│   │   ├── cz.json            # Czech translations
│   │   ├── en.json            # English translations (Primary/Fallback)
│   │   ├── hr.json            # Croatian translations
│   │   ├── pt.json            # Portuguese translations
│   │   ├── sk.json            # Slovak translations
│   │   ├── sq.json            # Albanian translations
│   │   └── tr.json            # Turkish translations
│   │
│   ├── styles/                # Global SASS stylesheets & mixins
│   │   ├── _mixins.scss       # SCSS mixins (media queries, flex helpers)
│   │   ├── _variables.scss    # SCSS design tokens (colors, spacing, fonts)
│   │   └── globals.scss       # Tailwind directives and main stylesheet import
│   │
│   ├── fonts/                 # Web-optimized local fonts (BBHHegarty, Urbanist, Outfit)
│   └── images/                # Dynamic graphics, logos, and UI imagery
│
└── uploads/                   # Server directory for file uploads managed by PHP
```

---

## 🧩 Detailed Component & Page Breakdown

### Page Views (`src/pages/`)
* **Page01 (`Page01.tsx`):** Hero section featuring visual branding, dynamic title headers, dynamic action triggers, and primary CTA buttons.
* **Page02 (`Page02.tsx`):** Detailed breakdown of game mechanics, VR gameplay features, and user interaction modes.
* **Page03 (`Page03.tsx`):** Technical hardware specs, supported VR headsets (e.g., Meta Quest, HTC Vive, Valve Index), and system performance guidelines.
* **Page04 (`Page04.tsx`):** Dynamic news section rendering article cards generated from backend data or localized JSON payloads.
* **Page05 (`Page05.tsx`):** Partner and consortium display grid highlighting contributing universities, companies, and organizations.
* **Page06 (`Page06.tsx`):** Multi-tab admin portal allowing authorized users to create posts (with title and content validation), manage existing feed entries, review submitted contact inquiries, and access project downloads.

### Reusable UI Objects (`src/objects/`)
* **`Navbar.tsx`:** Sticky navigation bar containing link markers for smooth page scrolling, theme controls, and language selection.
* **`ParticleBackground.tsx`:** High-performance HTML5 Canvas rendering interactive moving nodes and connecting lines responsive to screen resizing.
* **`LanguageSwitcher.tsx`:** Custom drop-down selector supporting flag icons and text labels for language switching.
* **`LoginModal.tsx`:** Accessible modal dialog featuring form validation for authentication workflows.
* **`ContactForm.tsx`:** Controlled form component with client-side validation, anti-spam honeypot, real-time character counters for Subject and Message fields, and direct connection to `api.ts`.
* **`EuDisclaimer.tsx`:** Footer/Header notice bar adhering to EU project visibility regulations.

---

## 📏 Input Validation & Character Limits

To ensure database consistency and prevent content overflow in cards and submission logs, strict length constraints are enforced on both client and server sides:

| Location / Component | Field | Max Character Limit | UI Visual Counter |
| ----- | ----- | ----- | ----- |
| `Page06.tsx` (Admin) | Article Title | **60 characters** | Yes (`x/60`) |
| `Page06.tsx` (Admin) | Article Content / Description | **1,000 characters** | Yes (`x/1000`) |
| `ContactForm.tsx` | Inquiry Subject | **100 characters** | Yes (`x/100`) |
| `ContactForm.tsx` | Inquiry Message | **1,000 characters** | Yes (`x/1000`) |

---

## 📥 Managing Downloadable Files & Localized Buttons

### 1. Where to Place Downloadable Files

All downloadable assets (such as PDF reports, research papers, ZIP archives, or guides) must be placed in the **`public/downloadable/`** directory:

```
public/
└── downloadable/
    ├── research_report.pdf
    └── project_documentation.zip
```

Files placed in `public/downloadable/` are accessible directly at the root path:
`/downloadable/research_report.pdf`

### 2. Where File Names & Paths are Defined

File names and download links are defined in **`src/pages/Page06.tsx`** (or the respective component rendering the download button):

```tsx
<a 
  href="/downloadable/research_report.pdf" 
  download="Research_Report.pdf"
  className="download-btn"
>
  {t('reportsDownloadBtn')}
</a>
```

### 3. Localizing the Download Button (`reportsDownloadBtn`)

Update the key `"reportsDownloadBtn"` across all language translation files located in **`src/langs/*.json`**:

* **`src/langs/en.json` (English):** `"reportsDownloadBtn": "Download Research"`
* **`src/langs/cz.json` (Czech):** `"reportsDownloadBtn": "Stáhnout výzkum"`
* **`src/langs/sk.json` (Slovak):** `"reportsDownloadBtn": "Stiahnuť výskum"`
* **`src/langs/hr.json` (Croatian):** `"reportsDownloadBtn": "Preuzmi istraživanje"`
* **`src/langs/pt.json` (Portuguese):** `"reportsDownloadBtn": "Baixar Pesquisa"`
* **`src/langs/sq.json` (Albanian):** `"reportsDownloadBtn": "Shkarko kërkimin"`
* **`src/langs/tr.json` (Turkish):** `"reportsDownloadBtn": "Araştırmayı İndir"`

---

## 🚀 Getting Started

### Prerequisites
Ensure the following tools are installed on your workstation:
* **Node.js:** v18.16.0 LTS or higher
* **npm:** v9.0.0 or higher
* **PHP:** v8.0 or higher with PDO and `pdo_sqlite` extensions enabled
* **SQLite3:** Recommended for direct database inspection

### Installation Steps

1. **Repository Cloning:**
   ```bash
   git clone https://github.com/your-org/vr-game-web.git
   cd vr-game-web
   ```

2. **Install Node Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Local Environment File:**
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```

4. **Launch Local Development Application:**
   Start the Vite frontend development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

5. **Launch Local PHP Backend Server:**
   In a separate terminal, serve `api.php` using PHP's built-in web server:
   ```bash
   php -S localhost:8000
   ```

---

## ⚙️ Environment Configuration

Environment variables are defined in `.env` and consumed via Vite's `import.meta.env` context.

| Variable Name | Type | Default Value | Description |
| ----- | ----- | ----- | ----- |
| `VITE_API_URL` | String | `http://localhost:8000/api.php` | The URL pointing to the active backend endpoint. |
| `VITE_ENABLE_MOCK_DATA` | Boolean | `false` | Fallback flag for UI testing without an active PHP backend. |
| `VITE_DEFAULT_LANGUAGE` | String | `en` | Fallback language ISO code. |

---

## 🌍 Internationalization (i18n) & Translation Proxy

Localization is managed through `src/i18n.ts` and dynamic translation files stored in `src/langs/`.

### Supported Locales

| Code | Native Name | Target Locale | Dictionary Path |
| ----- | ----- | ----- | ----- |
| `en` | English | International (Default) | `src/langs/en.json` |
| `cz` | Čeština | Czech Republic | `src/langs/cz.json` |
| `sk` | Slovenčina | Slovakia | `src/langs/sk.json` |
| `hr` | Hrvatski | Croatia | `src/langs/hr.json` |
| `pt` | Português | Portugal | `src/langs/pt.json` |
| `sq` | Shqip | Albania | `src/langs/sq.json` |
| `tr` | Türkçe | Turkey | `src/langs/tr.json` |

### Using `useTranslationProxy`

To avoid rendering empty strings or broken key identifiers when a key is missing from a specific language dictionary, components utilize the `useTranslationProxy` custom hook:

```tsx
import { useTranslationProxy } from '../hooks/useTranslationProxy';

const MyComponent = () => {
  const { t } = useTranslationProxy();

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
    </div>
  );
};
```

---

## 🗄️ Backend Architecture & API Endpoints

The backend is contained within `api.php`. It handles CORS headers, request routing, validation, image uploads, and direct queries to `testchc.sqlite`.

### HTTP Request Flow

```
[ React Application ] ---> ( fetch request via src/utils/api.ts )
                                    │
                                    ▼
                             [ api.php Router ]
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                [ Request Validation ]   [ PDO SQLite ]
                         │                     │
                         └──────────┬──────────┘
                                    ▼
                         [ JSON Response / HTTP Status ]
```

### API Endpoints Summary

#### 1. System Health Check
* **Endpoint:** `GET /api.php?action=status`
* **Response:**
  ```json
  {
    "status": "ok",
    "timestamp": 1700000000,
    "database_connected": true
  }
  ```

#### 2. Submit Contact Form
* **Endpoint:** `POST /api/contact` (or `POST /api.php?action=contact`)
* **Payload (FormData / JSON):**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "institution": "VET Academy Zlín",
    "subject": "Inquiry regarding VR platform",
    "message": "Hello team, I would like to learn more..."
  }
  ```
* **Response (Success - 201 Created):**
  ```json
  {
    "success": true,
    "message": "Message submitted successfully.",
    "id": 42
  }
  ```

#### 3. Manage Articles (Admin)
* **Fetch Articles:** `GET /api/articles`
* **Create Article:** `POST /api/articles` (supports `title`, `content`, `category`, and multipart `image` uploads)
* **Update Article:** `PUT /api/articles` (payload: `{ "id": 1, "title": "...", "content": "..." }`)
* **Delete Article:** `DELETE /api/articles` (payload: `{ "id": 1 }`)

#### 4. Manage Inquiries (Admin)
* **Fetch Inquiries:** `GET /api/inquiries`
* **Delete Inquiry:** `DELETE /api/inquiries` (payload: `{ "id": 1 }`)

---

## 🗃️ Database Schema Specifications

The project relies on SQLite (`testchc.sqlite`). Below are standard SQL table definitions managed by `api.php`:

### `users` Table
```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### `contact_messages` Table
```sql
CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    institution TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### `news_articles` Table
```sql
CREATE TABLE IF NOT EXISTS news_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'feed',
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎨 Styling, Design Tokens & Custom Fonts

### Theme Palette (`src/styles/_variables.scss`)

| Token Name | Hex / Value | Application |
| ----- | ----- | ----- |
| `$primary-color` | `#e6daf5` | Light lavender highlight / accent text |
| `$secondary-color` | `#51d0ed` | Vibrant cyan secondary accents and interactive highlights |
| `$brand-blue` | `#2E3192` | Primary brand deep blue color |
| `$dark-bg` | `#151320` | Deep purple-dark background mode |
| `$accent-crimson` | `#b23b4f` | Alert badges, error states, and prominent highlight buttons |
| `$text-light` | `#f8fafc` | Primary readable header and body text |

### Typography Integration
Custom local fonts are bundled in `src/fonts/` and loaded in `src/styles/globals.scss`:
* **BBHHegarty:** Applied to primary hero headers and high-impact title banners.
* **Urbanist:** Applied to section headings (`h2`, `h3`), navigation links, and modal headers.
* **Outfit:** Applied to main body text, form elements, descriptions, and tabular data.

---

## 🔧 Build Configuration & Target Setup

To build the application successfully without compiler (`tsc`) or CSS minifier (`lightningcss`) errors:

1. Both `tsconfig.json` and `vite.config.ts` must target **`ES2022`** (or `ESNext`). Unrecognized values like `ES2026` throw `TS6046` and `lightningcss` build errors.

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
```

### `vite.config.ts`
```typescript
export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
  }
});
```

---

## 🚀 Running Built & Production Versions

Once you compile the production bundle with `npm run build`, you can test or run the built application using several methods:

### Option 1: Quick Local Preview (Vite Preview)
To test the generated production build directly from the `dist/` directory:
```bash
npm run preview
```
* Serves the compiled files at `http://localhost:4173`.
* ⚠️ **Note:** Vite's development proxy (`server.proxy`) is inactive during preview. Ensure your backend (`php -S localhost:8000`) is running independently if testing API features.

### Option 2: Full Local Production Simulation
To test static asset rendering alongside the active PHP backend:
1. **Start the PHP server:**
   ```bash
   php -S localhost:8000
   ```
2. **Serve `dist/` files:** Use any lightweight HTTP server (e.g., `npx serve dist`) or point a local server to `dist/`.

---

## 📜 Scripts & Deployment Guidelines

### NPM Commands Reference

| Script | Command | Purpose |
| ----- | ----- | ----- |
| `dev` | `vite` | Runs local Vite dev server with Hot Module Replacement (HMR). |
| `build` | `tsc && vite build` | Compiles TypeScript and creates optimized assets in `dist/`. |
| `preview` | `vite preview` | Serves local production build from `dist/` for testing. |
| `lint` | `eslint . --ext ts,tsx --report-unused-disable-directives` | Runs static code analysis checks. |

### Production Server Deployment Steps

1. **Build Static Bundle:**
   ```bash
   npm run build
   ```

2. **Transfer Web Assets:**
   Upload all generated files inside the **`dist/`** directory to your production web root (`public_html` or `/var/www/html`).

3. **Deploy Backend Script & Database:**
   Upload `api.php`, `testchc.sqlite`, and the `uploads/` directory to the server path expected by your backend config.

4. **Directory Permissions Setup:**
   Ensure web server user permissions (`www-data`, `nginx`, or `apache`) are correctly assigned for SQLite read/write operations:
   ```bash
   chmod 775 testchc.sqlite
   chmod -R 775 uploads/
   chown -R www-data:www-data testchc.sqlite uploads/
   ```

5. **Configure Server Web Rewrites:**
   For Nginx environments, add route handling for API requests:
   ```nginx
   location /api/ {
       try_files $uri $uri/ /api.php?$query_string;
   }
   
   location ~ \.php$ {
       fastcgi_pass unix:/run/php/php8.2-fpm.sock;
       include fastcgi_params;
       fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
   }
   ```

---

## ❓ Troubleshooting & FAQs

### 1. `TS6046: Argument for '--target' option must be...` or `Unsupported target "es2026"`
* Ensure `target` in `tsconfig.json` and `vite.config.ts` is set to `"ES2022"`. ES2026 is not recognized by TypeScript or `lightningcss`.

### 2. API requests return 404 or CORS errors
* Check `.env` and verify `VITE_API_URL` points to the correct location of `api.php`.
* Ensure your local PHP development server is running (`php -S localhost:8000`).
* Confirm that `api.php` includes appropriate CORS response headers:
  ```php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: Content-Type");
  ```

### 3. SQLite Database Lock Errors (`SQLITE_BUSY`)
* Verify file permissions on `testchc.sqlite` and the parent folder containing it. The directory containing the SQLite file must be writable by the web server user so SQLite can generate journal files during transactions.

### 4. Missing Translation Keys Render Raw Strings
* Verify that the key exists inside `src/langs/en.json`. `useTranslationProxy` falls back to the primary English file if the active locale key is undefined.