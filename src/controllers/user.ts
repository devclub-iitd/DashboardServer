import express from 'express';
import User from '../models/user';
import initCRUD from '../utils/crudFactory';

import {ADMIN_ENTRY} from '../utils/secrets';
import {ADMIN_ID} from '../utils/init';
import {createResponse, createError} from '../utils/helper';
import {Request, Response, NextFunction} from 'express';
import {
  isAdmin,
  checkAdmin,
  hasCASITokenApproved,
  hasCASIToken,
  updateCASIEmail,
  clearCookies,
} from '../middlewares/auth';

const router = express.Router({mergeParams: true});
const {create, update, all, all_query, delete_query} = initCRUD(User);

const register = (req: Request, res: Response, next: NextFunction) => {
  req.body.privelege_level = 'Unapproved_User';
  req.body.display_on_website = false;
  req.body.casi_email = res.locals.casi_email;

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

const update_record = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.updated_by = res.locals.logged_user_id;
  if (!res.locals.isAdmin) {
    delete req.body.privelege_level;
    delete req.body.casi_email;
  }

  // Prevent devclub user's entry, privilege and casi_email from change
  if (req.params.id == ADMIN_ID) {
    delete req.body.entry_no;
    delete req.body.privelege_level;
    delete req.body.casi_email;
  }

  // If casi_email is to be updated, update roles in CASI
  if (req.body.casi_email != undefined) {
    const doc = await User.findById(req.params.id);
    if (!doc) {
      return next(
        createError(404, 'Not found', `No user with id ${req.params.id}`)
      );
    }

    const casiUpdateRes = await updateCASIEmail(
      res,
      doc.get('casi_email'),
      req.body.casi_email
    );

    // Looks weird, but the type of response is true|string
    if (casiUpdateRes != true) {
      return next(createError(500, 'Unable to update CASI Email', ''));
    }
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

/*
 * There should a auth middle before this which clears the cookies.
 */
const logout = (req: Request, res: Response, _: NextFunction) => {
  res.send('Logged out!');
};

/*
 * Only an approved user should be able to access this
 */
const myProfile = async (req: Request, res: Response, next: NextFunction) => {
  const doc = await User.findById(res.locals.logged_user_id);
  if (!doc) {
    return next(
      createError(404, 'Not Found', "This user's profile does not exist")
    );
  }
  res.json(createResponse('Found profile with details:', doc));
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
router.put('/:id', checkAdmin, isSameUserOrAdmin, update_record);
router.post('/rejectAll', isAdmin, reject_all);
router.get('/getAll/', all_website);
router.get('/getAllDB', hasCASITokenApproved, all);
router.post('/query/', hasCASITokenApproved, all_query);
router.post('/register', hasCASIToken, register);
router.get('/unapproved', hasCASITokenApproved, getUnapproved);
router.get('/myProfile', hasCASITokenApproved, myProfile);
router.post('/logout', hasCASIToken, clearCookies, logout);

export default router;
