import { z as Zod } from 'zod';

export const registerAccountValidator = Zod.object({
    username: Zod.string().email({
        message: 'Tên người dùng phải là địa chỉ email',
    }),
    password: Zod.string()
        .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Mật khẩu không được có ký tự đặc biệt hoặc chữ in hoa',
        }),
    confirmPassword: Zod.string()
        .min(6, {
            message: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự',
        })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Xác nhận mật khẩu không được có ký tự đặc biệt hoặc chữ in hoa',
        }),
}).refine((data) => data.confirmPassword === data.password, {
    path: ['confirmPassword'],
    message: 'Xác nhận mật khẩu phải khớp với mật khẩu hiện tại',
});

export const passwordValidator = Zod.object({
    password: Zod.string()
        .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Mật khẩu không được có ký tự đặc biệt hoặc chữ in hoa',
        }),
    confirmPassword: Zod.string()
        .min(6, {
            message: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự',
        })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Xác nhận mật khẩu không được có ký tự đặc biệt hoặc chữ in hoa',
        }),
}).refine((data) => data.confirmPassword === data.password, {
    path: ['confirmPassword'],
    message: 'Xác nhận mật khẩu phải khớp với mật khẩu hiện tại',
});

export const changePasswordValidator = Zod.object({
    oldPassword: Zod.string()
        .min(6, { message: 'Mật khẩu cũ phải có ít nhất 6 ký tự' })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Mật khẩu cũ không được có ký tự đặc biệt hoặc chữ in hoa',
        }),
    newPassword: Zod.string()
        .min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Mật khẩu mới không được có ký tự đặc biệt hoặc chữ in hoa',
        }),
    confirmPassword: Zod.string()
        .min(6, {
            message: 'Xác nhân mật khẩu phải có ít nhất 6 ký tự',
        })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Xác nhận mật khẩu cũ không được có ký tự đặc biệt hoặc chữ in hoa',
        }),
}).refine((data) => data.confirmPassword === data.newPassword, {
    path: ['confirmPassword'],
    message: 'Xác nhận mật khẩu phải khớp với mật khẩu hiện tại',
});
