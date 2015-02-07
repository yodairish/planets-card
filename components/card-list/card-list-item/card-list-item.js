/* global Polymer */
'use strict';

Polymer({
  width: 0,
  height: 0,
  color: 'FFFFFF',
  icon: 'some',
  styleContainer: {},
  
  /**
   * Declare reflected attributes
   */
  publish: {
    active: {
      value: false,
      reflect: true
    }
  },
  
  /**
   * Set default styles
   */
  created: function() {
    this.styleContainer = {
      minWidth: this.width + 'px',
      minHeight: this.height + 'px',
      backgroundColor: '#' + this.color
    };
  },
  
  /**
   * On width changed
   */
  widthChanged: function() {
    this.setStyleProp('minWidth', (this.width + 'px'));
  },
  
  /**
   * On height changed
   */
  heightChanged: function() {
    this.setStyleProp('minHeight', (this.height + 'px'));
  },
  
  /**
   * On color changed
   */
  colorChanged: function() {
    this.setStyleProp('backgroundColor', ('#' + this.color));
  },
  
  /**
   * Change the value of the style properties
   * @param {String} prop
   * @param {String} value
   */
  setStyleProp: function(prop, value) {
    var props = Object.keys(this.styleContainer),
        newStyle = {};
    
    props.forEach(function(curProp) {
      var newValue = (curProp === prop ? value :
                      this.styleContainer[curProp]);
      
      newStyle[curProp] = newValue;
    }.bind(this));
    
    if (!newStyle[prop]) {
      newStyle[prop] = value;
    }
    
    this.styleContainer = newStyle;
  },
  
  /**
   * Open detail view
   */
  showCard: function() {
    this.active = true;
  },
  
  /**
   * Close detail view
   */
  closeDetail: function(event) {
    event.stopPropagation();
    this.active = false;
  }
});
