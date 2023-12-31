import { Request, Response, NextFunction } from 'express';
import { JwtHandler } from '../utilities';
import createHttpError from 'http-errors';

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    let token;
    if (!authorization) {
        return next(createHttpError(401, 'Ủy quyền không hợp lệ'));
    } else {
        token = authorization.includes('Bearer') ? authorization.split(' ')[1] : authorization;
    }

    try {
        const verifiedResult = await JwtHandler.verify(token as string, 'access');
        res.locals.auth_id = verifiedResult.auth_id;
        res.locals.employee_id = verifiedResult.employee_id;
        res.locals.role_id = verifiedResult.role_id;
        return next();
    } catch (error) {
        return next(error);
    }
};

export default authorization;
