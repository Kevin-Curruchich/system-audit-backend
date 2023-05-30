import prisma from "../utils/db";
import { Quartetly } from "@prisma/client";

//get methods
export const getQuartets = async (page: number, take: number) => {
  const total = await prisma.quartetly.count();
  const quartetlys = await prisma.quartetly.findMany({
    skip: (page - 1) * take,
    take,
    include: {
      QuartetlyStatus: true,
    },
  });
  return { data: quartetlys, total };
};
export const getQuartetsList = async () => {
  const quartetlys = await prisma.quartetly.findMany();
  return quartetlys;
};

//post collections
export const postQuartetly = async (quartetlyData: Quartetly) => {
  const quartetly = prisma.quartetly.create({ data: quartetlyData });

  return quartetly;
};
