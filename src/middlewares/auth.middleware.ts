import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RequestExt } from "../interfaces/req-ext";
import { verifyToken } from "../utils/jwt.handle";
import pg from "pg";
import config from "../config/pg";
const pool = new pg.Pool(config);
const authMiddleware = async (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        const jwtByUser = req.headers.authorization || "";
        const jwtToken = jwtByUser.split(" ").pop();
        const isUser = verifyToken(`${jwtToken}`) as { id: string };


        if (!isUser) {
            res.status(401);
            res.send("NO_TIENES_UN_JWT_VALIDO");
        } else {
            const exist = await pool.query("SELECT * FROM users WHERE id = $1", [isUser.id]);
            if (exist.rowCount === 0) {
                res.status(401);
                res.send("NO_EXISTE_USUARIO");
            }
            req.user = isUser;
            next();
        }
    } catch (e) {
        console.log({ e });
        res.status(400);
        res.send("SESSION_NO_VALIDAD");
    }
};

export { authMiddleware };