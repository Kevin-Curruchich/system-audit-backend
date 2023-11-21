import { NextFunction, Request, Response } from "express";
import { PaginationFilterDto } from "../shared/dto/pagination-filter.dto";

export const convertPaginationParamsToNumber = (
  req: Request<{}, {}, {}, PaginationFilterDto>,
  res: Response,
  next: NextFunction
) => {
  if (req.query.page) {
    const page = Number(req.query.page);
    if (isNaN(page)) {
      return res.status(400).json({ message: "Invalid page number" });
    }
    req.query.page = page;
  }

  if (req.query.take) {
    const take = Number(req.query.take);
    if (isNaN(take)) {
      return res.status(400).json({ message: "Invalid take number" });
    }
    req.query.take = take;
  }

  next();
};
