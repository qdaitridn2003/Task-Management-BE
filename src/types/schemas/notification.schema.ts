import { Schema } from 'mongoose';

export type NotificationSchema = {
    _id: Schema.Types.ObjectId;
    message: string;
    type: string;
    employees: Schema.Types.ObjectId;
    event: Schema.Types.ObjectId;
    task: Schema.Types.ObjectId;
};
