import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { AppError, ErrorCode } from "../error/AppError";
import { logger } from "../logger";

const validateSchema =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      logger.error({ err }, "Failed to validate schema");
      if (err instanceof ZodError)
        next(
          new AppError(
            `Invalid payload: ${err.message}`,
            ErrorCode.VALIDATION_ERROR
          )
        );
    }
  };

export default validateSchema;
