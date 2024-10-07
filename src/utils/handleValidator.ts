import { NextFunction, Response, Request } from "express"
import { validationResult } from "express-validator"
import { CustomError } from "./customError"



const validateResult = (req: Request, res: Response, next: NextFunction) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (err: any) {
        throw new CustomError(err.array().map((e: any) => e.msg).join(', '), 400)
    }
}

export { validateResult }