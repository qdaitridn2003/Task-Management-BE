import { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';

import { ClientQuery, EventQuery, NotificationQuery } from '../../models';
import {
    createHttpSuccess,
    createNotification,
    paginationHelper,
    searchHelper,
} from '../../utilities';
import createHttpError from 'http-errors';
import sharp from 'sharp';
import { FirebaseParty } from '../../third-party';
import { ActionType, UploadImage } from '../../common';

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { clientId, name, description, startDateTime, endDateTime, location, status, imageUrls } =
        req.body;
    const { employee_id } = res.locals;
    // const socket = res.locals.socket as Socket;

    if (!name) {
        return next(createHttpError(400, 'Phải có tên sự kiện'));
    }

    try {
        const result = await EventQuery.create({
            client: clientId,
            name: name,
            description: description,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            status,
            location: location,
            images: imageUrls,
        });
        await ClientQuery.updateOne({ _id: clientId }, { $push: { events: result._id } });
        await createNotification(
            employee_id,
            `[Event #${result._id}] Bạn đang có sự kiện mới tên ${name.toUpperCase()}`,
            ActionType.Create,
            'event',
            result._id,
        );
        return next(createHttpSuccess({ data: { event: result } }));
    } catch (error) {
        return next(error);
    }
};

export const uploadImagesEvent = async (req: Request, res: Response, next: NextFunction) => {
    const images = req.files;
    try {
        const imagesUrls = await Promise.all(
            (images as Express.Multer.File[]).map(async (image: Express.Multer.File) => {
                const imageBuffer = await sharp(image.buffer).resize(720, 480).toBuffer();
                return await FirebaseParty.uploadImage(
                    { ...image, buffer: imageBuffer },
                    UploadImage.image,
                );
            }),
        );
        console.log(imagesUrls);
        return next(createHttpSuccess({ data: imagesUrls }));
    } catch (error) {
        next(error);
    }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { clientId, name, description, startDateTime, endDateTime, location, imageUrls, status } =
        req.body;
    // const socket = res.locals.socket as Socket;
    const { employee_id } = res.locals;
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
                description: description,
                status,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                location: location,
                images: imageUrls,
            },
        );
        await createNotification(
            employee_id,
            `[Event #${_id}] Sự kiện ${foundEvent.name.toUpperCase()} đã được chỉnh sửa, vui lòng kiểm tra`,
            ActionType.Update,
            'event',
            _id,
        );
        return next(createHttpSuccess({}));
    } catch (error) {
        return next(error);
    }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { employee_id } = res.locals;
    try {
        const foundEvent = await EventQuery.findOne({ _id });
        if (!foundEvent) {
            return next(createHttpError(404, 'Sự kiện không tồn tại'));
        }
        await EventQuery.deleteOne({ _id: foundEvent._id });
        await ClientQuery.updateOne({ events: foundEvent }, { $pull: { events: foundEvent._id } });
        await createNotification(
            employee_id,
            `[Event #${_id}] Sự kiện ${foundEvent.name.toUpperCase()} đã được xóa`,
            ActionType.Delete,
            'event',
            _id,
        );
        await NotificationQuery.deleteMany({
            event: foundEvent._id,
            type: { $ne: ActionType.Delete },
        });
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
