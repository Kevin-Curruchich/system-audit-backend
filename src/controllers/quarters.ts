import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { Quartetly } from "@prisma/client";
import { PutQuarterDto } from "./dto/collections/put.quarters.dto";
import quartetlyStatus from "../constants/quartetlyStatus";
import {
  getQuartets,
  getQuartetsList,
  getQuartetsListByStudentId,
  postQuartetly,
  putQuarter,
} from "../models/quarters";

//get controllers
export const getQuartersController = async (req: Request, res: Response) => {
  try {
    const { page, take } = req.query;
    const quarters = await getQuartets(Number(page), Number(take));

    if (!quarters) {
      return res.status(404).json({ message: "Quarters not found" });
    }

    const data = {
      data: quarters.data.map((quarter) => {
        return {
          quartetlyId: quarter.quartetlyId,
          quartetlyName: quarter.quartetlyName,
          quartetlyStart: moment(quarter.quartetlyStart)
            .utc()
            .format("YYYY-MM-DD"),
          quartetlyEnd: moment(quarter.quartetlyEnd).utc().format("YYYY-MM-DD"),
          quartetlyIsActive:
            quarter.quartetlyStatusId === quartetlyStatus.ACTIVE,
        };
      }),
      total: quarters.total,
    };

    res.json(data);
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

export const getStudentQuarterController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const quarters = await getQuartetsListByStudentId(String(id));

    //get quartetly without duplicates
    const quartetlyList = quarters.reduce((acc: any, curr: any) => {
      const found = acc.find(
        (item: any) => item.Quartetly.quartetlyId === curr.Quartetly.quartetlyId
      );
      if (!found) {
        return acc.concat([curr]);
      } else {
        return acc;
      }
    }, []);

    res.json(quartetlyList);
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

//put controllers
export const putQuarterController = async (
  req: Request<{ id: string }, {}, PutQuarterDto>,
  res: Response
) => {
  try {
    const payload = req.body;
    const { id } = req.params;

    const data = {
      ...payload,
    };

    data.quartetlyStatusId = data.quartetlyIsActive
      ? quartetlyStatus.ACTIVE
      : quartetlyStatus.INACTIVE;
    data.quartetlyStart = new Date(
      moment(data.quartetlyStart).format("YYYY-MM-DD")
    );
    data.quartetlyEnd = new Date(
      moment(data.quartetlyEnd).format("YYYY-MM-DD")
    );

    delete data.quartetlyIsActive;

    const quarter = await putQuarter(id, data);

    if (!quarter) {
      return res.status(404).json({ message: "Quarter not found" });
    }

    res.json(quarter);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
