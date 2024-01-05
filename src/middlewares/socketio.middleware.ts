import { Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';

const socketIOGlobal = (socket: Server) => {
    return (req: Request, res: Response, next: NextFunction) => {
        socket.on('connection', (socket) => {
            res.locals.socket = socket;
        });
        socket.on('disconnect', () => {
            console.log('Socket is disconnected');
        });
        return next();
    };
};

export default socketIOGlobal;
