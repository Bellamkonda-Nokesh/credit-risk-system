# RiskLens - Financial Risk Analysis & Credit Default Prediction System

## Overview
A comprehensive financial risk analysis platform that uses data-driven credit scoring to predict customer default probability. Features interactive dashboards, customer management, risk analysis with multiple ML models, model performance metrics, and report generation.

## Tech Stack
- **Frontend**: React + TypeScript, TanStack Query, Recharts, Shadcn UI, Tailwind CSS, Wouter routing
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Inter font, custom theme tokens with dark mode support

## Project Structure
```
client/src/
  pages/         - Dashboard, Customers, Risk Analysis, Model Metrics, Reports
  components/    - AppSidebar, StatCard, RiskGauge, ThemeToggle
  lib/           - queryClient, theme-provider, utils
server/
  index.ts       - Express server setup
  routes.ts      - All API endpoints
  storage.ts     - Database operations + risk calculation logic
  db.ts          - Drizzle database connection
  seed.ts        - Seed data for demo
shared/
  schema.ts      - All data models (customers, loans, predictions, modelMetrics, reports)
```

## Key Features
1. **Dashboard**: KPI stat cards, area/pie/bar charts, recent customer risk profiles
2. **Customers**: Grid cards with search/filter, detail panel, add customer form with auto risk scoring
3. **Risk Analysis**: Individual + batch predictions, radar chart, feature importance, prediction history
4. **Model Metrics**: Accuracy/Precision/Recall/F1/ROC-AUC comparison, confusion matrix, radial chart
5. **Reports**: Generate risk summary, customer analysis, model performance, portfolio health reports

## API Routes
- GET/POST /api/customers
- GET /api/loans, POST /api/loans
- GET /api/predictions, POST /api/predictions/run, POST /api/predictions/batch
- GET /api/model-metrics
- GET /api/reports, POST /api/reports/generate
- GET /api/dashboard/stats

## Database
- PostgreSQL with Drizzle ORM
- Tables: users, customers, loans, predictions, model_metrics, reports
- Auto-seeded with 12 customers, 10 loans, 3 model metrics on first run
