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
			selectorTrigger: '.revealer-trigger',
			selectorTarget: '.revealer-target',
			activeClass: 'active',
			activeTriggerText: '',
			initRevealed: false,
			useSlideEffect: true,
			animDuration: 400,
			customEventPrfx: 'CNJS:UI:Revealer'
	    }, objOptions || {});

		// element references
		this.$elTrigger = this.$el.find(this.options.selectorTrigger);
		this.$elTarget = this.$el.find(this.options.selectorTarget);

		// setup & properties
		this.isInitialized = false;
		this.isAnimating = false;
		this.inactiveTriggerText = this.$elTrigger.text();
		this.activeTriggerText = this.$elTrigger.attr('data-activeText') || this.options.activeTriggerText || false;
		this.isRevealed = this.$elTarget.attr('data-initRevealed') === 'true' || this.options.initRevealed ? true : false;

		// check url hash to override isRevealed
		this.focusOnInit = false;
		this.urlHash = window.location.hash.replace('#','') || false;
		if (this.urlHash && this.urlHash === this.$elTarget.attr('id')) {
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
		var self = this;

		this.$el.attr({'role':'tablist'});
		this.$elTrigger.attr({'role':'tab'});
		this.$elTarget.attr({'role':'tabpanel', 'tabindex':'-1'});

		if (this.isRevealed) {
			this.$el.addClass(this.options.activeClass);
			if (this.activeTriggerText) {
				this.$elTrigger.html(this.activeTriggerText);
			}
		} else {
			this.$elTarget.hide();
		}

		if (this.focusOnInit) {
			CNJS.$window.load(function() {
				$('html, body').animate({scrollTop:0}, 1);
				self.$elTarget.focus();
			});
		}

		this.isInitialized = true;

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.$el]);

	},

	bindEvents: function() {

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
		var self = this;

		var contentRevealed = function() {
			self.$elTarget.focus();
			self.isRevealed = true;
			self.$el.addClass(self.options.activeClass);
			$.event.trigger(self.options.customEventPrfx + ':contentRevealed', [self.$el]);
		};

		//update trigger
		if (this.activeTriggerText) {
			this.$elTrigger.html(this.activeTriggerText);
		}

		//update target
		if (this.options.useSlideEffect) {

			this.isAnimating = true;
			this.$elTarget.slideDown(self.options.animDuration, 'swing', function() {
				self.isAnimating = false;
				contentRevealed();
			});

		} else {
			this.$elTarget.show();
			contentRevealed();
		}

	},

	collapseContent: function() {
		var self = this;

		var contentCollapsed = function() {
			self.isRevealed = false;
			self.$el.removeClass(self.options.activeClass);
			$.event.trigger(self.options.customEventPrfx + ':contentCollapsed', [self.$el]);
		};

		//update trigger
		if (this.activeTriggerText) {
			this.$elTrigger.html(this.inactiveTriggerText);
		}
		this.$elTrigger.focus();

		//update target
		if (this.options.useSlideEffect) {

			this.isAnimating = true;
			this.$elTarget.slideUp(self.options.animDuration, 'swing', function() {
				self.isAnimating = false;
				contentCollapsed();
			});

		} else {
			this.$elTarget.hide();
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
