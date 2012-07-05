module.exports = Index;

function Index() {};

Index.iface = ['getName', 'getTableName', 'getColumnName'];

Index.iface.forEach(function(method) {
  Index.prototype[method] = function() {
    throw new Error(method + ' not yet implemented');
  };
});