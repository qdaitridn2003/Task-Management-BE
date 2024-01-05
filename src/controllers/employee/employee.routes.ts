import { Router } from 'express';
import * as Controller from './employee.controller';
import { Authorization, CheckRole, ImageHandler } from '../../middlewares';

export const EmployeeRouter = Router();

EmployeeRouter.put('/register-employee-profile', Controller.registerEmployeeProfile);
EmployeeRouter.put('/update-employee-profile', Authorization, Controller.updateEmployeeProfile);
EmployeeRouter.get('/get-employee-profile', Authorization, Controller.getEmployeeProfile);
EmployeeRouter.get('/get-employee-profile/:_id', Authorization, Controller.getEmployeeProfile);
EmployeeRouter.get('/get-employee-list', Authorization, CheckRole, Controller.getEmployeeList);
EmployeeRouter.put(
    '/edit-employee-role/:_id',
    Authorization,
    CheckRole,
    Controller.editEmployeeRole,
);
EmployeeRouter.post('/upload-image', ImageHandler.single('avatar'), Controller.uploadImage);
