import { Router } from "express";
import { getItemsCtrl } from "../controllers/item";


const router = Router();


router.get("/", getItemsCtrl);

export { router };