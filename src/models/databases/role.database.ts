import mongoose, { Schema } from 'mongoose';
import { RoleSchema } from '../../types';

const roleSchema = new Schema<RoleSchema>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
    },
    { timestamps: true },
);

const roleModel = mongoose.model('role', roleSchema);

export default roleModel;
