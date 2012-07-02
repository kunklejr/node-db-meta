module.exports = Table;

function Table() {};

Table.iface = ['getName'];

Table.iface.forEach(function(method) {
  Table.prototype[method] = function() {
    throw new Error(method + ' not yet implemented');
  };
});