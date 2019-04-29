exports.lowercaseKeys = function (obj) {
  var newObj = {};
  Object.keys(obj).forEach(function (key) {
    newObj[key.toLowerCase()] = obj[key];
  });
  return newObj;
};

exports.arrayContains = function(arr, item) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === item) {
      return true;
    }
  }
  return false;
}