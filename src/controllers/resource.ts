import { default as Resources } from "../models/resources";
import express from "express";
import initCRUD from "../utils/crudFactory";

const router = express.Router({mergeParams: true});
const [create, get, update, all, all_query] = initCRUD(Resources);

router.post("/", create);
router.get("/getAll/", all);
router.get("/:id", get);
router.put("/:id", update);

export default router;