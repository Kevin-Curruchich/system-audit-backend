import { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
  postUser,
  revokeTokens,
} from "../models/auth";
import { findUserById } from "./user";
import { generateTokens } from "../helpers/jwt";
import { hash } from "../helpers/hashing";
import { getStudentByDNI } from "../models/students";
import { getUserByEmail, getUserByStudentId } from "../models/user";
import userRole from "../constants/userRole";

export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userDNI, password, userEmail } = req.body;

    const student = await getStudentByDNI(userDNI);

    if (!student.studentId)
      return res.status(400).json({ message: "Estudiante no encontrado" });

    const findUser = await getUserByStudentId(student.studentId || "");

    if (findUser)
      return res
        .status(400)
        .json({ message: "El estudiante ya tiene una cuenta" });

    const hashedPassword = bcrypt.hashSync(password, 12);

    const data: User = {
      userId: uuid(),
      userName: student.studentFullName || "",
      userEmail,
      roleId: userRole.STUDENT,
      studentId: student.studentId || "",
      userPassword: hashedPassword,
    };

    const user = await postUser(data);

    const jti = uuid();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: user.userId,
    });

    const userData = {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      roleId: user.roleId,
      studentId: user.studentId,
    };

    res.json({ user: userData, accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userEmail, password } = req.body;

    const user = await getUserByEmail(userEmail);

    if (!user) {
      return res.status(400).json({ message: "Credenciales no validas" });
    }

    const isValid = bcrypt.compareSync(password, user.userPassword);

    if (!isValid) {
      return res.status(400).json({ message: "Credenciales no validas" });
    }

    const jti = uuid();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: user.userId,
    });

    const userData = {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      roleId: user.roleId,
      studentId: user.studentId,
    };

    res.json({ user: userData, accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error("Missing refresh token.");
    }
    const payload: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || ""
    );
    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const hashedToken = hash(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuid();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user,
      jti
    );
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken: newRefreshToken,
      userId: user.userId,
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const revokeRefreshTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    await revokeTokens(userId);
    res.json({ message: `Tokens revoked for user with id #${userId}` });
  } catch (err) {
    next(err);
  }
};
