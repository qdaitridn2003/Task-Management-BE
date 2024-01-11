import { Request, Response, NextFunction } from 'express';
import { AuthValidator, NodeMailerHandler, OtpHandler, createHttpSuccess } from '../../utilities';
import { AuthQuery, EmployeeQuery, RoleQuery } from '../../models';
import createHttpError from 'http-errors';
import hashHandler from '../../utilities/handlers/hash.handler';
import jwtHandler from '../../utilities/handlers/jwt.handler';
import { OtpType } from '../../common';

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
        const result = await AuthQuery.findOne({ username });
        if (!result) return next(createHttpError(400, 'Tài khoản không tồn tại'));

        const comparedResult = hashHandler.compare(password, result.password);
        if (!comparedResult) return next(createHttpError(400, 'Mật khẩu không đúng'));

        const foundEmployee = await EmployeeQuery.findOne({ auth: result._id });

        const accessToken = await jwtHandler.init(
            {
                auth_id: result._id,
                employee_id: foundEmployee?._id,
                role_id: result.role,
            },
            'access',
        );
        if (!foundEmployee) {
            return next(
                createHttpSuccess({
                    statusCode: 200,
                    data: { username, authId: result._id, accessToken },
                    message: 'Đã thành công',
                }),
            );
        }

        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { accessToken },
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        return next(error);
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
    try {
        const { check } = OtpHandler.verify(otpSecret, otp);
        if (!check) {
            return next(createHttpError(401, 'Otp đã hết hạn hoặc không tồn tại'));
        }

        const foundRole = await RoleQuery.findOne({ name: 'Employee' });
        if (!foundRole) {
            return next(createHttpError(400, 'Role không tồn tại'));
        }

        const hashPassword = hashHandler.init(password);
        await AuthQuery.create({
            username,
            password: hashPassword,
            role: foundRole?._id,
            isVerified: true,
            verifiedAt: new Date(),
        });

        await EmployeeQuery.create({ email: username });
        return next(
            createHttpSuccess({
                statusCode: 200,
                data: {},
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        return next(error);
    }
};

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    const existingEmailAccount = await AuthQuery.findOne({ username });
    if (existingEmailAccount) {
        return next(createHttpError(400, 'Tài khoản đã được đăng ký'));
    }

    try {
        const otpSecret = await OtpHandler.initSecret({ type: OtpType.ConfirmEmail });
        const otp = OtpHandler.initOtp(otpSecret);
        NodeMailerHandler.sendForConfirmEmail(username, otp);
        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { otpSecret },
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        console.log(error);
    }
};

export const resendOtpForConfirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    const existingEmailAccount = await AuthQuery.findOne({ username });
    if (existingEmailAccount) {
        return next(createHttpError(400, 'Tài khoản đã được đăng ký'));
    }

    try {
        const otpSecret = await OtpHandler.initSecret({
            type: OtpType.ConfirmEmail,
        });
        const otp = OtpHandler.initOtp(otpSecret);
        NodeMailerHandler.sendForConfirmEmail(username, otp);

        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { otpSecret },
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        return next(error);
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
        return next(createHttpError(400, 'Tài khoản không tồn tại'));
    }

    try {
        const otpSecret = await OtpHandler.initSecret({
            auth_id: foundAccount._id,
            type: OtpType.ResetPassword,
        });
        const otp = OtpHandler.initOtp(otpSecret);
        NodeMailerHandler.sendForResetPassword(username, otp);

        return next(
            createHttpSuccess({
                statusCode: 200,
                data: { otpSecret },
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        return next(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;

    const foundAccount = await AuthQuery.findOne({ username });
    if (!foundAccount) {
        return next(createHttpError(400, 'Tài khoản không tồn tại'));
    }

    const otpSecret = await OtpHandler.initSecret({
        auth_id: foundAccount?._id,
        type: OtpType.ResetPassword,
    });
    const otp = OtpHandler.initOtp(otpSecret);
    NodeMailerHandler.sendForResetPassword(username, otp);
    return next(
        createHttpSuccess({
            statusCode: 200,
            data: { otpSecret },
            message: 'Đã thành công',
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
                message: 'Đã thành công',
            }),
        );
    } catch (error) {
        return next(error);
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
        return next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { auth_id } = res.locals;
    try {
        const foundAccount = await AuthQuery.findOne({ _id: auth_id });
        if (!foundAccount) return next(createHttpError(400, 'Account is not exist'));

        const validate = AuthValidator.changePasswordValidator.safeParse({
            oldPassword,
            newPassword,
            confirmPassword,
        });
        if (!validate.success) return next(validate.error);

        const comparePassword = hashHandler.compare(oldPassword, foundAccount.password);
        if (!comparePassword) return next(createHttpError(400, 'Old password is not correct'));

        const hashNewPassword = hashHandler.init(newPassword);

        await AuthQuery.updateOne({ _id: auth_id }, { password: hashNewPassword });
        return next(
            createHttpSuccess({
                statusCode: 200,
                data: {},
                message: 'You have successfully',
            }),
        );
    } catch (error) {
        return next(error);
    }
};

export const registerExpoToken = async (req: Request, res: Response, next: NextFunction) => {
    const { expoToken } = req.body;
    const { auth_id } = res.locals;

    if (!expoToken) {
        return next(createHttpError(404, 'Không tìm thấy mã expo'));
    }

    try {
        await AuthQuery.updateOne({ _id: auth_id }, { expoToken: expoToken });
        return next(createHttpSuccess({}));
    } catch (error) {
        return next(error);
    }
};
