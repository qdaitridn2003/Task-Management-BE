import { Router } from 'express';
import { AuthRouter } from './auth';
import { EmployeeRouter } from './employee';

const ApiController = Router();

ApiController.use('/auth', AuthRouter);
ApiController.use('/employee', EmployeeRouter);

export default ApiController;
