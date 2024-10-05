
//importar tipos de express
import { NextFunction, Request, Response } from 'express';
import { Error } from '../interfaces/error.interface';
import { CustomError } from '../utils/customError';


function devErrors(e: Error, res: Response) {
    res.status(e.statusCode).json({
        status: e.status,
        message: e.message,
        stackTrace: e.stackTrace,
        error: e
    })
}
function prodErrors(e: Error, res: Response) {

    if (e.operational) {
        res.status(e.statusCode).json({
            status: e.status,
            message: e.message
        })
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Algo salio mal. Intente de nuevo mas tarde'
        })
    }
}

function expiredtoken() {
    return new CustomError('Token expirado', 401);
}

function invalidToken() {
    return new CustomError('Token invalido', 401);
}

const errorCtrl = (err: Error, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devErrors(err, res);
    } else if (process.env.NODE_ENV === 'production') {

        if (err.name === 'JsonWebTokenError') err = invalidToken()
        if (err.name === 'TokenExpiredError') err = expiredtoken();
        prodErrors(err, res);
    }
}

export { errorCtrl };


