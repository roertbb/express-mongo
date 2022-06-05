import mongoose from "mongoose";
import { config } from "./config";
import { logger } from "./logger";

export async function connect() {
  try {
    await mongoose.connect(config.dbUri);
    logger.info("Connected to database");
  } catch (error) {
    logger.error("Failed to connect to database");
    process.exit(1);
  }
}
