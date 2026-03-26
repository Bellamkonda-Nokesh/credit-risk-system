# 🛡️ RiskLens — Credit Risk Intelligence System

> **Live App → [credit-risk-system-r715.onrender.com](https://credit-risk-system-r715.onrender.com)**

---

## 🚨 The Problem

Banks and lenders lose **billions every year** from bad loans — approving credit for people who can't repay it. Traditional methods rely on gut feeling, manual checks, or oversimplified credit scores.

**This means:**
- ❌ Good customers get rejected unfairly
- ❌ High-risk customers slip through undetected
- ❌ Analysts waste hours reviewing data manually
- ❌ No clear visibility into portfolio-level risk

---

## ✅ The Solution

**RiskLens** is a data-driven credit risk platform that uses **machine learning** to instantly predict the probability of a customer defaulting on a loan — so lenders can make smarter, faster, and fairer decisions.

```
Customer Data → ML Model → Risk Score → Decision (Approve / Review / Reject)
```

**With RiskLens:**
- ✅ Predict default risk in seconds, not hours
- ✅ Visualise your entire loan portfolio at a glance
- ✅ Catch high-risk profiles before approving loans
- ✅ Track model accuracy and improve over time

---

## ✨ Features

### 📊 Risk Dashboard
Your command centre. See the full picture at a glance — total customers, active loans, average risk scores, and default trends. Interactive charts powered by live data so you always know where your portfolio stands.

### 👥 Customer Credit Profiles
Add customers and their financial details (income, credit score, employment, debt). Each profile is instantly scored by the ML model — no manual analysis needed.

### 🤖 ML-Powered Risk Scoring
The brain of the system. Every customer gets a **default probability score (0–100%)** and a risk category — `Low`, `Medium`, `High`, or `Critical`. It factors in credit history, income, loan amount, and more.

### 🎯 Smart Risk Categories
Not just a number — each customer is placed in a clear risk bucket with colour-coded badges:
- 🟢 **Low** → Safe to approve
- 🟡 **Medium** → Review recommended
- 🟠 **High** → Proceed with caution
- 🔴 **Critical** → High default likelihood

### 📈 Model Performance Metrics
Track how well your AI model is performing over time. Monitor **accuracy**, **ROC-AUC score**, **precision**, and **recall** — so you can trust the scores and improve them.

### 💰 Loan Management
Attach loans to customer profiles. Track loan amounts, interest rates, and repayment status. Link loans to risk predictions for a complete financial picture.

### 📑 Reports & Analytics
Generate summaries and spot patterns — which customers are defaulting? Which income ranges are safest? Which loan amounts carry the most risk?

### 🔐 Secure Authentication
Full user auth built-in — register new analyst accounts, log in securely, and maintain separate sessions. Passwords are hashed, sessions are encrypted.

---

## 🚀 Try It Now

```
🌐 URL      → https://credit-risk-system-r715.onrender.com
👤 Username → admin
🔑 Password → admin123
```

> ⏳ First load may take ~30 seconds (free server wakes from sleep)

---

## 🧰 Tech Stack

```
Frontend  → React + TypeScript + Tailwind CSS + shadcn/ui
Backend   → Node.js + Express
Database  → PostgreSQL (Neon)
ORM       → Drizzle ORM
Hosting   → Render.com
```

---

## 🛠️ Run Locally

```bash
# 1. Clone
git clone https://github.com/Bellamkonda-Nokesh/credit-risk-system.git
cd credit-risk-system

# 2. Install dependencies
npm install

# 3. Set up environment
DATABASE_URL=your_postgres_connection_string
SESSION_SECRET=your_secret_key

# 4. Push schema to database
npm run db:push

# 5. Start development server
npm run dev
# → Open http://localhost:5000
```

---

## 📁 Project Structure

```
credit-risk-system/
├── frontend/        → React UI (pages, components, hooks)
├── backend/         → Express API, auth, routes, storage
├── shared/          → Database schema & shared types
└── tools/           → Build scripts
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret key for user sessions |

---

Built with ❤️ by [Nokesh Bellamkonda](https://github.com/Bellamkonda-Nokesh)
