import express from "express";
import Project from "../models/project";
import initCRUD from "../utils/crudFactory";
import { ADMIN_SECRET } from "../utils/secrets";

const router = express.Router({mergeParams: true});
const [create, get, update, all, all_query, all_delete] = initCRUD(Project);
import { createResponse } from "../utils/helper";
import { Request, Response, NextFunction } from "express";
const bcrypt = require("bcrypt");

const update_record = (req: Request, res: Response, next: NextFunction) => {
    const my_query = {name: req.params.id};
    console.log(my_query);

    req.body.query = my_query;
    if (req.res == undefined) {
        req.res = res;
    }
    if (req.res.locals == undefined) {
        req.res.locals = {};
    }
    req.res.locals.no_send = true;
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
    if (req.res == undefined) {
        req.res = res;
    }
    if (req.res.locals == undefined) {
        req.res.locals = {};
    }
    req.res.locals.no_send = true;
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
router.get('/getAll/', all);
router.get('/:id', get);
router.put('/:id', update_record);

export default router;