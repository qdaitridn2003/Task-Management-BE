import mongoose, { Schema } from 'mongoose';
import { TagSchema } from '../../types';

const tagSchema = new Schema<TagSchema>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
    },
    { timestamps: true },
);

const tagModel = mongoose.model('tag', tagSchema);

export default tagModel;
