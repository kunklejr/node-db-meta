module.exports = Table;

var util = require('util');
var BaseTable = require('../table');

function Table(props) {
  this.meta = props;
}
util.inherits(Table, BaseTable);

Table.prototype.getName = function() {
  return this.meta.table_name;
};