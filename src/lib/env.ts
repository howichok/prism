import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  AUTH_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  AUTH_TRUST_HOST: z.string().optional(),
  AUTH_DISCORD_ID: z.string().optional(),
  AUTH_DISCORD_SECRET: z.string().optional(),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
  AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
});

export const authSecret = env.AUTH_SECRET ?? env.NEXTAUTH_SECRET;

export const isDiscordAuthConfigured = Boolean(
  env.AUTH_DISCORD_ID && env.AUTH_DISCORD_SECRET && authSecret,
);
