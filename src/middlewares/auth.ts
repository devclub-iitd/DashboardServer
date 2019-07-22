import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../utils/secrets";
import { createError } from "../utils/helper";


export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.header("x-access-token") || req.header("authorization"); // Express headers are auto converted to lowercase
  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    jwt.verify(token, JWT_SECRET, (err, userDecoded: any) => {
      if (err) {
        next(createError(401, "Unauthorized", "User is unauthorized. Token is invalid"));
      } else {

        res.locals.logged_user = userDecoded["_id"];
        next();
      }
    });
  } else {
    next(createError(400, "Bad Request", "Token not provided"));
  }
};


export const isSameUser  = (req: Request, res: Response, next: NextFunction) => {
  if(res.locals.logged_user == req.params.id){
    next()
  }
  else{
    next(createError(401,'Unauthorized','User is unauthorized for this endpoint. Token is invalid'))
  }
};
