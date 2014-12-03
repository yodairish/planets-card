'use strict';

var argv = require('../paramValue'),
    facts = require('./factsPage'),
    moons = require('./moonsPage'),
    missions = require('./missions'),
    constant = require('./constants'),
    write = require('./writeJson'),
    modules = {
      facts: true,
      moons: true,
      missions: true
    },
    processCount = 3,
    types = argv('-type'),
    keys;

if (types) {
  types = types.split(',');
  
  modules.facts = types.indexOf('facts') !== -1;
  modules.moons = types.indexOf('moons') !== -1;
  modules.missions = types.indexOf('mission') !== -1;
  
  keys = Object.keys(modules);
  keys.forEach(function(key) {
    if (!modules[key]) {
      processCount--;
    }
  });
}

/**
 * Get data for planet
 * @param {string} planet
 */
module.exports = function(planet) {
  if (modules.facts) {
    facts({
      planet: planet,
      url: constant.PLANETS_URL + '?Object=' + planet + constant.FACTS
    }, onDone);
  }
  
  if (modules.moons) {
    moons({
      planet: planet,
      url: constant.PLANETS_URL + '?Object=' + planet + constant.MOONS
    }, onDone);
  }
  
  if (modules.missions) {
    missions({
      planet: planet,
      url: constant.MISSIONS_URL + constant.MISSION_TARGET + planet
    }, onDone);
  }
};

/**
 * Callback than module is complete
 */
function onDone() {
  console.log('done', processCount);
  processCount--;
  
  if (!processCount) {
    write.done();
  }
}
