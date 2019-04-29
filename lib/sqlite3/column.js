module.exports = Column;

var util = require('util');
var dbmUtil = require('../util');
var BaseColumn = require('../column');

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
  if (match && match[1]) {
    return parseInt(match[1]);
  }
  return null;
};

Column.prototype.getDataType = function() {
  return this.meta.type.toUpperCase();
};

Column.prototype.isPrimaryKey = function () {
  return this.meta.pk === 1;
};

Column.prototype.isForeignKey = function () {
  return this.meta.fk === 1;
};

Column.prototype.getDefaultValue = function () {
  return this.meta.dflt_value;
};

Column.prototype.isUnique = function () {
  return (this.meta.unique === true) || (this.meta.pk === 1);
};

Column.prototype.isAutoIncrementing = function () {
  return this.meta.auto_increment === true;
};