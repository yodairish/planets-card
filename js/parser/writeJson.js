'use strict';

var fs = require('fs-extra'),
    files = {};
    
/**
 * Adding new data to file stack
 * @param {Object} options
 */
module.exports.add = function add(options) {
  var path = __dirname + '/../../planets/tmp/' +
             options.planet + '/' +
             (options.moon ? 'moons/' + options.moon : options.planet) +
             '.json';
             
  if (!files[path]) {
    files[path] = {};
  }
  
  files[path][options.type] = options.data;
};

/**
 * Write files from stack
 */
module.exports.done = function done() {
  var paths = Object.keys(files);
  
  paths.forEach(function(path) {
    fs.readJson(path, function(err, json) {
      var types = Object.keys(files[path]);

      if (!json) {
        json = {};
      }
      
      types.forEach(function(type) {
        json[type] = files[path][type];
      });
      
      fs.outputJson(path, json, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('The file was saved!');
        }
      });
    });
  });
};
