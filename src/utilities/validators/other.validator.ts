import { z as Zod } from 'zod';

export const registerInfoValidator = Zod.object({
    email: Zod.string().email({ message: 'Email must an email address' }).optional(),
    gender: Zod.enum(['male', 'female'], {
        errorMap: (issue, context) => {
            return {
                message: 'Gender must be male or female',
            };
        },
    }),
    phoneNumber: Zod.string()
        .max(10, {
            message:
                'Phone number must be have 10 digits or lower Phone number must be have lower 10 digits',
        })
        .regex(new RegExp('^[0-9]*$'), { message: 'Phone number must be a digit' }),
});
