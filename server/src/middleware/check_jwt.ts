import { Request, Response, NextFunction } from "express";

import {
  verifyAccessToken,
  verifyRefreshToken,
  createAccessToken,
} from "../utils/jwt";

export async function CheckJwt(
  req: Request,

  res: Response,

  next: NextFunction
): Promise<any> {
  const accessToken = req.cookies["access_token"];

  const refreshToken = req.cookies["refresh_token"];

  if (!refreshToken) {
    return res.status(401).json({ message: "Login again: Not have token." });
  }

  try {
    const decodeaccess = await verifyAccessToken(accessToken);

    if (decodeaccess) {
      (req as any).user = { id: decodeaccess.userId };

      return next();
    }

    try {
      const decoderefresh = await verifyRefreshToken(refreshToken);

      if (!decoderefresh) {
        return res

          .status(401)

          .json({ message: "Login again: refresh token invalid." });
      }

      const newAccessToken = await createAccessToken(decoderefresh.userId);

      if (!newAccessToken) {
        return res.status(500).json({ mesage: "Internal Server Error " });
      }

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,

        maxAge: 1000 * 60 * 60 * 24 * 30,

        path: "/",
      });

      (req as any).user = { id: decoderefresh.userId };

      return next();
    } catch (e) {
      console.error("JWT creation error", e);

      return res.status(500).json({ mesage: "Internal Server Error " });
    }
  } catch (err) {
    console.error("JWT middleware Error: Both tokens invalid", err);

    return res.status(401).json({ message: "Login again: Invalid tokens." });
  }
}
