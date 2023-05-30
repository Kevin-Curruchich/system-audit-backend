import { Request, Response } from "express";
import moment from "moment";
import { v4 as uuid } from "uuid";
import {
  getQuartets,
  getQuartetsList,
  postQuartetly,
} from "../models/quarters";
import quartetlyStatus from "../constants/quartetlyStatus";

//get controllers
export const getQuartersController = async (req: Request, res: Response) => {
  try {
    const { page, take } = req.query;
    const quarters = await getQuartets(Number(page), Number(take));
    res.json(quarters);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getQuartersListController = async (
  req: Request,
  res: Response
) => {
  try {
    const quarters = await getQuartetsList();
    res.json(quarters);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//post controllers

export const postQuarterController = async (req: Request, res: Response) => {
  try {
    const { quartetlyName, quartetlyStart, quartetlyEnd } = req.body;

    const data = {
      quartetlyId: uuid(),
      quartetlyName,
      quartetlyStart: new Date(moment(quartetlyStart).format("YYYY-MM-DD")),
      quartetlyEnd: new Date(moment(quartetlyEnd).format("YYYY-MM-DD")),
      quartetlyStatusId: quartetlyStatus.ACTIVE,
    };

    const quarter = await postQuartetly(data);

    res.json(quarter);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
