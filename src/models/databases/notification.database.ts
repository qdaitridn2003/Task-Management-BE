import mongoose, { Schema } from 'mongoose';
import { NotificationSchema } from '../../types';

const notificationSchema = new Schema<NotificationSchema>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        message: { type: Schema.Types.String },
        type: { type: Schema.Types.String },
        employees: [{ type: Schema.Types.ObjectId, ref: 'employee', default: null }],
        event: { type: Schema.Types.ObjectId, ref: 'event', default: null },
        task: { type: Schema.Types.ObjectId, ref: 'task', default: null },
    },
    { timestamps: true },
);

const notificationModel = mongoose.model('notification', notificationSchema);

export default notificationModel;
