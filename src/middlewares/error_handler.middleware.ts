import { Request, Response, NextFunction } from 'express';
import { ErrorPayloadType } from '../types';
import { ZodError } from 'zod';
import { JsonWebTokenError } from 'jsonwebtoken';

const errorHandler = (
    errorPayload: ErrorPayloadType,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (errorPayload instanceof JsonWebTokenError) {
        if (errorPayload.name === 'TokenExpiredError') {
            return res
                .status(401)
                .json({
                    status: 'Xảy ra lỗi',
                    message: 'Thời gian đăng nhập của bạn đã hết hạn',
                })
                .flush();
        } else {
            return res
                .status(401)
                .json({
                    status: 'Xảy ra lỗi',
                    message: 'Mã không hợp lệ',
                })
                .flush();
        }
    }
    if (errorPayload instanceof ZodError) {
        const listErrors = errorPayload.errors;
        const listErrorMessage = listErrors.map((error: any) => error.message);
        return res
            .status(errorPayload.statusCode ?? 500)
            .json({
                status: 'Xảy ra lỗi',
                message: listErrorMessage.length > 1 ? listErrorMessage : listErrorMessage[0],
            })
            .flush();
    } else {
        return res
            .status(errorPayload.statusCode ?? 500)
            .json({
                status: 'Xảy ra lỗi',
                message: errorPayload.message,
            })
            .flush();
    }
};

export default errorHandler;
