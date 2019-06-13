import logger from "../utils/logger";
import { Request,Response,NextFunction } from "express";

function logRequest(req: Request, res: Response, next: NextFunction) {
    // http://www.senchalabs.org/connect/responseTime.html
    var start = new Date();
    if (res._responseTime) {
        return next();
    }
    res._responseTime = true;

    const ip = req.header('x-forwarded-for') || (req.connection && req.connection.remoteAddress) || '';

    // install a listener for when the response is finished
    res.on('finish', function () { // the request was handled, print the log entry
        const responseTime = new Date().getTime() - start.getTime();
        const userId = res.locals.userId || "-";
        logger.info(`${ip} ${req.method} ${req.originalUrl} ${userId} ${res.statusCode} ${responseTime}ms`, {
            ip: ip,
            userId: userId,
            method: req.method,
            body: req.body,
            params: req.query,
            statusCode: res.statusCode,
            responseTime: responseTime  
        });
    });

    // resume the routing pipeline,
    // let other middleware to actually handle the request
    next();
}

export default logRequest;
