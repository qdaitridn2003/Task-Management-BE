import { Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';

const socketIOGlobal = (socket: Server) => {
    return (req: Request, res: Response, next: NextFunction) => {
        res.locals.socket = socket;
        return next();
    };
};

export default socketIOGlobal;
