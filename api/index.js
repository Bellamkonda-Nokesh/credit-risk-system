"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  customers: () => customers,
  insertCustomerSchema: () => insertCustomerSchema,
  insertLoanSchema: () => insertLoanSchema,
  insertModelMetricsSchema: () => insertModelMetricsSchema,
  insertPredictionSchema: () => insertPredictionSchema,
  insertReportSchema: () => insertReportSchema,
  insertUserSchema: () => insertUserSchema,
  loans: () => loans,
  modelMetrics: () => modelMetrics,
  predictions: () => predictions,
  reports: () => reports,
  users: () => users
});
var import_drizzle_orm, import_pg_core, import_drizzle_zod, users, customers, loans, predictions, modelMetrics, reports, insertUserSchema, insertCustomerSchema, insertLoanSchema, insertPredictionSchema, insertModelMetricsSchema, insertReportSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    import_drizzle_orm = require("drizzle-orm");
    import_pg_core = require("drizzle-orm/pg-core");
    import_drizzle_zod = require("drizzle-zod");
    users = (0, import_pg_core.pgTable)("users", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      username: (0, import_pg_core.text)("username").notNull().unique(),
      password: (0, import_pg_core.text)("password").notNull()
    });
    customers = (0, import_pg_core.pgTable)("customers", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      name: (0, import_pg_core.text)("name").notNull(),
      age: (0, import_pg_core.integer)("age").notNull(),
      gender: (0, import_pg_core.text)("gender").notNull(),
      email: (0, import_pg_core.text)("email").notNull(),
      phone: (0, import_pg_core.text)("phone"),
      occupation: (0, import_pg_core.text)("occupation"),
      annualIncome: (0, import_pg_core.real)("annual_income").notNull(),
      monthlyExpenses: (0, import_pg_core.real)("monthly_expenses").notNull(),
      creditScore: (0, import_pg_core.integer)("credit_score").notNull(),
      existingLoans: (0, import_pg_core.integer)("existing_loans").notNull().default(0),
      employmentYears: (0, import_pg_core.real)("employment_years").notNull(),
      homeOwnership: (0, import_pg_core.text)("home_ownership").notNull(),
      maritalStatus: (0, import_pg_core.text)("marital_status"),
      dependents: (0, import_pg_core.integer)("dependents").default(0),
      riskScore: (0, import_pg_core.real)("risk_score"),
      riskCategory: (0, import_pg_core.text)("risk_category"),
      defaultProbability: (0, import_pg_core.real)("default_probability"),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
    });
    loans = (0, import_pg_core.pgTable)("loans", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      customerId: (0, import_pg_core.varchar)("customer_id").notNull(),
      loanType: (0, import_pg_core.text)("loan_type").notNull(),
      loanAmount: (0, import_pg_core.real)("loan_amount").notNull(),
      interestRate: (0, import_pg_core.real)("interest_rate").notNull(),
      termMonths: (0, import_pg_core.integer)("term_months").notNull(),
      monthlyPayment: (0, import_pg_core.real)("monthly_payment").notNull(),
      status: (0, import_pg_core.text)("status").notNull().default("active"),
      purpose: (0, import_pg_core.text)("purpose"),
      collateral: (0, import_pg_core.text)("collateral"),
      disbursedAt: (0, import_pg_core.timestamp)("disbursed_at").defaultNow()
    });
    predictions = (0, import_pg_core.pgTable)("predictions", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      customerId: (0, import_pg_core.varchar)("customer_id").notNull(),
      modelName: (0, import_pg_core.text)("model_name").notNull(),
      defaultProbability: (0, import_pg_core.real)("default_probability").notNull(),
      riskCategory: (0, import_pg_core.text)("risk_category").notNull(),
      confidence: (0, import_pg_core.real)("confidence").notNull(),
      features: (0, import_pg_core.jsonb)("features"),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
    });
    modelMetrics = (0, import_pg_core.pgTable)("model_metrics", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      modelName: (0, import_pg_core.text)("model_name").notNull(),
      accuracy: (0, import_pg_core.real)("accuracy").notNull(),
      precision: (0, import_pg_core.real)("model_precision").notNull(),
      recall: (0, import_pg_core.real)("recall").notNull(),
      f1Score: (0, import_pg_core.real)("f1_score").notNull(),
      rocAuc: (0, import_pg_core.real)("roc_auc").notNull(),
      confusionMatrix: (0, import_pg_core.jsonb)("confusion_matrix"),
      featureImportance: (0, import_pg_core.jsonb)("feature_importance"),
      trainedAt: (0, import_pg_core.timestamp)("trained_at").defaultNow()
    });
    reports = (0, import_pg_core.pgTable)("reports", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      title: (0, import_pg_core.text)("title").notNull(),
      type: (0, import_pg_core.text)("type").notNull(),
      summary: (0, import_pg_core.text)("summary"),
      data: (0, import_pg_core.jsonb)("data"),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
    });
    insertUserSchema = (0, import_drizzle_zod.createInsertSchema)(users).pick({ username: true, password: true });
    insertCustomerSchema = (0, import_drizzle_zod.createInsertSchema)(customers).omit({ id: true, riskScore: true, riskCategory: true, defaultProbability: true, createdAt: true });
    insertLoanSchema = (0, import_drizzle_zod.createInsertSchema)(loans).omit({ id: true, disbursedAt: true });
    insertPredictionSchema = (0, import_drizzle_zod.createInsertSchema)(predictions).omit({ id: true, createdAt: true });
    insertModelMetricsSchema = (0, import_drizzle_zod.createInsertSchema)(modelMetrics).omit({ id: true, trainedAt: true });
    insertReportSchema = (0, import_drizzle_zod.createInsertSchema)(reports).omit({ id: true, createdAt: true });
  }
});

// backend/db.ts
var import_node_postgres, import_pg, pool, db;
var init_db = __esm({
  "backend/db.ts"() {
    "use strict";
    import_node_postgres = require("drizzle-orm/node-postgres");
    import_pg = __toESM(require("pg"), 1);
    init_schema();
    pool = new import_pg.default.Pool({
      connectionString: process.env.DATABASE_URL
    });
    db = (0, import_node_postgres.drizzle)(pool, { schema: schema_exports });
  }
});

// backend/storage.ts
function calculateRisk(customer) {
  let score = 50;
  if (customer.creditScore >= 750) score -= 25;
  else if (customer.creditScore >= 650) score -= 15;
  else if (customer.creditScore >= 550) score -= 5;
  else if (customer.creditScore < 450) score += 15;
  const dti = customer.monthlyExpenses / (customer.annualIncome / 12);
  if (dti > 0.8) score += 25;
  else if (dti > 0.6) score += 15;
  else if (dti < 0.3) score -= 10;
  if (customer.employmentYears >= 10) score -= 10;
  else if (customer.employmentYears >= 5) score -= 5;
  else if (customer.employmentYears < 2) score += 10;
  if ((customer.existingLoans ?? 0) === 0) score -= 5;
  else if ((customer.existingLoans ?? 0) > 3) score += 10;
  else if ((customer.existingLoans ?? 0) > 5) score += 20;
  if (customer.homeOwnership === "Own") score -= 8;
  else if (customer.homeOwnership === "Rent") score += 5;
  if (customer.age >= 30 && customer.age <= 55) score -= 5;
  else if (customer.age < 25) score += 5;
  const defaultProbability = Math.max(2, Math.min(95, score));
  const riskScore = defaultProbability;
  let riskCategory;
  if (defaultProbability <= 30) riskCategory = "Low";
  else if (defaultProbability <= 60) riskCategory = "Medium";
  else if (defaultProbability <= 80) riskCategory = "High";
  else riskCategory = "Critical";
  return { riskScore, riskCategory, defaultProbability };
}
function calculatePrediction(customer, modelName) {
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
    homeOwnership: customer.homeOwnership
  });
  let multiplier = 1;
  if (modelName === "random_forest") multiplier = 0.95 + Math.random() * 0.1;
  else if (modelName === "xgboost") multiplier = 0.9 + Math.random() * 0.15;
  const defaultProbability = Math.max(2, Math.min(95, base.defaultProbability * multiplier));
  let riskCategory;
  if (defaultProbability <= 30) riskCategory = "Low";
  else if (defaultProbability <= 60) riskCategory = "Medium";
  else if (defaultProbability <= 80) riskCategory = "High";
  else riskCategory = "Critical";
  const confidence = modelName === "xgboost" ? 0.88 + Math.random() * 0.08 : modelName === "random_forest" ? 0.84 + Math.random() * 0.1 : 0.8 + Math.random() * 0.1;
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
      home_ownership: 0.1,
      age: 0.07
    }
  };
}
var import_drizzle_orm2, DatabaseStorage, storage;
var init_storage = __esm({
  "backend/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    import_drizzle_orm2 = require("drizzle-orm");
    DatabaseStorage = class {
      async getUser(id) {
        const [user] = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.id, id));
        return user;
      }
      async getUserByUsername(username) {
        const [user] = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.username, username));
        return user;
      }
      async createUser(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      }
      async updateUserPassword(username, hashedPassword) {
        await db.update(users).set({ password: hashedPassword }).where((0, import_drizzle_orm2.eq)(users.username, username));
      }
      async getCustomers() {
        return db.select().from(customers).orderBy((0, import_drizzle_orm2.desc)(customers.createdAt));
      }
      async getCustomer(id) {
        const [customer] = await db.select().from(customers).where((0, import_drizzle_orm2.eq)(customers.id, id));
        return customer;
      }
      async createCustomer(customer) {
        const riskResult = calculateRisk(customer);
        const [created] = await db.insert(customers).values({
          ...customer,
          riskScore: riskResult.riskScore,
          riskCategory: riskResult.riskCategory,
          defaultProbability: riskResult.defaultProbability
        }).returning();
        return created;
      }
      async updateCustomer(id, data) {
        const [updated] = await db.update(customers).set(data).where((0, import_drizzle_orm2.eq)(customers.id, id)).returning();
        return updated;
      }
      async getLoans() {
        return db.select().from(loans).orderBy((0, import_drizzle_orm2.desc)(loans.disbursedAt));
      }
      async getLoansByCustomer(customerId) {
        return db.select().from(loans).where((0, import_drizzle_orm2.eq)(loans.customerId, customerId));
      }
      async createLoan(loan) {
        const [created] = await db.insert(loans).values(loan).returning();
        return created;
      }
      async getPredictions() {
        return db.select().from(predictions).orderBy((0, import_drizzle_orm2.desc)(predictions.createdAt));
      }
      async getPredictionsByCustomer(customerId) {
        return db.select().from(predictions).where((0, import_drizzle_orm2.eq)(predictions.customerId, customerId)).orderBy((0, import_drizzle_orm2.desc)(predictions.createdAt));
      }
      async createPrediction(prediction) {
        const [created] = await db.insert(predictions).values(prediction).returning();
        return created;
      }
      async getModelMetrics() {
        return db.select().from(modelMetrics).orderBy((0, import_drizzle_orm2.desc)(modelMetrics.trainedAt));
      }
      async createModelMetric(metric) {
        const [created] = await db.insert(modelMetrics).values(metric).returning();
        return created;
      }
      async getReports() {
        return db.select().from(reports).orderBy((0, import_drizzle_orm2.desc)(reports.createdAt));
      }
      async createReport(report) {
        const [created] = await db.insert(reports).values(report).returning();
        return created;
      }
      async getDashboardStats() {
        const allCustomers = await this.getCustomers();
        const allLoans = await this.getLoans();
        const totalCustomers = allCustomers.length;
        const totalLoans = allLoans.length;
        const totalLoanAmount = allLoans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);
        const avgRiskScore = totalCustomers > 0 ? allCustomers.reduce((sum, c) => sum + (c.defaultProbability || 0), 0) / totalCustomers : 0;
        const highRiskCount = allCustomers.filter((c) => (c.defaultProbability || 0) > 50).length;
        const defaultRate = totalCustomers > 0 ? highRiskCount / totalCustomers * 100 : 0;
        const riskCounts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
        allCustomers.forEach((c) => {
          const cat = c.riskCategory || "Medium";
          if (riskCounts[cat] !== void 0) riskCounts[cat]++;
          else riskCounts["Medium"]++;
        });
        const riskDistribution = Object.entries(riskCounts).map(([category, count]) => ({ category, count }));
        const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
        const monthlyTrend = months.map((month, i) => ({
          month,
          defaults: Math.round(highRiskCount * (0.5 + Math.random() * 0.8) * ((6 - i) / 6)),
          approved: Math.round(totalCustomers * (0.6 + Math.random() * 0.6) * ((i + 2) / 6))
        }));
        return { totalCustomers, totalLoans, totalLoanAmount, avgRiskScore, defaultRate, riskDistribution, monthlyTrend };
      }
    };
    storage = new DatabaseStorage();
  }
});

// backend/logger.ts
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var init_logger = __esm({
  "backend/logger.ts"() {
    "use strict";
  }
});

// backend/seed.ts
var seed_exports = {};
__export(seed_exports, {
  seedDatabase: () => seedDatabase
});
function hashPassword2(password) {
  const salt = import_crypto2.default.randomBytes(16).toString("hex");
  const hash = import_crypto2.default.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
async function seedDatabase() {
  try {
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      await storage.createUser({
        username: "admin",
        password: hashPassword2("admin123")
      });
      log("Created admin user with hashed password", "seed");
    } else if (!existingAdmin.password.includes(":")) {
      await storage.updateUserPassword("admin", hashPassword2("admin123"));
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
        customerId: createdCustomers[customerIndex].id
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
var import_crypto2, seedCustomers, seedLoans, seedModelMetrics;
var init_seed = __esm({
  "backend/seed.ts"() {
    "use strict";
    init_storage();
    init_logger();
    import_crypto2 = __toESM(require("crypto"), 1);
    seedCustomers = [
      { name: "Sarah Mitchell", age: 34, gender: "Female", email: "sarah.m@email.com", phone: "+1-555-0101", occupation: "Software Engineer", annualIncome: 125e3, monthlyExpenses: 3200, creditScore: 780, existingLoans: 1, employmentYears: 8, homeOwnership: "Own", maritalStatus: "Married", dependents: 2 },
      { name: "James Rodriguez", age: 42, gender: "Male", email: "j.rodriguez@email.com", phone: "+1-555-0102", occupation: "Financial Analyst", annualIncome: 95e3, monthlyExpenses: 2800, creditScore: 720, existingLoans: 2, employmentYears: 15, homeOwnership: "Mortgage", maritalStatus: "Married", dependents: 3 },
      { name: "Emily Chen", age: 28, gender: "Female", email: "emily.chen@email.com", phone: "+1-555-0103", occupation: "Marketing Manager", annualIncome: 78e3, monthlyExpenses: 2400, creditScore: 690, existingLoans: 1, employmentYears: 4, homeOwnership: "Rent", maritalStatus: "Single", dependents: 0 },
      { name: "Michael Johnson", age: 55, gender: "Male", email: "m.johnson@email.com", phone: "+1-555-0104", occupation: "Business Owner", annualIncome: 18e4, monthlyExpenses: 5500, creditScore: 810, existingLoans: 3, employmentYears: 25, homeOwnership: "Own", maritalStatus: "Married", dependents: 1 },
      { name: "Priya Patel", age: 31, gender: "Female", email: "priya.p@email.com", phone: "+1-555-0105", occupation: "Data Scientist", annualIncome: 11e4, monthlyExpenses: 2600, creditScore: 750, existingLoans: 0, employmentYears: 6, homeOwnership: "Rent", maritalStatus: "Single", dependents: 0 },
      { name: "David Williams", age: 47, gender: "Male", email: "d.williams@email.com", phone: "+1-555-0106", occupation: "Construction Manager", annualIncome: 72e3, monthlyExpenses: 3800, creditScore: 580, existingLoans: 4, employmentYears: 12, homeOwnership: "Mortgage", maritalStatus: "Divorced", dependents: 2 },
      { name: "Lisa Thompson", age: 39, gender: "Female", email: "l.thompson@email.com", phone: "+1-555-0107", occupation: "Teacher", annualIncome: 55e3, monthlyExpenses: 2200, creditScore: 650, existingLoans: 2, employmentYears: 10, homeOwnership: "Rent", maritalStatus: "Married", dependents: 1 },
      { name: "Robert Kim", age: 26, gender: "Male", email: "r.kim@email.com", phone: "+1-555-0108", occupation: "Freelance Designer", annualIncome: 45e3, monthlyExpenses: 2e3, creditScore: 520, existingLoans: 3, employmentYears: 2, homeOwnership: "Rent", maritalStatus: "Single", dependents: 0 },
      { name: "Amanda Foster", age: 36, gender: "Female", email: "a.foster@email.com", phone: "+1-555-0109", occupation: "Physician", annualIncome: 21e4, monthlyExpenses: 4200, creditScore: 820, existingLoans: 1, employmentYears: 9, homeOwnership: "Own", maritalStatus: "Married", dependents: 2 },
      { name: "Carlos Garcia", age: 51, gender: "Male", email: "c.garcia@email.com", phone: "+1-555-0110", occupation: "Retail Manager", annualIncome: 48e3, monthlyExpenses: 3100, creditScore: 490, existingLoans: 5, employmentYears: 18, homeOwnership: "Rent", maritalStatus: "Married", dependents: 4 },
      { name: "Jennifer Lee", age: 33, gender: "Female", email: "j.lee@email.com", phone: "+1-555-0111", occupation: "Accountant", annualIncome: 85e3, monthlyExpenses: 2500, creditScore: 740, existingLoans: 1, employmentYears: 7, homeOwnership: "Mortgage", maritalStatus: "Single", dependents: 0 },
      { name: "Thomas Brown", age: 44, gender: "Male", email: "t.brown@email.com", phone: "+1-555-0112", occupation: "Logistics Coordinator", annualIncome: 62e3, monthlyExpenses: 3400, creditScore: 610, existingLoans: 3, employmentYears: 14, homeOwnership: "Rent", maritalStatus: "Divorced", dependents: 1 }
    ];
    seedLoans = [
      { loanType: "Personal", loanAmount: 25e3, interestRate: 8.5, termMonths: 36, monthlyPayment: 788, status: "active", purpose: "Debt consolidation", collateral: "None" },
      { loanType: "Mortgage", loanAmount: 35e4, interestRate: 4.2, termMonths: 360, monthlyPayment: 1712, status: "active", purpose: "Home purchase", collateral: "Property" },
      { loanType: "Auto", loanAmount: 32e3, interestRate: 5.9, termMonths: 60, monthlyPayment: 618, status: "active", purpose: "Vehicle purchase", collateral: "Vehicle" },
      { loanType: "Business", loanAmount: 15e4, interestRate: 7.2, termMonths: 84, monthlyPayment: 2285, status: "active", purpose: "Business expansion", collateral: "Equipment" },
      { loanType: "Personal", loanAmount: 1e4, interestRate: 12.5, termMonths: 24, monthlyPayment: 473, status: "active", purpose: "Medical expenses", collateral: "None" },
      { loanType: "Student", loanAmount: 45e3, interestRate: 4.5, termMonths: 120, monthlyPayment: 466, status: "active", purpose: "Education", collateral: "None" },
      { loanType: "Mortgage", loanAmount: 28e4, interestRate: 3.8, termMonths: 360, monthlyPayment: 1304, status: "active", purpose: "Home purchase", collateral: "Property" },
      { loanType: "Auto", loanAmount: 18e3, interestRate: 6.5, termMonths: 48, monthlyPayment: 428, status: "active", purpose: "Vehicle purchase", collateral: "Vehicle" },
      { loanType: "Personal", loanAmount: 15e3, interestRate: 9.8, termMonths: 36, monthlyPayment: 483, status: "active", purpose: "Home improvement", collateral: "None" },
      { loanType: "Business", loanAmount: 75e3, interestRate: 6.8, termMonths: 60, monthlyPayment: 1480, status: "active", purpose: "Inventory", collateral: "Inventory" }
    ];
    seedModelMetrics = [
      {
        modelName: "logistic_regression",
        accuracy: 0.882,
        precision: 0.856,
        recall: 0.824,
        f1Score: 0.84,
        rocAuc: 0.891,
        confusionMatrix: { tp: 142, fp: 24, tn: 286, fn: 38 },
        featureImportance: { credit_score: 0.28, annual_income: 0.22, employment_years: 0.18, existing_loans: 0.15, home_ownership: 0.1, age: 0.07 }
      },
      {
        modelName: "random_forest",
        accuracy: 0.914,
        precision: 0.892,
        recall: 0.876,
        f1Score: 0.884,
        rocAuc: 0.928,
        confusionMatrix: { tp: 158, fp: 16, tn: 292, fn: 24 },
        featureImportance: { credit_score: 0.32, annual_income: 0.2, employment_years: 0.16, existing_loans: 0.14, home_ownership: 0.11, age: 0.07 }
      },
      {
        modelName: "xgboost",
        accuracy: 0.936,
        precision: 0.918,
        recall: 0.904,
        f1Score: 0.911,
        rocAuc: 0.952,
        confusionMatrix: { tp: 164, fp: 12, tn: 296, fn: 18 },
        featureImportance: { credit_score: 0.3, annual_income: 0.24, employment_years: 0.17, existing_loans: 0.13, home_ownership: 0.09, age: 0.07 }
      }
    ];
  }
});

// api/_server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);

// backend/routes.ts
init_storage();
init_schema();
async function registerRoutes(httpServer2, app2) {
  app2.get("/api/dashboard/stats", async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.get("/api/customers", async (_req, res) => {
    try {
      const customers2 = await storage.getCustomers();
      res.json(customers2);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) return res.status(404).json({ message: "Customer not found" });
      res.json(customer);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.post("/api/customers", async (req, res) => {
    try {
      const parsed = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(parsed);
      res.status(201).json(customer);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app2.get("/api/loans", async (_req, res) => {
    try {
      const allLoans = await storage.getLoans();
      res.json(allLoans);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.post("/api/loans", async (req, res) => {
    try {
      const parsed = insertLoanSchema.parse(req.body);
      const loan = await storage.createLoan(parsed);
      res.status(201).json(loan);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app2.get("/api/predictions", async (_req, res) => {
    try {
      const preds = await storage.getPredictions();
      res.json(preds);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.post("/api/predictions/run", async (req, res) => {
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
        defaultProbability: prediction.defaultProbability
      });
      res.status(201).json(prediction);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.post("/api/predictions/batch", async (req, res) => {
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
          defaultProbability: predData.defaultProbability
        });
        count++;
      }
      res.status(201).json({ count, message: `Batch prediction completed for ${count} customers` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.get("/api/model-metrics", async (_req, res) => {
    try {
      const m = await storage.getModelMetrics();
      res.json(m);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.get("/api/reports", async (_req, res) => {
    try {
      const r = await storage.getReports();
      res.json(r);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.post("/api/reports/generate", async (req, res) => {
    try {
      const { type } = req.body;
      if (!type) return res.status(400).json({ message: "Report type is required" });
      const allCustomers = await storage.getCustomers();
      const allLoans = await storage.getLoans();
      let title;
      let summary;
      let data;
      switch (type) {
        case "risk_summary": {
          const low = allCustomers.filter((c) => c.riskCategory === "Low").length;
          const med = allCustomers.filter((c) => c.riskCategory === "Medium").length;
          const high = allCustomers.filter((c) => c.riskCategory === "High").length;
          const critical = allCustomers.filter((c) => c.riskCategory === "Critical").length;
          const avgProb = allCustomers.length > 0 ? allCustomers.reduce((s, c) => s + (c.defaultProbability || 0), 0) / allCustomers.length : 0;
          title = "Risk Summary Report";
          summary = `Portfolio analysis across ${allCustomers.length} customers with average default probability of ${avgProb.toFixed(1)}%`;
          data = { total_customers: allCustomers.length, low_risk: low, medium_risk: med, high_risk: high, critical_risk: critical, avg_default_prob: `${avgProb.toFixed(1)}%` };
          break;
        }
        case "customer_analysis": {
          const avgIncome = allCustomers.length > 0 ? allCustomers.reduce((s, c) => s + c.annualIncome, 0) / allCustomers.length : 0;
          const avgCredit = allCustomers.length > 0 ? allCustomers.reduce((s, c) => s + c.creditScore, 0) / allCustomers.length : 0;
          const homeOwners = allCustomers.filter((c) => c.homeOwnership === "Own").length;
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
          const activeLoans = allLoans.filter((l) => l.status === "active").length;
          title = "Portfolio Health Report";
          summary = `Loan portfolio analysis with ${allLoans.length} total loans`;
          data = { total_loans: allLoans.length, active_loans: activeLoans, total_portfolio: `$${(totalAmount / 1e6).toFixed(2)}M`, avg_loan_amount: `$${allLoans.length > 0 ? (totalAmount / allLoans.length).toFixed(0) : 0}`, avg_interest_rate: `${allLoans.length > 0 ? (allLoans.reduce((s, l) => s + l.interestRate, 0) / allLoans.length).toFixed(1) : 0}%`, high_risk_loans: allCustomers.filter((c) => (c.defaultProbability || 0) > 60).length };
          break;
        }
        default:
          return res.status(400).json({ message: "Invalid report type" });
      }
      const report = await storage.createReport({ title, type, summary, data });
      res.status(201).json(report);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  return httpServer2;
}

// backend/auth.ts
init_storage();
init_schema();
var import_express_session = __toESM(require("express-session"), 1);
var import_passport = __toESM(require("passport"), 1);
var import_passport_local = require("passport-local");
var import_crypto = __toESM(require("crypto"), 1);
function hashPassword(password) {
  const salt = import_crypto.default.randomBytes(16).toString("hex");
  const hash = import_crypto.default.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const inputHash = import_crypto.default.scryptSync(password, salt, 64).toString("hex");
  return hash === inputHash;
}
function setupAuth(app2) {
  app2.use(
    (0, import_express_session.default)({
      secret: process.env.SESSION_SECRET || "credit-risk-session-secret-2024",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1e3
        // 7 days
      }
    })
  );
  app2.use(import_passport.default.initialize());
  app2.use(import_passport.default.session());
  import_passport.default.use(
    new import_passport_local.Strategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) return done(null, false, { message: "Invalid username or password" });
        const valid = verifyPassword(password, user.password);
        if (!valid) return done(null, false, { message: "Invalid username or password" });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  import_passport.default.serializeUser((user, done) => {
    done(null, user.id);
  });
  import_passport.default.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || false);
    } catch (err) {
      done(err);
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0]?.message || "Invalid input" });
      }
      const existing = await storage.getUserByUsername(parsed.data.username);
      if (existing) {
        return res.status(409).json({ message: "Username already taken" });
      }
      const hashedPassword = hashPassword(parsed.data.password);
      const user = await storage.createUser({
        username: parsed.data.username,
        password: hashedPassword
      });
      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login after registration failed" });
        return res.status(201).json({ id: user.id, username: user.username });
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app2.post("/api/auth/login", (req, res, next) => {
    import_passport.default.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.json({ id: user.id, username: user.username });
      });
    })(req, res, next);
  });
  app2.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.json({ message: "Logged out successfully" });
      });
    });
  });
  app2.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = req.user;
    return res.json({ id: user.id, username: user.username });
  });
}

// api/_server.ts
var import_http = require("http");
var app = (0, import_express.default)();
var httpServer = (0, import_http.createServer)(app);
app.use(
  import_express.default.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(import_express.default.urlencoded({ extended: false }));
setupAuth(app);
var ready = false;
var initError = null;
async function init() {
  try {
    const { seedDatabase: seedDatabase2 } = await Promise.resolve().then(() => (init_seed(), seed_exports));
    await seedDatabase2();
  } catch (err) {
    console.error("Seed error (non-fatal):", err);
  }
  await registerRoutes(httpServer, app);
  ready = true;
}
var initPromise = init().catch((err) => {
  initError = err;
  console.error("Fatal init error:", err);
});
app.use(async (_req, _res, next) => {
  if (!ready) {
    await initPromise;
  }
  if (initError) {
    return next(initError);
  }
  next();
});
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Error:", err);
  if (!res.headersSent) {
    res.status(status).json({ message });
  }
});
var server_default = app;
