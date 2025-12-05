import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      const decoded = jwt.verify(
        token,
        config.JWT_SECRET as string
      ) as JwtPayload;
      console.log(decoded);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role as string)) {
        res.status(500).json({
          success: false,
          message: "Unauthorized",
        });
      }
      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;
