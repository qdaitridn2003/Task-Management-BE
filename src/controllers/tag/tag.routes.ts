import { Router } from 'express';
import * as Controller from './tag.controller';
import { Authorization, CheckRole } from '../../middlewares';

export const TagRouter = Router();

TagRouter.post('/create-tag', Authorization, CheckRole, Controller.createTag);
TagRouter.put('/update-tag/:_id', Authorization, CheckRole, Controller.updateTag);
TagRouter.delete('/delete-tag/:_id', Authorization, CheckRole, Controller.deleteTag);
TagRouter.get('/get-tag-list', Authorization, CheckRole, Controller.getTagList);
