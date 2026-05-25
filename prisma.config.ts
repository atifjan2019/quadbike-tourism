import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "@prisma/config";

// Load .env.local first (Next.js convention), then fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // CLI commands (db push, migrate) need a session-mode connection (DDL won't run
    // through PgBouncer transaction mode). DIRECT_URL is the session-mode pooler URL.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
