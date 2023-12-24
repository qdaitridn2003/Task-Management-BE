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
        const resultVerify = Speakeasy.totp.verifyDelta({
            secret: secretKey,
            token: otp,
            encoding: 'base32',
            algorithm: 'sha256',
            step: 60,
            window: 5,
            //window: 2, step: 60 (60 seconds) => window * step = expired otp time
        });
        if (resultVerify?.delta === undefined) return false;
        else return true;
    },
};

export default otpHandler;
