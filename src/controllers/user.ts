import express from 'express';
import User from '../models/user';
import initCRUD from '../utils/crudFactory';
// import rp from "request-promise";

// import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } from "../utils/secrets";
import {JWT_SECRET, ADMIN_ENTRY} from '../utils/secrets';
import {ADMIN_ID} from '../utils/init';
//import { ADMIN_SECRET } from "../utils/secrets";
// import logger from "../utils/logger";
import jwt, {Secret} from 'jsonwebtoken';
import {createResponse, createError} from '../utils/helper';
import {Request, Response, NextFunction} from 'express';
// import { checkToken, isSameUser } from "../middlewares/auth";
import bcrypt from 'bcrypt';
import {
  isAdmin,
  checkAdmin,
  checkToken,
  hashPassword,
} from '../middlewares/auth';

const router = express.Router({mergeParams: true});
const {create, update, all, all_query, delete_query} = initCRUD(User);

const register = (req: Request, res: Response, next: NextFunction) => {
  req.body.privelege_level = 'Unapproved_User';
  req.body.display_on_website = false;
  res.locals.no_send = true;
  create(req, res, next)
    .then(_ => {
      res.json(createResponse('Request sent to the Administrator', _));
    })
    .catch(err => {
      res.json(createResponse('Error while registering', err));
    });
};

const getUnapproved = (req: Request, res: Response, next: NextFunction) => {
  const my_query = {privelege_level: 'Unapproved_User'};
  req.body.query = my_query;
  res.locals.no_send = true;
  all_query(req, res, next)
    .then(data => {
      return res.json(createResponse('Results', data));
    })
    .catch(err => {
      return res.json(createResponse('Error', err));
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) {
    next(createError(400, 'Bad request', 'Received request with no body'));
  }

  const my_password = req.body.password;
  const my_entryNumber = req.body.entry_no;

  // Retrieve the username from the database
  User.findOne({entry_no: my_entryNumber})
    .then(userDoc => {
      if (!userDoc) {
        return next(
          createError(
            404,
            'Not found',
            `User with entryNumber ${my_entryNumber} does not exist`
          )
        );
      } else {
        const userObject = userDoc.toObject();

        // Get the hashed password
        const passwordHash = userObject.password;

        // Just.. No.
        //console.log(userPassword);
        //console.log(my_password);

        bcrypt.compare(my_password, passwordHash, (err, passMatch) => {
          if (err || !passMatch) {
            return next(
              createError(
                400,
                'Incorrect login',
                `User with username ${my_entryNumber} does not exist or incorrect password entered`
              )
            );
          } else if (userObject.privelege_level == 'Unapproved_User') {
            return next(
              createError(400, 'Unapproved user', 'You are not approved')
            );
          }

          const payload = {_id: userObject._id};
          const options = {expiresIn: '2d', issuer: 'devclub-dashboard'};
          const secret = JWT_SECRET as Secret;

          if (secret === undefined) {
            return next(
              createError(
                500,
                'Incorrect configuration',
                'Token secret key not initialized'
              )
            );
          }

          const token = jwt.sign(payload, secret, options);

          const result = {
            token: token,
            status: 200,
            result: userDoc,
          };

          res.status(200).send(result);
        });
      }
    })
    .catch(err => {
      return next(err);
    });
};

// Authenticate user before this
const changePassword = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.logged_user_id == undefined) {
    return next(createError(500, 'Internal Error', 'User not authenticated'));
  }

  if (req.body.newPassword == undefined) {
    return next(
      createError(
        400,
        'New password not given',
        'Expected newPassword in body of request'
      )
    );
  }

  hashPassword(req.body.newPassword)
    .then(passwordHash => {
      res.locals.no_send = true;
      req.params.id = res.locals.logged_user_id;
      req.body = {
        password: passwordHash,
        updated_by: res.locals.logged_user_id,
      };

      console.log(passwordHash);
      update(req, res, next)
        .then(_ => res.json(createResponse('Password updated', '')))
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

const pswd_hash = (req: Request, _: Response, next: NextFunction) => {
  hashPassword(req.body.password)
    .then(passwordHash => {
      req.body.password = passwordHash;
      next();
    })
    .catch(err => console.log(err));
};

const reject_all = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.logged_user_id == undefined) {
    return next(
      createError(500, 'User not authenticated', 'User id not found')
    );
  }

  req.body.query = {privelege_level: 'Unapproved_User'};
  res.locals.no_send = true;
  delete_query(req, res, next)
    .then(() => res.send('All unapproved users rejected successfully'))
    .catch(err => next(err));
};

const update_record = (req: Request, res: Response, next: NextFunction) => {
  req.body.updated_by = res.locals.logged_user_id;
  if (!res.locals.isAdmin) {
    req.body.privelege_level = undefined;
  }

  // Prevent devclub user's entry and privilege from change
  if (req.params.id == ADMIN_ID) {
    delete req.body.entry_no;
    delete req.body.privelege_level;
  }

  update(req, res, next);
};

const delete_record = (req: Request, res: Response, next: NextFunction) => {
  res.locals.no_send = true;
  req.body.query = {entry_no: {$ne: ADMIN_ENTRY}};
  delete_query(req, res, next)
    .then(_ => {
      res.json(createResponse('Records deleted', ''));
    })
    .catch(err => {
      res.json(createError(500, 'Error while deleting', err));
    });
};

// Takes in req.body.id as the id of the doc to be deleted
const delete_user = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.id == undefined) {
    return next(
      createError(400, 'User id missing', 'Please specify id in body')
    );
  }

  req.body.query = {_id: req.body.id, entry_no: {$ne: ADMIN_ENTRY}};
  delete_query(req, res, next);
};

// Get all docs with display_on_website true
const all_website = (req: Request, res: Response, next: NextFunction) => {
  req.body.query = {display_on_website: true};
  all_query(req, res, next);
};

/*
 * Must be called after a call to checkAdmin. Relies on property res.locals.checkAdmin
 * to be present for admin access.
 */
const isSameUserOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.isAdmin === undefined) {
    return next(
      createError(500, 'Internal error', 'res.locals.isAdmin property not set')
    );
  }

  if (res.locals.isAdmin) return next();
  else if (res.locals.logged_user_id == req.params.id) return next();
  else {
    next(
      createError(
        401,
        'Unauthorized',
        'User is unauthorized for this endpoint.'
      )
    );
  }
};

router.post(
  '/testAdmin/',
  isAdmin,
  (_0: Request, res: Response, _2: NextFunction) => {
    res.send('You are a admin, Harry');
  }
);
router.post(
  '/testAdminSelf/:id',
  checkAdmin,
  isSameUserOrAdmin,
  (_0: Request, res: Response, _2: NextFunction) => {
    res.send('You were looking for yourself, Harry. Or you are an admin idk');
  }
);

router.post('/deleteAll/', isAdmin, delete_record);
router.post('/delete', isAdmin, delete_user);
router.post('/', create);
router.put('/:id', checkAdmin, isSameUserOrAdmin, update_record);
router.post('/login', login);
router.post('/changePassword', checkToken, changePassword);
router.post('/rejectAll', isAdmin, reject_all);
router.get('/getAll/', all_website);
router.get('/getAllDB', checkToken, all);
router.post('/query/', all_query);
router.post('/register', pswd_hash, register);
router.get('/unapproved', getUnapproved);

export default router;
