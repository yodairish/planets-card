/* global Polymer */
'use strict';

Polymer({
  img: '', // empty pic
  size: 150,
  fontSize: 25,
  
  /**
   * On item size changed, update font size
   */
  sizeChanged: function() {
    this.fontSize = this.size / 6;
  }
});
