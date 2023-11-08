import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import moment from "moment";
import {
  getCollectionTypes,
  getCollections,
  getCollectionStudent,
  getCollectionsByStudent,
  getCollectionsOwedByStudent,
  getCollectionsHistoryByStudent,
  postCollection,
  postCollectionStudent,
  putCollectionAmountOwed,
  getColelctionStudentById,
} from "../models/collections";
import { PutCollectionStudentDto } from "./dto/collections/put.collection-student.dto";

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
    const { page, take, searchQuery, currentYear, quartetlyId } = req.query;

    const studentCurrentYear =
      currentYear === "" ? undefined : Number(currentYear);

    const collectionStudent = await getCollectionStudent(
      Number(page),
      Number(take),
      String(searchQuery),
      studentCurrentYear,
      String(quartetlyId)
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
    const collectionWithTwoDecimals = collections.map((collection) => {
      const newCollection = {
        ...collection,
        collectionStudentAmountOwed: Number(
          collection.collectionStudentAmountOwed.toFixed(2)
        ),
      };

      return newCollection;
    });

    res.json(collectionWithTwoDecimals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCollectionsStudentByIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { quartetlyId } = req.query;

  const studentIdToSearch = String(id);
  const quartetlyIdToSearch = String(quartetlyId);

  try {
    const collections = await getCollectionsHistoryByStudent(
      studentIdToSearch,
      quartetlyIdToSearch
    );

    //create a new array with all collections data but sort Payment array by date desc
    const newCollections = collections.map((collection) => {
      const newCollection = {
        ...collection,
        Payment: collection.Payment.sort((a, b) => {
          return (
            new Date(b.paymentDate).getTime() -
            new Date(a.paymentDate).getTime()
          );
        }),
      };

      return newCollection;
    });

    res.json(newCollections);
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
      quartetlyQuartetlyId,
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
      quartetlyQuartetlyId,
    };

    const collectionStudent = await postCollectionStudent(data);

    res.json(collectionStudent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const putCollectionAmountOwedController = async (
  req: Request<{ id: string }, {}, PutCollectionStudentDto>,
  res: Response
) => {
  try {
    const payload = req.body;
    const { id: collectionStudentId } = req.params;
    const { collectionStudentAmountOwed: newCollectionOwed } = payload;

    // const  = id;
    // const newCollectionOwed = collectionStudentAmountOwed

    const collection = await getColelctionStudentById(collectionStudentId);

    if (!collection) {
      res.status(404).json({ message: "Cobro no encontrado" });
      return;
    }

    if (newCollectionOwed < collection.collectionStudentAmountPaid) {
      res
        .status(400)
        .json({ message: "El monto no puede ser menor al monto aportado" });
      return;
    }

    const correctAmountOwed =
      newCollectionOwed - collection.collectionStudentAmountPaid;

    const data: PutCollectionStudentDto = {
      collectionStudentAmountOwed: correctAmountOwed,
      collectionStudentUpdateDate: payload.collectionStudentUpdateDate,
      collectionDescription: payload.collectionDescription,
    };

    const collectionUpdated = await putCollectionAmountOwed(
      collectionStudentId,
      data
    );

    res.json(collectionUpdated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
