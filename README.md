# 🗓️ Interactive Journal Calendar - TUF Frontend Assessment

A premium, highly interactive calendar and journaling application built for the Take U Forward (TUF) frontend assessment. Designed with a focus on gesture-based interactions, dynamic theming, fluid physics, and a high-end "glassmorphism" aesthetic.

**[🔴 Live Vercel Deployment] (https://tuf-calendar-umber.vercel.app/)** | **[🎥 Loom Video Demonstration] (https://www.loom.com/share/b45c2a701439400ab25023b298adcd59)**

---

## ✨ Core Features & UX Details

* **Gesture-Based Drag Selection:** Engineered custom React event handlers (`onMouseDown`, `onMouseEnter`, `onMouseUp`) allowing users to click and drag across the grid to seamlessly select date ranges, generating a connected "pill" UI.
* **Dynamic Monthly Theming:** The application is context-aware. As the month changes, not only does the 4K background imagery update, but the entire UI color palette (selection highlights, hover states, and focus rings) shifts dynamically to match the season.
* **Persistent & Debounced Storage:** Strictly frontend data persistence. Journal entries automatically sync to browser `localStorage`. Implemented a custom `useRef` timer to trigger a smooth, debounced "Saved ✓" micro-animation, providing immediate user feedback without backend delays.
* **Framer Motion Physics:** Utilized spring-physics for kinetic hover effects, floating active states, and staggered entrance animations. Month transitions use `popLayout` to ensure zero layout shift.
* **Fully Responsive:** Gracefully degrades from a side-by-side ultra-wide desktop view to a stacked, touch-friendly mobile layout.

---

## 🏗️ Technical Choices & Architecture

To strictly meet the evaluation criteria for component architecture, state management, and styling, I made the following engineering decisions:

### 1. Advanced State Management & Logic (`date-fns` + React Hooks)
Instead of relying on heavy, monolithic calendar libraries (like `react-calendar`), I built the grid engine from scratch using `date-fns` for lightweight date math. Complex UI states—such as tracking drag status vs. click status—are managed natively via React `useState` and synchronized with `localStorage`.

### 2. Styling Implementation (Tailwind CSS)
I chose Tailwind CSS to maintain a strict, scalable design system. 
* **Algorithmic Styling:** Utilized a `THEME_CLASSES` dictionary to map specific months to exact Tailwind color scales (e.g., Emerald, Indigo, Rose) without breaking Tailwind's purge process.
* **Glassmorphism:** Leveraged `backdrop-blur-2xl` and custom CSS shadows to create depth and separate the UI layers from the dynamic background aura.

### 3. Animation Engine (Framer Motion)
Standard CSS transitions are often too linear. I used Framer Motion to inject realistic physics:
* `y: { type: "spring", stiffness: 60, damping: 15 }` gives the month transitions a "heavy" paper-like feel.
* Conditional rendering wrapped in `<AnimatePresence>` ensures smooth mounting/unmounting of the "Saved ✓" toast indicator.

### 4. Zero Backend Architecture
Per the assessment constraints, no API or database was used. The app relies entirely on optimized client-side interactions and `localStorage` to prove frontend competency without unnecessary full-stack bloat.

---

## 🚀 Running the Project Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/tuf-calendar.git](https://github.com/yourusername/tuf-calendar.git)
   cd tuf-calendar
2. **Install dependencies:**
   ```bash
   npm install
   # Installs Next.js, React, Tailwind, Framer Motion, and date-fns 
3. **Run the development server:**
   ```bash
   npm run dev
4. **Run the App:**   
   Open http://localhost:3000 in your browser.

**Built by Saksham for the TUF Engineering Assessment.**  
