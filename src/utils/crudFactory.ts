import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { createResponse, createError } from "./helper";

const initCRUD = (model: mongoose.Model<mongoose.Document, {}>) => {
  const name = model.collection.collectionName;

  /**
     * POST /
     * Create a document
     */
    const create = (req: Request, res: Response, next: NextFunction) => {
        console.log("CREATE CREATE CREATE");
        console.log(req.body);
        
        return new Promise <any> ((resolve, reject) => {
            console.log("Andar AAye?")
            model.create(req.body)
            .then((createdDoc) => {
                console.log("Doc bana?")
                if(req.res === undefined){
                    console.log("here??")
                    reject("req.res is undefined. Set locals properly");
                    next("req.res is undefined. Set locals properly");
                }else if (req.res.locals.no_send == undefined || req.res.locals.no_send == false) {
                    console.log("or here??")
                    res.json(createResponse(`${name} created with details:`, createdDoc));
                }
                console.log("you should be here??")

                resolve(createdDoc);
                return createdDoc;
            })
            .catch((err) => {
                console.log("Nahi bana?")
                console.log(err)
                reject(err);
                next(err);
            });
        });
    };

  /**
     * GET /:id
     * Get an existing document.
     */
    const get = (req: Request, res: Response, next: NextFunction) => {
        return new Promise <any> ((resolve, reject) => {
            model.findById(req.params.id)
            .then((doc) => {
                if (!doc) {
                    next(createError(404,"Not found",`${name} does not exist with id ${req.params.id}`));
                    return doc;
                }
                if(req.res === undefined){
                    reject("req.res is undefined. Set locals properly");
                    next("req.res is undefined. Set locals properly");
                }else if (req.res.locals.no_send == undefined || req.res.locals.no_send == false) {
                    res.json(createResponse(`${name} found with details:`, doc));
                }
                resolve(doc);
                return doc;
            })
            .catch((err) => {
                reject(err);
                // return err;
                next(err);
            });
        });
    };

  /**
     * PUT /:id
     * Update an existing document by id .
     */
    const update = (req: Request, res: Response, next: NextFunction) => {
        return new Promise <any> ((resolve, reject) => {
            model.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
            .then((doc) => {
                if (!doc) {
                    next(createError(404,"Not found",`${name} does not exist with id ${req.params.docid}`));
                    return doc;
                }
                if(req.res === undefined){
                    reject("req.res is undefined. Set locals properly");
                    next("req.res is undefined. Set locals properly");
                }else if (req.res.locals.no_send == undefined || req.res.locals.no_send == false) {
                    res.json(createResponse(`${name} updated with new details as:`, doc));
                }
                resolve(doc);
                return doc;
            })
            .catch((err) => {
                reject(err);
                next(err);
            });
        });
    };

  /**
     * GET /
     * Gets all documents
     */
    const all = (req: Request, res: Response, next: NextFunction) => {
        return new Promise <any> ((resolve, reject) => {
            model.find({})
            .then((docs) => {
                if (!docs) {
                    next(createError(404, "Not found", `No ${name}s found`));
                    return docs;
                }
                if(req.res === undefined){
                    reject("req.res is undefined. Set locals properly");
                    next("req.res is undefined. Set locals properly");
                }else if (req.res.locals.no_send == undefined || req.res.locals.no_send == false) {
                    res.json(createResponse(`${name} found with details:`, docs));
                }
                resolve(docs);
                return docs;
            })
            .catch((err) => {
                reject(err);
                next(err);
            });
        });
    };

  /**
     * GET /
     * Gets all documents by query
     */

    const all_query = (req: Request, res: Response, next: NextFunction) => {
        return new Promise <any> ((resolve, reject) => {
            model.find(req.body.query)
            .then((docs) => {
                if (!docs) {
                    next(createError(404, "Not found", `Not data found`));
                    return docs;
                }
                if(req.res === undefined){
                    reject("req.res is undefined. Set locals properly");
                    next("req.res is undefined. Set locals properly");
                }else if (req.res.locals.no_send == undefined || req.res.locals.no_send == false) {
                    res.json(createResponse(`data found with details:`, docs));
                }
                resolve(docs);
                return docs;
            })
            .catch((err) => {
                reject(err);
                next(err);
            });
        });
    };

  /**
     * POST /
     * Deletes all documents by query
     */

    const all_delete = (req: Request, res: Response, next: NextFunction) => {
        return new Promise <any> ((resolve, reject) => {
            model.remove({})
            .then((docs: any) => {
                if(req.res === undefined){
                    reject("req.res is undefined. Set locals properly");
                    next("req.res is undefined. Set locals properly");
                }else if (req.res.locals.no_send == undefined || req.res.locals.no_send == false) {
                    res.json(createResponse(`data found with details:`, docs));
                }
                resolve(docs);
            })
            .catch((err) => {
                reject(err);
                next(err);
            });
        });
    };

  return [create, get, update, all, all_query, all_delete];
};

export default initCRUD;
