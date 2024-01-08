import { Request, Response, NextFunction } from 'express';
import { TaskQuery } from '../../models';
import { createHttpSuccess, paginationHelper, searchHelper } from '../../utilities';
import createHttpError from 'http-errors';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    const {
        tagId,
        leaderId,
        employeeIds,
        name,
        dateTime,
        dateReminder,
        description,
        status,
        images,
        eventId,
    } = req.body;

    if (!name) {
        return next(createHttpError(400, 'Phải có tên công việc'));
    }

    try {
        const result = await TaskQuery.create({
            tag: tagId,
            leader: leaderId,
            employees: employeeIds,
            event: eventId,
            name: name,
            dateTime,
            dateReminder,
            description,
            status,
            images,
        });
        return next(createHttpSuccess({ data: { task: result } }));
    } catch (error) {
        return next(error);
    }
};
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const {
        tagId,
        leaderId,
        employeeIds,
        name,
        dateTime,
        dateReminder,
        description,
        status,
        images,
    } = req.body;
    try {
        const foundTask = await TaskQuery.findOne({ _id });
        if (!foundTask) {
            return next(createHttpError(404, 'Công việc không tồn tại'));
        }
        await TaskQuery.updateOne(
            { _id: foundTask },
            {
                tag: tagId,
                leader: leaderId,
                employees: employeeIds,
                name,
                dateTime,
                dateReminder,
                description,
                status,
                images,
            },
        );
        return next(createHttpSuccess({}));
    } catch (error) {
        return next(error);
    }
};
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundTask = await TaskQuery.findOne({ _id });
        if (!foundTask) {
            return next(createHttpError(404, 'Công việc không tồn tại'));
        }
        await TaskQuery.deleteOne({ _id: foundTask._id });
        return next(createHttpSuccess({}));
    } catch (error) {
        return next(error);
    }
};
export const getDetailTask = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundTask = await TaskQuery.findOne({ _id })
            .select({
                createdAt: false,
                updatedAt: false,
                __v: false,
            })
            .populate('tag', { createdAt: false, updatedAt: false, __v: false })
            .populate('leader', {
                createdAt: false,
                updatedAt: false,
                __v: false,
                auth: false,
            })
            .populate('employees', { createdAt: false, updatedAt: false, __v: false, auth: false })
            .populate('event', { createdAt: false, updatedAt: false, __v: false });
        if (!foundTask) {
            return next(createHttpError(404, 'Công việc không tồn tại'));
        }
        return next(createHttpSuccess({ data: { task: foundTask } }));
    } catch (error) {
        return next(error);
    }
};
export const getListTask = async (req: Request, res: Response, next: NextFunction) => {
    const { search, limit, page, location, status } = req.query;
    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = TaskQuery.find()
            .select({ createdAt: false, updatedAt: false, deletedAt: false })
            .sort({ createdAt: 'descending' });

        if (search) {
            query.and([{ name: { $regex: searchHelper(search as string) } }]);
        }

        if (location) {
            query.and([{ location: { $regex: searchHelper(location as string) } }]);
        }

        if (status) {
            const parsedStatus = JSON.parse(status as string);
            query.and([{ status: { $in: parsedStatus } }]);
        }

        const totalTask = await query.clone().countDocuments();
        const listTask = await query.limit(amount).skip(offset).exec();

        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { listTask, totalTask },
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        return next(error);
    }
};
