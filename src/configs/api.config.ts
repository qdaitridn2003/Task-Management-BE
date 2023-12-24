import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const apiConfig = {
    port: process.env.PORT as string,
    accessTokenKey: process.env.ACCESS_TOKEN_KEY as string,
    otpSecretTokenKey: process.env.OTP_SECRET_TOKEN_KEY as string,
    compressionLevel: parseInt(process.env.COMPRESSION_LEVEL as string),
    compressionThreshold: process.env.COMPRESSION_THRESHOLD as string,
};

export default apiConfig;
