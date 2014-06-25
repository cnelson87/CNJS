/*
	TITLE: Accordion

	DESCRIPTION: standard accordion

	USAGE: new CNJS.UI.Accordion('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- jQuery.easing
		- Class.js
		- cnjs.js

*/

CNJS.UI.Accordion = Class.extend({
	init: function($el, objOptions) {

		// defaults
		this.$el = $el;
		this.options = $.extend({
			initialIndex: 0,
			selectorTabs: '.tab a',
			selectorPanels: '.panel',
			activeClass: 'active',
			equalizeHeight: true,
			selfClosing: true,
			animDuration: 400,
			animEasing: 'easeInQuad',
			customEventPrfx: 'CNJS:UI:Accordion'
		}, objOptions || {});

		// element references
		this.$elTabs = this.$el.find(this.options.selectorTabs);
		this.$elPanels = this.$el.find(this.options.selectorPanels);

		// setup & properties
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

		this.initDOM();

		this.bindEvents();

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.$el]);

	},


/**
*	Private Methods
**/

	initDOM: function() {
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

		// if selfClosing then check various states of acordion
		if (this.options.selfClosing) {

			// currentIndex is open
			if (this.currentIndex === index) {
				this.prevIndex = false;
				this.currentIndex = -1;
				this.animateSelfClosed(index);

			// currentIndex is -1, all are closed
			} else if (this.currentIndex === -1) {
				this.prevIndex = false;
				this.currentIndex = index;
				this.animateSelfOpen(index);

			// default behaviour
			} else {
				this.prevIndex = this.currentIndex;
				this.currentIndex = index;
				this.animateAccordion();
			}

		// else accordion operates as normal
		} else {

			if (this.currentIndex === index) {
				this.$elPanels[index].focus();
			} else {
				this.prevIndex = this.currentIndex;
				this.currentIndex = index;
				this.animateAccordion();
			}

		}

	},


/**
*	Public Methods
**/

	animateSelfClosed: function(index) {
		var $elTab = $(this.$elTabs[index]);
		var $elPanel = $(this.$elPanels[index]);

		this.isAnimating = true;

		$elTab.removeClass(this.options.activeClass);
		$elPanel.slideUp(this.options.animDuration, this.options.animEasing, function() {
			this.isAnimating = false;
			$elTab.focus();
		}.bind(this));

		$.event.trigger(this.options.customEventPrfx + ':panelClosed');

	},

	animateSelfOpen: function(index) {
		var $elTab = $(this.$elTabs[index]);
		var $elPanel = $(this.$elPanels[index]);

		this.isAnimating = true;

		$elTab.addClass(this.options.activeClass);
		$elPanel.slideDown(this.options.animDuration, this.options.animEasing, function() {
			this.isAnimating = false;
			$elPanel.focus();
		}.bind(this));

		$.event.trigger(this.options.customEventPrfx + ':panelOpened', [this.currentIndex]);

	},

	animateAccordion: function() {
		var $elInactiveTab = $(this.$elTabs[this.prevIndex]);
		var $elInactivePanel = $(this.$elPanels[this.prevIndex]);
		var $elActiveTab = $(this.$elTabs[this.currentIndex]);
		var $elActivePanel = $(this.$elPanels[this.currentIndex]);

		this.isAnimating = true;

		//update tabs
		$elActiveTab.addClass(this.options.activeClass);
		$elInactiveTab.removeClass(this.options.activeClass);

		//update panels
		$elActivePanel.slideDown(this.options.animDuration, this.options.animEasing, function() {
			this.isAnimating = false;
			$elActivePanel.focus();
		}.bind(this));
		$elInactivePanel.slideUp(this.options.animDuration, this.options.animEasing);

		$.event.trigger(this.options.customEventPrfx + ':panelOpened', [this.currentIndex]);

	}

});
// end Accordion


// start MultiAccordionController
CNJS.UI.MultiAccordionController = Class.extend({
	init: function($els, objOptions) {
		var $els = $els;
		var len = $els.length;
		var $el;
		for (var i=0; i<len; i++) {
			$el = $($els[i]);
			new CNJS.UI.Accordion($el, objOptions);
		}
	}
});
