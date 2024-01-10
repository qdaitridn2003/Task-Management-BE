import { Router } from 'express';

import * as Controller from './notification.controller';
import { Authorization } from '../../middlewares';

export const NotificationRouter = Router();

NotificationRouter.get(
    '/get-detail-notification/:_id',
    Authorization,
    Controller.getDetailNotification,
);

NotificationRouter.get('/get-list-notification', Authorization, Controller.getListNotification);
