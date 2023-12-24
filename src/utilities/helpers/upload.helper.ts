import { UploadImage } from '../../common';

export const uploadPathHelper = (type: number) => {
    let path;
    path = type === UploadImage.avatar ? 'avatar' : type === UploadImage.image ? 'image' : '';
    return path;
};
