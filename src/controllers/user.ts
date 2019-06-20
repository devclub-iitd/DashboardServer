import express from "express";
import User from "../models/user";
import initCRUD from "../utils/crudFactory";
// import rp from "request-promise";

// import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } from "../utils/secrets";
// import logger from "../utils/logger";
// import jwt from "jsonwebtoken";
// import { checkToken, isSameUser } from "../middlewares/auth";

const router = express.Router({ mergeParams: true });
const [,,, all, allQuery] = initCRUD(User);

router.get('/getAll/', all);
router.get('/query/', allQuery);

export default router;