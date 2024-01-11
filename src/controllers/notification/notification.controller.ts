import { NextFunction, Request, Response } from 'express';
import { NotificationQuery } from '../../models';
import { createHttpSuccess, paginationHelper } from '../../utilities';
import createHttpError from 'http-errors';

export const getDetailNotification = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundNotification = await NotificationQuery.findOne({ _id })
            .select({ updatedAt: false, __v: false })
            .populate('task')
            .populate('event');
        if (!foundNotification) {
            return next(createHttpError(404, 'Không tìm thấy thông báo này'));
        }
        return next(createHttpSuccess({ data: { notification: foundNotification } }));
    } catch (error) {
        return next(error);
    }
};

export const getListNotification = async (req: Request, res: Response, next: NextFunction) => {
    const { limit, page } = req.query;
    const { employee_id } = res.locals;
    try {
        NotificationQuery.updateMany(
            { event: { $ne: null }, employees: { $nin: [employee_id] } },
            { employees: { $push: employee_id } },
        );
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = NotificationQuery.find({ employees: employee_id })
            .select({
                updatedAt: false,
                __v: false,
            })
            .sort({ createdAt: 'descending' });
        const totalNotification = await query.clone().countDocuments();
        const listNotification = await query.limit(amount).skip(offset).exec();
        return next(createHttpSuccess({ data: { listNotification, totalNotification } }));
    } catch (error) {
        return next(error);
    }
};
