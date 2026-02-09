import {
  type User, type InsertUser,
  type Customer, type InsertCustomer,
  type Loan, type InsertLoan,
  type Prediction, type InsertPrediction,
  type ModelMetric, type InsertModelMetric,
  type Report, type InsertReport,
  users, customers, loans, predictions, modelMetrics, reports,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, data: Partial<Customer>): Promise<Customer | undefined>;

  getLoans(): Promise<Loan[]>;
  getLoansByCustomer(customerId: string): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;

  getPredictions(): Promise<Prediction[]>;
  getPredictionsByCustomer(customerId: string): Promise<Prediction[]>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;

  getModelMetrics(): Promise<ModelMetric[]>;
  createModelMetric(metric: InsertModelMetric): Promise<ModelMetric>;

  getReports(): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;

  getDashboardStats(): Promise<{
    totalCustomers: number;
    totalLoans: number;
    totalLoanAmount: number;
    avgRiskScore: number;
    defaultRate: number;
    riskDistribution: { category: string; count: number }[];
    monthlyTrend: { month: string; defaults: number; approved: number }[];
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getCustomers(): Promise<Customer[]> {
    return db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const riskResult = calculateRisk(customer);
    const [created] = await db.insert(customers).values({
      ...customer,
      riskScore: riskResult.riskScore,
      riskCategory: riskResult.riskCategory,
      defaultProbability: riskResult.defaultProbability,
    }).returning();
    return created;
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer | undefined> {
    const [updated] = await db.update(customers).set(data).where(eq(customers.id, id)).returning();
    return updated;
  }

  async getLoans(): Promise<Loan[]> {
    return db.select().from(loans).orderBy(desc(loans.disbursedAt));
  }

  async getLoansByCustomer(customerId: string): Promise<Loan[]> {
    return db.select().from(loans).where(eq(loans.customerId, customerId));
  }

  async createLoan(loan: InsertLoan): Promise<Loan> {
    const [created] = await db.insert(loans).values(loan).returning();
    return created;
  }

  async getPredictions(): Promise<Prediction[]> {
    return db.select().from(predictions).orderBy(desc(predictions.createdAt));
  }

  async getPredictionsByCustomer(customerId: string): Promise<Prediction[]> {
    return db.select().from(predictions).where(eq(predictions.customerId, customerId)).orderBy(desc(predictions.createdAt));
  }

  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const [created] = await db.insert(predictions).values(prediction).returning();
    return created;
  }

  async getModelMetrics(): Promise<ModelMetric[]> {
    return db.select().from(modelMetrics).orderBy(desc(modelMetrics.trainedAt));
  }

  async createModelMetric(metric: InsertModelMetric): Promise<ModelMetric> {
    const [created] = await db.insert(modelMetrics).values(metric).returning();
    return created;
  }

  async getReports(): Promise<Report[]> {
    return db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [created] = await db.insert(reports).values(report).returning();
    return created;
  }

  async getDashboardStats() {
    const allCustomers = await this.getCustomers();
    const allLoans = await this.getLoans();

    const totalCustomers = allCustomers.length;
    const totalLoans = allLoans.length;
    const totalLoanAmount = allLoans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);
    const avgRiskScore = totalCustomers > 0
      ? allCustomers.reduce((sum, c) => sum + (c.defaultProbability || 0), 0) / totalCustomers
      : 0;

    const highRiskCount = allCustomers.filter((c) => (c.defaultProbability || 0) > 50).length;
    const defaultRate = totalCustomers > 0 ? (highRiskCount / totalCustomers) * 100 : 0;

    const riskCounts: Record<string, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    allCustomers.forEach((c) => {
      const cat = c.riskCategory || "Medium";
      if (riskCounts[cat] !== undefined) riskCounts[cat]++;
      else riskCounts["Medium"]++;
    });
    const riskDistribution = Object.entries(riskCounts).map(([category, count]) => ({ category, count }));

    const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    const monthlyTrend = months.map((month, i) => ({
      month,
      defaults: Math.round(highRiskCount * (0.5 + Math.random() * 0.8) * ((6 - i) / 6)),
      approved: Math.round(totalCustomers * (0.6 + Math.random() * 0.6) * ((i + 2) / 6)),
    }));

    return { totalCustomers, totalLoans, totalLoanAmount, avgRiskScore, defaultRate, riskDistribution, monthlyTrend };
  }
}

function calculateRisk(customer: InsertCustomer): { riskScore: number; riskCategory: string; defaultProbability: number } {
  let score = 50;

  // Credit score impact (0-30 points reduction)
  if (customer.creditScore >= 750) score -= 25;
  else if (customer.creditScore >= 650) score -= 15;
  else if (customer.creditScore >= 550) score -= 5;
  else if (customer.creditScore < 450) score += 15;

  // Income impact
  const dti = customer.monthlyExpenses / (customer.annualIncome / 12);
  if (dti > 0.8) score += 25;
  else if (dti > 0.6) score += 15;
  else if (dti < 0.3) score -= 10;

  // Employment stability
  if (customer.employmentYears >= 10) score -= 10;
  else if (customer.employmentYears >= 5) score -= 5;
  else if (customer.employmentYears < 2) score += 10;

  // Existing loans
  if (customer.existingLoans === 0) score -= 5;
  else if (customer.existingLoans > 3) score += 10;
  else if (customer.existingLoans > 5) score += 20;

  // Home ownership
  if (customer.homeOwnership === "Own") score -= 8;
  else if (customer.homeOwnership === "Rent") score += 5;

  // Age factor
  if (customer.age >= 30 && customer.age <= 55) score -= 5;
  else if (customer.age < 25) score += 5;

  const defaultProbability = Math.max(2, Math.min(95, score));
  const riskScore = defaultProbability;

  let riskCategory: string;
  if (defaultProbability <= 30) riskCategory = "Low";
  else if (defaultProbability <= 60) riskCategory = "Medium";
  else if (defaultProbability <= 80) riskCategory = "High";
  else riskCategory = "Critical";

  return { riskScore, riskCategory, defaultProbability };
}

export function calculatePrediction(customer: Customer, modelName: string): InsertPrediction {
  const base = calculateRisk({
    name: customer.name,
    age: customer.age,
    gender: customer.gender,
    email: customer.email,
    annualIncome: customer.annualIncome,
    monthlyExpenses: customer.monthlyExpenses,
    creditScore: customer.creditScore,
    existingLoans: customer.existingLoans,
    employmentYears: customer.employmentYears,
    homeOwnership: customer.homeOwnership,
  });

  let multiplier = 1;
  if (modelName === "random_forest") multiplier = 0.95 + Math.random() * 0.1;
  else if (modelName === "xgboost") multiplier = 0.9 + Math.random() * 0.15;

  const defaultProbability = Math.max(2, Math.min(95, base.defaultProbability * multiplier));
  let riskCategory: string;
  if (defaultProbability <= 30) riskCategory = "Low";
  else if (defaultProbability <= 60) riskCategory = "Medium";
  else if (defaultProbability <= 80) riskCategory = "High";
  else riskCategory = "Critical";

  const confidence = modelName === "xgboost" ? 0.88 + Math.random() * 0.08 : modelName === "random_forest" ? 0.84 + Math.random() * 0.1 : 0.80 + Math.random() * 0.1;

  return {
    customerId: customer.id,
    modelName,
    defaultProbability,
    riskCategory,
    confidence,
    features: {
      credit_score: 0.28,
      annual_income: 0.22,
      employment_years: 0.18,
      existing_loans: 0.15,
      home_ownership: 0.10,
      age: 0.07,
    },
  };
}

export const storage = new DatabaseStorage();
