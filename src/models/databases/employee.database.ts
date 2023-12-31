import mongoose, { Schema } from 'mongoose';

import { EmployeeSchema } from '../../types';
import { uuidHelper } from '../../utilities';

const employeeSchema = new Schema<EmployeeSchema>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        auth: { type: Schema.Types.ObjectId, ref: 'auth', default: null },
        name: { type: Schema.Types.String, default: `employee${uuidHelper()}` },
        birthday: { type: Schema.Types.Date },
        email: { type: Schema.Types.String },
        phone: { type: Schema.Types.String },
        address: { type: Schema.Types.String },
        gender: { type: Schema.Types.String },
        avatar: { type: Schema.Types.String, default: null },
    },
    { timestamps: true },
);

const employeeModel = mongoose.model('employee', employeeSchema);

export default employeeModel;
