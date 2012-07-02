var util = require('util');
var pg = require('pg');
var Table = require('./table');
var Column = require('./column');

exports.connect = function (options, callback) {
  var client = new pg.Client(options);
  client.connect(onConnect);

  function onConnect(err) {
    callback(err, new Driver(client));
  }
};

function Driver(client) {
  this.client = client;
}

Driver.prototype.getVersion = function (callback) {
  this.client.query('select version()', onResult);

  function onResult(err, result) {
    if (err) {
      return callback(err);
    }

    callback(null, result.rows[0].version);
  }
};

Driver.prototype.getTables = function (callback) {
  var handler = handleResults.bind(this, Table, callback);
  this.client.query("SELECT * FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');", handler);
};

Driver.prototype.getColumns = function (tableName, callback) {
  var handler = handleResults.bind(this, Column, callback);
  this.client.query("SELECT * FROM information_schema.columns WHERE table_name = $1", [tableName], handler);
};

Driver.prototype.close = function(callback) {
  this.client.end();
  callback();
};

function handleResults(obj, callback, err, result) {
  if (err) {
    return callback(err);
  }

  var objects = result.rows.map(function (row) {
    return new obj(row);
  });

  callback(null, objects);
}
