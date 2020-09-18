import jwt from 'jsonwebtoken';

import {Request, Response, NextFunction} from 'express';
import {JWT_SECRET} from '../utils/secrets';
import {createError, hasOwnProperty} from '../utils/helper';
import User from '../models/user';

import bcrypt from 'bcrypt';
import {FilterQuery} from 'mongoose';
const SALT_WORK_FACTOR = 10;

export const hashPassword = (password: string) => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) return reject(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  });
};

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.header('x-access-token') || req.header('authorization'); // Express headers are auto converted to lowercase
  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    jwt.verify(token, JWT_SECRET, (err, userDecoded) => {
      if (err) {
        next(
          createError(
            401,
            'Unauthorized',
            'User is unauthorized. Token is invalid'
          )
        );
      } else if (
        userDecoded == undefined ||
        !hasOwnProperty(userDecoded, '_id')
      ) {
        next(
          createError(401, 'Unauthorized', 'No user associated with the token')
        );
      } else {
        const id = userDecoded['_id'];
        res.locals.logged_user_id = id;
        User.findById(id)
          .then(doc => {
            if (doc == null) {
              return next(
                createError(401, 'Unauthorized', 'User is not valid')
              );
            } else if (doc.get('privelege_level') == 'Unapproved_User') {
              return next(createError(400, 'Unapproved user', ''));
              //^ Should change it to 401 I think
            }
            res.locals.logged_user = doc.get('entry_no');
            console.log('Verified token: ' + res.locals.logged_user);
            next();
          })
          .catch(err => {
            next(err);
          });
      }
    });
  } else {
    next(createError(400, 'Bad Request', 'Token not provided'));
  }
};

/*
 * Generic(ish) function that takes in a query and searches the database for users
 * matching the query, and returns a middleware that checks if the logged in user is
 * is in the results of the query. If found, calls next(). Else:
 * If prop is undefined, the middleware passes the error to Express.
 * Else, the given property is marked as false (and marked true if user is present) and
 * next middleware is called
 */
const isUser = (query: FilterQuery<typeof User>, prop?: string) => {
  return (_: Request, res: Response, next: NextFunction) => {
    const report = (response: number, title: string, msg: string) => {
      if (prop == undefined) {
        next(createError(response, title, msg));
      } else {
        res.locals[prop] = false;
        next();
      }
    };

    User.find(query)
      .then(docs => {
        for (const doc of docs) {
          if (doc._id == res.locals.logged_user_id) {
            if (prop != undefined) res.locals[prop] = true;
            return next();
          }
        }
        return report(
          401,
          'Unauthorized',
          'User is not allowed to access this endpoint'
        );
      })
      .catch(err => {
        console.log(err);
        next(
          createError(500, 'Internal Server Error', 'Database access error')
        );
      });
  };
};

// Enforces admin, reports an error otherwise
export const isAdmin = [checkToken, isUser({privelege_level: 'Admin'})];

// Enforces user to be logged in, and sets res.locals.isAdmin property by checking
// admin
export const checkAdmin = [
  checkToken,
  isUser({privelege_level: 'Admin'}, 'isAdmin'),
];
