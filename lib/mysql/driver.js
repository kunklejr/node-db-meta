var mysql = require('mysql');
var Table = require('../table');
var Column = require('./column');
var Index = require('./index');

exports.connect = function (options, callback) {
  try {
    var client = mysql.createClient(options);
    callback(null, new Driver(client));
  } catch (err) {
    callback(err);
  }
};

exports.connectToExistingConnection = function(client, callback){
  callback(null, new Driver(client));
};

function Driver(client) {
  this.client = client;
}

Driver.prototype.getVersion = function (callback) {
  this.client.query('select version() as version', onResult);

  function onResult(err, result) {
    if (err) {
      return callback(err);
    }

    callback(null, result[0].version);
  }
};

Driver.prototype.getTables = function (callback) {
  var handler = handleResults.bind(this, Table, callback);
  this.client.query("select * from information_schema.tables where table_schema = ?", [this.client.database], handler);
};

Driver.prototype.getColumns = function (tableName, callback) {
  var handler = handleResults.bind(this, Column, callback);
  this.client.query("select * from information_schema.columns where table_schema = ? and table_name = ?", [this.client.database, tableName], handler);
};

Driver.prototype.getIndexes = function(tableName, callback) {
  var handler = handleResults.bind(this, Index, callback);
  this.client.query("show indexes from " + tableName, handler);
};

Driver.prototype.close = function(callback) {
  this.client.end(callback);
};

function handleResults(obj, callback, err, result) {
  if (err) {
    return callback(err);
  }

  var objects = result.map(function (row) {
    return new obj(row);
  });

  callback(null, objects);
}
