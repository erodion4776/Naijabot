import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from '../logger';

// Load environment variables
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().default('file:./dev.db'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  APP_URL: z.string().default('http://localhost:3000'),
});

let parsedEnv;
try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  logger.error({ error }, '❌ Invalid environment variables configuration');
  // Fallback to defaults to prevent immediate crash if some non-critical variables fail validation
  parsedEnv = envSchema.parse({});
}

export const config = parsedEnv;
export default config;
