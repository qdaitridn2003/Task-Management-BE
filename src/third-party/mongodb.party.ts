import mongoose from 'mongoose';
import { MongoDBConfig } from '../configs';

const mongodbParty = {
    connectionHandler: () => {
        mongoose
            .connect(MongoDBConfig.connectionString as string)
            .then(() => {
                console.log('Kết nối với MongoDB đã được thiết lập');
            })
            .catch((error) => {
                console.log('MongoDB Error:', error);
                console.log('Kết nối với MongoDB đã có lỗi xảy ra');
            });
    },
};

export default mongodbParty;
