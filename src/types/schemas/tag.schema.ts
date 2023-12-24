import { Schema } from 'mongoose';

export type TagSchema = {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
};
