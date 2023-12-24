import { Router } from 'express';
import * as Controller from './auth.controller';

export const AuthRouter = Router();

AuthRouter.post('/sign-in', Controller.signIn);
