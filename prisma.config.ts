import "dotenv/config";
import path from "node:path";
import { defineConfig } from "@prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  experimental: {
    adapter: true,
  },
  async adapter() {
    return new PrismaPg({ connectionString: process.env.DATABASE_URL });
  },
});
