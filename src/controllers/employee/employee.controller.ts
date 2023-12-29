import { NextFunction, Request, Response } from 'express';
import { OtherValidator, createHttpSuccess } from '../../utilities';
import { EmployeeQuery } from '../../models';
import createHttpError from 'http-errors';
import jwtHandler from '../../utilities/handlers/jwt.handler';

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
                authId,
                email: username,
                name: fullName,
                phone: phoneNumber,
                gender,
                address,
                birthday: dateOfBirth ? new Date(dateOfBirth) : new Date(),
            },
        );
        const accessToken = await jwtHandler.init(
            {
                auth_id: authId,
                employee_id: RegisterEmployee?._id,
            },
            'access',
        );
        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { employee: RegisterEmployee, accessToken },
                message: 'You have successfully',
            }),
        );
    } catch (error) {
        console.log(error);
    }
};
// export const getEmployeeProfile = async (req: Request, res: Response, next: NextFunction) => {
//     const { employee_id } = res.locals;
//     const { _id } = req.params;
//     console.log(employee_id);
//     try {
//         const foundEmployee = await EmployeeQuery.findOne({
//             _id: _id ? _id : employee_id,
//         })
//             .populate({
//                 path: 'authId',
//                 select: { _id: _id, username: true, role: true },
//                 populate: {
//                     path: 'role',
//                     select: { _id: true, name: true },
//                 },
//             })
//             .select({ createdAt: false, updatedAt: false, __v: false });
//         if (!foundEmployee) return next(createHttpError(404, 'Not found employee'));

//         return next(
//             createHttpSuccess({
//                 statusCode: 200,
//                 data: { employee: foundEmployee },
//                 message: 'Đã thành công',
//             }),
//         );
//     } catch (error) {
//         console.log(error);
//     }
// };
