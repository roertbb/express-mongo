export enum ErrorCode {
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export class AppError extends Error {
  code: ErrorCode;
  message: string;

  constructor(message: string, code: ErrorCode = ErrorCode.INTERNAL_ERROR) {
    super(message);
    this.code = code;
    this.message = message;
  }
}
