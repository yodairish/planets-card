'use strict';

var jsdom = require('jsdom'),
    _ = require('../../bower_components/lodash/dist/lodash'),
    write = require('./writeJson');

/**
 * Get facts data for planet or moon
 * @param {Object} options
 * @param {Function} cb
 */
module.exports = function(options, cb) {
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
   * Proccess dom
   * @param {?Array} errors
   * @param {Object=} window
   */
  function parseHtml(errors, window) {
    if (!window) {
      return;
    }
    
    var tableLines = window.document.querySelectorAll(
      '.bodyContentTab .l2text > table > tbody > tr'
    );

    write.add({
      type: 'facts',
      data: getProperties(tableLines),
      planet: options.planet,
      moon: options.moon
    });
    
    cb();
  }
  
  /**
   * Get properties from lines
   * @param {Array} lines - dom elements list
   * @return {Object}
   */
  function getProperties(lines) {
    var planetObject = {};
    
    _(lines).forEach(function(row) {
      var title = getPropTitle(row);
      
      if (!title) {
        return;
      }
      
      planetObject[title] = getPropData(row);
    });

    return planetObject;
  }
  
  /**
   * Get parameter name
   * @param {HTMLElement} row
   * @return {string}
   */
  function getPropTitle(row) {
    var title = row.querySelector('.l2featuresmalltitle');
    
    return (title ? title.textContent : '');
  }
  
  /**
   * Get parameter value
   * @param {HTMLElement} row
   * @return {Array} - dom elements list
   */
  function getPropValueRaws(row) {
    return row.querySelectorAll('.l2featuretext');
  }
  
  /**
   * Get values for parameter
   * @param {HTMLElement} row
   * @return {Array}
   */
  function getPropData(row) {
    var info = getPropValueRaws(row),
        lines = [];
    
    _(info).forEach(function(line) {
      var typeElem = line.querySelector('b'),
          type = (typeElem ? typeElem.textContent : ''),
          data = {
            text: line.textContent
          };
      
      if (type) {
        data.type = type.replace(':', '').trim();
        data.text = data.text.replace(type, '').trim();
      }
      
      lines.push(data);
    });
    
    lines = addPropComparison(row, lines);
    
    return lines;
  }
  
  /**
   * Get comparison to Earth value
   * @param {HTMLElement} row
   * @param {Array} lines
   * @return {Array}
   */
  function addPropComparison(row, lines) {
    var comparison = row.querySelector('.l2bycomparison');
    
    if (comparison) {
      lines.push({
        type: 'comparison',
        text: comparison.textContent
                .replace('By Comparison:', '')
                .trim()
      });
    }
    
    return lines;
  }
};
