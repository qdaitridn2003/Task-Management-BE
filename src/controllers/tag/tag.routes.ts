import { Router } from 'express';
import * as Controller from './tag.controller';
import { Authorization, CheckRole } from '../../middlewares';

export const TagRouter = Router();

TagRouter.post('/create-tag', Authorization, Controller.createTag);
TagRouter.put('/update-tag/:_id', Authorization, Controller.updateTag);
TagRouter.delete('/delete-tag/:_id', Authorization, Controller.deleteTag);
TagRouter.get('/get-tag-list', Authorization, Controller.getTagList);
