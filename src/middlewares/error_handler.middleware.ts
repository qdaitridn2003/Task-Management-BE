import { Request, Response, NextFunction } from 'express';
import { ErrorPayloadType } from '../types';
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
