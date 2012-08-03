var path = require('path');

module.exports = function (driverName, options, callback) {
  if (arguments.length < 3) {
    callback = options;
    options = {};
  }

  try {
    var driverPath = path.join(__dirname, driverName, 'driver');
    var driver = require(driverPath);
    if(options.hasOwnProperty("connection")){
      driver.connectToExistingConnection(options["connection"], callback);
    }else{
    driver.connect(options, callback);
  }
  } catch (e) {
    callback(new Error('Unsupported driver: ' + driverName));
  }
};