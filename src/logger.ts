import pino from "pino";
import { config } from "./config";

const loggerConfig = {
  production: {},
  development: {
    base: { pid: false },
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  },
  test: { enabled: false },
}[config.env];

export const logger = pino(loggerConfig);
