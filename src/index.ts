import { app } from "./app";
import { config } from "./config";
import { connect } from "./db";
import { logger } from "./logger";

app.listen(config.port, async () => {
  logger.info(`Listening on port ${config.port}`);
  await connect();
});
