# VitaLog

VitaLog is a **full‑stack wellness tracking app** that helps users understand patterns in their daily habits — sleep, mood, hydration, nutrition, and activity — and turns them into **clear, explainable insights**.

The goal of VitaLog is not just to show averages, but to reveal **day‑to‑day relationships** between behaviors (for example, how sleep and hydration relate to mood), while keeping everything transparent and easy to understand.

---

## ✨ Features

* 💤 **Sleep tracking** – hours slept per day
* 😊 **Mood check‑ins** – simple 1–10 daily rating
* 💧 **Hydration tracking** – daily water intake (liters)
* 🍽️ **Nutrition tracking** – daily calorie intake
* 🏃 **Activity tracking** – workout duration (minutes)
* 📊 **Smart insights** – correlations between habits based on daily data
* 🧠 **Explainable logic** – no black‑box AI, just clear reasoning

---

## 🧩 How Insights Work (High‑Level)

Instead of relying only on averages, VitaLog groups data **by day** and analyzes how different metrics move together:

* Sleep ↔ Mood
* Hydration ↔ Mood
* Sleep ↔ Activity
* Calories ↔ Activity

When enough daily data exists (5+ paired days), the app computes **correlation strength** and converts it into human‑readable insights such as:

> "There is a clear correlation between adequate sleep and improved mood scores."

If data is missing or inconsistent, VitaLog surfaces that too:

> "Hydration logs have been sporadic, which may hide clearer patterns."

---

## 🛠️ Tech Stack

### Frontend

* **Next.js** (App Router)
* **React**
* **TypeScript**
* **Tailwind CSS**

### Backend

* **Flask (Python)**
* **SQLAlchemy**
* **PostgreSQL**

### Data & Logic

* Daily data aggregation
* Safe averages and extrema
* Pearson correlation for pattern detection
* Fully explainable insight generation

---

## 🚀 Getting Started (Frontend)

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open:

```
http://localhost:3000
```

You can start editing the main page at:

```
app/page.tsx
```

The page auto‑updates as you edit the file.

---

## 🔤 Fonts

This project uses **next/font** to automatically optimize and load **Geist**, a modern font family by Vercel.

---

## 🌍 Deployment

The easiest way to deploy the frontend is with **Vercel**:

* Connect the repository
* Select Next.js as the framework
* Deploy

Learn more here:
[https://nextjs.org/docs/app/building-your-application/deploying](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 🎯 Project Philosophy

VitaLog focuses on:

* Transparency over hype
* Patterns over raw numbers
* Guidance without judgment

The app is designed to grow gradually — starting with manual logs and explainable insights, and later expanding into smarter recommendations and deeper analytics.

---

## 📌 Status

This project is under active development and iteration.

Contributions, feedback, and suggestions are welcome.
