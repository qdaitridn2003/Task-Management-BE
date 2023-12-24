import * as NodeMailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { NodeMailerConfig } from '../../configs';
import { Html } from '../../common';

const nodeMailerTransporter = NodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    pool: true,
    maxConnections: Infinity,
    maxMessages: Infinity,
    secure: true,
    auth: {
        user: NodeMailerConfig.username,
        pass: NodeMailerConfig.password,
    },
});

const nodeMailerHandler = {
    sendForConfirmEmail: (email: string, otp: string) => {
        const mailerOptions: Mail.Options = {
            from: NodeMailerConfig.username,
            to: email,
            subject: 'Team cook confirm your email address',
            html: Html.confirmEmail(otp),
        };
        nodeMailerTransporter.sendMail(mailerOptions, (error, info) => {
            if (error) console.log('Nodemailer Error:', error);
            if (info) console.log('Nodemailer Info: ', info);
        });
    },
    sendForResetPassword: (email: string, otp: string) => {
        const mailerOptions: Mail.Options = {
            from: NodeMailerConfig.username,
            to: email,
            subject: 'Team cook confirm your resetting password',
            html: Html.resetPassword(otp),
        };
        nodeMailerTransporter.sendMail(mailerOptions, (error, info) => {
            if (error) console.log('Nodemailer Error:', error);
            if (info) console.log('Nodemailer Info:', info);
        });
    },
};

export default nodeMailerHandler;
