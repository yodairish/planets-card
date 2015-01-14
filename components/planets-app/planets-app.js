/* global Polymer */
'use strict';

Polymer({
  /**
   * Element prepared
   */
  created: function() {
    this.data = {};
  },
  
  /**
   * Update detail view with new data
   */
  updateDetail: function(e, data) {
    this.data = data;
  }
});
