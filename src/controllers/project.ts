import express from "express";
import Project from "../models/project";
import initCRUD from "../utils/crudFactory";

const router = express.Router({mergeParams: true});
const [create, get, update, all] = initCRUD(Project);

router.post('/', create);
router.get('/getAll/', all);
router.get('/:id', get);
router.put('/:id', update);

export default router;