'use strict';

var fs = require('fs-extra'),
    globby = require('globby'),
    imagesList = require('../../planets/data/images.json'),
    factIcons = require('../../planets/data/factIcons.json'),
    planetsData = {
      planets: []
    },
    missedIcons = {},
    
    // MAX_SUBTITLE = 50,
    COMBINE_PATH = __dirname + '/../../planets/data/planets.json',
    MISSED_ICONS_PATH = __dirname + '/../../planets/data/missedFactIcons.json';

/**
 * Get info for the planets
 */
globby(
  ['planets/**/*.json',
   '!planets/data/**', '!planets/planets.json', '!planets/**/moons/**'],
  function(err, files) {
    files.forEach(readPlanet);
    
    write();
  }
);

/**
 * Get data from a file on the path
 * @param {string} path
 */
function readPlanet(path) {
  var data = fs.readJsonSync(path),
      planetData;
  
  if (data) {
    planetData = {
      name: getNameFromPath(path),
      cards: getFactCards(data),
      lists: getLists(data, path)
    };
    
    planetData.img = getFrontImages(planetData.name);
    
    planetsData.planets.push(planetData);
  }
}

/**
 * Extracts name from path
 * @param {string} path
 * @return {string}
 */
function getNameFromPath(path) {
  return path.replace(/(.*\/)|(\.json)/g, '');
}

/**
 * Getting info cards by planet data
 * @param {Object} data
 * @return {Array}
 */
function getFactCards(data) {
  var cards = [],
      facts = (data.facts ? Object.keys(data.facts) : []);
      
  facts.forEach(function(fact) {
    var card = {
      title: fact,
      text: getCardText(data.facts[fact]),
      icon: ''
    };
    
    if (factIcons[fact]) {
      card.icon = factIcons[fact];
      
    } else {
      missedIcons[fact] = true;
    }
    
    // card.subTitle = getCardSubTitle(card.text);
    
    cards.push(card);
  });
  
  return cards;
}

/**
 * Getting info cards by planet data
 * @param {Object} data
 * @return {Array}
 */
function getMissionCards(data) {
  var cards = [],
      dates = getMissionDates(data),
      goals = getMissionGoals(data);
    
  if (dates) {
    cards.push(dates);
  }
  
  cards = cards.concat(goals);
  
  return cards;
}

/**
 * Get mission dates
 * @param {Object} data
 * @return {Object=}
 */
function getMissionDates(data) {
  var dates;
  
  if (data.dates) {
    dates = {
      title: 'dates',
      text: getCardText(data.dates),
      icon: ''
      
    };
    
    if (factIcons.dates) {
      dates.icon = factIcons.dates;
      
    } else {
      missedIcons.dates = true;
    }
  }
  
  return dates;
}

/**
 * Get mission dates
 * @param {Object} data
 * @return {Array}
 */
function getMissionGoals(data) {
  var goals = [],
      goal,
      accomplishments;
  
  if (data.goals) {
    if (data.goals.Goals) {
      goal = {
        title: 'Goals',
        text: [
          data.goals.Goals
        ],
        icon: ''
      };
      
      if (factIcons.goal) {
        goal.icon = factIcons.goal;
        
      } else {
        missedIcons.goal = true;
      }
      
      goals.push(goal);
    }
    
    if (data.goals.Accomplishments) {
      accomplishments = {
        title: 'Accomplishments',
        text: [
          data.goals.Accomplishments
        ],
        icon: ''
      };
      
      if (factIcons.accomplishments) {
        accomplishments.icon = factIcons.accomplishments;
        
      } else {
        missedIcons.accomplishments = true;
      }
      
      goals.push(accomplishments);
    }
  }
  
  return goals;
}

/**
 * Generate text data from card info
 * @param {Array} cardInfo
 * @return {Array}
 */
function getCardText(cardInfo) {
  var texts = [];
  
  cardInfo.forEach(function(info) {
    var text = (info.date ? info.date + ' ' : '') +
               (info.type ? info.type + ': ' : '') +
               info.text;
    
    texts.push(text);
  });
  
  return texts;
}

/**
 * Generate text data from card info
 * @param {Array} cardTexts
 * @return {String}
 */
// function getCardSubTitle(cardTexts) {
//   var subTitle = '';
  
//   if (cardTexts.length && cardTexts[0].length < MAX_SUBTITLE) {
//     subTitle = cardTexts[0].replace(/^.*: /, '');
//   }
  
//   return subTitle;
// }

/**
 * Getting lists of moons and missions
 * @param {Object} data
 * @param {String} path
 * @return {Array}
 */
function getLists(data, path) {
  var lists = [],
      moons = getMoons(data.moons, path),
      missions = getMissions(data.missions);
  
  if (moons) {
    lists.push(moons);
  }
  
  if (missions) {
    lists.push(missions);
  }
  
  return lists;
}

/**
 * @param {Array=} missionsList
 * @param {Object=}
 */
function getMissions(missionsList) {
  var missions;
  
  if (Array.isArray(missionsList) && missionsList.length) {
    missions = {
      title: 'Missions',
      items: []
    };
    
    missionsList.forEach(function(mission) {
      var item = {
        name: mission.name,
        cards: getMissionCards(mission),
        img: getFrontImages(mission.name, 'mission')
      };
      
      missions.items.push(item);
    });
  }
  
  return missions;
}

/**
 * @param {Array} moonsList
 * @param {String} path
 * @return {Object=}
 */
function getMoons(moonsList, path) {
  var moons;
  
  if (Array.isArray(moonsList) && moonsList.length) {
    moons = {
      title: 'Moons',
      items: []
    };
    
    moonsList.forEach(function(moon) {
      var moonPath = path.replace(/[^\/]*(\.json)$/, 'moons/' + moon + '$1'),
          data = fs.readJsonSync(moonPath),
          item;
          
      if (data) {
        item = {
          name: moon,
          cards: getFactCards(data),
          lists: getLists(data, moonPath),
          img: getFrontImages(moon, 'moon')
        };
        
        moons.items.push(item);
      }
    });
  }
  
  return moons;
}

/**
 * Get image for object by the name
 * @param {String} name
 * @param {String} type
 * @return {String}
 */
function getFrontImages(name, type) {
  var image = '';
  
  if (Array.isArray(imagesList[name])) {
    image = 'images/' + name + '/' + imagesList[name][0];
    
  } else if (type === 'moon') {
    image = 'images/moon.jpg';
    
  } else if (type === 'mission') {
    image = 'images/mission.jpg';
    
  }
  
  return image;
}

/**
 * Write data into file
 */
function write() {
  fs.outputJson(COMBINE_PATH, planetsData, function(err) {
    if (!err) {
      console.log('The file was saved!');
    } else {
      console.log(err);
    }
  });
  
  fs.outputJson(MISSED_ICONS_PATH, missedIcons, function(err) {
    if (!err) {
      console.log('Missed icons was!');
    } else {
      console.log(err);
    }
  });
}
