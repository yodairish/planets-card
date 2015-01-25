'use strict';

var planets = require('../../planets/data/planets.json'),
    listOfEmpty = [];
    
checkImages(planets.planets);
console.dir(listOfEmpty);

/**
 * Checking on any images for the items
 * @param {Array} items
 */
function checkImages(items) {
  items.forEach(function(item) {
    if (!item.img) {
      if (listOfEmpty.indexOf(item.name) === -1) {
        listOfEmpty.push(item.name);
      }
    }
    
    if (Array.isArray(item.lists) && item.lists.length) {
      item.lists.forEach(function(list) {
        checkImages(list.items);
      });
    }
  });
}
