'use strict';

var jsdom = require('jsdom'),
    _ = require('../../bower_components/lodash/dist/lodash'),
    constant = require('./constants'),
    write = require('./writeJson'),
    facts = require('./factsPage');

/**
 * Adding moons data for planet
 * @param {Object} options
 * @param {Function} cb
 */
module.exports = function(options, cb) {
  var moonsData = [],
      moonsCount = 0;
  
  getHtml();
  
  /**
   * Get html doc by url
   */
  function getHtml() {
    jsdom.env(
      options.url,
      parseHtml
    );
  }
  
  /**
   * Add moons files and data
   * @param {?Array} errors
   * @param {Object=} window
   */
  function parseHtml(errors, window) {
    if (options.planet === 'Earth') {
      earthMoon();
    } else {
      var moonsList = window.document.querySelector('.l2featuretext'),
          moons;
      
      if (moonsList) {
        moons = moonsList.querySelectorAll('a');
        
        moonsCount = moons.length;
        
        _(moons).forEach(addMoon);
      }
    
      if (moonsData.length) {
        write.add({
          type: 'moons',
          data: moonsData,
          planet: options.planet
        });
      }
    }
  }
  
  /**
   * Add Earth moon
   */
  function earthMoon() {
    moonsCount = 1;
    
    facts({
      planet: options.planet,
      url: constant.PLANETS_URL + '?Object=' +
             constant.EARTH_MOON + constant.FACTS,
      moon: 'Moon'
    }, onMoonAdded);

    write.add({
      type: 'moons',
      data: [constant.EARTH_MOON],
      planet: options.planet
    });
  }
  
  /**
   * Add new moon
   * @param {HTMLElement} moon
   */
  function addMoon(moon) {
    // cleanPosPattern - use constructor cause bug with esprima at jscs
    var cleanPosPattern = new RegExp('^[0-9\\s]*\\.?\\s*', 'g'),
        moonName = moon.textContent
                       .replace(cleanPosPattern, '');

    facts({
      planet: options.planet,
      url: moon.href + '&Display=Facts',
      moon: moonName
    }, onMoonAdded);
    
    moonsData.push(moonName);
  }
  
  /**
   * Callback for adding new moon
   */
  function onMoonAdded() {
    moonsCount--;
    
    if (!moonsCount) {
      cb();
    }
  }
};
