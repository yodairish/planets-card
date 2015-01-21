/* global _, Polymer */
'use strict';

Polymer({
  row: 3,
  col: 3,
  size: '',
  cell: 150,
  full: false,
  pageWidth: 450,
  pageHeight: 450,
  pagesCount: 1,
  pagesContainerWidth: 450,
  pageShift: 0,
  page: 0,
  fullLayout: ['layout', 'horizontal', 'center', 'wrap', 'around-justified'],
  
  /**
   * Inserted into DOM
   */
  attached: function() {
    this.cellChanged();
    this.onMutation(this, this.cellChanged);
  },
  
  /**
   * On cell size change
   */
  cellChanged: function() {
    this.rowChanged();
    this.colChanged();
    this.updateCells();
  },
  
  /**
   * On rows count change
   */
  rowChanged: function() {
    if (!this.row) {
      return;
    }
    
    this.pageHeight = this.row * this.cell;
    this.updatePagination();
  },
  
  /**
   * On columns count change
   */
  colChanged: function() {
    if (!this.col) {
      return;
    }
    
    this.pageWidth = this.col * this.cell;
    this.updatePagination();
  },
  
  /**
   * On size attr change
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
   * On current page change
   */
  pageChanged: function() {
    var leftHidden = (this.page <= 0 ? 'add' : 'remove'),
        rightHidden = ((this.page >= this.pagesCount - 1) ? 'add' : 'remove');
    
    this.pageShift = -(this.page * this.pageWidth);
    
    this.$.scrollLeft.classList[leftHidden]('hidden');
    this.$.scrollRight.classList[rightHidden]('hidden');
  },
  
  /**
   * On full state change
   */
  fullChanged: function() {
    this.fullLayout.forEach(function(attr) {
      this.$.scrollBody[
        (this.full ? 'setAttribute' : 'removeAttribute')
      ](attr, '');
    }.bind(this));
  },
  
  /**
   * Update child items size
   */
  updateCells: function() {
    var nodes = this.$.content.getDistributedNodes();

    _(nodes).forEach(function(node) {
      node.setAttribute('size', this.cell);
    }.bind(this));
  },
  
  /**
   * Update pagination elements
   * @param {HTMLElement} nodes
   */
  updatePagination: function(nodes) {
    nodes = nodes || this.$.content.getDistributedNodes();
    
    var pageSize = this.row * this.col;
        
    this.pagesCount = Math.ceil(nodes.length / pageSize);
    this.pagesContainerWidth = this.pagesCount * this.pageWidth;
    
    if (this.page === 0) {
      this.pageChanged();
    } else {
      this.page = 0;
    }
  },
  
  /**
   * Goes to the next page
   */
  nextPage: function() {
    if (this.page >= this.pagesCount - 1) {
      return;
    }
    
    this.page++;
  },
  
  /**
   * Goes to the previously page
   */
  prevPage: function() {
    if (this.page <= 0) {
      return;
    }
    
    this.page--;
  }
});
