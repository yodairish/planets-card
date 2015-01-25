'use strict';

var fs = require('fs-extra'),
    globby = require('globby'),
    planetsData = {
      planets: []
    },
    
    MAX_SUBTITLE = 50,
    COMBINE_PATH = __dirname + '/../../planets/data/planets.json';

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
      text: getCardText(data.facts[fact])
    };
    
    card.subTitle = getCardSubTitle(card.text);
    
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
      text: getCardText(data.dates)
    };
  }
  
  return dates;
}

/**
 * Get mission dates
 * @param {Object} data
 * @return {Array}
 */
function getMissionGoals(data) {
  var goals = [];
  
  if (data.goals) {
    if (data.goals.Goals) {
      goals.push({
        title: 'Goals',
        text: data.goals.Goals
      });
    }
    
    if (data.goals.Accomplishments) {
      goals.push({
        title: 'Accomplishments',
        text: data.goals.Accomplishments
      });
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
function getCardSubTitle(cardTexts) {
  var subTitle = '';
  
  if (cardTexts.length && cardTexts[0].length < MAX_SUBTITLE) {
    subTitle = cardTexts[0].replace(/^.*: /, '');
  }
  
  return subTitle;
}

/**
 * Getting lists of moons and missions
 * @param {Object} data
 * @param {String} path
 * @return {Array}
 */
function getLists(data, path) {
  var lists = [],
      missions = getMissions(data.missions),
      moons = getMoons(data.moons, path);
      
  if (missions) {
    lists.push(missions);
  }
  
  if (moons) {
    lists.push(moons);
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
      name: 'Missions',
      items: []
    };
    
    missionsList.forEach(function(mission) {
      var item = {
        name: mission.name,
        cards: getMissionCards(mission)
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
      name: 'Moons',
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
          lists: getLists(data, moonPath)
        };
        
        moons.items.push(item);
      }
    });
  }
  
  return moons;
}

/**
 * Write data into file
 */
function write() {
  fs.outputJson(COMBINE_PATH, planetsData, function(err) {
    if (!err) {
      console.log('The file was saved!');
    }
  });
}