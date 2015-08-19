/*
	TITLE: TabCarousel

	DESCRIPTION: carousel w/ tab controls

	USAGE: new CNJS.UI.Carousel('Element', 'Options')
		@param {jQuery Object}
		@param {Object}
		note: The TabCarousel is both a Carousel and a TabSwitcher, setting numItemsPerGroup
		and numVisibleItems to other than 1 (one) will have unpredictable results since a 
		TabSwitcher never has more than 1 (one) item visible at a time.
		The most common use-case for the TabCarousel would be for a 'hero' scenario.

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- class.js
		- cnjs.js

*/

CNJS.UI.TabCarousel = CNJS.UI.Carousel.extend({
	init: function($el, objOptions) {

		// defaults
		this.$el = $el;
		this.options = $.extend({
			initialIndex: 0,
			numItemsPerGroup: 1,	//do not change
			numVisibleItems: 1,		//do not change
			selectorTabs: '.tabnav a',
			selectorInnerTrack: 'hero-carousel-panels > ul',
			customEventPrfx: 'CNJS:UI:TabCarousel'
		}, objOptions || {});

		// element references
		this.$elTabs = this.$el.find(this.options.selectorTabs);

		this._super(this.$el, this.options);

	},


/**
*	Private Methods
**/

	initDOM: function() {
		var $elActiveTab = $(this.$elTabs[this.currentIndex]);

		this.$elTabs.attr({'role':'tab'});
		$elActiveTab.addClass(this.options.activeClass);

		this._super();

	},

	bindEvents: function() {

		this.$elTabs.on('click', function(e) {
			e.preventDefault();
			this.__clickTab(e);
		}.bind(this));

		this._super();

	},


/**
*	Event Handlers
**/

	__clickTab: function(e) {
		var index = this.$elTabs.index(e.currentTarget);
		if (this.currentIndex === index) {
			this.$elItems[index].focus();
		} else {
			this.currentIndex = index;
			this.updateCarousel();
		}
	},


/**
*	Public Methods
**/

	updateNav: function() {
		var $elActiveTab = $(this.$elTabs[this.currentIndex]);

		this.$elTabs.removeClass(this.options.activeClass);
		$elActiveTab.addClass(this.options.activeClass);

		this._super();

	}

});
// end TabCarousel
