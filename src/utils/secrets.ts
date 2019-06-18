import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.warn("Please create a .env file for environment variables");
}
export const ENVIRONMENT = process.env.NODE_ENV;
// const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

// export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI: string = process.env["MONGODB_URI_LOCAL"] || "mongodb://localhost:27017/dashboard";

export const GITHUB_CLIENT_ID: string = process.env["GITHUB_CLIENT_ID"] || ''
export const GITHUB_CLIENT_SECRET: string = process.env["GITHUB_CLIENT_SECRET"] || ''

export const JWT_SECRET: string = process.env["JWT_SECRET"] || ''


if(GITHUB_CLIENT_ID == '' || GITHUB_CLIENT_SECRET == '' || JWT_SECRET == ''){
    logger.error("No github client secret or github client id. Set environment variable.");
    process.exit(1);
}

// if (!SESSION_SECRET) {
//     logger.error("No client secret. Set SESSION_SECRET environment variable.");
//     process.exit(1);
// }

if (!MONGODB_URI) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}
