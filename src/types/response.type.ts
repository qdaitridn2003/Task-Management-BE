import { JsonWebTokenError } from 'jsonwebtoken';
import { HttpError } from 'http-errors';

export type ErrorPayloadType = HttpError | JsonWebTokenError;
export type SuccessPayloadType = {
    statusCode?: number;
    data?: object | object[];
    message?: string;
};

export type ResponsePayloadType = SuccessPayloadType | ErrorPayloadType;
