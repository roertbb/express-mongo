import { Request, Response, NextFunction } from "express";

export function notFound(_req: Request, res: Response, _next: NextFunction) {
  res.send(404).json({ error: "Not found" });
}
