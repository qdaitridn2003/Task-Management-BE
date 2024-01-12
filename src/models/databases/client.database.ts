import mongoose, { Schema } from 'mongoose';
import { ClientSchema } from '../../types';

const clientSchema = new Schema<ClientSchema>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: Schema.Types.String },
        email: { type: Schema.Types.String },
        birthday: { type: Schema.Types.Date },
        gender: { type: Schema.Types.String },
        phone: { type: Schema.Types.String },
        address: { type: Schema.Types.String },
        avatar: { type: Schema.Types.String, default: null },
        events: [{ type: Schema.Types.ObjectId, ref: 'event', default: null }],
        status: { type: Schema.Types.String, default: 'active' },
    },
    { timestamps: true },
);

const clientModel = mongoose.model('client', clientSchema);

export default clientModel;
