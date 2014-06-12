/*
	TITLE: TabSwitcher

	DESCRIPTION: standard tab switcher

	USAGE: new CNJS.UI.TabSwitcher('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- class.js
		- cnjs.js

*/

CNJS.UI.TabSwitcher = Class.extend({
	init: function($el, objOptions) {

		// defaults
		this.$el = $el;
		this.options = $.extend({
			initialIndex: 0,
			selectorTabs: '.tabnav a',
			selectorPanels: '.tabpanels .panel',
			activeClass: 'active',
			equalizeHeight: true,
			useFadeEffect: true,
			animDuration: 400,
			customEventPrfx: 'CNJS:UI:TabSwitcher'
		}, objOptions || {});

		// element references
		this.$elTabs = this.$el.find(this.options.selectorTabs);
		this.$elPanels = this.$el.find(this.options.selectorPanels);

		// setup & properties
		this.isInitialized = false;
		this.isAnimating = false;
		this._len = this.$elPanels.length;
		if (this.options.initialIndex >= this._len) {this.options.initialIndex = 0;}
		this.currentIndex = this.options.initialIndex;
		this.prevIndex = false;

		// check url hash to override currentIndex
		this.focusOnInit = false;
		this.urlHash = window.location.hash.replace('#','') || false;
		if (this.urlHash) {
			for (var i=0; i<this._len; i++) {
				if (this.$elPanels[i].id === this.urlHash) {
					this.currentIndex = i;
					this.focusOnInit = true;
					break;
				}
			}
		}

		this.initDisplay();

		this.bindEvents();

	},


/**
*	Private Methods
**/

	initDisplay: function() {
		var $elActiveTab = $(this.$elTabs[this.currentIndex]);
		var $elActivePanel = $(this.$elPanels[this.currentIndex]);

		if (this.options.equalizeHeight) {
			this.heightEqualizer = new CNJS.UTILS.HeightEqualizer(this.$elPanels);
		}

		this.$el.attr({'role':'tablist'});
		this.$elTabs.attr({'role':'tab'});
		this.$elPanels.attr({'role':'tabpanel', 'tabindex':'-1'}).hide();

		$elActiveTab.addClass(this.options.activeClass);
		$elActivePanel.show();

		if (this.focusOnInit) {
			CNJS.$window.load(function() {
				$('html, body').animate({scrollTop:0}, 1);
				$elActivePanel.focus();
			});
		}

		this.isInitialized = true;

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.$el]);

	},

	bindEvents: function() {

		CNJS.$window.on('resizeEnd', function(e) {
			this.__onWindowResizeEnd(e);
		}.bind(this));

		this.$elTabs.on('click', function(e) {
			e.preventDefault();
			if (!this.isAnimating) {
				this.__clickTab(e);
			}
		}.bind(this));

	},


/**
*	Event Handlers
**/

	__onWindowResizeEnd: function(e) {
		if (this.options.equalizeHeight) {
			this.heightEqualizer.resetHeight();
		}
	},

	__clickTab: function(e) {
		var index = this.$elTabs.index(e.currentTarget);

		if (this.currentIndex === index) {
			this.$elPanels[index].focus();
		} else {
			this.prevIndex = this.currentIndex;
			this.currentIndex = index;
			this.switchPanel();
		}
	},


/**
*	Public Methods
**/

	switchPanel: function() {
		var $elInactiveTab = $(this.$elTabs[this.prevIndex]);
		var $elInactivePanel = $(this.$elPanels[this.prevIndex]);
		var $elActiveTab = $(this.$elTabs[this.currentIndex]);
		var $elActivePanel = $(this.$elPanels[this.currentIndex]);

		//update tabs
		$elActiveTab.addClass(this.options.activeClass);
		$elInactiveTab.removeClass(this.options.activeClass);

		//update panels
		if (this.options.useFadeEffect) {
			this.isAnimating = true;
			$elActivePanel.fadeIn(this.options.animDuration, 'swing', function() {
				this.isAnimating = false;
				$elActivePanel.focus();
			}.bind(this));
		} else {
			$elActivePanel.show().focus();
		}
		$elInactivePanel.hide();

		$.event.trigger(this.options.customEventPrfx + ':panelSwitched', [this.currentIndex]);

	}

});
// end TabSwitcher


// start MultiTabSwitcherController
CNJS.UI.MultiTabSwitcherController = Class.extend({
	init: function($els, objOptions) {
		var $els = $els;
		var len = $els.length;
		var $el;
		for (var i=0; i<len; i++) {
			$el = $($els[i]);
			new CNJS.UI.TabSwitcher($el, objOptions);
		}
	}
});
