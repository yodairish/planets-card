'use strict';

var fs = require('fs-extra');

/**
 * Write data to file
 * @param {Object} options
 * @return {string}
 */
module.exports = function writeToFile(options) {
  var path = __dirname + '/../../planets/tmp/' +
             options.planet + '/' +
             (options.moon ? 'moons/' + options.moon : options.planet) +
             '.json';
  
  fs.readJson(path, function(err, obj) {
    if (!obj) {
      obj = {};
    }
    
    obj[options.type] = options.data;
    
    fs.outputJson(path, obj, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('The file was saved!');
      }
    });
  });
  
  return path;
};
