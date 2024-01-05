import { Router } from 'express';

import * as Controller from './task.controller';
import { Authorization } from '../../middlewares';

export const TaskRouter = Router();

TaskRouter.post('/create-task', Authorization, Controller.createTask);
TaskRouter.put('/update-task/:_id', Authorization, Controller.updateTask);
TaskRouter.delete('/delete-task/:_id', Authorization, Controller.deleteTask);
TaskRouter.get('/get-detail-task/:_id', Authorization, Controller.getDetailTask);
TaskRouter.get('/get-list-task', Authorization, Controller.getListTask);
