var _ = require('underscore');
var CategoryModel = require('cdb/geo/ui/widgets/category/model.js');
var ViewModel = require('cdb/geo/ui/widgets/widget_content_model.js');
var OptionsView = require('cdb/geo/ui/widgets/category/options/options_view.js');
var WindshaftFiltersCategory = require('cdb/windshaft/filters/category');
var $ = require('jquery');

describe('widgets/category/options_view', function() {

  beforeEach(function() {
    this.model = new CategoryModel(null, {
      filter: new WindshaftFiltersCategory()
    });
    this.viewModel = new ViewModel();
    this.view = new OptionsView({
      viewModel: this.viewModel,
      dataModel: this.model
    });
  });

  it('should render properly', function() {
    this.model.setCategories([{ name: 'test' }]);
    this.view.render();
    var $el = this.view.$el;
    expect($el.find('.Widget-textSmaller').length).toBe(1);
    expect($el.find('.Widget-link').length).toBe(1);
    expect($el.find('.Widget-link').text()).toBe('none');
  });

  describe('bind', function() {

    beforeEach(function() {
      spyOn(this.model, 'bind');
      spyOn(this.viewModel, 'bind');
      this.view._initBinds();
    });

    it('should render when any of this events are triggered from data model', function() {
      var bind = this.model.bind.calls.argsFor(0);
      expect(bind[0]).toEqual('change:data change:filter change:locked change:lockCollection');
      expect(bind[1]).toEqual(this.view.render);
    });

    it('should render when search is enabled/disabled', function() {
      var bind = this.viewModel.bind.calls.argsFor(0);
      expect(bind[0]).toEqual('change:search');
      expect(bind[1]).toEqual(this.view.render);
    });

  });

  describe('render', function() {

    it('should render selected all from the beginning', function() {
      this.view.render();
      expect(this.view.$('.Widget-textSmaller').length).toBe(1);
      expect(this.view.$('.Widget-textSmaller').text()).toContain('All selected');
    });

    it('should render only a text with locked/selected items when search is enabled', function() {
      spyOn(this.viewModel, 'isSearchEnabled').and.returnValue(true);
      this.view.render();
      expect(this.view.$('.Widget-textSmaller').length).toBe(1);
      expect(this.view.$('.Widget-textSmaller').text()).toContain('0 selected');
      expect(this.view.$('.Widget-filterButtons').length).toBe(0);
    });

    it('should render only number of locked items if widget is locked', function() {
      spyOn(this.model, 'isLocked').and.returnValue(true);
      this.view.render();
      expect(this.view.$('.Widget-textSmaller').length).toBe(1);
      expect(this.view.$('.Widget-textSmaller').text()).toContain('0 selected');
      expect(this.view.$('.Widget-filterButtons').length).toBe(0);
    });

    it('should render filter buttons if widget is neither locked nor search enabled', function() {
      spyOn(this.model, 'isLocked').and.returnValue(false);
      spyOn(this.viewModel, 'isSearchEnabled').and.returnValue(false);
      this.model.acceptFilters('Hey');
      this.model.setCategories([{ name: 'Hey' }, { name: 'Buddy' }]);
      this.view.render();
      expect(this.view.$('.Widget-textSmaller').length).toBe(1);
      expect(this.view.$('.Widget-textSmaller').text()).toContain('1 selected');
      expect(this.view.$('.Widget-filterButtons').length).toBe(1);
      expect(this.view.$('.js-all').length).toBe(1);
      expect(this.view.$('.js-none').length).toBe(1);
    });

    it('should render all button if all categories are rejected', function() {
      spyOn(this.model, 'isAllFiltersRejected').and.returnValue(true);
      this.view.render();
      expect(this.view.$('.js-all').length).toBe(1);
      expect(this.view.$('.js-none').length).toBe(0);
    });

    it('should render none button if all categories are not rejected', function() {
      spyOn(this.model, 'isAllFiltersRejected').and.returnValue(false);
      this.model.setCategories([{ name: 'Hey' }, { name: 'Buddy' }]);
      this.view.render();
      expect(this.view.$('.js-all').length).toBe(0);
      expect(this.view.$('.js-none').length).toBe(1);
    });

  });

  it('should reject all when none button is clicked', function() {
    spyOn(this.model, 'rejectAll');
    this.model.setCategories([{ name: 'Hey' }, { name: 'Buddy' }]);
    this.view.render();
    this.view.$('.js-none').click();
    expect(this.model.rejectAll).toHaveBeenCalled();
  });

  it('should accept all when all button is clicked', function() {
    spyOn(this.model, 'acceptAll');
    this.model.setCategories([{ name: 'Hey' }, { name: 'Buddy' }]);
    this.model.acceptFilters('Hey');
    this.view.render();
    this.view.$('.js-all').click();
    expect(this.model.acceptAll).toHaveBeenCalled();
  });

});