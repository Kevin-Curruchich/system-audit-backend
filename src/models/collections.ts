import prisma from "../utils/db";
import { Collection, CollectionStudent } from "@prisma/client";
import { PutCollectionStudentDto } from "../controllers/dto/collections/put.collection-student.dto";
import { PutCollectionDto } from "../controllers/dto/collections/put.collection.dto";

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
  currentYear: any,
  quartetlyId: string
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
      Quartetly: {
        quartetlyId: {
          contains: quartetlyId,
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

      const collectionStudentData = {
        collectionStudentId: collectionStudent.collectionStudentId,
        collectionId: collectionStudent.collectionId,
        childrenStudentId: collectionStudent.studentId,
        collectionStudentAmountOwed:
          collectionStudent.collectionStudentAmountOwed,
        collectionStudentAmountPaid:
          collectionStudent.collectionStudentAmountPaid,
        collectionStudentDate: collectionStudent.collectionStudentDate,
        collection: collectionStudent.collection,
        Quartetly: collectionStudent.Quartetly,
        quartetlyQuartetlyId: collectionStudent.quartetlyQuartetlyId,
      };

      acc[studentId].children.push(collectionStudentData);
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

export const getCollectionStudentWithoutPage = async (
  searchQuery: string,
  currentYear: any,
  quartetlyId: string
) => {
  const collectionStudent = await prisma.collectionStudent.findMany({
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
          studentCurrentYear: true,
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
      Quartetly: {
        quartetlyId: {
          contains: quartetlyId,
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
          studentCurrentYear: collectionStudent.student.studentCurrentYear,
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

  return collectionStudentByStudent;
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
          collectionDesc: true,
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
  studentIdToSearch: string,
  quartetlyId: string
) => {
  const collections = await prisma.collectionStudent.findMany({
    select: {
      collectionStudentId: true,
      collection: {
        select: {
          collectionId: true,
          collectionName: true,
          collectionDesc: true,
        },
      },
      collectionStudentAmountOwed: true,
      collectionStudentAmountPaid: true,
      collectionStudentDate: true,
      collectionDescription: true,
      Payment: true,
      Quartetly: {
        select: {
          quartetlyId: true,
          quartetlyName: true,
        },
      },
    },

    where: {
      studentId: studentIdToSearch,
      Quartetly: {
        quartetlyId: {
          contains: quartetlyId,
        },
      },
    },
  });

  return collections;
};

export const getColelctionStudentById = async (collectionStudentId: string) => {
  const collectionStudent = await prisma.collectionStudent.findUnique({
    where: {
      collectionStudentId,
    },
  });

  return collectionStudent;
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

//put
export const putCollection = async (
  collectionId: string,
  data: PutCollectionDto
) => {
  const collection = await prisma.collection.update({
    where: {
      collectionId,
    },
    data,
  });

  return collection;
};

export const putCollectionAmountOwed = async (
  collectionStudentId: string,
  data: PutCollectionStudentDto
) => {
  const collectionStudent = await prisma.collectionStudent.update({
    where: {
      collectionStudentId,
    },
    data,
  });

  return collectionStudent;
};
