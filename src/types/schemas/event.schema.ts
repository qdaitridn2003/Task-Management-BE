import { Schema } from 'mongoose';
import { ClientSchema } from './client.schema';
import { TaskSchema } from './task.schema';

export type EventSchema = {
    _id: Schema.Types.ObjectId;
    client: Schema.Types.ObjectId | ClientSchema;
    name: string;
    description: string;
    startDateTime: Date;
    endDateTime: Date;
    location: string;
    status: string;
    images: string[];
};
