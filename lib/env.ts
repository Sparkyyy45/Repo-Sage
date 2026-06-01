import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z
    .string()
    .min(1, "AUTH_SECRET is required. Generate with: openssl rand -base64 32"),
  AUTH_GITHUB_ID: z
    .string()
    .min(1, "AUTH_GITHUB_ID is required (GitHub OAuth App Client ID)"),
  AUTH_GITHUB_SECRET: z
    .string()
    .min(1, "AUTH_GITHUB_SECRET is required (GitHub OAuth App Client Secret)"),
  OPENROUTER_API_KEY: z
    .string()
    .optional()
    .describe("Required for AI features (Sprints 3-5). Get one at https://openrouter.ai"),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  throw new Error("Fix the env issues above. See .env.local.example for the full template.");
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
