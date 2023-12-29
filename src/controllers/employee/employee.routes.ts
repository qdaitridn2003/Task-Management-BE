import { Router } from 'express';
import * as Controller from './employee.controller';

export const EmployeeRouter = Router();

EmployeeRouter.put('/register-employee-profile', Controller.registerEmployeeProfile);
