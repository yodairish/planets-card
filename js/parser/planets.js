'use strict';

var argv = require('../paramValue'),
    facts = require('./factsPage'),
    moons = require('./moonsPage'),
    missions = require('./missions'),
    constant = require('./constants'),
    modules = {
      facts: true,
      moons: true,
      missions: true
    },
    types = argv('-type');

if (types) {
  types = types.split(',');
  
  modules.facts = types.indexOf('facts') !== -1;
  modules.moons = types.indexOf('moons') !== -1;
  modules.missions = types.indexOf('mission') !== -1;
}

/**
 * Get data for planet
 * @param {string} planet
 */
module.exports = function(planet) {
  if (modules.facts) {
    facts(planet, constant.PLANETS_URL + '?Object=' + planet + constant.FACTS);
  }
  
  if (modules.moons) {
    moons(planet, constant.PLANETS_URL + '?Object=' + planet + constant.MOONS);
  }
  
  if (modules.missions) {
    missions(planet, constant.MISSIONS_URL + constant.MISSION_TARGET + planet);
  }
};
