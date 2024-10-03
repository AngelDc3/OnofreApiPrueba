
import { NextFunction, Request, Response } from 'express';
import { check } from "express-validator"
import { validateResult } from "../utils/handleValidator"

const pruebaValidation = [
    check('id').isNumeric().exists().withMessage('id is required'),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next)
    }
]

export { pruebaValidation }