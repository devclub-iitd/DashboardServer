import express from "express";
import Project from "../models/project";
import initCRUD from "../utils/crudFactory";
//import { ADMIN_SECRET } from "../utils/secrets";
import { checkToken, isAdmin } from "../middlewares/auth"

const router = express.Router({mergeParams: true});
const [create, get, update, all, all_query, all_delete, delete_query] = initCRUD(Project);
import { createResponse, createError } from "../utils/helper";
import { Request, Response, NextFunction } from "express";
//const bcrypt = require("bcrypt");

const update_record = (req: Request, res: Response, next: NextFunction) => {
    const my_query = {name: req.params.id};
    console.log(my_query);

    req.body.query = my_query;
    res.locals.no_send = true;
    all_query(req, res, next)
    .then((data: any) => {
        req.body.query = {};
        req.body.updated_by = res.locals.logged_user_id;
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

/* const chk_pswd = (req: Request, res: Response, next: NextFunction) => {
    bcrypt.compare(ADMIN_SECRET, req.body.password, function(err: any, _: any) {
        if (err) {
            console.log(err)
            res.json(createResponse("You are not authorised to perform this action. Your details have been reported", ""));
        };
        next();
    });
}; */

const create_record = (req: Request, res: Response, next: NextFunction) => {
    req.body.created_by = res.locals.logged_user_id;
    create(req, res, next);
}

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

// Takes in req.body.id as the id of the doc to be deleted
const delete_project = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.id == undefined) {
        return next(createError(400, "Project id missing", "Please specify id in body"))
    }

    req.body.query = {_id: req.body.id};
    delete_query(req, res, next);
}

// Get all docs with display_on_website true
const all_website = (req: Request, res: Response, next: NextFunction) => {
    req.body.query = {display_on_website: true};
    all_query(req, res, next);
}

router.post('/deleteAll/', isAdmin, delete_record);
router.post('/delete', isAdmin, delete_project);
router.post('/', checkToken, create_record);
router.get('/getAll/', all_website);
router.get("/getAllDB/", checkToken, all);
router.get('/:id', get);
router.put('/:id', checkToken, update_record);

export default router;