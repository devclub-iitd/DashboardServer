import express from "express";
import Item from "../models/item";
import initCRUD from "../utils/crudFactory";

const router = express.Router({mergeParams: true});
const [create, get, update, all, all_delete] = initCRUD(Item);

router.post('/', create);
router.get('/getAll/', all);
router.get('/:id', get);
router.put('/:id', update);

export default router;