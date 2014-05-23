/*
	TITLE: Accordion

	DESCRIPTION: standard accordion

	USAGE: new CNJS.UI.Accordion('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	VERSION: 0.1.0

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.8+
		- class.js
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
			customEventPrfx: 'CNJS:UI:Accordion'
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
		this.nextIndex = false;

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
		var $elTab = $(e.currentTarget);
		var index = this.$elTabs.index($elTab);

		this.nextIndex = index;

		if (this.options.selfClosing) {
			// if selfClosing then check various states of acordion
			if ((!$elTab.hasClass(this.options.activeClass)) && (this.currentIndex !== this.nextIndex) && (this.currentIndex !== -1)) {
				// default state, same behaviour as !selfClosing
				this.animateAccordion();
			} else {
				if (($elTab.hasClass(this.options.activeClass)) && (this.currentIndex === this.nextIndex)) {
					// currentIndex is open
					this.animateSelfClosed();
				} else {
					// currentIndex is -1, all are closed
					this.animateSelfOpen();
				}
			}

		} else {
			// else accordion operates as normal
			if ($elTab.hasClass(this.options.activeClass)) {
				$(this.$elPanels[this.nextIndex]).focus();
			} else {
				this.animateAccordion();
			}
		}

	},


/**
*	Public Methods
**/

	animateSelfOpen: function() {
		var $elTab = $(this.$elTabs[this.nextIndex]);
		var $elPanel = $(this.$elPanels[this.nextIndex]);

		$elTab.addClass(this.options.activeClass);
		$elPanel.slideDown(this.options.animDuration, 'swing', function() {
			$elPanel.focus();
		});
		this.currentIndex = this.nextIndex;

		$.event.trigger(this.options.customEventPrfx + ':panelOpened', [this.currentIndex]);

	},

	animateSelfClosed: function() {
		var $elTab = $(this.$elTabs[this.nextIndex]);
		var $elPanel = $(this.$elPanels[this.nextIndex]);

		$elTab.removeClass(this.options.activeClass);
		$elPanel.slideUp(this.options.animDuration, 'swing', function() {
			$elTab.focus();
		});
		this.currentIndex = -1;

		$.event.trigger(this.options.customEventPrfx + ':panelClosed');

	},

	animateAccordion: function() {
		var $nextTab = $(this.$elTabs[this.nextIndex]);
		var $nextPanel = $(this.$elPanels[this.nextIndex]);
		var $currentTab = $(this.$elTabs[this.currentIndex]);
		var $currentPanel = $(this.$elPanels[this.currentIndex]);

		//update tabs
		$nextTab.addClass(this.options.activeClass);
		$currentTab.removeClass(this.options.activeClass);

		//update panels
		$nextPanel.slideDown(this.options.animDuration, 'swing', function() {
			$nextPanel.focus();
		});
		$currentPanel.slideUp(this.options.animDuration, 'swing');

		this.currentIndex = this.nextIndex;

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
