import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const mongodbConfig = {
    connectionString: process.env.MONGODB_CONNECTION_STRING as string,
};

export default mongodbConfig;
