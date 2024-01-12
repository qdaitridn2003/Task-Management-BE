import { NextFunction, Request, Response } from 'express';
import { OtherValidator, createHttpSuccess, paginationHelper } from '../../utilities';
import { AuthQuery, EmployeeQuery, RoleQuery, TaskQuery } from '../../models';
import createHttpError from 'http-errors';
import jwtHandler from '../../utilities/handlers/jwt.handler';
import path from 'path';
import { searchHelper } from '../../utilities/helpers/search.helper';
import sharp from 'sharp';
import { FirebaseParty } from '../../third-party';
import { UploadImage } from '../../common';

export const registerEmployeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { username, authId, fullName, dateOfBirth, gender, phoneNumber, address, avatarUrl } =
        req.body;
    const validator = OtherValidator.registerInfoValidator.safeParse({ gender, phoneNumber });
    if (!validator.success) {
        return next(validator.error);
    }

    try {
        const foundEmployee = await EmployeeQuery.findOne({ email: username });
        if (!foundEmployee) {
            return next(createHttpError(404, 'Nhân viên không tồn tại'));
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
                avatar: avatarUrl,
            },
        );
        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { employee: RegisterEmployee },
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        return next(error);
    }
};

export const updateEmployeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { email, fullName, dateOfBirth, gender, phoneNumber, address, avatarUrl } = req.body;
    const { employee_id } = res.locals;

    const validator = OtherValidator.registerInfoValidator.safeParse({ gender, phoneNumber });
    if (!validator.success) {
        return next(validator.error);
    }

    try {
        const foundEmployee = await EmployeeQuery.findOne({ _id: employee_id });
        if (!foundEmployee) return next(createHttpError(404, 'Nhân viên không tồn tại'));

        await EmployeeQuery.updateOne(
            { _id: employee_id },
            {
                email: email,
                name: fullName,
                gender,
                birthday: dateOfBirth,
                phone: phoneNumber,
                address,
                avatar: avatarUrl,
            },
        );
        return next(
            createHttpSuccess({ statusCode: 200, data: { avatarUrl }, message: 'Đã thành công' }),
        );
    } catch (error) {
        return next(error);
    }
};

export const updateEmployeeStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { status } = req.body;
    try {
        const foundEmployee = await EmployeeQuery.findOne({ _id });
        if (!foundEmployee) return next(createHttpError(404, 'Nhân viên không tồn tại'));

        const foundEmployeeAtTask = await TaskQuery.findOne({ employees: _id });
        if (foundEmployeeAtTask && status === 'disabled')
            return next(createHttpError(400, 'Không thể vô hiệu hoá nhân viên này'));

        await EmployeeQuery.updateOne({ _id: foundEmployee }, { status });
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
        if (!foundEmployee) return next(createHttpError(404, 'Nhân viên không tồn tại'));

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
    const { search, limit, page } = req.query;
    try {
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

export const editEmployeeRole = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { roleId } = req.body;
    try {
        const foundEmployee = await EmployeeQuery.findOne({ _id });
        if (!foundEmployee) return next(createHttpError(404, 'Nhân viên không tồn tại'));

        const foundRole = await RoleQuery.findOne({ _id: roleId });
        if (!foundRole) return next(createHttpError(404, 'Chức vụ không tồn tại'));

        await AuthQuery.updateOne({ _id: foundEmployee.auth }, { role: foundRole?._id });
        return next(createHttpSuccess({ statusCode: 200, data: {}, message: 'Đã thành công' }));
    } catch (error) {
        next(error);
    }
};
