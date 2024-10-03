
//importar tipos de express
import { NextFunction, Request, Response } from 'express';
import { Error } from '../interfaces/error.interface';


function devErrors(e: Error, res: Response) {
    res.status(e.statusCode).json({
        status: e.status,
        message: e.message,
        stack: e.stack,
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

const errorCtrl = (err: Error, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devErrors(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        prodErrors(err, res);
    }
}

export { errorCtrl };


