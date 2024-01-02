import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { TagQuery } from '../../models';
import { createHttpSuccess, paginationHelper, searchHelper } from '../../utilities';

export const createTag = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    try {
        if (!name) {
            return next(createHttpError(400, 'Vui lòng đặt tên cho tag này'));
        }
        const createTag = await TagQuery.create({ name, description });
        return next(
            createHttpSuccess({ statusCode: 200, data: createTag, message: 'Đã thành công' }),
        );
    } catch (error) {
        next(error);
    }
};

export const updateTag = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { name, description } = req.body;
    try {
        if (!name) {
            return next(createHttpError(400, 'Vui lòng đặt tên cho tag này'));
        }
        await TagQuery.updateOne({ _id }, { name, description });
        return next(createHttpSuccess({ statusCode: 200, data: {}, message: 'Đã thành công' }));
    } catch (error) {
        next(error);
    }
};

export const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        await TagQuery.deleteOne({ _id });
        return next(createHttpSuccess({ statusCode: 200, data: {}, message: 'Đã thành công' }));
    } catch (error) {
        next(error);
    }
};

export const getTagList = async (req: Request, res: Response, next: NextFunction) => {
    const { limit, page, search } = req.query;
    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = TagQuery.find().sort({ createdAt: 'descending' });

        if (search) {
            query.and([{ name: { $regex: searchHelper(search as string) } }]);
        }
        const totalTag = await query.clone().countDocuments();
        const listTag = await query.limit(amount).skip(offset).exec();
        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { listTag, totalTag },
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        next(error);
    }
};
