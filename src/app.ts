
import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
import { router } from "./routes";
import { Error } from "./interfaces/error.interface";
import { errorCtrl } from "./controllers/errorController";
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const PORT = process.env.PORT || 3010;
const app = express();
app.use(cors());
app.use(express.json());


app.use(router);


app.use(errorCtrl)
app.listen(PORT, () => console.log(`Listo por el puerto ${PORT}`));