import { Request, Response } from "express";

import { getUserByEmail, getUserById } from "../models/user";

export const findUserByEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    const user = await getUserByEmail(email);

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const findUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    res.json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const findUserById = async (id: string) => {
  return await getUserById(id);
};
