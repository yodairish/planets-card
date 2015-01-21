/* global Polymer */
'use strict';

Polymer({
  /**
   * Element prepared
   */
  created: function() {
    this.planets = [];
  },
  
  /**
   * Save data from a file
   */
  planetsLoaded: function() {
    this.planets = this.$.ajax.response.planets;
  }
  
});
