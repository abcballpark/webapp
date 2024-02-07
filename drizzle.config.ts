import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    ssl: true,
    host: process.env.POSTGRES_HOST as string,
    port: 5432,
    password: process.env.POSTGRES_PASSWORD as string,
    database: process.env.POSTGRES_DATABASE as string,
  },
} satisfies Config;
