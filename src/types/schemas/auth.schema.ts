import { Schema } from 'mongoose';
import { RoleSchema } from './role.schema';

export type AuthSchema = {
    _id: Schema.Types.ObjectId;
    username: string;
    password: string;
    isVerified: boolean;
    verifiedAt: Date;
    role: Schema.Types.ObjectId | RoleSchema;
    expoToken: string[];
};
