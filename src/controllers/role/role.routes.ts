import { Router } from 'express';
import { Authorization, CheckRole } from '../../middlewares';
import * as Controller from './role.controller';
import checkRole from '../../middlewares/check_role.middleware';

export const RoleRouter = Router();

RoleRouter.post('/create-role', Authorization, CheckRole, Controller.createRole);
RoleRouter.put('/update-role/:_id', Authorization, checkRole, Controller.updateRole);
RoleRouter.delete('/delete-role/:_id', Authorization, checkRole, Controller.deleteRole);
RoleRouter.get('/get-list-role', Authorization, checkRole, Controller.getListRole);
