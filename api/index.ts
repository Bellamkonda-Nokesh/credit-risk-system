import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../backend/routes";
import { setupAuth } from "../backend/auth";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    verify: (req: any, _res: Response, buf: Buffer) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

// Initialise auth (passport + session) — must be before routes
setupAuth(app);

// Bootstrap: seed DB + register routes (done once per cold start)
let ready = false;
let initError: Error | null = null;

async function init() {
  try {
    const { seedDatabase } = await import("../backend/seed");
    await seedDatabase();
  } catch (err) {
    console.error("Seed error (non-fatal):", err);
  }
  await registerRoutes(httpServer, app);
  ready = true;
}

// Start initialisation immediately (not per-request)
const initPromise = init().catch((err) => {
  initError = err;
  console.error("Fatal init error:", err);
});

// Wait for init to complete before handling any request
app.use(async (_req, _res, next) => {
  if (!ready) {
    await initPromise;
  }
  if (initError) {
    return next(initError);
  }
  next();
});

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
