/* global _, Polymer */
'use strict';

Polymer({
  tabName: 'Tab',
  tabs: [],
  tab: 0,
  row: 3,
  col: 3,
  size: '',
  cell: 150,
  pageStyle: {},
  
  /**
   * An instance of the element is created.
   */
  created: function() {
    this.pageStyle = {
      width: '450px',
      height: '450px'
    };
  },
  
  /**
   * Element prepared
   */
  ready: function() {
    this.updateContent();
  },
  
  /**
   * On cell size change
   */
  cellChanged: function() {
    this.updateContent();
  },
  
  /**
   * On rows count change
   */
  rowChanged: function() {
    this.pageStyle = {
      width: this.pageStyle.width,
      height: (this.row * this.cell) + 'px'
    };
    
    this.updateContent();
  },
  
  /**
   * On columns count change
   */
  colChanged: function() {
    this.pageStyle = {
      width: (this.col * this.cell) + 'px',
      height: this.pageStyle.height
    };
    
    this.updateContent();
  },
  
  /**
   * On size change
   */
  sizeChanged: function() {
    var sizes = this.size.toString().split(' '),
        row = parseInt(sizes[0], 10),
        col = parseInt(sizes[1], 10);
    
    if (!isNaN(row)) {
      this.row = row;
    }
    
    if (!isNaN(col)) {
      this.col = col;
    }
  },
  
  /**
   * Update lists and tabs
   */
  updateContent: function() {
    var lists = this.$.content.getDistributedNodes();

    this.updateLists(lists);
    this.updateTabs(lists);
    
    this.onMutation(this, this.updateContent);
  },
  
  /**
   * Change size lists
   * @param {HTMLElement} lists
   */
  updateLists: function(lists) {
    if (!lists.length) {
      return;
    }

    _(lists).each(function(list) {
      list.setAttribute('cell', this.cell);
      list.setAttribute('size', this.row + ' ' + this.col);
    }.bind(this));
  },
  
  /**
   * Create tabs for lists
   * @param {HTMLElement} lists
   */
  updateTabs: function(lists) {
    var num = 1;
    
    this.tabs = [];
    
    _(lists).each(function(list) {
      var title = list.getAttribute('title') || this.tabName + ' ' + num;
      
      this.tabs.push(title);
      num++;
    }.bind(this));
  }
});
