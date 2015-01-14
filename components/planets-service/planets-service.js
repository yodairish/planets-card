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
  postsLoaded: function() {
    this.planets = this.$.ajax.response.slice(0);
  }
  
});
