import { Schema } from 'mongoose';
import { TagSchema } from './tag.schema';
import { EmployeeSchema } from './employee.schema';
import { EventSchema } from './event.schema';

export type TaskSchema = {
    _id: Schema.Types.ObjectId;
    tag: Schema.Types.ObjectId | TagSchema;
    event: Schema.Types.ObjectId | EventSchema;
    leader: Schema.Types.ObjectId | EmployeeSchema;
    name: string;
    description: string;
    dateTime: Date;
    dateReminder: Date;
    location: string;
    status: string;
    images: string[];
    employees: Schema.Types.ObjectId | EmployeeSchema;
};
