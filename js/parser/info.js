'use strict';

var fs = require('fs-extra'),
    globby = require('globby'),
    infoData = {},
    count = 0;

/**
 * Get info from all tmp json files
 */
globby(['planets/**/*.json', '!planets/data/**'], function(err, files) {
  count = files.length;

  files.forEach(readFile);
});

/**
 * Get data from a file on the path
 * @param {string} path
 */
function readFile(path) {
  fs.readJson(path, function(err, data) {
    addData(data, path.indexOf('moons') !== -1);
    
    if (!--count) {
      writeData();
    }
  });
}

/**
 * Adding current data to the general
 * @param {Object} data
 * @param {boolean} isMoon
 */
function addData(data, isMoon) {
  if (!data.facts) {
    return;
  }
  
  var props = Object.keys(data.facts),
      type = (isMoon ? 'moon' : 'planet');
      
  props.forEach(function(prop) {
    if (!infoData[prop]) {
      infoData[prop] = {
        planet: 0,
        moon: 0,
        full: 0
      };
    }
    
    infoData[prop][type]++;
    infoData[prop].full++;
  });
}

/**
 * Write general data to info json
 */
function writeData() {
  var infoPath = __dirname + '/../../planets/data/info.json';
  
  fs.outputJson(infoPath, infoData, function(err) {
    if (!err) {
      console.log('The file was saved!');
    }
  });
}
