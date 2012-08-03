var pg = require('pg');
var Table = require('../table');
var Column = require('./column');
var Index = require('./index');

exports.connect = function (options, callback) {
  var client = new pg.Client(options);
  client.connect(onConnect);

  function onConnect(err) {
    callback(err, new Driver(client));
  }
};

exports.connectToExistingConnection = function(client, callback){
  // console.log("connecting to existing connection");
  callback(null, new Driver(client));
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
  var handler = handleResults.bind(this, Column, findPrimaryKeys.bind(this));
  this.client.query("SELECT * FROM information_schema.columns WHERE table_name = $1", [tableName], handler);

  function findPrimaryKeys(err, columns) {
    if (err) {
      return callback(err);
    }

    this.client.query("select cu.column_name " +
      "from information_schema.key_column_usage cu, " +
      "information_schema.table_constraints tc " +
      "where tc.table_name = cu.table_name " +
      "and tc.constraint_type = 'PRIMARY KEY' " +
      "and tc.constraint_name = cu.constraint_name " +
      "and tc.table_name = $1",
      [tableName],
      onPrimaryKeysResult.bind(this, columns)
    );
  }

  function onPrimaryKeysResult(columns, err, result) {
    if (err) {
      return callback(err);
    }

    var primaryKeys = result.rows.map(function (row) {
      return row.column_name;
    });

    columns.forEach(function (column) {
      if (arrayContains(primaryKeys, column.getName())) {
        column.meta.primary_key = true;
      }
    });

    callback(null, columns);
  }
};

Driver.prototype.getIndexes = function(tableName, callback) {
  var handler = handleResults.bind(this, Index, callback);
  var sql = "select t.relname as table_name, " +
    "i.relname as index_name, " +
    "a.attname as column_name " +
    "from pg_class t, pg_class i, pg_index ix, pg_attribute a " +
    "where t.oid = ix.indrelid " +
    "and i.oid = ix.indexrelid " +
    "and a.attrelid = t.oid " +
    "and a.attnum = ANY(ix.indkey) " +
    "and t.relkind = 'r' " +
    "and t.relname = $1";

  this.client.query(sql, [tableName], handler);
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

function arrayContains(arr, item) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === item) {
      return true;
    }
  }
  return false;
}