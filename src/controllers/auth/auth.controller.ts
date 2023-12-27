import { SuccessPayloadType } from './../../types/response.type';
import { Request, Response, NextFunction } from 'express';
import {
    AuthValidator,
    JwtHandler,
    NodeMailerHandler,
    OtpHandler,
    createHttpSuccess,
} from '../../utilities';
import { AuthQuery, EmployeeQuery } from '../../models';
import createHttpError from 'http-errors';
import hashHandler from '../../utilities/handlers/hash.handler';
import jwtHandler from '../../utilities/handlers/jwt.handler';
import { OtpType } from '../../common';
import otpHandler from '../../utilities/handlers/otp.handler';
import { RoleSchema } from '../../types';

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
        const result = await AuthQuery.findOne({ username });
        if (!result) return next(createHttpError(400, 'Account is not exist'));

        const comparedResult = hashHandler.compare(password, result.password);
        if (!comparedResult) return next(createHttpError(400, 'Password is not correct'));

        const foundEmployee = await EmployeeQuery.findOne({ auth: result._id });
        if (!foundEmployee) {
            return next(
                createHttpSuccess({
                    statusCode: 200,
                    data: { auth_id: result._id, isFirstLogin: true },
                    message: 'You have successfully',
                }),
            );
        } else {
            const accessToken = await jwtHandler.init(
                {
                    auth_id: result._id,
                    employee_id: foundEmployee._id,
                    identify: (result.role as RoleSchema).name,
                },
                'access',
            );
            return next(
                createHttpSuccess({
                    statusCode: 200,
                    data: { accessToken },
                    message: 'You have successfully',
                }),
            );
        }
    } catch (error) {
        console.log(error);
    }
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, confirmPassword, otp, otpSecret } = req.body;
    const validate = AuthValidator.registerAccountValidator.safeParse({
        username,
        password,
        confirmPassword,
    });

    if (!validate.success) {
        return next(validate.error);
    }
    const { check } = OtpHandler.verify(otpSecret, otp);
    if (!check) {
        return next(createHttpError(401, 'Otp was expired or invalid'));
    }
    try {
        const hashPassword = hashHandler.init(password);
        const result = await AuthQuery.create({
            username,
            password: hashPassword,
            isVerified: true,
            verifiedAt: new Date(),
        });
        next(
            createHttpSuccess({
                statusCode: 200,
                data: result ?? {},
                message: 'You have successfully',
            }),
        );
    } catch (error) {
        console.log(error);
    }
};

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    const existingEmailAccount = await AuthQuery.findOne({ username });
    if (existingEmailAccount) {
        return next(createHttpError(400, 'Account already exists'));
    }

    try {
        const otpSecret = await jwtHandler.init(
            {
                type: OtpType.ConfirmEmail,
            },
            'otp',
        );
        // console.log(otpSecret);
        const otp = OtpHandler.initOtp(otpSecret);
        NodeMailerHandler.sendForConfirmEmail(username, otp);

        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { otpSecret } ?? {},
                message: 'You have successfully send otp',
            }),
        );
    } catch (error) {
        console.log(error);
    }
};

export const resendOtpForConfirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;

    const foundAccount = await AuthQuery.findOne({ username });
    if (!foundAccount) {
        return next(createHttpError(400, 'Account not exist'));
    }

    try {
        const otpSecret = await jwtHandler.init(
            {
                auth_id: foundAccount._id,
                type: OtpType.ConfirmEmail,
            },
            'otp',
        );
        // console.log(otpSecret);
        const otp = OtpHandler.initOtp(otpSecret);
        NodeMailerHandler.sendForConfirmEmail(username, otp);

        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { otpSecret } ?? {},
                message: 'You have successfully send otp',
            }),
        );
    } catch (error) {
        console.log(error);
    }
};

export const resendOtpForConfirmResetPass = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { username } = req.body;

    const foundAccount = await AuthQuery.findOne({ username });
    if (!foundAccount) {
        return next(createHttpError(400, 'Account not exist'));
    }

    try {
        const otpSecret = await jwtHandler.init(
            {
                auth_id: foundAccount._id,
                type: OtpType.ResetPassword,
            },
            'otp',
        );
        // console.log(otpSecret);
        const otp = OtpHandler.initOtp(otpSecret);
        NodeMailerHandler.sendForResetPassword(username, otp);

        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { otpSecret } ?? {},
                message: 'You have successfully send otp',
            }),
        );
    } catch (error) {
        console.log(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;

    const foundAccount = await AuthQuery.findOne({ username });
    if (!foundAccount) {
        return next(createHttpError(400, 'Account not exist'));
    }

    const otpSecret = await JwtHandler.init(
        { auth_id: foundAccount?._id, type: OtpType.ResetPassword },
        'otp',
    );
    const otp = OtpHandler.initOtp(otpSecret);
    NodeMailerHandler.sendForResetPassword(username, otp);
    return next(
        createHttpSuccess({
            statusCode: 200,
            data: { otpSecret } ?? {},
            message: 'You have successfully reset your password',
        }),
    );
};

export const verifyOtpForResetPass = async (req: Request, res: Response, next: NextFunction) => {
    const { otp, otpSecret } = req.body;

    try {
        const { check, type, auth_id } = OtpHandler.verify(otpSecret, otp);
        if (!check) {
            return next(createHttpError(401, 'Otp was expired or invalid'));
        }
        const foundAccount = await AuthQuery.findOne({ _id: auth_id });
        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { username: foundAccount?.username },
                message: 'You have successfully verify-otp reset password',
            }),
        );
    } catch (error) {
        console.log(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, confirmPassword } = req.body;
        const validate = AuthValidator.passwordValidator.safeParse({
            password,
            confirmPassword,
        });
        console.log(validate);
        if (!validate.success) {
            return next(validate.error);
        }

        const hashPassword = hashHandler.init(password);
        await AuthQuery.findOneAndUpdate({ username }, { password: hashPassword });
        next(createHttpSuccess({ statusCode: 200, data: {}, message: 'You have successfully' }));
    } catch (error) {
        console.log(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {};
