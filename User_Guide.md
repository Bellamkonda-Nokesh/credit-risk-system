# RiskLens User Guide

RiskLens is a financial risk analysis system that helps you manage customer profiles and predict the likelihood of loan defaults using rule-based calculations.

## 1. Where is the data stored?
All your data is stored in the **PostgreSQL Database** that you connected via the `DATABASE_URL` in your `.env` file. 
*   **Persistent:** Your data remains safe even if you stop the server.
*   **Seeded Data:** The app comes with 12 sample customers and 10 loans already added so you can see how the charts look immediately.

## 2. How to Add a Customer
To add a new customer for analysis, go to the **Customers** page and click **"Add Customer"**. You will need to provide:

| Category | Input Field | What to enter |
| :--- | :--- | :--- |
| **Identity** | Name | Full name of the applicant |
| | Email | Contact email |
| **Financials** | Annual Income | Total yearly earnings (e.g., 75000) |
| | Monthly Expenses | Total monthly outgoings (e.g., 2000) |
| | Credit Score | A number between 300 and 850 |
| **Stability** | Employment Years | Number of years at current job |
| | Home Ownership | Rent, Mortgage, or Own |

## 3. How to Run Risk Analysis
Once a customer is added, go to the **Risk Analysis** page:
1.  **Select Customer:** Choose the person you want to assess.
2.  **Select Model:** Choose an analysis model (e.g., "Logistic Regression" or "Random Forest"). 
    *   *Note: These are simulated models. Different models will give slightly different risk scores based on how they weigh income vs. credit score.*
3.  **Click Run Prediction:** The system will calculate a **Risk Score (0-100)** and a **Risk Level** (Low, Medium, High).

## 4. Understanding the Dashboard
*   **Summary Stats:** Shows your total portfolio value and average risk.
*   **Risk Distribution:** A pie chart showing how many customers are "High Risk" vs "Low Risk".
*   **Trends:** Shows how risk levels have changed over time in your database.

## 5. Generating Reports
Go to the **Reports** page to create professional summaries of your data. You can generate:
*   **Portfolio Health:** A bird's-eye view of your entire loan book.
*   **Customer Risk Analysis:** Detailed breakdown of individual applicant risks.

### Pro Tip:
Keep the **Credit Score** high and the **Income-to-Expense ratio** healthy for "Low Risk" results!
