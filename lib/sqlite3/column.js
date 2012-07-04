module.exports = Column;

var util = require('util');
var dbmUtil = require('../util');
var BaseColumn = require('../column');
var dataType = require('../data-type');

function Column(props) {
  this.meta = dbmUtil.lowercaseKeys(props);
}
util.inherits(Column, BaseColumn);

Column.prototype.getName = function () {
  return this.meta.name;
};

Column.prototype.isNullable = function () {
  return this.meta.notnull === 0;
};

Column.prototype.getMaxLength = function () {
  var match = this.getDataType().match(/\((\d+)\)$/);
  if (match[1]) {
    return parseInt(match[1]);
  }
  return -1;
};

Column.prototype.getDataType = function() {
  return this.meta.type.toUpperCase();
};

Column.prototype.isPrimaryKey = function () {
  return this.meta.pk === 1;
};