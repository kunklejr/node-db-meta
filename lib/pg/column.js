module.exports = Column;

var util = require('util');
var dbmUtil = require('../util');
var BaseColumn = require('../column');

function Column(props) {
  this.meta = dbmUtil.lowercaseKeys(props);
}
util.inherits(Column, BaseColumn);

Column.prototype.getName = function () {
  return this.meta.column_name;
};

Column.prototype.isNullable = function () {
  return this.meta.is_nullable === 'YES';
};

Column.prototype.getMaxLength = function () {
  return this.meta.character_maximum_length;
};

Column.prototype.getDataType = function() {
  return this.meta.data_type.toUpperCase();
};

Column.prototype.isPrimaryKey = function () {
  return this.meta.primary_key === true;
};

Column.prototype.isForeignKey = function () {
  return this.meta.foreign_key === true;
};

Column.prototype.getDefaultValue = function () {
  return this.meta.column_default;
};

Column.prototype.isUnique = function () {
  return ((this.meta.unique === true) || (this.meta.primary_key === true));
};

Column.prototype.isAutoIncrementing = function () {
  return this.meta.autoincrement === true;
};