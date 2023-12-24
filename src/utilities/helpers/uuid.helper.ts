import { v4 as uuidV4 } from 'uuid';

export const uuidHelper = () => {
    const uuid = uuidV4();
    return uuid.substring(0, 8);
};
