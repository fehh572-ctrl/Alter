import { defineConfig } from "drizzle-kit";

// L'adresse vient de la variable DATABASE_URL (Vercel, Neon…) ; repli sur une base locale en développement.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
