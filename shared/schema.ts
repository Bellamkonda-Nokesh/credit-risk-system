import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  occupation: text("occupation"),
  annualIncome: real("annual_income").notNull(),
  monthlyExpenses: real("monthly_expenses").notNull(),
  creditScore: integer("credit_score").notNull(),
  existingLoans: integer("existing_loans").notNull().default(0),
  employmentYears: real("employment_years").notNull(),
  homeOwnership: text("home_ownership").notNull(),
  maritalStatus: text("marital_status"),
  dependents: integer("dependents").default(0),
  riskScore: real("risk_score"),
  riskCategory: text("risk_category"),
  defaultProbability: real("default_probability"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const loans = pgTable("loans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  loanType: text("loan_type").notNull(),
  loanAmount: real("loan_amount").notNull(),
  interestRate: real("interest_rate").notNull(),
  termMonths: integer("term_months").notNull(),
  monthlyPayment: real("monthly_payment").notNull(),
  status: text("status").notNull().default("active"),
  purpose: text("purpose"),
  collateral: text("collateral"),
  disbursedAt: timestamp("disbursed_at").defaultNow(),
});

export const predictions = pgTable("predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  modelName: text("model_name").notNull(),
  defaultProbability: real("default_probability").notNull(),
  riskCategory: text("risk_category").notNull(),
  confidence: real("confidence").notNull(),
  features: jsonb("features"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const modelMetrics = pgTable("model_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelName: text("model_name").notNull(),
  accuracy: real("accuracy").notNull(),
  precision: real("model_precision").notNull(),
  recall: real("recall").notNull(),
  f1Score: real("f1_score").notNull(),
  rocAuc: real("roc_auc").notNull(),
  confusionMatrix: jsonb("confusion_matrix"),
  featureImportance: jsonb("feature_importance"),
  trainedAt: timestamp("trained_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(),
  summary: text("summary"),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, riskScore: true, riskCategory: true, defaultProbability: true, createdAt: true });
export const insertLoanSchema = createInsertSchema(loans).omit({ id: true, disbursedAt: true });
export const insertPredictionSchema = createInsertSchema(predictions).omit({ id: true, createdAt: true });
export const insertModelMetricsSchema = createInsertSchema(modelMetrics).omit({ id: true, trainedAt: true });
export const insertReportSchema = createInsertSchema(reports).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type ModelMetric = typeof modelMetrics.$inferSelect;
export type InsertModelMetric = z.infer<typeof insertModelMetricsSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
