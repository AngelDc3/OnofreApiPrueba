import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RequestExt } from "../interfaces/req-ext";
import { verifyToken } from "../utils/jwt.handle";
import pg from "pg";
import config from "../config/pg";
import { CustomError } from "../utils/customError";
const pool = new pg.Pool(config);
const authMiddleware = async (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        const jwtByUser = req.headers.authorization || "";
        const jwtToken = jwtByUser.split(" ").pop();
        if (!jwtToken) {
            throw new CustomError("NO_TIENES_UN_JWT_VALIDO", 401);
        }

        const isUser = verifyToken(`${jwtToken}`) as { id: string };
        if (!isUser) {
            throw new CustomError("NO_TIENES_UN_JWT_VALIDO", 401);
        }

        const exist = await pool.query("SELECT * FROM users WHERE userid = $1", [isUser.id]);
        if (exist.rowCount === 0) {
            throw new CustomError("NO_EXISTE_USUARIO", 401);
        }

        req.user = isUser;
        next();
    } catch (e) {
        next(e);
    }
};

export { authMiddleware };