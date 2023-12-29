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
