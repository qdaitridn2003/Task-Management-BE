import { z as Zod } from 'zod';

export const registerAccountValidator = Zod.object({
    username: Zod.string().email({
        message: 'Username must be an email address',
    }),
    password: Zod.string()
        .min(6, { message: 'Password must be at least have 6 characters' })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Password must be not have special characters or capital letters',
        }),
    confirmPassword: Zod.string()
        .min(6, {
            message: 'Confirm password must be at least have 6 characters',
        })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Confirm password must be not have special characters or capital letters',
        }),
}).refine((data) => data.confirmPassword === data.password, {
    path: ['confirmPassword'],
    message: 'Confirm password must be matches to the current password',
});

export const passwordValidator = Zod.object({
    password: Zod.string()
        .min(6, { message: 'Password must be at least have 6 characters' })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Password must be not have special characters or capital letters',
        }),
    confirmPassword: Zod.string()
        .min(6, {
            message: 'Confirm password must be at least have 6 characters',
        })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Confirm password must be not have special characters or capital letters',
        }),
}).refine((data) => data.confirmPassword === data.password, {
    path: ['confirmPassword'],
    message: 'Confirm password must be matches to the current password',
});

export const changePasswordValidator = Zod.object({
    oldPassword: Zod.string()
        .min(6, { message: 'Old password must be at least have 6 characters' })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Old password must be not have special characters or capital letters',
        }),
    newPassword: Zod.string()
        .min(6, { message: 'New password must be at least have 6 characters' })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'New password must be not have special characters or capital letters',
        }),
    confirmPassword: Zod.string()
        .min(6, {
            message: 'Confirm password must be at least have 6 characters',
        })
        .regex(new RegExp('^[a-z0-9]*$'), {
            message: 'Confirm password must be not have special characters or capital letters',
        }),
}).refine((data) => data.confirmPassword === data.newPassword, {
    path: ['confirmPassword'],
    message: 'Confirm password must be matches to the new password',
});
