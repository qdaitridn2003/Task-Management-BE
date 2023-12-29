import { Router } from 'express';
import * as Controller from './auth.controller';
import { Authorization } from '../../middlewares';

export const AuthRouter = Router();

AuthRouter.post('/sign-in', Controller.signIn);
AuthRouter.post('/sign-up', Controller.signUp);
AuthRouter.post('/send-otp/confirm-email', Controller.sendOtp);
AuthRouter.post('/forgot-password', Controller.forgotPassword);
AuthRouter.post('/resend-otp/confirm-email', Controller.resendOtpForConfirmEmail);
AuthRouter.post('/resend-otp/reset-password', Controller.resendOtpForConfirmResetPass);
AuthRouter.post('/verify-otp', Controller.verifyOtpForResetPass);
AuthRouter.put('/reset-password', Controller.resetPassword);
AuthRouter.put('/sign-in', Controller.signIn);
AuthRouter.put('/change-password', Authorization, Controller.changePassword);
