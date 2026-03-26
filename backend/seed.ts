import { storage } from "./storage";
import { log } from "./logger";
import crypto from "crypto";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}


const seedCustomers = [
  { name: "Sarah Mitchell", age: 34, gender: "Female", email: "sarah.m@email.com", phone: "+1-555-0101", occupation: "Software Engineer", annualIncome: 125000, monthlyExpenses: 3200, creditScore: 780, existingLoans: 1, employmentYears: 8, homeOwnership: "Own", maritalStatus: "Married", dependents: 2 },
  { name: "James Rodriguez", age: 42, gender: "Male", email: "j.rodriguez@email.com", phone: "+1-555-0102", occupation: "Financial Analyst", annualIncome: 95000, monthlyExpenses: 2800, creditScore: 720, existingLoans: 2, employmentYears: 15, homeOwnership: "Mortgage", maritalStatus: "Married", dependents: 3 },
  { name: "Emily Chen", age: 28, gender: "Female", email: "emily.chen@email.com", phone: "+1-555-0103", occupation: "Marketing Manager", annualIncome: 78000, monthlyExpenses: 2400, creditScore: 690, existingLoans: 1, employmentYears: 4, homeOwnership: "Rent", maritalStatus: "Single", dependents: 0 },
  { name: "Michael Johnson", age: 55, gender: "Male", email: "m.johnson@email.com", phone: "+1-555-0104", occupation: "Business Owner", annualIncome: 180000, monthlyExpenses: 5500, creditScore: 810, existingLoans: 3, employmentYears: 25, homeOwnership: "Own", maritalStatus: "Married", dependents: 1 },
  { name: "Priya Patel", age: 31, gender: "Female", email: "priya.p@email.com", phone: "+1-555-0105", occupation: "Data Scientist", annualIncome: 110000, monthlyExpenses: 2600, creditScore: 750, existingLoans: 0, employmentYears: 6, homeOwnership: "Rent", maritalStatus: "Single", dependents: 0 },
  { name: "David Williams", age: 47, gender: "Male", email: "d.williams@email.com", phone: "+1-555-0106", occupation: "Construction Manager", annualIncome: 72000, monthlyExpenses: 3800, creditScore: 580, existingLoans: 4, employmentYears: 12, homeOwnership: "Mortgage", maritalStatus: "Divorced", dependents: 2 },
  { name: "Lisa Thompson", age: 39, gender: "Female", email: "l.thompson@email.com", phone: "+1-555-0107", occupation: "Teacher", annualIncome: 55000, monthlyExpenses: 2200, creditScore: 650, existingLoans: 2, employmentYears: 10, homeOwnership: "Rent", maritalStatus: "Married", dependents: 1 },
  { name: "Robert Kim", age: 26, gender: "Male", email: "r.kim@email.com", phone: "+1-555-0108", occupation: "Freelance Designer", annualIncome: 45000, monthlyExpenses: 2000, creditScore: 520, existingLoans: 3, employmentYears: 2, homeOwnership: "Rent", maritalStatus: "Single", dependents: 0 },
  { name: "Amanda Foster", age: 36, gender: "Female", email: "a.foster@email.com", phone: "+1-555-0109", occupation: "Physician", annualIncome: 210000, monthlyExpenses: 4200, creditScore: 820, existingLoans: 1, employmentYears: 9, homeOwnership: "Own", maritalStatus: "Married", dependents: 2 },
  { name: "Carlos Garcia", age: 51, gender: "Male", email: "c.garcia@email.com", phone: "+1-555-0110", occupation: "Retail Manager", annualIncome: 48000, monthlyExpenses: 3100, creditScore: 490, existingLoans: 5, employmentYears: 18, homeOwnership: "Rent", maritalStatus: "Married", dependents: 4 },
  { name: "Jennifer Lee", age: 33, gender: "Female", email: "j.lee@email.com", phone: "+1-555-0111", occupation: "Accountant", annualIncome: 85000, monthlyExpenses: 2500, creditScore: 740, existingLoans: 1, employmentYears: 7, homeOwnership: "Mortgage", maritalStatus: "Single", dependents: 0 },
  { name: "Thomas Brown", age: 44, gender: "Male", email: "t.brown@email.com", phone: "+1-555-0112", occupation: "Logistics Coordinator", annualIncome: 62000, monthlyExpenses: 3400, creditScore: 610, existingLoans: 3, employmentYears: 14, homeOwnership: "Rent", maritalStatus: "Divorced", dependents: 1 },
];

const seedLoans = [
  { loanType: "Personal", loanAmount: 25000, interestRate: 8.5, termMonths: 36, monthlyPayment: 788, status: "active", purpose: "Debt consolidation", collateral: "None" },
  { loanType: "Mortgage", loanAmount: 350000, interestRate: 4.2, termMonths: 360, monthlyPayment: 1712, status: "active", purpose: "Home purchase", collateral: "Property" },
  { loanType: "Auto", loanAmount: 32000, interestRate: 5.9, termMonths: 60, monthlyPayment: 618, status: "active", purpose: "Vehicle purchase", collateral: "Vehicle" },
  { loanType: "Business", loanAmount: 150000, interestRate: 7.2, termMonths: 84, monthlyPayment: 2285, status: "active", purpose: "Business expansion", collateral: "Equipment" },
  { loanType: "Personal", loanAmount: 10000, interestRate: 12.5, termMonths: 24, monthlyPayment: 473, status: "active", purpose: "Medical expenses", collateral: "None" },
  { loanType: "Student", loanAmount: 45000, interestRate: 4.5, termMonths: 120, monthlyPayment: 466, status: "active", purpose: "Education", collateral: "None" },
  { loanType: "Mortgage", loanAmount: 280000, interestRate: 3.8, termMonths: 360, monthlyPayment: 1304, status: "active", purpose: "Home purchase", collateral: "Property" },
  { loanType: "Auto", loanAmount: 18000, interestRate: 6.5, termMonths: 48, monthlyPayment: 428, status: "active", purpose: "Vehicle purchase", collateral: "Vehicle" },
  { loanType: "Personal", loanAmount: 15000, interestRate: 9.8, termMonths: 36, monthlyPayment: 483, status: "active", purpose: "Home improvement", collateral: "None" },
  { loanType: "Business", loanAmount: 75000, interestRate: 6.8, termMonths: 60, monthlyPayment: 1480, status: "active", purpose: "Inventory", collateral: "Inventory" },
];

const seedModelMetrics = [
  {
    modelName: "logistic_regression",
    accuracy: 0.882,
    precision: 0.856,
    recall: 0.824,
    f1Score: 0.840,
    rocAuc: 0.891,
    confusionMatrix: { tp: 142, fp: 24, tn: 286, fn: 38 },
    featureImportance: { credit_score: 0.28, annual_income: 0.22, employment_years: 0.18, existing_loans: 0.15, home_ownership: 0.10, age: 0.07 },
  },
  {
    modelName: "random_forest",
    accuracy: 0.914,
    precision: 0.892,
    recall: 0.876,
    f1Score: 0.884,
    rocAuc: 0.928,
    confusionMatrix: { tp: 158, fp: 16, tn: 292, fn: 24 },
    featureImportance: { credit_score: 0.32, annual_income: 0.20, employment_years: 0.16, existing_loans: 0.14, home_ownership: 0.11, age: 0.07 },
  },
  {
    modelName: "xgboost",
    accuracy: 0.936,
    precision: 0.918,
    recall: 0.904,
    f1Score: 0.911,
    rocAuc: 0.952,
    confusionMatrix: { tp: 164, fp: 12, tn: 296, fn: 18 },
    featureImportance: { credit_score: 0.30, annual_income: 0.24, employment_years: 0.17, existing_loans: 0.13, home_ownership: 0.09, age: 0.07 },
  },
];

export async function seedDatabase() {
  try {
    // Always ensure admin user exists with a properly hashed password
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      await storage.createUser({
        username: "admin",
        password: hashPassword("admin123"),
      });
      log("Created admin user with hashed password", "seed");
    } else if (!existingAdmin.password.includes(":")) {
      // Password is stored as plaintext (old seed) — fix it
      await storage.updateUserPassword("admin", hashPassword("admin123"));
      log("Fixed admin user password hash", "seed");
    }

    const existingCustomers = await storage.getCustomers();
    if (existingCustomers.length > 0) {
      log("Database already seeded, skipping...", "seed");
      return;
    }

    const createdCustomers = [];
    for (const c of seedCustomers) {
      const customer = await storage.createCustomer(c);
      createdCustomers.push(customer);
    }

    for (let i = 0; i < seedLoans.length; i++) {
      const customerIndex = i % createdCustomers.length;
      await storage.createLoan({
        ...seedLoans[i],
        customerId: createdCustomers[customerIndex].id,
      });
    }

    for (const m of seedModelMetrics) {
      await storage.createModelMetric(m);
    }

    log(`Seeded ${createdCustomers.length} customers, ${seedLoans.length} loans, ${seedModelMetrics.length} model metrics`, "seed");
  } catch (err) {
    log(`Seed error: ${err}`, "seed");
  }
}
