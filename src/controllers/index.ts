import { Router } from 'express';
import { AuthRouter } from './auth';

const ApiController = Router();

ApiController.use('/auth', AuthRouter);

export default ApiController;
