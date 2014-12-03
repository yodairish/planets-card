'use strict';

var jsdom = require('jsdom'),
    _ = require('../../bower_components/lodash/dist/lodash'),
    constant = require('./constants'),
    write = require('./writeJson'),
    facts = require('./factsPage');

/**
 * Adding moons data for planet
 * @param {string} planet
 * @url {string} url
 */
module.exports = function(planet, url) {
  var moonsData = [];
  
  getHtml();
  
  /**
   * Get html doc by url
   */
  function getHtml() {
    jsdom.env(
      url,
      parseHtml
    );
  }
  
  /**
   * Add moons files and data
   * @param {?Array} errors
   * @param {Object=} window
   */
  function parseHtml(errors, window) {
    if (planet === 'Earth') {
      earthMoon();
    } else {
      var moonsList = window.document.querySelector('.l2featuretext'),
          moons;
      
      if (moonsList) {
        moons = moonsList.querySelectorAll('a');
        
        _(moons).forEach(addMoon);
      }
    
      if (moonsData.length) {
        write({
          type: 'moons',
          data: moonsData,
          planet: planet
        });
      }
    }
  }
  
  /**
   * Add Earth moon
   */
  function earthMoon() {
    facts(
      planet,
      constant.PLANETS_URL + '?Object=' +
        constant.EARTH_MOON + constant.FACTS,
      'Moon'
    );
    
    write({
      type: 'moons',
      data: [constant.EARTH_MOON],
      planet: planet
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

    facts(
      planet,
      moon.href + '&Display=Facts',
      moonName
    );
    
    moonsData.push(moonName);
  }
};
