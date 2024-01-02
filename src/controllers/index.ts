import { Router } from 'express';
import { AuthRouter } from './auth';
import { EmployeeRouter } from './employee';
import { ClientRouter } from './client';
import { TagRouter } from './tag';

const ApiController = Router();

ApiController.use('/auth', AuthRouter);
ApiController.use('/employee', EmployeeRouter);
ApiController.use('/client', ClientRouter);
ApiController.use('/tag', TagRouter);

export default ApiController;
