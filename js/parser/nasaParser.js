'use strict';

var planets = require('./planets'),
    argv = require('../paramValue'),
    // CONSTANTS
    PLANETS = ['Mercury', 'Venus', 'Earth', 'Mars',
               'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    argPlanet = argv('-planet');

if (PLANETS.indexOf(argPlanet) !== -1) {
  planets(argPlanet);
}
// else {
//   PLANETS.forEach(planets);
// }
