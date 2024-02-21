import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);
    throw new Error("Un-Authorized");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "");
    req.payload = payload;
  } catch (err: any) {
    res.status(401);
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ message: err.name, code: 401 });
      throw new Error(err.name);
    }
    res.status(401).json({ message: err.message, code: 401 });
    throw new Error("Un-Authorized");
  }

  return next();
};
