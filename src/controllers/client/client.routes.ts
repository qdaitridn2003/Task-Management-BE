import { Router } from 'express';
import * as Controller from './client.controller';
import { Authorization, CheckRole, ImageHandler } from '../../middlewares';

export const ClientRouter = Router();

ClientRouter.post('/create-info-client', Authorization, CheckRole, Controller.createInfoClient);
ClientRouter.put('/update-info-client/:_id', Authorization, CheckRole, Controller.updateInfoClient);
ClientRouter.put(
    '/update-client-status/:_id',
    Authorization,
    CheckRole,
    Controller.updateClientStatus,
);
ClientRouter.delete('/delete-client/:_id', Authorization, CheckRole, Controller.deleteClient);
ClientRouter.get('/get-client-detail/:_id', Authorization, CheckRole, Controller.getClientDetail);
ClientRouter.get('/get-client-list', Authorization, CheckRole, Controller.getListClient);
ClientRouter.post('/upload-image', ImageHandler.single('avatar'), Controller.uploadImage);
