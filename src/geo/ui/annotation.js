cdb.geo.ui.Annotation = cdb.core.View.extend({

  className: "cartodb-overlay overlay-annotation",

  events: {
    "click": "stopPropagation"
  },

  default_options: { },

  stopPropagation: function(e) {
    e.stopPropagation();
  },

  initialize: function() {

    _.defaults(this.options, this.default_options);

    this.template = this.options.template;
    this.mapView  = this.options.mapView;

    this.extra = this.model.get("extra");

    this.mapView.map.bind('change',      this._place, this);
    this.mapView.map.bind('change:zoom', this._applyZoomLevelStyle, this);

    // zoom level config
    var minZoomLevel     = this.mapView.map.get("minZoom");
    var maxZoomLevel     = this.mapView.map.get("maxZoom");

  },

  _onMouseDown: function() {},

  _onMouseEnter: function() {

    this.$el.addClass("hover");

    if (this.editModel.get("mode") == "editable") {
      if (this.timeout) clearTimeout(this.timeout);
    }

  },

  _onMouseLeave: function() {
    this.$el.removeClass("hover");

    var self = this;

    if (this.editModel.get("mode") == "editable") {

      this.timeout = setTimeout(function() {

        self.editModel.set("mode", "");

      }, 250);
    }

  },

  show: function(animated) {

    this.$el.show();

    if (true) this.$el.addClass('animated bounceIn');

  },

  hide: function(callback) {

    var self = this;

    this.model.set("selected", false);

    this.$el
    .removeClass('animated bounceIn')
    .addClass('animated bounceOut')

    callback && _.isFunction(callback) && callback();

    // unbind from the map
    this.mapView.map.unbind('change',      this._place, this);
    this.mapView.map.unbind('change:zoom', this._applyZoomLevelStyle, this);

    // Give it some time to complete the animation
    setTimeout(function() {
      self.clean();
    }, 550);

  },

  _place: function () {

    var style      = this.model.get("style");
    var lineWidth  = style["line-width"];
    var textAlign  = style["text-align"];

    var
    pos             = this.mapView.latLonToPixel(this.extra.latlng),
    containerHeight = this.extra.height || 45,
    containerWidth  = this.$el.width(),
    size            = this.mapView.getSize();

    if (textAlign === "right") {
      left = pos.x - this.extra.width - lineWidth;
    } else {
      left = pos.x  + lineWidth;
    }

    this.$el.css({ top: pos.y - 13, left: left });

  },

  _onChangeDisplay: function() {

    var display = this.model.get("display");

    if (display) {
      this.show();
    } else {
      this.$el.hide();
    }

  },


  _applyzoomlevelstyle: function() {

    var style      = this.model.get("style");

    var boxColor   = style["box-color"];
    var boxOpacity = style["box-opacity"];
    var lineColor  = style["line-color"];

    var minZoom    = style["zoom-min"];
    var maxZoom    = style["zoom-max"];

    var currentZoom = this.mapView.map.get("zoom");
    var textOpacity = 1;

    if (currentZoom >= minZoom && currentZoom <= maxZoom) {

      textOpacity = 1;

      var rgbaLineCol = 'rgba(' + parseInt(lineColor.slice(-6,-4),16)
      + ',' + parseInt(lineColor.slice(-4,-2),16)
      + ',' + parseInt(lineColor.slice(-2),16)
      +', ' + 1 + ' )';

      var rgbaBoxCol = 'rgba(' + parseInt(boxColor.slice(-6,-4),16)
      + ',' + parseInt(boxColor.slice(-4,-2),16)
      + ',' + parseInt(boxColor.slice(-2),16)
      +', ' + boxOpacity + ' )';

    } else {

      textOpacity = .5;

      var rgbaLineCol = 'rgba(' + parseInt(lineColor.slice(-6,-4),16)
      + ',' + parseInt(lineColor.slice(-4,-2),16)
      + ',' + parseInt(lineColor.slice(-2),16)
      +', ' + .2 + ' )';

      var rgbaBoxCol = 'rgba(' + parseInt(boxColor.slice(-6,-4),16)
      + ',' + parseInt(boxColor.slice(-4,-2),16)
      + ',' + parseInt(boxColor.slice(-2),16)
      +', ' + .2 + ' )';

    }

    this.$el.find(".text").animate({ opacity: textOpacity }, 150);

    this.$el.css("background-color", rgbaBoxCol);

    this.$el.find(".stick").css("background-color", rgbaLineCol);
    this.$el.find(".ball").css("background-color", rgbaLineCol);

  },

  _applyStyle: function(save) {

    var style      = this.model.get("style");

    var textAlign  = style["text-align"];
    var boxColor   = style["box-color"];
    var boxOpacity = style["box-opacity"];
    var boxPadding = style["box-padding"];

    var lineWidth  = style["line-width"];
    var lineColor  = style["line-color"];
    var fontFamily = style["font-family-name"];

    if (boxOpacity === 0) {
      this.$el.addClass("border-dark");
    } else {
      this.$el.removeClass("border-dark");
    }

    this.$text.css(style);

    this.$el.find(".content").css("padding", boxPadding);
    this.$text.css("font-size", style["font-size"] + "px");
    this.$el.css("z-index", style["z-index"]);

    this.$el.find(".stick").css({ width: lineWidth, left: -lineWidth });

    var fontFamilyClass = "";

    if      (fontFamily  == "Droid Sans") fontFamilyClass = "droid";
    else if (fontFamily  == "Vollkorn")   fontFamilyClass = "vollkorn";
    else if (fontFamily  == "Open Sans")  fontFamilyClass = "open_sans";
    else if (fontFamily  == "Roboto")     fontFamilyClass = "roboto";

    this.$el
    .removeClass("droid")
    .removeClass("vollkorn")
    .removeClass("roboto")
    .removeClass("open_sans");

    this.$el.addClass(fontFamilyClass);

    if (textAlign === "right") {
      this.$el.addClass("align-right");
      this.$el.find(".stick").css({ left: "auto", right: -lineWidth });
    } else {
      this.$el.removeClass("align-right");
    }

    this._place();

    this._applyZoomLevelStyle();

    if (save) this.model.save();

    var self = this;

    setTimeout(function() {
      var width = self.$el.width();
      self.$el.css("width", self.$el.width() + .4); // ? but it seems to work (TODO: check more browsers)
    }, 500);

  },

  _applyZoomLevelStyle: function() {

    var style      = this.model.get("style");

    var boxColor   = style["box-color"];
    var boxOpacity = style["box-opacity"];
    var lineColor  = style["line-color"];

    var minZoom    = style["zoom-min"];
    var maxZoom    = style["zoom-max"];

    var currentZoom = this.mapView.map.get("zoom");
    var textOpacity = 1;

    if (currentZoom >= minZoom && currentZoom <= maxZoom) {

      textOpacity = 1;

      var rgbaLineCol = 'rgba(' + parseInt(lineColor.slice(-6,-4),16)
      + ',' + parseInt(lineColor.slice(-4,-2),16)
      + ',' + parseInt(lineColor.slice(-2),16)
      + ',' + 1 + ' )';

      var rgbaBoxCol = 'rgba(' + parseInt(boxColor.slice(-6,-4),16)
      + ',' + parseInt(boxColor.slice(-4,-2),16)
      + ',' + parseInt(boxColor.slice(-2),16)
      + ',' + boxOpacity + ' )';

    } else {

      textOpacity = .5;

      var rgbaLineCol = 'rgba(' + parseInt(lineColor.slice(-6,-4),16)
      + ',' + parseInt(lineColor.slice(-4,-2),16)
      + ',' + parseInt(lineColor.slice(-2),16)
      + ',' + .2 + ' )';

      var rgbaBoxCol = 'rgba(' + parseInt(boxColor.slice(-6,-4),16)
      + ',' + parseInt(boxColor.slice(-4,-2),16)
      + ',' + parseInt(boxColor.slice(-2),16)
      + ',' + .2 + ' )';

    }

    this.$el.find(".text").animate({ opacity: textOpacity }, 150);

    this.$el.css("background-color", rgbaBoxCol);

    this.$el.find(".stick").css("background-color", rgbaLineCol);
    this.$el.find(".ball").css("background-color", rgbaLineCol);

  },
  render: function() {

    this.$el.html(this.template(_.extend(this.model.attributes, { text: this.model.attributes.extra.rendered_text })));

    this.$text = this.$el.find(".text");

    this._applyStyle();

    return this;

  }

});