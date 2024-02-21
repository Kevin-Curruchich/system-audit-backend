import jwt from "jsonwebtoken";

export const generateJWT = (user: any) => {
  const token = jwt.sign(
    {
      userId: user.userId,
    },
    process.env.JWT_ACCESS_SECRET || "",
    {
      expiresIn: "3h",
    }
  );
  return token;
};

export const generateRefreshJWT = (user: any, jti: any) => {
  const token = jwt.sign(
    {
      userId: user.userId,
      jti,
    },
    process.env.JWT_REFRESH_SECRET || "",
    {
      expiresIn: "8h",
    }
  );
  return token;
};

export const generateTokens = (user: any, jti: any) => {
  const accessToken = generateJWT(user);
  const refreshToken = generateRefreshJWT(user, jti);

  return { accessToken, refreshToken };
};
