import { Schema } from 'mongoose';
import { EventSchema } from './event.schema';

export type ClientSchema = {
    _id: Schema.Types.ObjectId;
    name: string;
    birthday: Date;
    gender: string;
    phone: string;
    email: string;
    address: string;
    avatar: string;
    events: Schema.Types.ObjectId[] | EventSchema[];
};
