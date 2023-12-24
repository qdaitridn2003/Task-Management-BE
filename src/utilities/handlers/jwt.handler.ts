import Jwt from 'jsonwebtoken';
import { ApiConfig } from '../../configs';

type JsonWebTokenPayloadType = string | object | Buffer;
type JsonWebTokenSignatureType = 'access' | 'otp';

const jwtHandler = {
    init: (payload: JsonWebTokenPayloadType, signature: JsonWebTokenSignatureType) => {
        return new Promise<string>((resolve, reject) => {
            Jwt.sign(
                payload,
                signature === 'access'
                    ? ApiConfig.accessTokenKey
                    : signature === 'otp'
                      ? ApiConfig.otpSecretTokenKey
                      : '',
                {
                    algorithm: 'HS256',
                },
                (error, token) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(token as string);
                    }
                },
            );
        });
    },

    verify: (token: string, signature: JsonWebTokenPayloadType) => {
        return new Promise<Jwt.JwtPayload>((resolve, reject) => {
            Jwt.verify(
                token,
                signature === 'access'
                    ? ApiConfig.accessTokenKey
                    : signature === 'otp'
                      ? ApiConfig.otpSecretTokenKey
                      : '',
                (error, decode) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(decode as Jwt.JwtPayload);
                    }
                },
            );
        });
    },

    decode: (token: string) => {
        return Jwt.decode(token);
    },
};

export default jwtHandler;
