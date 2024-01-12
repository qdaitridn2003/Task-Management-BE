import { NextFunction, Request, Response } from 'express';
import { ClientQuery, EmployeeQuery, EventQuery, RoleQuery } from '../../models';
import createHttpError from 'http-errors';
import { OtherValidator, createHttpSuccess, paginationHelper } from '../../utilities';
import { searchHelper } from '../../utilities/helpers/search.helper';
import sharp from 'sharp';
import { FirebaseParty } from '../../third-party';
import { UploadImage } from '../../common';

export const createInfoClient = async (req: Request, res: Response, next: NextFunction) => {
    const { email, fullName, dateOfBirth, gender, phoneNumber, address, avatarUrl } = req.body;

    const validator = OtherValidator.registerInfoValidator.safeParse({
        email,
        gender,
        phoneNumber,
    });
    if (!validator.success) {
        return next(validator.error);
    }

    try {
        const createClient = await ClientQuery.create({
            email,
            name: fullName,
            phone: phoneNumber,
            birthday: dateOfBirth ? new Date(dateOfBirth) : new Date(),
            gender: gender,
            address,
            avatar: avatarUrl,
        });
        return next(
            createHttpSuccess({ statusCode: 200, data: createClient, message: 'Đã thành công' }),
        );
    } catch (error) {
        next(error);
    }
};

export const updateInfoClient = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { email, fullName, dateOfBirth, gender, phoneNumber, address, avatarUrl, status } =
        req.body;
    try {
        const foundClient = await ClientQuery.findOne({ _id });
        if (!foundClient) return next(createHttpError(404, 'Không tìm thấy khách hàng'));

        const foundClientAtEvent = await EventQuery.findOne({ client: _id });
        if (status === 'disabled' && foundClientAtEvent) {
            return next(createHttpSuccess({ data: {}, message: 'Không thể xoá khách hàng này' }));
        }
        await ClientQuery.updateOne(
            { _id: foundClient._id },
            {
                email,
                name: fullName,
                phone: phoneNumber,
                birthday: dateOfBirth ? new Date(dateOfBirth) : new Date(foundClient.birthday),
                gender,
                address,
                avatar: avatarUrl,
                status,
            },
        );
        return next(createHttpSuccess({ statusCode: 200, data: {}, message: 'Đã thành công' }));
    } catch (error) {
        return next(error);
    }
};

export const updateClientStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { status } = req.body;
    try {
        const foundClient = await ClientQuery.findOne({ _id });
        if (!foundClient) return next(createHttpError(404, 'Không tìm thấy khách hàng'));

        const foundClientAtEvent = await EventQuery.findOne({ client: _id });
        if (status === 'disabled' && foundClientAtEvent) {
            return next(createHttpError(400, 'Không thể thay đổi trạng thái khách hàng này'));
        }
        await ClientQuery.updateOne(
            { _id: foundClient._id },
            {
                status,
            },
        );
        return next(createHttpSuccess({ data: {} }));
    } catch (error) {
        next(error);
    }
};

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    const avatar = req.file;
    try {
        const avatarBuffer = await sharp(avatar?.buffer)
            .resize(480, 480)
            .toBuffer();
        const avatarUrl = await FirebaseParty.uploadImage(
            { ...(avatar as Express.Multer.File), buffer: avatarBuffer },
            UploadImage.avatar,
        );
        return next(
            createHttpSuccess({ statusCode: 200, data: { avatarUrl }, message: 'Đã thành công' }),
        );
    } catch (error) {
        return next(error);
    }
};

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const foundClient = await ClientQuery.findOne({ _id });
        if (!foundClient) {
            return next(createHttpError(404, 'Không tìm thấy khách hàng'));
        }
        await ClientQuery.deleteOne({ _id: foundClient._id });
        return next(createHttpSuccess({ statusCode: 200, data: {}, message: 'Đã thành công' }));
    } catch (error) {
        return next(error);
    }
};

export const getClientDetail = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    try {
        const client = await ClientQuery.findById(_id).select({
            createdAt: false,
            updatedAt: false,
            __v: false,
        });
        if (!client) {
            return next(createHttpError(400, 'Khách hàng không tồn tại'));
        }
        return next(createHttpSuccess({ statusCode: 200, data: client, message: 'Đã thành công' }));
    } catch (error) {
        return next(error);
    }
};

export const getListClient = async (req: Request, res: Response, next: NextFunction) => {
    const { limit, page, search, status } = req.query;
    try {
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = ClientQuery.find({ status })
            .populate({
                path: 'events',
                select: { createdAt: false, updatedAt: false, __v: false },
            })
            .select({ createdAt: false, updatedAt: false, __v: false })
            .sort({ createdAt: 'descending' });

        if (search) {
            query.and([
                {
                    $or: [
                        { name: { $regex: searchHelper(search as string) } },
                        { email: { $regex: searchHelper(search as string) } },
                    ],
                },
            ]);
        }

        const totalClient = await query.clone().countDocuments();
        const listClient = await query.limit(amount).skip(offset).exec();
        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { listClient, totalClient },
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        return next(error);
    }
};
