import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import bluebird from "bluebird";
import { MONGODB_URI } from "./utils/secrets";
import { createDummyData } from "./utils/dummy";
import logRequest from "./middlewares/logRequest";

import userRouter from "./controllers/user";
import projectRouter from "./controllers/project";
import eventRouter from "./controllers/event";
import itemRouter from "./controllers/item";
import resourceRouter from "./controllers/resource";

import { Request, Response, NextFunction } from "express";


// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl: string = MONGODB_URI;
mongoose.Promise = bluebird;
mongoose.connect(mongoUrl, {useNewUrlParser: true}).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);
app.use(logRequest);


let apiRouter = express.Router();


apiRouter.use('/resource', resourceRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/project', projectRouter);
apiRouter.use('/event', eventRouter);
apiRouter.use('/item', itemRouter);

// test route to make sure everything is working
apiRouter.get('/', function(_, res) {
    res.json({
      "data": null,
      "message": "Hooray! Welcome to dashboard api!"
  });
});
apiRouter.get('/dummy', function(_, res) {
  createDummyData()
  .then((_) => {
    return res.json({message: "All created!"});
  });
});



app.use('/api', apiRouter);

app.use(function(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500);
  let e = new Error();
  e.message = err.message;
  e.name = err.name;
  res.send(e);
});


export default app;
