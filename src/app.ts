import express from 'express';
import {Request, Response, NextFunction} from 'express';
import helmet from 'helmet';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import lusca from 'lusca';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import {MONGODB_URI} from './utils/secrets';
import createDummyData from './utils/dummy';
import logRequest from './middlewares/logRequest';

import userRouter from './controllers/user';
import projectRouter from './controllers/project';
import eventRouter from './controllers/event';
import itemRouter from './controllers/todo';
import resourceRouter from './controllers/resource';

import init from './utils/init';
import {ErrorWStatus} from './utils/helper';

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl: string = MONGODB_URI;
mongoose.Promise = bluebird;
mongoose
  .connect(mongoUrl, {useNewUrlParser: true})
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch(err => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    );
    throw new Error('MongoDB Connection Error');
  });

// Express configuration
app.set('port', process.env.PORT);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

const corsOptions = {
  origin: true, // Allow all origin ending in devclub.com
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(helmet());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 31557600000}));
app.use(logRequest);

const apiRouter = express.Router();

apiRouter.use('/resource', resourceRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/project', projectRouter);
apiRouter.use('/event', eventRouter);
apiRouter.use('/item', itemRouter);

// test route to make sure everything is working
apiRouter.get('/', (_, res) => {
  res.json({
    data: null,
    message: 'Hooray! Welcome to dashboard api!',
  });
});
apiRouter.get('/dummy', (_, res) => {
  createDummyData().then(() => {
    return res.json({message: 'All created!'});
  });
});

app.use('/api', apiRouter);
app.use('/healthz', (_0: Request, res: Response, _1: NextFunction) => {
  res.send('Ok, Healthy!');
});

app.use((err: Error, _0: Request, res: Response, _1: NextFunction) => {
  res.status((err as ErrorWStatus).status);
  const e = new Error();
  e.message = err.message;
  e.name = err.name;
  res.send(e);
});

init();

export default app;
