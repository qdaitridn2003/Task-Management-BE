import mongoose, { Schema } from 'mongoose';
import { TaskSchema } from '../../types';

const taskSchema = new Schema<TaskSchema>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        tag: { type: Schema.Types.ObjectId, ref: 'tag', default: null },
        leader: { type: Schema.Types.ObjectId, ref: 'employee', default: null },
        employees: [{ type: Schema.Types.ObjectId, ref: 'employees', default: null }],
        name: { type: Schema.Types.String },
        dateTime: { type: Schema.Types.Date },
        dateReminder: { type: Schema.Types.Date },
        description: { type: Schema.Types.String },
        location: { type: Schema.Types.String },
        status: { type: Schema.Types.String },
        images: [{ type: Schema.Types.String, default: null }],
    },
    { timestamps: true },
);

const taskModel = mongoose.model('task', taskSchema);

export default taskModel;
