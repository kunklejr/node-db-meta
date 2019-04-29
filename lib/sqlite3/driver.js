var sqlite3 = require('sqlite3');
var Table = require('../table');
var Column = require('./column');
var Index = require('./index');
var arrayContains = require('../util').arrayContains;

exports.connect = function (options, callback) {
  try {
    var client = new sqlite3.Database(options);
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
  var handler = handleResults.bind(this, Column, onResult.bind(this));
  this.client.all("PRAGMA table_info(" + tableName + ")", handler);


  function onResult(err, result){
    if (err) {
      return callback(err);
    }
    var previous = result;
    this.client.all("SELECT sql from sqlite_master where name = \'" + tableName + "\';", process.bind(this, previous));
  }

  function process(previous,err,result){
    if (err) {
      return callback(err);
    }

    var sql = result[0]['sql'];
    sql = sql.substring( sql.indexOf('\(')+1,sql.lastIndexOf('\)') );
    var strings = sql.split(',');
    var colNumber = 0;
    strings.forEach(function(string){
      string = string.trim();
      string = string.toUpperCase();
      if (string.indexOf('UNIQUE') >= 0){
        previous[colNumber].meta.unique = true;
      }

      if (string.indexOf('AUTOINCREMENT') >= 0){
        previous[colNumber].meta.auto_increment = true;
      }
      colNumber++;
    });

    findForeignKeys(previous, this.client);
  }

  function findForeignKeys(columns, client) {
    client.all('PRAGMA foreign_key_list(' + tableName  + ');',
      onForeignKeysResult.bind(this, columns, client));
  }

  function onForeignKeysResult(columns, client, err, result) {
    if(err) {
      return callback(err);
    }

    var foreignKeys = result.map(function (row) {
      return row.from;
    });

    columns.forEach(function (column) {
      if (arrayContains(foreignKeys, column.getName())) {
        column.meta.fk = 1;
      }
    });

    callback(err, columns);
  }

};

Driver.prototype.getIndexes = function (tableName, callback) {
  this.client.all("pragma index_list(" + tableName + ")", function (err, result) {
    if (err) {
      return callback(err);
    }

    var indexCount = 0;
    var indexes = [];
    var numIndexes = result.length;

    if (numIndexes === 0) {
      return callback(null, []);
    }

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
