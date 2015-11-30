var View = require('cdb/core/view');
var template = require('./torque-controls.tpl');

/**
 * Torque animation controls, to manage run state
 */
module.exports = View.extend({

  tagName: 'button',
  className: 'Widget-buttonIcon Widget-buttonIcon--circleBig is-selected',

  events: {
    'click': '_onClick'
  },

  initialize: function() {
    this.model.bind('change:isRunning', this.render, this);
  },

  render: function() {
    this.$el.html(
      template({
        iconClass: this.model.get('isRunning')
          ? 'Widget-timeSeriesPauseIcon'
          : 'Widget-timeSeriesPlayIcon'
      })
    );

    return this;
  },

  _onClick: function() {
    if (this.model.get('isRunning')) {
      this.model.pause();
    } else {
      this.model.play();
    }
  }
});