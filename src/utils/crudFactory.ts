import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { createResponse, createError } from "./helper";

const initCRUD = (model: mongoose.Model<mongoose.Document, {}>) => {
  const name = model.collection.collectionName;

  /**
     * POST /
     * Create a document
     */
  const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdDoc = await model.create(req.body);
      if (req.res.locals.no_send == undefined || req.res.locals.no_send == false) {
        res.json(createResponse(`${name} created with details:`, createdDoc));
      }
      return createdDoc;
    }
    catch (err1) {
      next(err1);
    }
  };

  /**
     * GET /:id
     * Get an existing document.
     */
  const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await model.findById(req.params.id);
      if (!doc) {
        next(createError(404, "Not found", `${name} does not exist with id ${req.params.id}`));
        return doc;
      }
      if (req.res.locals.no_send == undefined || req.res.locals.no_send == false) {
        res.json(createResponse(`${name} found with details:`, doc));
      }
      return doc;
    }
    catch (err1) {
      next(err1);
    }
  };

  /**
     * PUT /:id
     * Update an existing document by id .
     */
  const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await model.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      if (!doc) {
        next(createError(404, "Not found", `${name} does not exist with id ${req.params.docid}`));
        return doc;
      }
      if (req.res.locals.no_send == undefined || req.res.locals.no_send == false) {
        res.json(createResponse(`${name} updated with new details as:`, doc));
      }
      return doc;
    }
    catch (err1) {
      next(err1);
    }
  };

  /**
     * GET /
     * Gets all documents
     */
  const all = async (req: Request, res: Response, next: NextFunction) => {
    console.log("yo");
    try {
      const docs = await model.find({});
      if (!docs) {
        next(createError(404, "Not found", `No ${name}s found`));
        return docs;
      }
      if (req.res.locals.no_send == undefined || req.res.locals.no_send == false) {
        res.json(createResponse(`${name} found with details:`, docs));
      }
      return docs;
    }
    catch (err1) {
      next(err1);
    }
  };

  /**
     * GET /
     * Gets all documents by query
     */
  const allQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const docs = await model.find(req.body.query);
      if (!docs) {
        next(createError(404, "Not found", `Not data found`));
        return docs;
      }
      if (req.res.locals.no_send == undefined || req.res.locals.no_send == false) {
        res.json(createResponse(`data found with details:`, docs));
      }
      return docs;
    }
    catch (err1) {
      next(err1);
    }
  };

  return [create, get, update, all, allQuery];
};

export default initCRUD;
