import { z } from "zod";

const configSchema = z.object({
  port: z.string().transform((value) => Number(value)),
  env: z.union([
    z.literal("production"),
    z.literal("development"),
    z.literal("test"),
  ]),
  dbUri: z.string(),
});

export const config = configSchema.parse({
  port: process.env.PORT ?? "3000",
  env: process.env.NODE_ENV ?? "development",
  dbUri:
    process.env.DB_URI ??
    "mongodb://root:passwd@localhost:27017/express-mongo?authSource=admin",
});
