var mysql = require('mysql');
var Table = require('../table');
var Column = require('./column');
var Index = require('./index');
var metaUtils = require('../util');
var arrayContains = metaUtils.arrayContains;

exports.connect = function (options, callback) {
  try {
    var client;
    if (typeof(mysql.createConnection) === 'undefined') {
      client =  new mysql.createClient(options);
    } else {
      client =  new mysql.createConnection(options);
    }

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
  var db = getClientDatabase(this.client);
  this.client.query("select * from information_schema.tables where table_schema = ?", [db], handler);
};

Driver.prototype.getColumns = function (tableName, callback) {
  var handler = handleResults.bind(this, Column, findForeignKeys.bind(this));
  var db = getClientDatabase(this.client);
  this.client.query("select * from information_schema.columns where table_schema = ? and table_name = ?", [db, tableName], handler);

  function findForeignKeys(err, columns) {
    if(err) {
      return callback(err);
    }

    this.client.query("select * from information_schema.key_column_usage " +
      "WHERE table_schema = ? AND table_name = ? AND referenced_column_name IS NOT NULL",
      [db, tableName], onForeignKeysResult.bind(this, columns, this.client));
  }

  function onForeignKeysResult(columns, client, err, result) {
    if(err) {
      return callback(err);
    }

    var foreignKeys = result.map(function (row) {
      return row.COLUMN_NAME;
    });

    columns.forEach(function (column) {
      if (arrayContains(foreignKeys, column.getName())) {
        column.meta.foreign_key = true;
      }
    });

    callback(null, columns);
  }
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

function getClientDatabase(client) {
  return client.database || client.config.database;
}
