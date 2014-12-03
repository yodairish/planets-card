'use strict';

var jsdom = require('jsdom'),
    _ = require('../../bower_components/lodash/dist/lodash'),
    constant = require('./constants'),
    write = require('./writeJson');

/**
 * Add missions data to planet
 * @param {Object} options
 * @param {Function} cb
 */
module.exports = function(options, cb) {
  var missionsCount = 0,
      missionsData = [];
  
  getHtml();
  
  /**
   * Get html doc by url
   */
  function getHtml() {
    getPast();
  }
  
  /**
   * Get html for past missions
   */
  function getPast() {
    jsdom.env(
      options.url + constant.MISSION_PAST,
      parseHtml
    );
  }
  
  /**
   * Proccess dom for missions list page
   * @param {?Array} errors
   * @param {Object=} window
   * @return {boolean=}
   */
  function parseHtml(errors, window) {
    if (!window) {
      cb('missions');
      return;
    }
    
    var missions = window.document.querySelectorAll('.l2missiontitle');
    
    missionsCount = missions.length;

    if (missionsCount) {
      _(missions).forEach(function(mission) {
        jsdom.env(
          mission.href,
          parseHtmlDetail
        );
      });
      
    } else {
      cb('missions');
    }
  }
  
  /**
   * Proccess dom for mission detail page
   * @param {?Array} errors
   * @param {Object=} window
   * @return {boolean=}
   */
  function parseHtmlDetail(errors, window) {
    missionsCount--;
    
    if (window) {
      var doc = window.document,
          name = doc.querySelector('.pageTitle').textContent,
          keyDates = getKeyDates(doc),
          goals = getGoals(doc);
      
      missionsData.push({
        name: name,
        dates: keyDates,
        goals: goals
      });
    }
    
    if (!missionsCount) {
      write.add({
        type: 'missions',
        data: missionsData,
        planet: options.planet
      });
      
      cb('missions');
    }
  }
  
  /**
   * Get list of key dates
   * @param {Object} doc - window.document
   * @return {Array}
   */
  function getKeyDates(doc) {
    var headers = doc.querySelectorAll('.pastheaderbar'),
        dates = [];
    
    _(headers).forEach(function(header) {
      var sibling,
          dateRows;
      
      if (header.textContent.indexOf('Key Dates') !== -1) {
        sibling = header.parentElement.nextSibling;
        
        while (sibling.nodeType !== 1) {
          sibling = sibling.nextSibling;
        }
        
        dateRows = sibling.querySelectorAll('.l2eventdateblack');
        _(dateRows).forEach(function(row) {
          var dateElem = row.querySelector('b'),
              date;
              
          if (dateElem) {
            date = dateElem.textContent;
            dates.push({
              date: date,
              text: row.textContent.replace(date, '').trim()
            });
          }
        });
      }
    });
    
    return dates;
  }
  
  /**
   * Get goal and accomplishments
   * @param {Object} doc - window.document
   * @return {Object}
   */
  function getGoals(doc) {
    var texts = doc.querySelector('.l2missiontext')
                   .querySelectorAll('p'),
        goals = {},
        type;
        
    _(texts).forEach(function(paragraph) {
      var title = paragraph.querySelector('b'),
          text = paragraph.textContent;
        
      if (title) {
        type = title.textContent;
        text = text.replace(type, '');
      } else if (!type) {
        return;
      }
      
      if (!goals[type]) {
        goals[type] = text;
  
      } else {
        goals[type] += '\n' + text;
      }
    });
    
    return goals;
  }
};
