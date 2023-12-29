import { Router } from 'express';
import * as Controller from './employee.controller';
import { Authorization } from '../../middlewares';

export const EmployeeRouter = Router();

EmployeeRouter.put('/register-employee-profile', Controller.registerEmployeeProfile);
EmployeeRouter.get('/get-employee-profile', Authorization, Controller.getEmployeeProfile);
EmployeeRouter.get('/get-employee-profile/:_id', Authorization, Controller.getEmployeeProfile);
