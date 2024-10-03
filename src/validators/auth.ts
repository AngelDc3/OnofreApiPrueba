import { check } from 'express-validator'
import { validateResult } from '../utils/handleValidator';
import { NextFunction, Request, Response } from 'express';


//validar el body el register

const registerValidation = [
    check('email').isEmail().exists().withMessage('email is required'),
    check('password').isString().exists().withMessage('password is required').isLength({ min: 6, max: 12 }).withMessage('password must be between 6 and 12 characters'),
    check('userName').isString().exists().withMessage('userName is required').isLength({ min: 1, max: 20 }).withMessage('userName must be between 1 and 20 characters'),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next)
    }
]

const loginValidation = [
    check('email').isEmail().exists().withMessage('email is required'),
    check('password').isString().exists().withMessage('password is required').isLength({ min: 6, max: 12 }).withMessage('password must be between 6 and 12 characters'),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next)
    }
]

export { registerValidation, loginValidation }