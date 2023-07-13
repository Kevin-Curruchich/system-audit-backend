import prisma from "../utils/db";

export const getUserByEmail = async (email: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      userEmail: email,
    },
  });

  return userData;
};

export const getUserById = async (id: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      userId: id,
    },
  });

  return userData;
};
