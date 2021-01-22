import jwt from 'jsonwebtoken';

import {Request, Response, NextFunction} from 'express';
import {createError} from '../utils/helper';
import User from '../models/user';

import axios, {AxiosRequestConfig} from 'axios';
import fs from 'fs';
import path from 'path';

import {FilterQuery} from 'mongoose';
import {CLIENT_ACCESS_TOKEN} from '../utils/secrets';
import logger from '../utils/logger';

// SSO Url for refreshing tokens that are about to expire
const SSO_Refresh_URL = 'https://auth.devclub.in/auth/refresh-token';
export const SSO_Login_URL = 'https://auth.devclub.in/user/login?serviceURL=';
const SSO_ADD_ROLE_URL = 'https://auth.devclub.in/api/addUserRole';
const SSO_DELETE_ROLE_URL = 'https://auth.devclub.in/api/deleteUserRole';

const accessTokenName = 'token'; // The default JWT token name
const refreshTokenName = 'rememberme'; // Name for remember me style tokens

const publicKey = fs.readFileSync(path.resolve(__dirname, '../../public.pem')); // Public Key path

// Max time remaining for token expiry, after which a refresh request will be sent to the SSO for refreshing the token
const maxTTL = 2 * 60; // 5 minutes

interface AuthUser {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  isVerified: boolean;
  entry_num: string;
  roles: [string];
}

interface JWTToken {
  exp: number;
  user: AuthUser;
}

export const hasCASIToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies[accessTokenName];
  const refreshToken = req.cookies[refreshTokenName];

  try {
    let decoded: JWTToken;
    if (!token) {
      if (!refreshToken) {
        throw jwt.JsonWebTokenError;
      }
      decoded = jwt.verify(refreshToken, publicKey, {
        algorithms: ['RS256'],
      }) as JWTToken;

      // Send a refresh request to the SSO Server if the time remaining is less than maxTTL
      const response = await axios.post(SSO_Refresh_URL, {
        rememberme: refreshToken,
      });
      res.setHeader('set-cookie', response.headers['set-cookie']);
    } else {
      decoded = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as JWTToken;

      const tokenAgeRemaining = decoded.exp - Math.floor(Date.now() / 1000);
      if (tokenAgeRemaining <= maxTTL) {
        console.log('refreshing token, since it is about to expire!');
        const response = await axios.post(SSO_Refresh_URL, {token});
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }
    }

    res.locals.casi_email = decoded.user.email;
    res.locals.token = token;
    res.locals.refreshToken = refreshToken;
    next();
  } catch (error) {
    res.clearCookie(accessTokenName);
    res.clearCookie(refreshTokenName);
    next(
      createError(
        401,
        'Unauthorized',
        'Either token not provided or bad token provided'
      )
    );
  }
};

// Checks if the logged in user is  present in our DB and is approved.
// hasCASITokenApproved must be called before this.
const isApproved = (req: Request, res: Response, next: NextFunction) => {
  User.findOne({casi_email: res.locals.casi_email}).then(userDoc => {
    if (!userDoc) {
      return next(
        createError(401, 'Unauthorized', 'This user is not authorized')
      );
    }

    if (userDoc.get('privelege_level') == 'Unapproved_User') {
      return next(
        createError(401, 'Unauthorized', 'An admin needs to approve this user')
      );
    }

    res.locals.logged_user_id = userDoc.get('id');
    console.log('Verified token: ' + userDoc.get('entry_no'));

    next();
  });
};

export const hasCASITokenApproved = [hasCASIToken, isApproved];

const memberRole = 'dc_member';

// Given current email and new email, remove the dc_member role from old email
// Returns true if succeeded, and a error message as a string otherwise
export const updateCASIEmail = async (
  res: Response,
  old_email: string,
  new_email: string
) => {
  if (old_email == new_email) return true;

  const cookieHeader = `${accessTokenName}=${res.locals.token}; ${refreshTokenName}=${res.locals.refreshToken}`;
  const axiosConfig: AxiosRequestConfig = {
    headers: {
      Cookie: cookieHeader,
      Authorization: CLIENT_ACCESS_TOKEN,
    },
  };

  try {
    const delete_res = await axios.post(
      SSO_DELETE_ROLE_URL,
      {
        email: old_email,
        role: memberRole,
      },
      axiosConfig
    );
    logger.info(
      `Delete user role success: ${delete_res.status} ${delete_res.statusText}`
    );
  } catch (err) {
    logger.info(
      `Delete user role error response: ${err.response.status} ${err.response.data}`
    );

    // A 400 level error would mean that the given email id didn't exist in the
    // CASI DB, which is fine. But a 500 level error is bad, so we must also
    // return an error
    if (err.response.status >= 500) {
      return err.response.data;
    }
  }

  try {
    const add_res = await axios.post(
      SSO_ADD_ROLE_URL,
      {
        email: new_email,
        role: memberRole,
      },
      axiosConfig
    );
    logger.info(
      `Add user role success: ${add_res.status} ${add_res.statusText}`
    );
  } catch (err) {
    logger.error(
      `Add user role error: ${err.response.status} ${err.response.data}`
    );
    return err.response.data;
  }

  return true;
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
export const isAdmin = hasCASITokenApproved.concat([
  isUser({privelege_level: 'Admin'}),
]);

// Enforces user to be logged in, and sets res.locals.isAdmin property by checking
// admin
export const checkAdmin = hasCASITokenApproved.concat([
  isUser({privelege_level: 'Admin'}, 'isAdmin'),
]);
