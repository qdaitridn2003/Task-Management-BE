import { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';

import { ClientQuery, EventQuery } from '../../models';
import { createHttpSuccess, paginationHelper, searchHelper } from '../../utilities';
import createHttpError from 'http-errors';

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const {
        clientId,
        taskIds,
        name,
        description,
        startDateTime,
        endDateTime,
        location,
        status,
        images,
    } = req.body;
    // const socket = res.locals.socket as Socket;

    if (!name) {
        return next(createHttpError(400, 'Phải có tên sự kiện'));
    }

    try {
        const result = await EventQuery.create({
            client: clientId,
            name: name,
            tasks: taskIds,
            description: description,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            status,
            location: location,
            images: images,
        });
        await ClientQuery.updateOne({ _id: clientId }, { $push: { events: result._id } });
        return next(createHttpSuccess({ data: { event: result } }));
    } catch (error) {
        return next(error);
    }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const {
        clientId,
        taskIds,
        name,
        description,
        startDateTime,
        endDateTime,
        location,
        images,
        status,
    } = req.body;
    // const socket = res.locals.socket as Socket;
    try {
        const foundEvent = await EventQuery.findOne({ _id });
        if (!foundEvent) {
            return next(createHttpError(404, 'Sự kiện không tồn tại'));
        }
        await EventQuery.updateOne(
            { _id: foundEvent._id },
            {
                client: clientId,
                name: name,
                tasks: taskIds,
                description: description,
                status,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                location: location,
                images: images,
            },
        );
        return next(createHttpSuccess({}));
    } catch (error) {
        return next(error);
    }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundEvent = await EventQuery.findOne({ _id });
        if (!foundEvent) {
            return next(createHttpError(404, 'Sự kiện không tồn tại'));
        }
        await EventQuery.deleteOne({ _id: foundEvent._id });
        await ClientQuery.updateOne({ events: foundEvent }, { $pull: { events: foundEvent._id } });
        return next(createHttpSuccess({}));
    } catch (error) {
        return next(error);
    }
};

export const getDetailEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundEvent = await EventQuery.findOne({ _id })
            .select({
                createdAt: false,
                updatedAt: false,
                __v: false,
            })
            .populate('client', { createdAt: false, updatedAt: false, __v: false })
            .populate('tasks', { createdAt: false, updatedAt: false, __v: false });
        if (!foundEvent) {
            return next(createHttpError(404, 'Sự kiện không tồn tại'));
        }
        return next(createHttpSuccess({ data: { event: foundEvent } }));
    } catch (error) {
        return next(error);
    }
};

export const getListEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { search, limit, page, location, status } = req.query;
    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = EventQuery.find()
            .select({ createdAt: false, updatedAt: false, deletedAt: false })
            .sort({ createdAt: 'descending' });

        if (search) {
            query.and([{ name: { $regex: searchHelper(search as string) } }]);
        }

        if (status) {
            const parsedStatus = JSON.parse(status as string);
            query.and([{ status: { $in: parsedStatus } }]);
        }

        if (location) {
            query.and([{ location: { $regex: searchHelper(location as string) } }]);
        }

        const totalEvent = await query.clone().countDocuments();
        const listEvent = await query.limit(amount).skip(offset).exec();

        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { listEvent, totalEvent },
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        return next(error);
    }
};
