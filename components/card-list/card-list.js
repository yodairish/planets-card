/* global _, Polymer */
'use strict';

Polymer({
  width: 600,
  height: 400,
  blocks: [],
  colors: [
    'F44336', '3F51B5', '03A9F4', '009688',
    'CDDC39', 'FF9800', '795548', '4CAF50'
  ],
  
  /**
   * Element prepared
   */
  ready: function() {
    this.updateBlocks();
  },
  
  /**
   * On change width size
   */
  widthChanged: function() {
    this.updateBlocks();
  },

  /**
   * On change height size
   */
  heightChanged: function() {
    this.updateBlocks();
  },
  
  /**
   * Update positions and sizes blocks
   */
  updateBlocks: function() {
    var nodes = this.$.content.getDistributedNodes();
        
    // TODO somehow get element size
    this.blocks = [{
      node: null,
      width: this.width,
      height: this.height,
      pos: [0, 0]
    }];
    
    _(nodes).each(this.setItem.bind(this));
    
    this.updateParameters();
  },
  
  /**
   * Set item for node
   * @param {HTMLElement} node
   */
  setItem: function(node) {
    var index = this.findBiggestBlock();

    if (this.blocks[index].node) {
      index = this.splitRectangle(index) - 1;
    }
    
    this.blocks[index].node = node;
  },
  
  /**
   * Get biggest existed block
   * @return {Number}
   */
  findBiggestBlock: function() {
    var bigIndex = 0,
        bigSize = 0;
    
    this.blocks.forEach(function(rect, index) {
      var size = rect.width * rect.height;
      
      if (!bigSize || size > bigSize) {
        bigIndex = index;
        bigSize = size;
      }
    }.bind(this));
    
    return bigIndex;
  },
  
  /**
   * Split block on two and return new index
   * @param {Number} index
   * @return {Number}
   */
  splitRectangle: function(index) {
    var block = this.blocks[index],
        orientation = (block.width > block.height ? 'width' : 'height'),
        newValue = parseInt(block[orientation] * _.random(0.3, 0.7), 10),
        newBLock = {
          node: null,
          width: block.width,
          height: block.height,
          pos: [block.pos[0], block.pos[1]]
        };
    
    block[orientation] = newValue;
    newBLock[orientation] -= newValue;
    
    if (orientation === 'width') {
      newBLock.pos[0] += newValue;
    } else {
      newBLock.pos[1] += newValue;
    }
    
    return this.blocks.push(newBLock);
  },
  
  /**
   * Set new attributes to blocks
   */
  updateParameters: function() {
    var colorInx = 0;
    
    this.blocks.forEach(function(block) {
      var node = block.node,
          color;
      
      colorInx++;
      
      if (colorInx >= this.colors.length) {
        colorInx = 0;
      }
      
      color = this.colors[colorInx];
      
      if (!node) {
        return;
      }
      
      node.setAttribute('width', block.width);
      node.setAttribute('height', block.height);
      node.setAttribute('color', color);
      node.style.left = block.pos[0] + 'px';
      node.style.top = block.pos[1] + 'px';
    }.bind(this));
  }
});
