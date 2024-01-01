import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { RoleQuery } from '../models';

const checkRole = async (req: Request, res: Response, next: NextFunction) => {
    const { role_id } = res.locals;
    try {
        console.log(role_id);
        const foundRole = await RoleQuery.findOne({ name: 'Admin' });
        const foundRoleId = foundRole?._id.toString();
        if (role_id !== foundRoleId) return next(createHttpError(401, 'Bạn không phải là admin'));
        return next();
    } catch (error) {
        return next(error);
    }
};

export default checkRole;
