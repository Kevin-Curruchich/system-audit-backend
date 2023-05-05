import prisma from "../utils/db";
import { Collection, CollectionStudent } from "@prisma/client";

//get methods
export const getCollectionTypes = async () => {
  const collectionTypes = await prisma.collectionType.findMany();
  return collectionTypes;
};

export const getCollections = async () => {
  const collections = await prisma.collection.findMany({
    include: { collectionType: true },
  });
  return collections;
};

export const getCollectionStudent = async (page: number, take: number) => {
  const total = await prisma.collectionStudent.count();
  const collectionStudent = await prisma.collectionStudent.findMany({
    skip: (page - 1) * take,
    take,
    include: {
      collection: {
        select: {
          collectionId: true,
          collectionName: true,
        },
      },
      student: {
        select: {
          studentId: true,
          studentName: true,
          studentLastName: true,
        },
      },
    },
  });
  return { data: collectionStudent, total };
};

//post collections
export const postCollection = async (collectionData: Collection) => {
  const collection = await prisma.collection.create({
    data: collectionData,
  });

  return collection;
};

export const postCollectionStudent = async (
  collectionStudentData: CollectionStudent
) => {
  const collectionStudent = await prisma.collectionStudent.create({
    data: collectionStudentData,
  });

  return collectionStudent;
};
