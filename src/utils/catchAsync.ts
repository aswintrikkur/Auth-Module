import { Request, Response, NextFunction, RequestHandler } from "express";

export default function catchAsync(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
}
