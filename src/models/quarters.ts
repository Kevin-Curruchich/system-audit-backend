import prisma from "../utils/db";
import { PutQuarterDto } from "../controllers/dto/collections/put.quarters.dto";
import { Quartetly } from "@prisma/client";

//get methods
export const getQuartets = async (page: number, take: number) => {
  const quartetlys = await prisma.quartetly.findMany({
    skip: (page - 1) * take,
    take,
    include: {
      QuartetlyStatus: true,
    },
  });

  const total = await prisma.quartetly.count();

  return { data: quartetlys, total };
};

export const getQuartetsList = async () => {
  const quartetlys = await prisma.quartetly.findMany();
  return quartetlys;
};

export const getQuartetsListByStudentId = async (id: string) => {
  const quartetlys = await prisma.collectionStudent.findMany({
    where: {
      studentId: id,
    },
    include: {
      Quartetly: {
        select: {
          quartetlyId: true,
          quartetlyName: true,
        },
      },
    },
  });

  return quartetlys;
};

//post collections
export const postQuartetly = async (quartetlyData: Quartetly) => {
  const quartetly = prisma.quartetly.create({ data: quartetlyData });

  return quartetly;
};

//put collections
export const putQuarter = async (id: string, data: PutQuarterDto) => {
  const quartetly = await prisma.quartetly.update({
    where: {
      quartetlyId: id,
    },
    data,
  });

  return quartetly;
};
