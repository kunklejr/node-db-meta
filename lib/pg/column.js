module.exports = Column;

var util = require('util');
var BaseColumn = require('../column');
var dataType = require('../data-type');

function Column(props) {
  this.meta = props;
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
  switch (this.meta.data_type) {
    case 'integer':
    case 'int':
    case 'int4':
      return dataType.integer;
    case 'boolean':
    case 'bool':
      return dataType.boolean;
    case 'text':
      return dataType.text;
    case 'varchar':
    case 'character varying':
      return dataType.varchar;
    case 'real':
    case 'float4':
      return dataType.float;
    case 'double precision':
    case 'float8':
      return dataType.double;
    case 'time':
    case 'timetz':
      return dataType.time;
    case 'timestamp':
    case 'timestamptz':
      return dataType.timestamp;
    default:
      return this.meta.data_type.toUpperCase();
  }
};