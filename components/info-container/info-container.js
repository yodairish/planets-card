/* global Polymer */
'use strict';

Polymer({
  active: false,
  title: '',
  width: 500,
  listLines: 2,
  cardsWidth: 500,
  cardsHeight: 500,
  titleHeight: 70,
  visibility: 'none',
  
  /**
   * Element prepared
   */
  created: function() {
    this.width = window.innerWidth * 0.6;

    if ((this.width / window.innerHeight) > 1) {
      this.listLines = 1;
    }
    
    this.updateCardsSize();
    this.activeChanged();
  },
  
  /**
   * Update size of cards container
   */
  updateCardsSize: function() {
    var tabsListsHeight = ((this.width / 4) * this.listLines);
    
    this.cardsWidth = this.width;
    this.cardsHeight = window.innerHeight - this.titleHeight -
                       tabsListsHeight - 48;
  },
  
  /**
   * Change element visibility by the state
   */
  activeChanged: function() {
    this.visibility = (this.active ? 'block' : 'none');
    
    this.style.display = this.visibility;
  }
});
