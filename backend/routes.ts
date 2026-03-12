import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, calculatePrediction } from "./storage";
import { insertCustomerSchema, insertLoanSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Dashboard stats
  app.get("/api/dashboard/stats", async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Customers
  app.get("/api/customers", async (_req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) return res.status(404).json({ message: "Customer not found" });
      res.json(customer);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const parsed = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(parsed);
      res.status(201).json(customer);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  // Loans
  app.get("/api/loans", async (_req, res) => {
    try {
      const allLoans = await storage.getLoans();
      res.json(allLoans);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/loans", async (req, res) => {
    try {
      const parsed = insertLoanSchema.parse(req.body);
      const loan = await storage.createLoan(parsed);
      res.status(201).json(loan);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  // Predictions
  app.get("/api/predictions", async (_req, res) => {
    try {
      const preds = await storage.getPredictions();
      res.json(preds);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/predictions/run", async (req, res) => {
    try {
      const { customerId, modelName } = req.body;
      if (!customerId || !modelName) {
        return res.status(400).json({ message: "customerId and modelName are required" });
      }
      const customer = await storage.getCustomer(customerId);
      if (!customer) return res.status(404).json({ message: "Customer not found" });

      const predData = calculatePrediction(customer, modelName);
      const prediction = await storage.createPrediction(predData);

      await storage.updateCustomer(customerId, {
        riskScore: prediction.defaultProbability,
        riskCategory: prediction.riskCategory,
        defaultProbability: prediction.defaultProbability,
      });

      res.status(201).json(prediction);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/predictions/batch", async (req, res) => {
    try {
      const { modelName } = req.body;
      const allCustomers = await storage.getCustomers();
      let count = 0;

      for (const customer of allCustomers) {
        const predData = calculatePrediction(customer, modelName || "logistic_regression");
        await storage.createPrediction(predData);
        await storage.updateCustomer(customer.id, {
          riskScore: predData.defaultProbability,
          riskCategory: predData.riskCategory,
          defaultProbability: predData.defaultProbability,
        });
        count++;
      }

      res.status(201).json({ count, message: `Batch prediction completed for ${count} customers` });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Model Metrics
  app.get("/api/model-metrics", async (_req, res) => {
    try {
      const m = await storage.getModelMetrics();
      res.json(m);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Reports
  app.get("/api/reports", async (_req, res) => {
    try {
      const r = await storage.getReports();
      res.json(r);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/reports/generate", async (req, res) => {
    try {
      const { type } = req.body;
      if (!type) return res.status(400).json({ message: "Report type is required" });

      const allCustomers = await storage.getCustomers();
      const allLoans = await storage.getLoans();

      let title: string;
      let summary: string;
      let data: Record<string, unknown>;

      switch (type) {
        case "risk_summary": {
          const low = allCustomers.filter(c => c.riskCategory === "Low").length;
          const med = allCustomers.filter(c => c.riskCategory === "Medium").length;
          const high = allCustomers.filter(c => c.riskCategory === "High").length;
          const critical = allCustomers.filter(c => c.riskCategory === "Critical").length;
          const avgProb = allCustomers.length > 0 ? allCustomers.reduce((s, c) => s + (c.defaultProbability || 0), 0) / allCustomers.length : 0;
          title = "Risk Summary Report";
          summary = `Portfolio analysis across ${allCustomers.length} customers with average default probability of ${avgProb.toFixed(1)}%`;
          data = { total_customers: allCustomers.length, low_risk: low, medium_risk: med, high_risk: high, critical_risk: critical, avg_default_prob: `${avgProb.toFixed(1)}%` };
          break;
        }
        case "customer_analysis": {
          const avgIncome = allCustomers.length > 0 ? allCustomers.reduce((s, c) => s + c.annualIncome, 0) / allCustomers.length : 0;
          const avgCredit = allCustomers.length > 0 ? allCustomers.reduce((s, c) => s + c.creditScore, 0) / allCustomers.length : 0;
          const homeOwners = allCustomers.filter(c => c.homeOwnership === "Own").length;
          title = "Customer Analysis Report";
          summary = `Demographic and financial profile analysis of ${allCustomers.length} customers`;
          data = { total_customers: allCustomers.length, avg_income: `$${avgIncome.toFixed(0)}`, avg_credit_score: Math.round(avgCredit), home_owners: homeOwners, renters: allCustomers.length - homeOwners, avg_employment: `${(allCustomers.reduce((s, c) => s + c.employmentYears, 0) / Math.max(allCustomers.length, 1)).toFixed(1)} yrs` };
          break;
        }
        case "model_performance": {
          const allMetrics = await storage.getModelMetrics();
          const best = allMetrics[0];
          title = "Model Performance Report";
          summary = `Evaluation of ${allMetrics.length} trained models with performance benchmarks`;
          data = best ? { best_model: best.modelName, accuracy: `${(best.accuracy * 100).toFixed(1)}%`, precision: `${(best.precision * 100).toFixed(1)}%`, recall: `${(best.recall * 100).toFixed(1)}%`, roc_auc: `${(best.rocAuc * 100).toFixed(1)}%`, models_trained: allMetrics.length } : { models_trained: 0, message: "No models trained yet" };
          break;
        }
        case "portfolio_health": {
          const totalAmount = allLoans.reduce((s, l) => s + l.loanAmount, 0);
          const activeLoans = allLoans.filter(l => l.status === "active").length;
          title = "Portfolio Health Report";
          summary = `Loan portfolio analysis with ${allLoans.length} total loans`;
          data = { total_loans: allLoans.length, active_loans: activeLoans, total_portfolio: `$${(totalAmount / 1000000).toFixed(2)}M`, avg_loan_amount: `$${allLoans.length > 0 ? (totalAmount / allLoans.length).toFixed(0) : 0}`, avg_interest_rate: `${allLoans.length > 0 ? (allLoans.reduce((s, l) => s + l.interestRate, 0) / allLoans.length).toFixed(1) : 0}%`, high_risk_loans: allCustomers.filter(c => (c.defaultProbability || 0) > 60).length };
          break;
        }
        default:
          return res.status(400).json({ message: "Invalid report type" });
      }

      const report = await storage.createReport({ title, type, summary, data });
      res.status(201).json(report);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  return httpServer;
}
