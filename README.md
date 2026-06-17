# 🤖 BotLeague - India's Ultimate Robotics Arena

An ultra-premium, high-performance, and immersive landing page designed for **BotLeague**, India's premier robotics battle arena. Built using modern frontend methodologies, vanilla CSS, and vanilla JavaScript powered by **Vite** with a secure **Vercel Serverless Node.js backend**.

### 🔗 Live Deployment: [https://bot-league-assignment.vercel.app/](https://bot-league-assignment.vercel.app/)

---

## 🎨 UI/UX Design System & Philosophy

Recruiters and frontend engineers will appreciate the following visual and architectural decisions implemented throughout the project:

### 🌌 1. Cyberpunk / High-Tech Industrial Theme
* **Color Palette**: Dark obsidian backgrounds (`#050508`) paired with neon accents (Pyro Red, Cyber Blue, Ember Amber) to simulate a high-stakes arena environment.
* **Glassmorphism**: Backdrop blur overlays, semi-transparent glossy panels, and subtle border highlights (`rgba(255, 255, 255, 0.08)`) that create a layered 3D depth.
* **Modern Typography**: Structured titles using `Orbitron` and clean, readable text bodies using `Outfit` (sourced from Google Fonts) to maintain a gaming/futuristic aesthetic.

### ⚡ 2. Immersive Micro-Interactions & Transitions
* **Interactive Robot Hover Panels**: Fighting robots scale up, display grid overlays, and trigger status light indicators when hovered over.
* **Fluid Keyframe Animations**: Subtle breathing glows, rotating background orbit rings in the ecosystem panel, and custom SVG animation states.
* **Smooth CSS Transitions**: All buttons, links, cards, and input fields morph smoothly (`transition: all 0.3s cubic-bezier(...)`) rather than jumping instantly.

### 📱 3. Fully Responsive Mobile-First Breakpoints
* Layout adjusts fluidly across ultra-wide monitors, standard laptops, tablets, and smartphones using CSS grid/flexbox dynamics.
* Fully styled mobile navigation drawer with custom hamburger toggle mechanics.

---

## ⚙️ Core Features

### 1. ⚔️ Playable Robot Battle Simulator Console
* **Interactive HUD Controls**: Users can click **Laser**, **Shield**, or **Charge** buttons to simulate a battle between two heavy-duty combatants.
* **Real-time DOM Telemetry**: Updates health bars, energy meters, active actions log, and registers round wins/losses instantly.
* **Visual Effects**: Screen-shake, collision flashes, and particle sparks rendered on hits.

### 2. 🔐 Cyberpunk User Portal & Authentication Modal
* **Interactive Login/Register Modal**: Features smooth tab transitions between login and registration panels.
* **Advanced Backend Security**: Secure password encryption in `/api/auth` using Node.js's native `crypto.pbkdf2Sync` (zero dependencies, high efficiency) with unique salts.
* **Dynamic Header State**: Once logged in, login/signup buttons fade out and are replaced with a glowing User Profile trigger (`Astronaut Avatar`).
* **Glassmorphic User Dashboard Console**: Access your membership details (Active status, Rank: Level 1, Reputation: 150 XP, and registered event tickets).

### 3. 🧬 Creative "Join the Ecosystem" Hub
* **Live Telemetry social proof**: Left side displays a live fluctuating active member counter (`🟢 12,847+ Members Online`) to drive sign-ups.
* **Stateful Role Cards**: Switching between Judge, Volunteer, or Partner forms updates the submission cards.
* **Vercel Serverless Integrations**: Submissions hit `/api/join` serverless handler, validate inputs, show interactive spinner loading states (`REGISTERING...`), and transition to a checklist success page.

### 🛡️ 4. Monochrome Sponsors & Partners Section
* **Uniform Grayscale Styling**: Partner logos display in high-fidelity black & grey to keep sections clean and professional.
* **Hover Restoral**: Hovering over a logo card lifts the card, brightens the logo color, and generates a glowing neon border indicating partnership levels.

---

## 🛠️ Technical Architecture

* **Frontend**: Vanilla HTML5, CSS3 Variables, ES6+ Modular JavaScript
* **Build Engine**: Vite.js (Optimized production assets tree-shaking & code splitting)
* **Backend**: Vercel Serverless Functions (Node.js API endpoints inside `/api/`)
* **Database (Optional)**: Connects directly to a **Supabase (PostgreSQL)** database.
* **Resilient Offline Fallback**: If run locally via `npm run dev` (where serverless backend ports are offline), the JS automatically detects this, warns in the console, and falls back to mock storage so registration flows still succeed instantly for evaluation.

---

## 🚀 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MayurKharat0390/BotLeague-Assignment.git
   cd BotLeague-Assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Run Serverless Backend APIs Locally**:
   * Install Vercel CLI: `npm install -g vercel`
   * Run the CLI dev server: `vercel dev` (hosts on `http://localhost:3000` with full API support).

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🗄️ Database Table Setup (Supabase / PostgreSQL)

Run the following SQL script in your Supabase SQL editor to create the required tables:

```sql
-- 1. Create table for registered users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table for Ecosystem registrations
CREATE TABLE registrations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create table for Newsletter subscribers
CREATE TABLE subscribers (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```
