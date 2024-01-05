import { Router } from 'express';

import * as Controller from './event.controller';
import { Authorization } from '../../middlewares';

export const EventRouter = Router();

EventRouter.post('/create-event', Authorization, Controller.createEvent);
EventRouter.put('/update-event/:_id', Authorization, Controller.updateEvent);
EventRouter.delete('/delete-event/:_id', Authorization, Controller.deleteEvent);
EventRouter.get('/get-detail-event/:_id', Authorization, Controller.getDetailEvent);
EventRouter.get('/get-list-event', Authorization, Controller.getListEvent);
