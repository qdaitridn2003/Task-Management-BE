import { Schema } from 'mongoose';
import { NotificationQuery } from '../../models';
import { EmployeeSchema } from '../../types';

export const createNotification = async (
    initEmployeeId:
        | string
        | Schema.Types.ObjectId
        | (Schema.Types.ObjectId | EmployeeSchema)[]
        | string[]
        | Schema.Types.ObjectId[],
    message: string,
    action: string,
    type: 'task' | 'event',
    typeId: string | Schema.Types.ObjectId,
) => {
    if (type === 'task') {
        const result = await NotificationQuery.create({
            task: typeId,
            message,
            type: action,
            employees: initEmployeeId ? initEmployeeId : null,
        });
    } else {
        const result = await NotificationQuery.create({
            event: typeId,
            message,
            type: action,
            employees: [initEmployeeId],
        });
    }
};
