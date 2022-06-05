import { Request, Response, NextFunction } from "express";
import { AppError, ErrorCode } from "../error/AppError";

const errorCodeToStatus = {
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.VALIDATION_ERROR]: 422,
} as const;

export function handleErrors(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let code = 500;

  if (err instanceof AppError) {
    code = errorCodeToStatus[err.code];
  }

  res.status(code).send({ error: err.message });
}
