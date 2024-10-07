import { NextFunction, Response } from "express";
import { RequestExt } from "../interfaces/req-ext";
import { getItems } from "../services/item";


export const getItemsCtrl = async (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const items = await getItems()

        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
}