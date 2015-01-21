/* global Polymer */
'use strict';

Polymer({
  title: '',
  width: 500,
  cellsDevide: 4,
  listLines: 1,
  cardsWidth: 500,
  cardsHeight: 500,
  titleHeight: 70,
  
  /**
   * Element prepared
   */
  created: function() {
    this.data = {};
    
    this.width = window.innerWidth * 0.6;

    // if ((this.width / window.innerHeight) > 1) {
    //   this.listLines = 1;
    // }
    
    this.updateCardsSize();
  },
  
  /**
   * Update size of cards container
   */
  updateCardsSize: function() {
    var tabsListsHeight = 0;
    
    if (this.data.lists && this.data.lists.length) {
      tabsListsHeight = ((this.width / 4) * this.listLines) +
                        48; // tabs height
    }
    
    this.cardsWidth = this.width;
    this.cardsHeight = window.innerHeight - this.titleHeight - tabsListsHeight;
  },
  
  /**
   * Update lists based on the data
   */
  dataChanged: function() {
    // if (this.data.lists) {
    //   var max = 0;
      
    //   this.data.lists.forEach(function(list) {
    //     var count = list.items.length;
        
    //     if (count > max) {
    //       max = count;
    //     }
    //   });
      
    //   if (max <= 4) {
    //     this.listLines = 1;
    //   }
    // }
    this.updateCardsSize();
  }
});
