var sqlite3 = require('sqlite3');
var Table = require('./table');
var Column = require('./column');

exports.connect = function (options, callback) {
  try {
    var client = new sqlite3.Database(options);
    callback(null, new Driver(client));
  } catch (err) {
    callback(err);
  }
};

function Driver(client) {
  this.client = client;
}

Driver.prototype.getVersion = function (callback) {
  this.client.all('select sqlite_version() as version', onResult);

  function onResult(err, result) {
    if (err) {
      return callback(err);
    }

    callback(null, result[0].version);
  }
};

Driver.prototype.getTables = function (callback) {
  var handler = handleResults.bind(this, Table, callback);
  this.client.all("SELECT tbl_name as table_name, * from sqlite_master where type = 'table';", handler);
};

Driver.prototype.getColumns = function (tableName, callback) {
  var handler = handleResults.bind(this, Column, callback);
  this.client.all("PRAGMA table_info(" + tableName + ")", handler);
};

Driver.prototype.close = function(callback) {
  this.client.close();
  callback();
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
