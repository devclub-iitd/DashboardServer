import { Request, Response, NextFunction } from "express";
import { createResponse, createError } from "./helper";
import mongoose from "mongoose";

const initCRUD = (model: mongoose.Model<mongoose.Document, {}>) => {
    const name = model.collection.collectionName;

    /**
     * POST /
     * Create a document
     */
    const create = (req: Request, res: Response, next: NextFunction) => {
        return model.create(req.body)
        .then((createdDoc) => {
            res.json(createResponse(`${name} created with details:`, createdDoc));
            return createdDoc;
        })
        .catch((err) => {
            next(err);
        });
    };

    /**
     * GET /:id
     * Get an existing document.
     */
    const get = (req: Request, res: Response, next: NextFunction) => {
        return model.findById(req.params.id)
        .then((doc) => {
            if (!doc) {
                next(createError(404,"Not found",`${name} does not exist with id ${req.params.id}`));
                return doc;
            }
            res.json(createResponse(`${name} found with details:`, doc));
            return doc;
        })
        .catch((err) => {
            next(err);
        });
    };

    /**
     * PUT /:id
     * Update an existing document by id .
     */
    const update = (req: Request, res: Response, next: NextFunction) => {
        return model.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .then((doc) => {
            if (!doc) {
                next(createError(404,"Not found",`${name} does not exist with id ${req.params.docid}`));
                return doc;
            }
            res.json(createResponse(`${name} updated with new details as:`, doc));
            return doc;
        })
        .catch((err) => {
            next(err);
        });
    };

    /**
     * GET /
     * Gets all documents
     */
    const all = (req: Request, res: Response, next: NextFunction) => {
        return model.find({})
        .then((docs) => {
            if (!docs) {
                next(createError(404, "Not found", `No ${name}s found`));
                return docs;
            }
            res.json(createResponse(`${name}s found with details:`, docs));
            return docs;
        })
        .catch((err) => {
            next(err);
        });
    };
    return [create, get, update, all];
};

export default initCRUD;
