var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

const RESOURCES_SCHEMA = {
  "id": "",
  "internal_name": "",
  "directory_year": "",
  "subdirectory": "",
  "name": "",
  "archive": "",
  "description": "",
  "url": {},
  "date_of_creation": "",
  "new": true,
  "display_on_website": false
}

const EVENT_SCHEMA = {
  "id": "",
  "name": "",
  "description": "",
  "start_date": "",
  "end_date": "",
  "embed_code": "",
  "url": {}
}

const MEMBERS_SCHEMA = {
  "id": "",
  "name": "",
  "entry_no": "",
  "hostel": "",
  "gender": "",
  "join_year": "",
  "grad_year": "",
  "phone_no": "",
  "birth_date": "",
  "email": "",
  "hometown": "",
  "interests": "",
  "specialization": "",
  "intro": "",
  "display_on_website": false,
  "url": {}
}

const PROJECT_SCHEMA = {
  "id": "",
  "name": "",
  "description": "",
  "start_date": "",
  "end_date": "",
  "origin": "",
  "origin_contact": "",
  "perks": "",
  "display_on_website": false,
  "requirements": "",
  "is_internal": true,
  "members": [],
  "links": {}
}


function insert(db, tablename, data, callback) {
  var collection = db.collection(tablename);
  collection.insertOne(data, function (err, result) {
    callback(err, result)
  });
}

function view(db, tablename, data = {}, callback) {
  var collection = db.collection(tablename);
  collection.find(data).toArray(function (err, result) {
    callback(err, result)
  });
}

function viewFields(db, tablename, data = {}, fields = {}, callback) {
  var collection = db.collection(tablename);
  collection.find(data).project(fields).toArray(function (err, result) {
    callback(err, result)
  });
}

function update(db, tablename, data = {}, newData = {}, callback) {
  var collection = db.collection(tablename);
  collection.update(data, newData, function (err, result) {
    callback(err, result)
  });
}

function remove(db, tablename, data, callback) {
  var collection = db.collection(tablename);
  collection.deleteOne(data, function (err, result) {
    callback(err, result)
  });
}

module.exports = {
  insert: insert,
  view: view,
  viewFields: viewFields,
  update: update,
  remove: remove,
  resources: RESOURCES_SCHEMA,
  event: EVENT_SCHEMA,
  project: PROJECT_SCHEMA,
  members: MEMBERS_SCHEMA
}