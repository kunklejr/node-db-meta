var sqlite3 = require('sqlite3');
var Table = require('./table');
var Column = require('./column');
var Index = require('./index');

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

Driver.prototype.getIndexes = function (tableName, callback) {
  this.client.all("pragma index_list(" + tableName + ")", function (err, result) {
    if (err) {
      return callback(err);
    }

    var indexCount = 0;
    var numIndexes = result.length;
    var indexes = [];

    for (var i = 0; i < numIndexes; i++) {
      var indexName = result[i].name;
      this.client.all("pragma index_info(" + indexName + ")", function (err, result) {
        if (err) {
          return callback(err);
        }

        for (var j = 0; j < result.length; j++) {
          var indexMeta = result[j];
          indexMeta.index_name = indexName;
          indexMeta.table_name = tableName;
          indexes.push(new Index(indexMeta));
        }

        if (++indexCount === numIndexes) {
          callback(null, indexes);
        }
      });
    }
  }.bind(this));

};

Driver.prototype.close = function (callback) {
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
