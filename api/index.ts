import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../backend/routes";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

// Seed database on cold start (runs once per serverless instance)
let seeded = false;
app.use(async (_req, _res, next) => {
  if (!seeded) {
    try {
      const { seedDatabase } = await import("../backend/seed");
      await seedDatabase();
      seeded = true;
    } catch (err) {
      console.error("Seed error (non-fatal):", err);
      seeded = true; // don't retry on every request
    }
  }
  next();
});

// Register all API routes
registerRoutes(httpServer, app);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Error:", err);
  if (!res.headersSent) {
    res.status(status).json({ message });
  }
});

export default app;
