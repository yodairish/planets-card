/* global Polymer */
'use strict';

Polymer({
  changingHistory: false,
  
  /**
   * Element prepared
   */
  created: function() {
    window.addEventListener('popstate', this.goHistory.bind(this));
  },
  
  /**
   * Save history on data update
   */
  dataChanged: function() {
    if (!this.changingHistory) {
      history.pushState(this.data);
    }
    
    this.changingHistory = false;
  },
  
  /**
   * Update with data from history
   */
  goHistory: function() {
    if (!history.state) {
      this.fire('planetsList');
      
    } else {
      this.changingHistory = true;
      this.fire('detail', history.state);
    }
  }
});
