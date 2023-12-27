import Speakeasy from 'speakeasy';
import jwtHandler from './jwt.handler';

const otpHandler = {
    initSecret: async (data: string | Buffer | object) => {
        const secretKey = await jwtHandler.init(data, 'otp');
        return secretKey;
    },

    initOtp: (secretKey: string) => {
        const otp = Speakeasy.totp({
            secret: secretKey,
            encoding: 'base32',
            algorithm: 'sha256',
            step: 60,
        });
        return otp;
    },

    verify: (secretKey: string, otp: string) => {
        const decodeSecretKey = jwtHandler.decode(secretKey);
        let result: { check: boolean; auth_id: string; type: number } = {
            check: false,
            auth_id: decodeSecretKey.auth_id,
            type: decodeSecretKey.type,
        };
        const resultVerify = Speakeasy.totp.verifyDelta({
            secret: secretKey,
            token: otp,
            encoding: 'base32',
            algorithm: 'sha256',
            step: 60,
            window: 5,
            //window: 2, step: 60 (60 seconds) => window * step = expired otp time
        });
        if (resultVerify?.delta === undefined) result.check = false;
        else result.check = true;
        return result;
    },
};

export default otpHandler;
