import dotenv from 'dotenv';
import fs from 'fs';
import logger from './logger';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({path: '.env'});
} else {
  logger.warn('Please create a .env file for environment variables');
}
export const ENVIRONMENT = process.env.NODE_ENV;
// const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

// export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI: string =
  process.env['MONGODB_URI_LOCAL'] || 'mongodb://localhost:27017/dashboard';

export const GITHUB_CLIENT_ID: string = process.env['GITHUB_CLIENT_ID'] || '';
export const GITHUB_CLIENT_SECRET: string =
  process.env['GITHUB_CLIENT_SECRET'] || '';

export const JWT_SECRET: string = process.env['JWT_SECRET'] || '';
export const ADMIN_SECRET: string = process.env['ADMIN_SECRET'] || '';

if (GITHUB_CLIENT_ID == '' || GITHUB_CLIENT_SECRET == '' || JWT_SECRET == '') {
  logger.error(
    'No github client secret or github client id. Set environment variable.'
  );
  throw new Error('Set env variable for github client secret/id');
}

// if (!SESSION_SECRET) {
//     logger.error("No client secret. Set SESSION_SECRET environment variable.");
//     process.exit(1);
// }

if (!MONGODB_URI) {
  logger.error(
    'No mongo connection string. Set MONGODB_URI environment variable.'
  );
  throw new Error('No mongo connection string');
}

export const ADMIN_ENTRY: string = process.env['ADMIN_ENTRY'] || '';
export const ADMIN_CASI_EMAIL: string = process.env['ADMIN_CASI_EMAIL'] || '';

if (ADMIN_ENTRY == '' || ADMIN_CASI_EMAIL == '') {
  logger.error('Set ADMIN_ENTRY and ADMIN_CASI_EMAIL environment variables');
  throw new Error('Admin entry number or CASI email id missing');
}

export const CLIENT_ACCESS_TOKEN: string =
  process.env['CLIENT_ACCESS_TOKEN'] || '';

if (CLIENT_ACCESS_TOKEN == '') {
  logger.error('Set CLIENT_ACCESS_TOKEN environment variable');
  throw new Error('SSO Client Access token is missing');
}
