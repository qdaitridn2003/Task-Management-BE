import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const nodeMailerConfig = {
    username: process.env.NODE_MAILER_USERNAME as string,
    password: process.env.NODE_MAILER_PASSWORD as string,
};

export default nodeMailerConfig;
