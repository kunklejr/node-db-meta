module.exports = Index;

var util = require('util');
var dbmUtil = require('../util');
var BaseIndex = require('../index');

function Index(props) {
  this.meta = dbmUtil.lowercaseKeys(props);
}
util.inherits(Index, BaseIndex);

Index.prototype.getName = function() {
  return this.meta.index_name;
};

Index.prototype.getTableName = function() {
  return this.meta.table_name;
};

Index.prototype.getColumnName = function() {
  return this.meta.name;
};