const jwt = require('jsonwebtoken');
const assert = require('assert');

const website_baseurl = process.env.APIURL || "http://localhost:4000"; //without a trailing slash
assert(website_baseurl[website_baseurl.length - 1] != '/');

var usrTableName = process.env.usrTableName || 'Club_Members';
var eventsTableName = process.env.eventsTableName || 'Club_Events';
var resourcesTableName = process.env.resourcesTableName || 'Club_Resources';
var projectTableName = process.env.projectTableName || 'Club_Projects';

var MongoDbURL = process.env.MongoDbURL || "mongodb://localhost:27017";
var MongoDbName = process.env.MongoDbName || "club_web_dashboard";
var EmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// JWT token
var jwtSecret = process.env.JWTSECRET || '%Shhh_##_Dont_**_tell_**_anyone??';

module.exports = {
  website_url: website_baseurl,
  usrTableName: usrTableName,
  eventsTableName: eventsTableName,
  resourcesTableName: resourcesTableName,
  projectTableName: projectTableName,
  MongoDbURL: MongoDbURL,
  MongoDbName: MongoDbName,
  EmailRegex: EmailRegex,
  jwtSecret: jwtSecret,
  port: process.env.PORT || 4000,
}