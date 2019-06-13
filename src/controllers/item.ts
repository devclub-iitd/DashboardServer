import { default as Item } from "../models/item";
import express from "express";
import initCRUD from "../utils/crudFactory";

const router = express.Router({mergeParams: true});
const [create, get, update, all] = initCRUD(Item);

router.post('/',create);
router.get('/',all);
router.get('/:id',get);
router.put('/:id',update);

export default router;