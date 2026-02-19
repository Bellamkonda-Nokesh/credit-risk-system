# RiskLens - Financial Risk Analysis & Credit Default Prediction System

A full-stack web application for financial risk analysis and credit default prediction. Built for financial institutions to manage customer profiles, assess loan risk, run ML-based prediction models, view model performance metrics, and generate portfolio reports.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Risk Prediction Algorithm](#risk-prediction-algorithm)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- **Dashboard** - Summary statistics, risk distribution charts, portfolio trends, and key performance indicators
- **Customer Management** - Add, view, search, and filter customer profiles with detailed financial data
- **Risk Analysis** - Run credit default predictions using multiple ML model simulations (Logistic Regression, Random Forest, Gradient Boosting, Neural Network)
- **Model Metrics** - Compare model performance with accuracy, precision, recall, F1 score, ROC AUC, confusion matrices, and feature importance charts
- **Report Generation** - Generate portfolio health, customer risk analysis, model performance, and portfolio summary reports
- **Dark Mode** - Full light/dark theme support
- **Responsive Design** - Works on desktop, tablet, and mobile screens
- **Sample Data** - Pre-loaded with 12 sample customers and 10 loans for immediate exploration

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| shadcn/ui (Radix UI) | Component library |
| Recharts | Data visualization (charts) |
| TanStack React Query | Server state management |
| Wouter | Client-side routing |
| React Hook Form + Zod | Form handling & validation |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | HTTP framework |
| TypeScript (tsx) | Type-safe server code |
| Drizzle ORM | Database ORM |
| PostgreSQL | Database |
| Zod | Request validation |
| express-session | Session management |

---

## Project Structure

```
RiskLens/
├── client/                     # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/             # shadcn/ui components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions
│   │   ├── pages/              # Page components
│   │   │   ├── dashboard.tsx       # Main dashboard with charts
│   │   │   ├── customers.tsx       # Customer management
│   │   │   ├── risk-analysis.tsx   # Risk prediction tool
│   │   │   ├── model-metrics.tsx   # Model performance comparison
│   │   │   ├── reports.tsx         # Report generation
│   │   │   └── not-found.tsx       # 404 page
│   │   ├── App.tsx             # Root component with routing
│   │   ├── index.css           # Global styles & theme variables
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Static assets
│   └── index.html              # HTML template
├── server/                     # Backend application
│   ├── db.ts                   # Database connection (pg.Pool)
│   ├── index.ts                # Server entry point
│   ├── routes.ts               # API route definitions
│   ├── seed.ts                 # Sample data seeding
│   ├── storage.ts              # Data access layer & risk calculation
│   ├── static.ts               # Static file serving (production)
│   └── vite.ts                 # Vite dev server integration
├── shared/
│   └── schema.ts               # Database schema & types (shared)
├── script/
│   └── build.ts                # Production build script
├── .env                        # Environment variables (create this)
├── drizzle.config.ts           # Drizzle ORM configuration
├── package.json                # Dependencies & scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── postcss.config.js           # PostCSS configuration
```

---

## Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** database (local or cloud-hosted)
- **npm** (comes with Node.js)

---

## Installation

1. **Clone or extract the project:**
   ```bash
   cd RiskLens
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Environment Variables

Create a `.env` file in the project root with the following:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/risklens
SESSION_SECRET=your-secret-key-here
```

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/risklens` |
| `SESSION_SECRET` | Secret key for session encryption | Any random string (e.g., `my-super-secret-key-123`) |

---

## Database Setup

1. **Create a PostgreSQL database:**
   ```sql
   CREATE DATABASE risklens;
   ```

2. **Push the schema to the database:**
   ```bash
   npm run db:push
   ```
   This creates all the necessary tables automatically.

3. **Sample data** is seeded automatically when the server starts for the first time.

---

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will start at **http://localhost:5000**

### Production Build
```bash
npm run build
npm start
```

### Available Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run db:push` | Push schema changes to database |
| `npm run check` | Run TypeScript type checking |

---

## Usage Guide

### 1. Dashboard
Navigate to `/` to see:
- **Total Customers** - Number of customer profiles in the system
- **Total Portfolio Value** - Sum of all active loans
- **Average Risk Score** - Mean risk score across all assessed customers
- **High Risk Count** - Number of customers flagged as high risk
- **Risk Distribution Chart** - Pie chart showing Low / Medium / High risk breakdown
- **Portfolio Trends** - Line chart showing risk changes over time

### 2. Adding a Customer
Navigate to `/customers` and click **"Add Customer"**. Required inputs:

| Field | Type | Description | Example |
|---|---|---|---|
| Name | Text | Full name | John Smith |
| Age | Number | Age in years | 35 |
| Gender | Select | Male / Female / Other | Male |
| Email | Text | Contact email | john@example.com |
| Phone | Text | Phone number (optional) | +1-555-0123 |
| Occupation | Text | Job title (optional) | Software Engineer |
| Annual Income | Number | Yearly income | 85000 |
| Monthly Expenses | Number | Monthly spending | 3200 |
| Credit Score | Number | FICO score (300-850) | 720 |
| Existing Loans | Number | Number of current loans | 1 |
| Employment Years | Number | Years at current job | 5.5 |
| Home Ownership | Select | Rent / Mortgage / Own | Own |
| Marital Status | Select | Single / Married / Divorced (optional) | Married |
| Dependents | Number | Number of dependents (optional) | 2 |

### 3. Running Risk Analysis
Navigate to `/risk-analysis`:
1. Select a **customer** from the dropdown
2. Choose a **prediction model**:
   - Logistic Regression
   - Random Forest
   - Gradient Boosting
   - Neural Network
3. Click **"Run Prediction"**
4. View the result: **Risk Score (0-100)**, **Risk Category** (Low/Medium/High), and **Confidence Level**

### 4. Model Metrics
Navigate to `/model-metrics` to compare model performance:
- Accuracy, Precision, Recall, F1 Score, ROC AUC
- Confusion matrix visualization
- Feature importance rankings
- Radar chart comparison across models

### 5. Generating Reports
Navigate to `/reports` and select a report type:
- **Risk Summary** - Overview of portfolio risk distribution
- **Customer Analysis** - Detailed customer risk breakdown
- **Model Performance** - ML model comparison report
- **Portfolio Health** - Overall portfolio health assessment

---

## API Reference

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Get dashboard summary statistics |

### Customers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/customers` | List all customers |
| GET | `/api/customers/:id` | Get a single customer by ID |
| POST | `/api/customers` | Create a new customer |

### Loans
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/loans` | List all loans |
| POST | `/api/loans` | Create a new loan |

### Predictions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/predictions` | List all predictions |
| POST | `/api/predictions/run` | Run a single prediction |
| POST | `/api/predictions/batch` | Run predictions for all customers |

### Model Metrics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/model-metrics` | List all model performance metrics |

### Reports
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports` | List all generated reports |
| POST | `/api/reports/generate` | Generate a new report |

---

## Database Schema

### Users
| Column | Type | Description |
|---|---|---|
| id | VARCHAR (UUID) | Primary key |
| username | TEXT | Unique username |
| password | TEXT | Hashed password |

### Customers
| Column | Type | Description |
|---|---|---|
| id | VARCHAR (UUID) | Primary key |
| name | TEXT | Full name |
| age | INTEGER | Age |
| gender | TEXT | Gender |
| email | TEXT | Email address |
| phone | TEXT | Phone (optional) |
| occupation | TEXT | Job title (optional) |
| annual_income | REAL | Yearly income |
| monthly_expenses | REAL | Monthly expenses |
| credit_score | INTEGER | FICO score (300-850) |
| existing_loans | INTEGER | Number of active loans |
| employment_years | REAL | Years employed |
| home_ownership | TEXT | Rent / Mortgage / Own |
| marital_status | TEXT | Marital status (optional) |
| dependents | INTEGER | Number of dependents |
| risk_score | REAL | Calculated risk score |
| risk_category | TEXT | Low / Medium / High |
| default_probability | REAL | Probability of default |
| created_at | TIMESTAMP | Record creation time |

### Loans
| Column | Type | Description |
|---|---|---|
| id | VARCHAR (UUID) | Primary key |
| customer_id | VARCHAR | Reference to customer |
| loan_type | TEXT | Type of loan |
| loan_amount | REAL | Total loan amount |
| interest_rate | REAL | Annual interest rate |
| term_months | INTEGER | Loan term in months |
| monthly_payment | REAL | Monthly payment amount |
| status | TEXT | active / paid / defaulted |
| purpose | TEXT | Loan purpose (optional) |
| collateral | TEXT | Collateral details (optional) |
| disbursed_at | TIMESTAMP | Disbursement date |

### Predictions
| Column | Type | Description |
|---|---|---|
| id | VARCHAR (UUID) | Primary key |
| customer_id | VARCHAR | Reference to customer |
| model_name | TEXT | ML model used |
| default_probability | REAL | Predicted default probability |
| risk_category | TEXT | Low / Medium / High |
| confidence | REAL | Model confidence level |
| features | JSONB | Input features snapshot |
| created_at | TIMESTAMP | Prediction time |

### Model Metrics
| Column | Type | Description |
|---|---|---|
| id | VARCHAR (UUID) | Primary key |
| model_name | TEXT | Model name |
| accuracy | REAL | Overall accuracy |
| model_precision | REAL | Precision score |
| recall | REAL | Recall score |
| f1_score | REAL | F1 score |
| roc_auc | REAL | ROC AUC score |
| confusion_matrix | JSONB | Confusion matrix data |
| feature_importance | JSONB | Feature importance rankings |
| trained_at | TIMESTAMP | Training timestamp |

### Reports
| Column | Type | Description |
|---|---|---|
| id | VARCHAR (UUID) | Primary key |
| title | TEXT | Report title |
| type | TEXT | Report type |
| summary | TEXT | Brief summary |
| data | JSONB | Full report data |
| created_at | TIMESTAMP | Generation timestamp |

---

## Risk Prediction Algorithm

The risk scoring uses a rule-based algorithm that considers:

| Factor | Weight | Impact |
|---|---|---|
| Credit Score | High | Higher score = Lower risk |
| Income-to-Expense Ratio | High | Higher ratio = Lower risk |
| Employment Years | Medium | More years = Lower risk |
| Existing Loans | Medium | More loans = Higher risk |
| Home Ownership | Low | Owning = Lower risk |

**Risk Categories:**
- **Low Risk** (0-33): Strong financial profile, low default probability
- **Medium Risk** (34-66): Moderate financial indicators, some concern
- **High Risk** (67-100): Weak financial profile, high default probability

Different model selections (Logistic Regression, Random Forest, etc.) apply slight variations to the base calculation to simulate model-specific behavior.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `NODE_ENV is not recognized` (Windows) | Make sure `cross-env` is installed: `npm install cross-env` |
| Database connection error | Verify your `DATABASE_URL` in `.env` is correct and PostgreSQL is running |
| Port 5000 already in use | Stop the other process using port 5000, or change the port in `server/index.ts` |
| Tables not created | Run `npm run db:push` to create all database tables |
| No data on dashboard | The seed data loads automatically on first start. Restart the server if needed |
| TypeScript errors | Run `npm run check` to see type errors, then fix accordingly |

---

## License

MIT License
