import prisma from "../utils/db";
import { hash } from "../helpers/hashing";
import { User } from "@prisma/client";

export const postUser = async (user: User) => {
  const userData = await prisma.user.create({
    data: user,
  });

  return userData;
};

export const addRefreshTokenToWhitelist = ({
  jti,
  refreshToken,
  userId,
}: any) => {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hash(refreshToken),
      userId,
    },
  });
};

// used to check if the token sent by the client is in the database.
export const findRefreshTokenById = (id: string) => {
  return prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });
};

// soft delete tokens after usage.
export const deleteRefreshToken = (id: string) => {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};

export const revokeTokens = (userId: string) => {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
};
