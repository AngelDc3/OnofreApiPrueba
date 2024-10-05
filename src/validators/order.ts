
import { NextFunction, Request, Response } from 'express';
import { check } from "express-validator"
import { validateResult } from "../utils/handleValidator"

const pruebaValidation = [
    check('id').isNumeric().exists().withMessage('id is required'),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next)
    }
]
//Para crear una orden se necesita la deudaid
export const createOrderValidation = [
    check('deuda').exists().withMessage('product is required'),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next);
    }
];

export const updateOrderValidation = [
    check('estado').optional().isInt().withMessage('quantity must be an integer'),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next);
    }
];


export const addItemToOrderValidation = [
    check('orderid').isInt().exists().withMessage('order id is required'),
    check('items').isArray().exists().withMessage('items is required'),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next);
    }
];

export { pruebaValidation }