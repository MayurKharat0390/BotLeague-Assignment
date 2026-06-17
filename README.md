# 🤖 BotLeague - India's Ultimate Robotics Arena

An ultra-premium, high-performance, and immersive landing page designed for **BotLeague**, India's premier robotics battle arena. Built using modern frontend methodologies, vanilla CSS, and vanilla JavaScript powered by **Vite**.

Live deployment ready: Perfect for showcasing advanced UI/UX design, custom micro-interactions, responsive frameworks, and interactive game mechanics to recruiters.

---

## 🌟 Key Features

### 1. ⚔️ Interactive Fighting Robots Simulator
* **Live Action Console**: Users can interact directly with the robot arena.
* **Combat Controls**: Click to execute **Laser**, **Shield**, or **Charge** commands.
* **Dynamic State Management**: Real-time updating health bars, energy meters, action logs, and win/loss state conditions.
* **Micro-Animations**: Custom particle effects, screenshake, and damage-flash animations built entirely in pure CSS/JS.

### 2. 🌌 Cyberpunk Premium Hero Section
* **Immersive Atmosphere**: Sleek dark-mode theme utilizing dark metallics, neon accents, and glowing radial gradients.
* **Visual Polish**: Fluid hover states, custom typography (Outfit & Orbitron), and glassmorphic UI panels.
* **Call To Actions**: High-intent registration triggers with smooth page anchors.

### 3. 🛡️ Premium Sponsor & Partner Grid
* **Monochrome Aesthetic**: Sponsor logos rendered in uniform black & grey tones to maintain brand cohesion.
* **Card Framing**: Housed inside glossy dark cards (`#0c0c10`) featuring hover lift effects, border glow transitions, and partner role tagging (`Academic Partner`, `Hardware Sponsor`, `Industry Partner`).

### 4. 🧬 Creative "Join the Ecosystem" Hub
* **Split Layout with Live Telemetry**: Left side displays a live-fluctuating participant counter (`🟢 12,847+ Active Members`) to create urgency and social proof.
* **Role-Selector System**: Interactive pills (Judge, Volunteer, Partner) that auto-scroll users to their specific card.
* **Stateful Forms**: Cards containing benefits, role tags, custom input fields, active loading spinners, and styled success check-mark states.

---

## 🛠️ Tech Stack & Architecture

* **Bundler & Tooling**: [Vite.js](https://vitejs.dev/) (Fast development, optimized tree-shaking production builds)
* **Markup**: Semantic HTML5 (SEO friendly structure with strict sectioning tags)
* **Styling**: Vanilla CSS3 (Custom variables, Flexbox/Grid layouts, and CSS keyframe animations)
* **Logic**: Vanilla JavaScript (ES6+ modular event handlers, real-time counters, state machines, DOM manipulation)
* **Icons**: [FontAwesome](https://fontawesome.com/)

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

4. **Compile production build:**
   ```bash
   npm run build
   ```
   The production-ready assets will compile into the `dist/` directory.

---

## 🌐 How to Deploy to Vercel (Recruiter-Ready)

Vite projects deploy seamlessly to **Vercel** in seconds:

1. **Sign Up/Log In**: Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
2. **Import Repo**: Click **"Add New"** > **"Project"** and select `BotLeague-Assignment` from your GitHub list.
3. **Configure Project**:
   * **Framework Preset**: Vercel will automatically detect `Vite`.
   * **Root Directory**: `./` (default)
   * **Build Command**: `npm run build` (automatic)
   * **Output Directory**: `dist` (automatic)
4. **Deploy**: Click **"Deploy"**. Your live URL will be ready within 30 seconds!

---

## 🧑‍💻 Full-Stack Considerations & Recommendations

As a **Full-Stack Developer**, you can make this project stand out even more to recruiters by demonstrating backend expertise:
1. **Serverless Form API**:
   * Instead of local simulation, build a simple serverless endpoint (e.g., using **Vercel Serverless Functions** in `/api/register.js` or a Node/Express backend).
   * Persist registrations in a lightweight database like **Supabase (PostgreSQL)**, **Firebase**, or **MongoDB Atlas**.
2. **Webhooks / Email Notifications**:
   * Hook form submissions to **Resend** or **SendGrid** to trigger a real email confirmation upon joining.
   * Send registrations to a Discord/Slack webhook channel so recruiters see notifications in real-time.
3. **Performance & SEO**:
   * Leverage Vite’s asset optimization.
   * Set up open-graph meta tags so the link previews look gorgeous when shared on LinkedIn or Twitter.
