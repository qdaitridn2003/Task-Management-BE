import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { RoleQuery } from '../../models';
import { createHttpSuccess, searchHelper } from '../../utilities';

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    if (!name) return next(createHttpError(400, 'Thêm thông tin tên chức vụ'));
    try {
        const foundRole = await RoleQuery.findOne({ name });
        if (foundRole) return next(createHttpError(400, 'Chức vụ đã có sẵn'));

        const addRole = await RoleQuery.create({ name, description });
        return next(createHttpSuccess({ data: addRole }));
    } catch (error) {
        next(error);
    }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    const { _id } = req.params;
    if (!name) return next(createHttpError(400, 'Thêm thông tin tên chức vụ'));
    try {
        const foundRole = await RoleQuery.findOne({ _id });
        if (!foundRole) return next(createHttpError(400, 'Chức vụ không tồn tại'));

        await RoleQuery.updateOne({ _id }, { name, description });
        return next(createHttpSuccess({ data: {} }));
    } catch (error) {
        next(error);
    }
};

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundRole = await RoleQuery.findOne({ _id });
        if (!foundRole) return next(createHttpError(400, 'Chức vụ không tồn tại'));

        await RoleQuery.deleteOne({ _id });
        return next(createHttpSuccess({ data: {} }));
    } catch (error) {
        next(error);
    }
};

export const getListRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await RoleQuery.find()
            .select({
                createdAt: false,
                updatedAt: false,
                __v: false,
            })
            .sort({ createdAt: 'descending' });

        return next(createHttpSuccess({ data: result }));
    } catch (error) {
        next(error);
    }
};
