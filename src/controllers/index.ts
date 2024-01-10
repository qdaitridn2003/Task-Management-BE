import { Router } from 'express';
import { AuthRouter } from './auth';
import { EmployeeRouter } from './employee';
import { ClientRouter } from './client';
import { TagRouter } from './tag';
import { EventRouter } from './event';
import { TaskRouter } from './task';
import { RoleRouter } from './role';
import { NotificationRouter } from './notification';

const ApiController = Router();

ApiController.use('/auth', AuthRouter);
ApiController.use('/employee', EmployeeRouter);
ApiController.use('/client', ClientRouter);
ApiController.use('/tag', TagRouter);
ApiController.use('/event', EventRouter);
ApiController.use('/task', TaskRouter);
ApiController.use('/role', RoleRouter);
ApiController.use('/notification', NotificationRouter);

export default ApiController;
