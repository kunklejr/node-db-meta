exports.lowercaseKeys = function (obj) {
  var newObj = {};
  Object.keys(obj).forEach(function (key) {
    newObj[key.toLowerCase()] = obj[key];
  });
  return newObj;
}