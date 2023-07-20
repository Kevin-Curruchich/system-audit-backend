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

export const getCollectionStudent = async (
  page: number,
  take: number,
  searchQuery: string,
  currentYear: any
) => {
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
      Quartetly: {
        select: {
          quartetlyId: true,
          quartetlyName: true,
        },
      },
      student: {
        select: {
          studentId: true,
          studentFullName: true,
        },
      },
    },
    where: {
      student: {
        studentFullName: {
          contains: searchQuery,
          mode: "insensitive",
        },
        studentCurrentYear: {
          equals: currentYear,
        },
      },
    },
    orderBy: {
      collectionStudentAmountOwed: "desc",
    },
  });

  const collectionStudentByStudentGroupedByStudent = collectionStudent.reduce(
    (acc, collectionStudent) => {
      const { studentId } = collectionStudent.student;
      if (!acc[studentId]) {
        acc[studentId] = {
          studentId,
          studentFullName: collectionStudent.student.studentFullName,
          children: [],
        };
      }
      acc[studentId].children.push(collectionStudent);
      return acc;
    },
    {} as Record<string, any>
  );

  const collectionStudentByStudent = Object.values(
    collectionStudentByStudentGroupedByStudent
  );

  const total = collectionStudentByStudent.length;

  return { data: collectionStudentByStudent, total };
};

export const getCollectionsByStudent = async (studentIdToSearch: string) => {
  const collections = await prisma.collectionStudent.findMany({
    where: {
      studentId: studentIdToSearch,
    },
  });

  return collections;
};

export const getCollectionsOwedByStudent = async (
  studentIdToSearch: string
) => {
  const collections = await prisma.collectionStudent.findMany({
    select: {
      collectionStudentId: true,
      collection: {
        select: {
          collectionId: true,
          collectionName: true,
        },
      },
      Quartetly: {
        select: {
          quartetlyId: true,
          quartetlyName: true,
        },
      },
      collectionStudentAmountOwed: true,
    },
    where: {
      studentId: studentIdToSearch,
      collectionStudentAmountOwed: {
        gt: 0,
      },
    },
  });

  return collections;
};

export const getCollectionsHistoryByStudent = async (
  studentIdToSearch: string
) => {
  const collections = await prisma.collectionStudent.findMany({
    select: {
      collectionStudentId: true,
      collection: {
        select: {
          collectionId: true,
          collectionName: true,
        },
      },
      collectionStudentAmountOwed: true,
      collectionStudentAmountPaid: true,
      Payment: true,
    },
    where: {
      studentId: studentIdToSearch,
    },
  });

  return collections;
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
