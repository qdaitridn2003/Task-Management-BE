import mongoose, { Schema } from 'mongoose';
import { EventSchema } from '../../types';

const eventSchema = new Schema<EventSchema>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        client: { type: Schema.Types.ObjectId, ref: 'client', default: null },
        tasks: [{ type: Schema.Types.ObjectId, ref: 'task', default: null }],
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
        startDateTime: { type: Schema.Types.Date },
        endDateTime: { type: Schema.Types.Date },
        location: { type: Schema.Types.String },
        status: { type: Schema.Types.String },
        images: [{ type: Schema.Types.String, default: null }],
    },
    { timestamps: true },
);

const eventModel = mongoose.model('event', eventSchema);

export default eventModel;
