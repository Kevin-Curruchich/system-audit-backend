import { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator";

export const validateIdParam = [
  param("id").isUUID(4).withMessage("Invalid id param"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
