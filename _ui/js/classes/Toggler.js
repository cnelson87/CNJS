/*
	TITLE: Toggler

	DESCRIPTION: toggles show/hide between short/long content areas

	USAGE: new CNJS.UI.Toggler('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- class.js
		- cnjs.js

*/

CNJS.UI.Toggler = Class.extend({
	init: function($el, objOptions) {

		// defaults
		this.$el = $el;
		this.options = $.extend({
			selectorTrigger: '.toggler-trigger',
			selectorTarget: '.long-content',
			selectorAltTarget: '.short-content',
			activeClass: 'active',
			activeTriggerText: '',
			initToggled: false,
			useAppearEffect: true,
			animDuration: 400,
			customEventPrfx: 'CNJS:UI:Toggler'
	    }, objOptions || {});

		// element references
		this.$elTrigger = this.$el.find(this.options.selectorTrigger);
		this.$elTarget = this.$el.find(this.options.selectorTarget);
		this.$elAltTarget = this.$el.find(this.options.selectorAltTarget);

		// setup & properties
		this.isInitialized = false;
		this.isAnimating = false;
		this.inactiveTriggerText = this.$elTrigger.first().text();
		this.activeTriggerText = this.$elTrigger.attr('data-activeText') || this.options.activeTriggerText || false;
		this.isToggled = (this.options.initToggled || this.$elTarget.attr('data-initRevealed') === 'true') ? true : false;

		// check url hash to override isToggled
		this.focusOnInit = false;
		this.urlHash = window.location.hash.replace('#','') || false;
		if (this.urlHash && this.urlHash === this.$elTarget.attr('id')) {
			this.isToggled = true;
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
		this.$elTrigger.attr({'role':'tab'});
		this.$elTarget.attr({'role':'tabpanel', 'tabindex':'-1'});
		this.$elAltTarget.attr({'role':'tabpanel', 'tabindex':'-1'});

		if (this.isToggled) {
			this.$el.addClass(this.options.activeClass);
			this.$elTarget.show();
			this.$elAltTarget.hide();
			if (this.activeTriggerText) {
				this.$elTrigger.html(this.activeTriggerText);
			}
		} else {
			this.$elTarget.hide();
			this.$elAltTarget.show();
		}

		if (this.focusOnInit) {
			CNJS.$window.load(function() {
				$('html, body').animate({scrollTop:0}, 1);
				this.$elTarget.focus();
			}.bind(this));
		}

		this.isInitialized = true;

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.$el]);

	},

	bindEvents: function() {

		CNJS.$window.on('resizeEnd', function(e) {
			this.__onWindowResizeEnd(e);
		}.bind(this));

		this.$elTrigger.on('click', function(e) {
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
		if (this.isToggled) {
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
			this.$elTarget.focus();
			this.isToggled = true;
			this.$el.addClass(this.options.activeClass);
			$.event.trigger(this.options.customEventPrfx + ':contentRevealed', [this.$el]);
		}.bind(this);

		//update trigger
		if (this.activeTriggerText) {
			this.$elTrigger.html(this.activeTriggerText);
		}

		//update targets
		this.$elAltTarget.hide();
		if (this.options.useAppearEffect) {

			this.isAnimating = true;
			this.$elTarget.fadeIn(this.options.animDuration, 'swing', function() {
				this.isAnimating = false;
				contentRevealed();
			}.bind(this));

		} else {
			this.$elTarget.show();
			contentRevealed();
		}

	},

	collapseContent: function() {

		var contentCollapsed = function contentCollapsed() {
			this.$elAltTarget.focus();
			this.isToggled = false;
			this.$el.removeClass(this.options.activeClass);
			$.event.trigger(this.options.customEventPrfx + ':contentCollapsed', [this.$el]);
		}.bind(this);

		//update trigger
		if (this.activeTriggerText) {
			this.$elTrigger.html(this.inactiveTriggerText);
		}
		this.$elTrigger.focus();

		//update targets
		this.$elTarget.hide();
		if (this.options.useAppearEffect) {

			this.isAnimating = true;
			this.$elAltTarget.fadeIn(this.options.animDuration, 'swing', function() {
				this.isAnimating = false;
				contentCollapsed();
			}.bind(this));

		} else {
			this.$elAltTarget.show();
			contentCollapsed();
		}

	}

});
// end Toggler


// start MultiTogglerController
CNJS.UI.MultiTogglerController = Class.extend({
	init: function($els, objOptions) {
		var $els = $els;
		var len = $els.length;
		var $el;
		for (var i=0; i<len; i++) {
			$el = $($els[i]);
			new CNJS.UI.Toggler($el, objOptions);
		}
	}
});
