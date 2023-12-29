import mongoose, { Schema } from 'mongoose';
import { AuthSchema } from '../../types';

const authSchema = new Schema<AuthSchema>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        role: { type: Schema.Types.ObjectId, ref: 'role', default: null },
        username: { type: Schema.Types.String },
        password: { type: Schema.Types.String },
        expoToken: [{ type: Schema.Types.String, default: null }],
    },
    { timestamps: true },
);

const authModel = mongoose.model('auth', authSchema);

export default authModel;
