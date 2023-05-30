import { Request, Response } from "express";
import moment from "moment";
import { v4 as uuid } from "uuid";
import {
  getCollectionTypes,
  getCollections,
  getCollectionStudent,
  getCollectionsByStudent,
  getCollectionsOwedByStudent,
  postCollection,
  postCollectionStudent,
} from "../models/collections";

//get controllers
export const getCollectionTypesController = async (
  req: Request,
  res: Response
) => {
  try {
    const collectionTypes = await getCollectionTypes();
    res.json(collectionTypes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCollectionsController = async (req: Request, res: Response) => {
  try {
    const collections = await getCollections();

    res.json(collections);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCollectionStudentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, take } = req.query;
    const collectionStudent = await getCollectionStudent(
      Number(page),
      Number(take)
    );

    res.json(collectionStudent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCollectionsByIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const studentIdToSearch = String(id);

  try {
    const collections = await getCollectionsByStudent(studentIdToSearch);

    res.json(collections);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCollectionsOwedByIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const studentIdToSearch = String(id);

  try {
    const collections = await getCollectionsOwedByStudent(studentIdToSearch);

    res.json(collections);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//post controllers

export const postCollectionController = async (req: Request, res: Response) => {
  try {
    const {
      collectionName,
      collectionDesc,
      collectionTypeId,
      collectionBaseAmount,
      collectionStudentApply,
    } = req.body;

    const data = {
      collectionId: uuid(),
      collectionName,
      collectionDesc,
      collectionTypeId,
      collectionBaseAmount,
      collectionStudentApply,
    };

    const collection = await postCollection(data);

    res.json(collection);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postCollectionStudentController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      collectionId,
      studentId,
      collectionStudentAmountOwed,
      collectionStudentDate,
      collectionDescription,
    } = req.body;

    const data = {
      collectionStudentId: uuid(),
      collectionId,
      studentId,
      collectionStudentAmountOwed,
      collectionStudentAmountPaid: 0,
      collectionStudentDate: new Date(
        moment(collectionStudentDate).format("YYYY-MM-DD")
      ),
      collectionStudentUpdateDate: new Date(),
      collectionDescription,
    };

    const collectionStudent = await postCollectionStudent(data);

    res.json(collectionStudent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
