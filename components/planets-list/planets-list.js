/* global Polymer */
'use strict';

Polymer({
  planetSize: 200,
  listSize: '2 4',
  
  /**
   * Update after dom ready
   */
  domReady: function() {
    this.planetsChanged();
  },
  
  /**
   * Update planet size
   */
  planetsChanged: function() {
    var size = this.planets.length;
    
    if (window.innerWidth >= window.innerHeight) {
      this.listSize = '2 4';
      this.planetSize = window.innerWidth / (size < 4 ? size : 4);
      
      if (this.planetSize * 2 > window.innerHeight) {
        this.planetSize = window.innerHeight / 2;
      }
      
    } else {
      this.listSize = '4 2';
      this.planetSize = window.innerHeight / (size < 4 ? size : 4);
      
      if (this.planetSize * 2 > window.innerWidth) {
        this.planetSize = window.innerWidth / 2;
      }
    }
  }
});
