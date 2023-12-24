import { Request } from 'express';
import createHttpError from 'http-errors';
import * as Multer from 'multer';

const imageHandler = Multer.default({
    storage: Multer.memoryStorage(),
    fileFilter: (req: Request, file: Express.Multer.File, callBack: Multer.FileFilterCallback) => {
        const tailImageFile = file.mimetype.split('/')[1];
        if (
            tailImageFile === 'jpg' ||
            tailImageFile === 'jpeg' ||
            tailImageFile === 'png' ||
            tailImageFile === 'svg'
        ) {
            callBack(null, true);
        } else {
            callBack(createHttpError(400, 'Đuôi ảnh phải có định dạng (jpg, jpeg, png, hoặc svg)'));
        }
    },
    limits: {
        fieldSize: 1024 * 10, //0.1MB 100KB
    },
});

export default imageHandler;
