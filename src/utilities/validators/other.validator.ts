import { z as Zod } from 'zod';

export const registerInfoValidator = Zod.object({
    email: Zod.string().email({ message: 'Email không hợp lệ' }).optional(),
    gender: Zod.enum(['nam', 'nữ'], {
        errorMap: (issue, context) => {
            return {
                message: 'Giới tính phải là nam hoặc nữ',
            };
        },
    }),
    phoneNumber: Zod.string()
        .max(10, {
            message:
                'Số điện thoại phải có 10 chữ số trở xuống Số điện thoại phải có ít hơn 10 chữ số',
        })
        .regex(new RegExp('^[0-9]*$'), { message: 'Số điện thoại phải là số' }),
});
