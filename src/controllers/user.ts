import { default as User } from "../models/user";
import express from "express";
import initCRUD from "../utils/crudFactory";
import { createResponse, createError } from "../utils/helper";
import { Request, Response, NextFunction } from "express";
// import rp from "request-promise";

// import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } from "../utils/secrets";
// import logger from "../utils/logger";
// import jwt from "jsonwebtoken";
// import { checkToken, isSameUser } from "../middlewares/auth";

const router = express.Router({mergeParams: true});
const [create, get, update, all, all_query] = initCRUD(User);
// const register = (req: Request, res: Response, next: NextFunction) => {
//     req.body.privelege_level = "Unapproved_User";
//     req.body.displayOnWebsite = false;
//     create(req, res, next, true)
//     .then((_) => {
//         res.json(createResponse("Request sent to the Administrator", _));
//     })
//     .catch((err: any) => {
//         res.json(createResponse("Error while registering", err));
//     });
// };

// const getUnapproved = (req: Request, res: Response, next: NextFunction) => {
//     const my_query = {privelege_level: "Unapproved_User"};
//     req.body.query = my_query;
//     all_query(req, res, next, true)
//     .then((data: any) => {
//         return res.json(createResponse("Results", data));
//     })
//     .catch((err) => {
//         return res.json(createResponse("Error", err));
//     });
// };

// const login = (req: Request, res: Response, next: NextFunction) => {

//     const code_from_github: string = req.body.code;

//     const get_access_token_options = {
//         method: 'POST',
//         uri: 'https://github.com/login/oauth/access_token',
//         body: {
//             'client_id': GITHUB_CLIENT_ID,
//             'client_secret': GITHUB_CLIENT_SECRET,
//             'code': code_from_github
//         },
//         json: true,
//         headers: {
//             'Accept': 'application/json'
//         }
//     };

//     rp(get_access_token_options)
//         .then((parsedBody) => {
//             const access_token: string = parsedBody['access_token'] || '';
//             if (access_token == '') {
//                 logger.warn('Access Token not found');
//                 throw (createError(401,"Unauthorized",`Invalid Code : ${code_from_github}`));
//             }
//             return access_token;
//         })
//         .then(access_token => {
//             const get_details = {
//                 method: 'GET',
//                 uri: 'https://api.github.com/user',
//                 json: true,
//                 headers:{
//                     'Accept': 'application/json',
//                     'Authorization': `token ${access_token}`,
//                     'User-Agent': 'Club Dashboard'
//                 }
//             };
//             return rp(get_details);
//         })
//         .then(user_details => {
//             if (!user_details['email']) {
//                 logger.warn('User email not found');
//                 throw (createError(401, "Unauthorized", "No email found"));
//             }
//             return user_details;
//         })
//         .then(user_details => {
//             return Promise.all([
//                 User.findOne({'email': user_details['email']}), user_details]);
//         })
//         .then(([userInstance, user_details]) => {
//             if (!userInstance) {
//                 const schema_user_details = {
//                     'email': user_details['email'],
//                     'name': user_details['name'],
//                     'links': {
//                         'avatar': user_details['avatar_url'],
//                         'github': user_details['html_url']
//                     }
//                 };
//                 return User.create(schema_user_details);
//             }
//             else
//                 return userInstance;
//         })
//         .then((createdUser) => {
//             const jwt_payload = {
//                 '_id': createdUser._id,
//             };
//             const token: string = jwt.sign(jwt_payload, JWT_SECRET, {expiresIn:'7d'});
//             const resp_data = {
//                 'authToken': token,
//                 'email': createdUser.email,
//                 'name': createdUser.name,
//                 'privelege_level': createdUser.privelege_level,
//                 '_id' : createdUser._id
//             };
//             res.send(createResponse('Login successful', resp_data));
//         })
//         .catch(function (err) {
//             next(err);
//         });
// };

// router.post('/',create);
// router.get('/', checkToken, all);
// router.get('/:id', checkToken, get);
// router.put('/:id', checkToken, isSameUser, update);
// router.post('/github_login', login);
// router.post('/register', register);
// router.get('/unapproved', getUnapproved);

const foo = (req: Request, res: Response, next: NextFunction) => {
    return all(req, res, next);
};

router.get('/getAll/', all);
router.get('/query/', all_query);

export default router;