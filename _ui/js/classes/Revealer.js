/*
	TITLE: Revealer

	DESCRIPTION: show/hide content

	USAGE: new CNJS.UI.Revealer('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- class.js
		- cnjs.js

*/

CNJS.UI.Revealer = Class.extend({
    init: function($el, objOptions) {

		// defaults
		this.$el = $el;
		this.options = $.extend({
			selectorTab: '.revealer-trigger',
			selectorPanel: '.revealer-target',
			activeClass: 'active',
			activeTabText: '',
			initRevealed: false,
			useSlideEffect: true,
			animDuration: 400,
			customEventPrfx: 'CNJS:UI:Revealer'
	    }, objOptions || {});

		// element references
		this.$elTab = this.$el.find(this.options.selectorTab);
		this.$elPanel = this.$el.find(this.options.selectorPanel);

		// setup & properties
		this.isInitialized = false;
		this.isAnimating = false;
		this.inactiveTabText = this.$elTab.text();
		this.activeTabText = this.$elTab.attr('data-activeText') || this.options.activeTabText || false;
		this.isRevealed = this.$elPanel.attr('data-initRevealed') === 'true' || this.options.initRevealed ? true : false;

		// check url hash to override isRevealed
		this.focusOnInit = false;
		this.urlHash = window.location.hash.replace('#','') || false;
		if (this.urlHash && this.urlHash === this.$elPanel.attr('id')) {
			this.isRevealed = true;
			this.focusOnInit = true;
		}

		this.initDisplay();

		this.bindEvents();

	},


/**
*	Private Methods
**/

	initDisplay: function() {

		this.$el.attr({'role':'tablist'});
		this.$elTab.attr({'role':'tab'});
		this.$elPanel.attr({'role':'tabpanel', 'tabindex':'-1'});

		if (this.isRevealed) {
			this.$el.addClass(this.options.activeClass);
			if (this.activeTabText) {
				this.$elTab.html(this.activeTabText);
			}
		} else {
			this.$elPanel.hide();
		}

		if (this.focusOnInit) {
			CNJS.$window.load(function() {
				$('html, body').animate({scrollTop:0}, 1);
				this.$elPanel.focus();
			}.bind(this));
		}

		this.isInitialized = true;

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.$el]);

	},

	bindEvents: function() {

		CNJS.$window.on('resizeEnd', function(e) {
			this.__onWindowResizeEnd(e);
		}.bind(this));

		this.$elTab.on('click', function(e) {
			e.preventDefault();
			if (!this.isAnimating) {
				this.__clickTrigger(e);
			}
		}.bind(this));

	},


/**
*	Event Handlers
**/

	__onWindowResizeEnd: function(e) {
		//console.log('__onWindowResizeEnd');
	},

	__clickTrigger: function(e) {
		if (this.isRevealed) {
			this.collapseContent();
		} else {
			this.revealContent();
		}
	},


/**
*	Public Methods
**/

	revealContent: function() {

		var contentRevealed = function contentRevealed() {
			this.isRevealed = true;
			this.$elPanel.focus();
			this.$el.addClass(this.options.activeClass);
			$.event.trigger(this.options.customEventPrfx + ':contentRevealed', [this.$el]);
		}.bind(this);

		//update tab
		if (this.activeTabText) {
			this.$elTab.html(this.activeTabText);
		}

		//update panel
		if (this.options.useSlideEffect) {

			this.isAnimating = true;
			this.$elPanel.slideDown(this.options.animDuration, 'swing', function() {
				this.isAnimating = false;
				contentRevealed();
			}.bind(this));

		} else {
			this.$elPanel.show();
			contentRevealed();
		}

	},

	collapseContent: function() {

		var contentCollapsed = function contentCollapsed() {
			this.isRevealed = false;
			this.$elTab.focus();
			this.$el.removeClass(this.options.activeClass);
			$.event.trigger(this.options.customEventPrfx + ':contentCollapsed', [this.$el]);
		}.bind(this);

		//update tab
		if (this.activeTabText) {
			this.$elTab.html(this.inactiveTabText);
		}

		//update panel
		if (this.options.useSlideEffect) {

			this.isAnimating = true;
			this.$elPanel.slideUp(this.options.animDuration, 'swing', function() {
				this.isAnimating = false;
				contentCollapsed();
			}.bind(this));

		} else {
			this.$elPanel.hide();
			contentCollapsed();
		}

	}

});
// end Revealer


// start MultiRevealerController
CNJS.UI.MultiRevealerController = Class.extend({
	init: function($els, objOptions) {
		var $els = $els;
		var len = $els.length;
		var $el;
		for (var i=0; i<len; i++) {
			$el = $($els[i]);
			new CNJS.UI.Revealer($el, objOptions);
		}
	}
});
