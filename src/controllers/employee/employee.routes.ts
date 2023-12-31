import { Router } from 'express';
import * as Controller from './employee.controller';
import { Authorization, ImageHandler } from '../../middlewares';

export const EmployeeRouter = Router();

EmployeeRouter.put('/register-employee-profile', Controller.registerEmployeeProfile);
EmployeeRouter.put('/update-employee-profile', Authorization, Controller.updateEmployeeProfile);
EmployeeRouter.get('/get-employee-profile', Authorization, Controller.getEmployeeProfile);
EmployeeRouter.get('/get-employee-profile/:_id', Authorization, Controller.getEmployeeProfile);
EmployeeRouter.get('/get-employee-list', Authorization, Controller.getEmployeeList);
EmployeeRouter.post(
    '/upload-avatar-employee',
    Authorization,
    ImageHandler.single('avatar'),
    Controller.uploadEmployeeAvatar,
);
EmployeeRouter.put('/edit-employee-role/:_id', Authorization, Controller.editEmployeeRole);
