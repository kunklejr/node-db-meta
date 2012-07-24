module.exports = Column;

function Column() {};

Column.iface = [
  'getName',
  'isNullable',
  'getDataType',
  'getMaxLength',
  'isPrimaryKey',
  'getDefaultValue',
  'isUnique',
  'isAutoIncrementing'
];

Column.iface.forEach(function(method) {
  Column.prototype[method] = function() {
    throw new Error(method + ' not yet implemented');
  };
});