
import { NextFunction, Request, Response } from 'express';
import { check } from "express-validator"
import { validateResult } from "../utils/handleValidator"

//Para crear una orden se necesita la deudaid
export const createOrderValidation = [
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next);
    }
];

export const updateOrderValidation = [
    check('estado').optional().isInt().withMessage('estado must be an integer'),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next);
    }
];


export const addItemToOrderValidation = [
    check('orderid').isInt().exists().withMessage('orderid is required'),
    check('items').isArray().exists().withMessage('items is required'),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next);
    }
];
