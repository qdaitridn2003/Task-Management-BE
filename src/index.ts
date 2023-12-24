import 'express-error-handler';
import Express from 'express';
import Http from 'http';
import Cors from 'cors';
import Compression from 'compression';
import Helmet from 'helmet';
import * as SwaggerUI from 'swagger-ui-express';
import { Server as SocketIOServer } from 'socket.io';

import { ApiConfig } from './configs';
import ApiController from './controllers';
import * as SwaggerConfig from './configs/swagger.config.json';
import { MongodbParty } from './third-party';
import { ErrorHandler, ResponseHandler, SocketIOGlobal } from './middlewares';

const App = Express();
const Server = Http.createServer(App);
const SocketIO = new SocketIOServer(Server);

/***************<Using Library Middlewares>****************/
App.use(Cors({ origin: '*' }));
App.use(
    Compression({ level: ApiConfig.compressionLevel, threshold: ApiConfig.compressionThreshold }),
);
App.use(Helmet());
App.use(Express.json());
App.use(Express.urlencoded({ extended: false }));

/***************<Using Custom Middlewares>****************/
App.use(SocketIOGlobal(SocketIO));

/****************<Main Routing Endpoint>******************/
App.use('/api', ApiController);
App.use('/api-doc', SwaggerUI.serve, SwaggerUI.setup(SwaggerConfig));

/***************<Using Custom Middlewares>****************/
App.use(ResponseHandler);
App.use(ErrorHandler);

MongodbParty.connectionHandler();

Server.listen(ApiConfig.port, () => {
    console.log(`Máy chủ đang hoạt động tại cổng ${ApiConfig.port}`);
});
