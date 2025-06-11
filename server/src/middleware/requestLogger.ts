import { Request, Response, NextFunction } from "express";

export default function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();
  res.on("finish", () => {
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start
      }ms - user:${res.locals.userId ?? "anon"}`
    );
  });
  next();
}
