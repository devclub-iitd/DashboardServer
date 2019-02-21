const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
})); // support encoded bodies

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
  next();
});

console.log(config.MongoDbName);

MongoClient.connect(config.MongoDbURL, { useNewUrlParser: true }, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db = client.db(config.MongoDbName);
  app.locals.db = db;

  const userCollection = db.collection(config.usrTableName);
  userCollection.createIndex({
    id: 1
  }, {
    unique: true
  }, function (err, result) {
    //console.log(result);
  });

  const eventCollection = db.collection(config.eventsTableName);
  eventCollection.createIndex({
    id: 1
  }, {
    unique: true
  }, function (err, result) {
    //console.log(result);
  });

  const resourcesCollection = db.collection(config.resourcesTableName);
  resourcesCollection.createIndex({
    id: 1
  }, {
    unique: true
  }, function (err, result) {
    //console.log(result);
  });

  const projectCollection = db.collection(config.projectTableName);
  projectCollection.createIndex({
    id: 1
  }, {
    unique: true
  }, function (err, result) {
    //console.log(result);
  });

  app.listen(config.port, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('app running successfully on ' + config.port);
    }
  });
});
