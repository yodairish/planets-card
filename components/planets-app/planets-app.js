/* global Polymer */
'use strict';

Polymer({
  detailView: '',
  
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
    this.detailView = 'detailView';
  },
  
  /**
   * Show planets list
   */
  showPlanets: function() {
    this.detailView = '';
  }
});
