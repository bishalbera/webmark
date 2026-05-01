import dotenv from "dotenv";
import path from "path";
import { configure } from "passmark";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const requiredEnvVars = ["OPENROUTER_API_KEY"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable not set: ${envVar}`);
  }
}

configure({
  ai: {
    gateway: "openrouter",
  },
});

console.log(
  "[webmark] Passmark configured. Redis:",
  process.env.REDIS_URL ? "enabled :)" : "disabled :( set REDIS_URL",
);
