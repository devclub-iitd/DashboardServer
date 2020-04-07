import express from "express";
import Resources from "../models/resources";
import initCRUD from "../utils/crudFactory";
import { ADMIN_SECRET } from "../utils/secrets";
import { createResponse } from "../utils/helper";
import { Request, Response, NextFunction } from "express";

const router = express.Router({mergeParams: true});
const [create, get, update, all, all_delete] = initCRUD(Resources);
const bcrypt = require("bcrypt");

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
router.post("/", create);
router.get("/getAll/", all);
router.get("/:id", get);
router.put("/:id", update);

export default router;