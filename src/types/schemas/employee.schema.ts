import { Schema } from 'mongoose';
import { AuthSchema } from './auth.schema';

export type EmployeeSchema = {
    _id: Schema.Types.ObjectId;
    auth: Schema.Types.ObjectId | AuthSchema;
    name: string;
    birthday: Date;
    gender: string;
    phone: string;
    email: string;
    address: string;
    avatar: string;
};
