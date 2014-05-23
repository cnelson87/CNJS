/*
	TITLE: Toggler

	DESCRIPTION: toggles show/hide between short/long content areas

	USAGE: new CNJS.UI.Toggler('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	VERSION: 0.1.0

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.8+
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
		this._isInitialized = false;
		this._isAnimating = false;
		this.inactiveTriggerText = this.$elTrigger.first().text();
		this.activeTriggerText = this.$elTrigger.attr('data-activeText') || this.options.activeTriggerText || false;
		this._isToggled = (this.options.initToggled || this.$elTarget.attr('data-initRevealed') === 'true') ? true : false;

		// check url hash to override _isToggled
		this.focusOnInit = false;
		this.urlHash = window.location.hash.replace('#','') || false;
		if (this.urlHash && this.urlHash === this.$elTarget.attr('id')) {
			this._isToggled = true;
			this.focusOnInit = true;
		}

		this._initDisplay();

		this._bindEvents();

	},


/**
*	Private Methods
**/

	_initDisplay: function() {
		var self = this;

		this.$el.attr({'role':'tablist'});
		this.$elTrigger.attr({'role':'tab'});
		this.$elTarget.attr({'role':'tabpanel', 'tabindex':'-1'});
		this.$elAltTarget.attr({'role':'tabpanel', 'tabindex':'-1'});

		if (this._isToggled) {
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
				self.$elTarget.focus();
			});
		}

		this._isInitialized = true;

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.$el]);

	},

	_bindEvents: function() {

		this.$elTrigger.on('click', function(e) {
			e.preventDefault();
			if (!this._isAnimating) {
				this.__clickTrigger(e);
			}
		}.bind(this));

	},


/**
*	Event Handlers
**/

	__clickTrigger: function(e) {
		if (this._isToggled) {
			this.collapseContent();
		} else {
			this.revealContent();
		}
	},


/**
*	Public Methods
**/

	revealContent: function() {
		var self = this;

		function contentRevealed() {
			self.$elTarget.focus();
			self._isToggled = true;
			self.$el.addClass(self.options.activeClass);
			$.event.trigger(self.options.customEventPrfx + ':contentRevealed', [self.$el]);
		};

		//update trigger
		if (this.activeTriggerText) {
			this.$elTrigger.html(this.activeTriggerText);
		}

		//update targets
		this.$elAltTarget.hide();
		if (this.options.useAppearEffect) {

			this._isAnimating = true;
			this.$elTarget.fadeIn(self.options.animDuration, 'swing', function() {
				self._isAnimating = false;
				contentRevealed();
			});

		} else {
			this.$elTarget.show();
			contentRevealed();
		}

	},

	collapseContent: function() {
		var self = this;

		function contentCollapsed() {
			self.$elAltTarget.focus();
			self._isToggled = false;
			self.$el.removeClass(self.options.activeClass);
			$.event.trigger(self.options.customEventPrfx + ':contentCollapsed', [self.$el]);
		};

		//update trigger
		if (this.activeTriggerText) {
			this.$elTrigger.html(this.inactiveTriggerText);
		}
		this.$elTrigger.focus();

		//update targets
		this.$elTarget.hide();
		if (this.options.useAppearEffect) {

			this._isAnimating = true;
			this.$elAltTarget.fadeIn(self.options.animDuration, 'swing', function() {
				self._isAnimating = false;
				contentCollapsed();
			});

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
