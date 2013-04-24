/*
	TITLE: TabCarousel

	DESCRIPTION: carousel w/ tab controls

	USAGE: new CNJS.UI.Carousel('Element', 'Options')
		@param {jQuery Object}
		@param {Object}
		note: The TabCarousel is both a Carousel and a TabSwitcher, setting itemsPerGroup
		and visibleItems to other than 1 (one) will have unpredictable results since a 
		TabSwitcher never has more than 1 (one) item visible at a time.
		The most common use-case for the TabCarousel would be for a 'hero' placement.

	VERSION: 0.1.0

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.8+
		- class.js
		- cnjs.js

	CHANGE LOG
	--------------------------
	11/07/12 - CN: Inception
	--------------------------

*/

CNJS.UI.TabCarousel = CNJS.UI.Carousel.extend({
    init: function($element, objOptions) {
		var self = this;

		// defaults
		this.elContainer = $element;
		this.options = $.extend({
			initialIndex: 0,
			itemsPerGroup: 1,
			visibleItems: 1,
			selectorTabs: '.tab-nav .tab',
			activeClass: 'active',
			customEventPrfx: 'CNJS:UI:TabCarousel'
	    }, objOptions || {});

		// element references
		this.elTabs = this.elContainer.find(this.options.selectorTabs);

		// setup & properties


		this._super(this.elContainer, this.options);

        delete this.init;
    },

/**
*	Private Methods
**/
	_initDisplay: function() {
		var self = this;
		var elTab;
		var elPanel;
		var currentTab = $(this.elTabs[this.currentIndex]);

		for (var i=0; i<this._len; i++) {
			elTab = $(this.elTabs[i]);
			elPanel = $(this.elItems[i]);
			elTab.attr({'role':'tab', 'aria-selected':'false', 'aria-controls': elPanel.attr('id')});
		}
		currentTab.attr('aria-selected', 'true').parent().addClass(this.options.activeClass);

		this._super();

	},

	_bindEvents: function() {
		var self = this;

		this.elTabs.on('click', function(e) {
			e.preventDefault();
			self.__clickTab(e);
		});

		this._super();

	},

/**
*	Event Handlers
**/
	__clickTab: function(e) {
		var index = this.elTabs.index(e.currentTarget);
		if (this.currentIndex === index && !CNJS.Config.isIDevice) {
			this.elItems[index].focus();
		} else {
			this.currentIndex = index;
			this.updateCarousel();
		}
	},

/**
*	Public Methods
**/
	updateNav: function() {
		this._super();
		this.elTabs.attr({'aria-selected':'false'}).parent().removeClass(this.options.activeClass);
		$(this.elTabs[this.currentIndex]).attr({'aria-selected':'true'}).parent().addClass(this.options.activeClass);
	}

});
// end TabCarousel
