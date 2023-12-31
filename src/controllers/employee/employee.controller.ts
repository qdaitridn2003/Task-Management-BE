import { NextFunction, Request, Response } from 'express';
import { OtherValidator, createHttpSuccess, paginationHelper } from '../../utilities';
import { AuthQuery, EmployeeQuery, RoleQuery } from '../../models';
import createHttpError from 'http-errors';
import jwtHandler from '../../utilities/handlers/jwt.handler';
import path from 'path';
import { searchHelper } from '../../utilities/helpers/search.helper';
import sharp from 'sharp';
import { FirebaseParty } from '../../third-party';
import { UploadImage } from '../../common';

export const registerEmployeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { username, authId, fullName, dateOfBirth, gender, phoneNumber, address } = req.body;
    const validator = OtherValidator.registerInfoValidator.safeParse({ gender, phoneNumber });
    if (!validator.success) {
        return next(validator.error);
    }

    try {
        const foundEmployee = await EmployeeQuery.findOne({ email: username });
        if (!foundEmployee) {
            return next(createHttpError(404, 'Employee not found'));
        }

        const RegisterEmployee = await EmployeeQuery.findOneAndUpdate(
            { email: username },
            {
                auth: authId,
                email: username,
                name: fullName,
                phone: phoneNumber,
                gender,
                address,
                birthday: dateOfBirth ? new Date(dateOfBirth) : new Date(),
            },
        );
        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { employee: RegisterEmployee },
                message: 'You have successfully',
            }),
        );
    } catch (error) {
        return next(error);
    }
};

export const updateEmployeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { email, fullName, dateOfBirth, gender, phoneNumber, address } = req.body;
    const { employee_id } = res.locals;

    const validator = OtherValidator.registerInfoValidator.safeParse({ gender, phoneNumber });
    if (!validator.success) {
        return next(validator.error);
    }

    try {
        const foundEmployee = await EmployeeQuery.findOne({ _id: employee_id });
        if (!foundEmployee) return next(createHttpError(404, 'Not found employee'));

        await EmployeeQuery.updateOne(
            { _id: employee_id },
            {
                email: email,
                name: fullName,
                birthday: dateOfBirth,
                phone: phoneNumber,
                address,
            },
        );
        return next(createHttpSuccess({ statusCode: 200, data: {}, message: 'Đã thành công' }));
    } catch (error) {
        return next(error);
    }
};

export const getEmployeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { employee_id } = res.locals;
    const { _id } = req.params;
    console.log(employee_id);
    try {
        const foundEmployee = await EmployeeQuery.findOne({
            _id: _id ? _id : employee_id,
        })
            .populate({
                path: 'auth',
                select: { _id: true, username: true, role: true },
                populate: {
                    path: 'role',
                    select: { _id: true, name: true },
                },
            })
            .select({ createdAt: false, updatedAt: false, __v: false });
        if (!foundEmployee) return next(createHttpError(404, 'Not found employee'));

        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { employee: foundEmployee },
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        return next(error);
    }
};

export const getEmployeeList = async (req: Request, res: Response, next: NextFunction) => {
    const { role_id } = res.locals;
    const { search, limit, page } = req.query;
    try {
        const foundRole = await RoleQuery.findOne({ name: 'Admin' });
        const foundRoleId = foundRole?._id.toString();
        if (role_id !== foundRoleId) {
            return next(createHttpError(401, 'Bạn không phải là admin'));
        }
        const { amount, offset } = paginationHelper(limit as string, page as string);
        const query = EmployeeQuery.find()
            .populate({
                path: 'auth',
                select: { _id: true, username: true, role: true },
                populate: {
                    path: 'role',
                    select: { _id: true, name: true },
                },
            })
            .select({ createdAt: false, updatedAt: false, deletedAt: false })
            .sort({ createdAt: 'descending' });

        if (search) {
            query.and([{ name: { $regex: searchHelper(search as string) } }]);
        }
        const totalEmployee = await query.clone().countDocuments();
        const listEmployee = await query.limit(amount).skip(offset).exec();

        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { listEmployee, totalEmployee },
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        return next(error);
    }
};

export const uploadEmployeeAvatar = async (req: Request, res: Response, next: NextFunction) => {
    const avatar = req.file;
    const { employee_id } = res.locals;
    console.log(avatar);
    try {
        const foundEmployee = await EmployeeQuery.findOne({ _id: employee_id });
        if (!foundEmployee) {
            return next(createHttpError(404, 'Not found employee'));
        }
        const avatarBuffer = await sharp(avatar?.buffer)
            .resize(480, 480)
            .toBuffer();
        const avatarUrl = await FirebaseParty.uploadImage(
            { ...(avatar as Express.Multer.File), buffer: avatarBuffer },
            UploadImage.avatar,
        );
        await EmployeeQuery.updateOne({ _id: foundEmployee._id }, { avatar: avatarUrl });
        return next(
            createHttpSuccess({ statusCode: 200, data: { avatarUrl }, message: 'Đã thành công' }),
        );
    } catch (error) {
        next(error);
    }
};

export const editEmployeeRole = async (req: Request, res: Response, next: NextFunction) => {
    const { role_id } = res.locals;
    const { _id } = req.params;

    try {
        const foundRole = await RoleQuery.findOne({ name: 'Admin' });
        const foundRoleId = foundRole?._id.toString();
        if (role_id !== foundRoleId) return next(createHttpError(401, 'Bạn không phải là admin'));

        const foundEmployee = await EmployeeQuery.findOne({ _id });
        if (!foundEmployee) return next(createHttpError(404, 'Không tìm thấy nhân viên'));

        await AuthQuery.updateOne({ _id: foundEmployee.auth }, { role: foundRole });
        return next(createHttpSuccess({ statusCode: 200, data: {}, message: 'Đã thành công' }));
    } catch (error) {
        console.log(error);
    }
};
