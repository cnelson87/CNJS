/*
	TITLE: Revealer

	DESCRIPTION: show/hide content

	USAGE: new CNJS.UI.Revealer('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	VERSION: 0.1.0

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.8+
		- class.js
		- pop.js

	CHANGE LOG
	--------------------------
	8/20/12 - CN: Inception
	--------------------------

*/

CNJS.UI.Revealer = Class.extend({
    init: function($element, objOptions) {
		var self = this;

		// defaults
		this.elContainer = $element;
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
		this.elTrigger = this.elContainer.find(this.options.selectorTrigger);
		this.elTarget = this.elContainer.find(this.options.selectorTarget);

		if (!this.elTrigger.length || !this.elTarget.length) {return;}

		// setup & properties
		this.containerID = this.elContainer.attr('id');
		this._isInitialized = false;
		this.targetID = this.elTarget.attr('id');
		this.inactiveTriggerText = this.elTrigger.text();
		this.activeTriggerText = this.elTrigger.attr('data-activeText') || this.options.activeTriggerText || false;
		this._isAnimating = false;
		this._isRevealed = this.elTarget.attr('data-initRevealed') === 'true' || this.options.initRevealed ? true : false;

		// check urlHash
		this.focusOnInit = false;
		this.urlHash = window.location.hash.replace('#','') || false;
		if (this.urlHash && this.urlHash === this.elTarget.attr('id')) {
			this._isRevealed = true;
			this.focusOnInit = true;
		}

		this._initDisplay();

        delete this.init;
    },

/**
*	Private Methods
**/
	_initDisplay: function() {
		var self = this;
		var ariaSelected = 'false';
		var ariaExpanded = 'false';
		var ariaHidden = 'true';
		if (this._isRevealed) {
			ariaSelected = 'true';
			ariaExpanded = 'true';
			ariaHidden = 'false';
			this.elContainer.addClass(this.options.activeClass);
		}

		// add aria attributes
		this.elContainer.attr({'role':'tablist', 'aria-multiselectable':'false'});
		this.elTrigger.attr({'role':'tab', 'aria-selected': ariaSelected, 'aria-controls': this.targetID});
		this.elTarget.attr({'role':'tabpanel', 'tabindex':'-1', 'aria-expanded': ariaExpanded, 'aria-hidden': ariaHidden});

		if (this._isRevealed) {
			if (this.focusOnInit) {
				$(window).load(function() {
					$('html, body').animate({scrollTop:0}, 1);
					self.elTarget.focus();
				});
			}
			if (this.activeTriggerText) {
				this.elTrigger.html(this.activeTriggerText);
			}
		} else {
			this.elTarget.hide();
		}

		this._isInitialized = true;

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.elContainer]);

		this._bindEvents();

	},

	_bindEvents: function() {
		var self = this;

		this.elTrigger.on('click', function(e) {
			e.preventDefault();
			if (!self._isAnimating) {
				self.__clickTrigger();
			}
		});

	},

/**
*	Event Handlers
**/
	__clickTrigger: function() {
		if (this._isRevealed) {
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
			self.elTarget.focus();
			self._isRevealed = true;
			self.elContainer.addClass(self.options.activeClass);
			$.event.trigger(self.options.customEventPrfx + ':contentRevealed', [self.elContainer]);
		};

		//update trigger
		if (this.activeTriggerText) {
			this.elTrigger.html(this.activeTriggerText);
		}
		this.elTrigger.attr({'aria-selected':'true'});

		//update target
		this.elTarget.attr({'aria-expanded':'true', 'aria-hidden':'false'});
		if (this.options.useSlideEffect) {
			this._isAnimating = true;
			this.elTarget.slideDown(self.options.animDuration, 'swing', function() {
				self._isAnimating = false;
				contentRevealed();
			});
		} else {
			this.elTarget.show();
			contentRevealed();
		}

	},
	collapseContent: function() {
		var self = this;

		var contentCollapsed = function() {
			self._isRevealed = false;
			self.elContainer.removeClass(self.options.activeClass);
			$.event.trigger(self.options.customEventPrfx + ':contentCollapsed', [self.elContainer]);
		};

		//update trigger
		if (this.activeTriggerText) {
			this.elTrigger.html(this.inactiveTriggerText);
		}
		this.elTrigger.attr({'aria-selected':'false'}).focus();

		//update target
		this.elTarget.attr({'aria-expanded':'false', 'aria-hidden':'true'});
		if (this.options.useSlideEffect) {
			this._isAnimating = true;
			this.elTarget.slideUp(self.options.animDuration, 'swing', function() {
				self._isAnimating = false;
				contentCollapsed();
			});
		} else {
			this.elTarget.hide();
			contentCollapsed();
		}

	}

});
// end Revealer

// start MultiRevealerController
CNJS.UI.MultiRevealerController = Class.extend({
    init: function($elements, objOptions) {
		this.elContainers = $elements;
		this.options = objOptions;
		this.arrRevealers = [];
		var elContainer;
		for (var i=0, len = this.elContainers.length; i<len; i++) {
			elContainer = $(this.elContainers[i]);
			this.arrRevealers[i] = new CNJS.UI.Revealer(elContainer, this.options);
		}
	}
});
