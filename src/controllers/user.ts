import express from "express";
import User from "../models/user";
import initCRUD from "../utils/crudFactory";
// import rp from "request-promise";

// import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } from "../utils/secrets";
import { JWT_SECRET } from "../utils/secrets";
import { ADMIN_SECRET } from "../utils/secrets";
// import logger from "../utils/logger";
import jwt, { Secret } from "jsonwebtoken";
import { createResponse, createError } from "../utils/helper";
import { Request, Response, NextFunction } from "express";
// import { checkToken, isSameUser } from "../middlewares/auth";
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const router = express.Router({mergeParams: true});
const [create, , update, all, all_query, all_delete] = initCRUD(User);

const register = (req: Request, res: Response, next: NextFunction) => {
    req.body.privelege_level = "Unapproved_User";
    req.body.display_on_website = false;
    res.locals.no_send = true;
    create(req, res, next)
    .then((_: any) => {
        res.json(createResponse("Request sent to the Administrator", _));
    })
    .catch((err: any) => {
        res.json(createResponse("Error while registering", err));
    });
};

const getUnapproved = (req: Request, res: Response, next: NextFunction) => {
    const my_query = {privelege_level: "Unapproved_User"};
    req.body.query = my_query;
    res.locals.no_send = true;
    all_query(req, res, next)
    .then((data: any) => {
        return res.json(createResponse("Results", data));
    })
    .catch((err) => {
        return res.json(createResponse("Error", err));
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
        next(createError(400, "Bad request", "Received request with no body"));
    }

    const my_password = req.body.password;
    const my_entryNumber = req.body.entry_no;

    // Retrieve the username from the database
    User.findOne({entry_no: my_entryNumber}).then((userDoc) => {
        if (!userDoc) {
            next(createError(404, "Not found", `User with entryNumber ${my_entryNumber} does not exist`));
        } else {
            const userObject = userDoc.toObject();

            // Get the password
            const userPassword = userObject.password;

            if (userObject.privelege_level == "Unapproved_User") {
                next(createError(500, "You are not yet approved", ``));
            }

            console.log(userPassword);
            console.log(my_password);
            bcrypt.compare(my_password, userPassword, function(err: any, _: any) {
                if (err) {
                    next(createError(400, "Incorrect login", `User with username ${my_entryNumber} does not exist or incorrect password entered`));
                }
                const payload = {user: userObject.entry_no};
                const options = {expiresIn: "2d", issuer: "devclub-dashboard"};
                const secret = JWT_SECRET as Secret;

                if (secret === undefined) {
                    next(createError(500, "Incorrect configuration", `Token secret key not initialized`));
                }

                const token = jwt.sign(payload, secret, options);

                const result = {
                    token: token,
                    status: 200,
                    result: userObject
                };

                res.status(200).send(result);
                return result;
            });
        }
    })
    .catch((err) => {
        next(err);
    });
};

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

// const foo = (req: Request, res: Response, next: NextFunction) => {
//     return all(req, res, next);
// };

const pswd_hash = (req: Request, _: Response, next: NextFunction) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err: any, salt: any) {
        if (err) console.log(err);
        // hash the password using our new salt
        bcrypt.hash(req.body.password, salt, function (err: any, hash: any) {
            if (err) console.log(err);
            req.body.password = hash;
            next();
        });
    });
};

const approve_user = (req: Request, res: Response, next: NextFunction) => {
    const my_query = {entry_no: req.body.entry_no};
    req.body.query = my_query;
    res.locals.no_send = true;
    all_query(req, res, next)
    .then((data: any) => {
        req.body = {};
        req.body.privelege_level = "Approved_User";
        req.params.id = data[0]["_id"];
        update(req, res, next)
        .then((fresh_data: any) => {
            res.json(createResponse("Approved User", fresh_data));
        })
        .catch((err: any) => {
            res.json(createResponse("Error while registering", err));
        });
    })
    .catch((err: any) => {
        res.json(createResponse("Error while registering", err));
    });
};

const update_record = (req: Request, res: Response, next: NextFunction) => {
    const my_query = {entry_no: req.params.id};
    console.log(my_query);

    req.body.query = my_query;
    res.locals.no_send = true;
    all_query(req, res, next)
    .then((data: any) => {
        req.body.query = {};
        req.params.id = data[0]["_id"];
        update(req, res, next)
        .then((fresh_data: any) => {
            res.json(createResponse("Record updated", fresh_data));
        })
        .catch((err: any) => {
            res.json(createResponse("Error while registering", err));
        });
    })
    .catch((err: any) => {
        res.json(createResponse("Error while registering", err));
    });
};

const chk_pswd = (req: Request, res: Response, next: NextFunction) => {
    bcrypt.compare(ADMIN_SECRET, req.body.password, function(err: any, _: any) {
        if (err) {
            console.log(err)
            res.json(createResponse("You are not authorised to perform this action. Your details have been reported", ""));
        };
        next();
    });
};

const delete_record = (req: Request, res: Response, next: NextFunction) => {
    res.locals.no_send = true;
    all_delete(req, res, next)
    .then((_: any) => {
        res.json(createResponse("Records deleted", ""));
    })
    .catch((err: any) => {
        res.json(createResponse("Error while deleting", err));
    });
};

router.post('/deleteAll/', chk_pswd, delete_record);
router.post('/', create);
router.put('/:id', update_record);
router.post("/login", login);
router.post("/approve", approve_user); 		// Add a middleware to checkAdmin
router.get("/getAll/", all);
router.get("/query/", all_query);
router.post("/register", pswd_hash, register);
router.get("/unapproved", getUnapproved);

export default router;