import { Schema } from 'mongoose';

export type RoleSchema = {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
};
