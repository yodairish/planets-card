'use strict';

/**
 * Find param value by index or name
 * Start with 0, actually first 2 are path and env, we inogre them 
 * @param {string|number} param
 */
module.exports = function getParamValue(param) {
  var value = '',
      argv;
  
  // get by index
  if (typeof param === 'number') {
    argv = process.argv[param + 2];
    
  } else if (typeof param === 'string') {
    process.argv.forEach(function(arg, index) {
      if (arg.indexOf(param) === 0) {
        argv = process.argv[index];
      }
    });
  }
  
  if (argv) {
    value = argv.split('=')[1];
  }
  
  return value;
};
