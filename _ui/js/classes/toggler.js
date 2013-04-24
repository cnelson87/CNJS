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

	CHANGE LOG
	--------------------------
	11/30/12 - CN: Inception
	--------------------------

*/

CNJS.UI.Toggler = Class.extend({
    init: function($element, objOptions) {
		var self = this;

		// defaults
		this.elContainer = $element;
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
		this.elTrigger = this.elContainer.find(this.options.selectorTrigger);
		this.elTarget = this.elContainer.find(this.options.selectorTarget);
		this.elAltTarget = this.elContainer.find(this.options.selectorAltTarget);

		// setup & properties
		this.containerID = this.elContainer.attr('id');
		this._isInitialized = false;
		this.targetID = this.elTarget.attr('id');
		this.inactiveTriggerText = this.elTrigger.first().text();
		this.activeTriggerText = this.elTrigger.attr('data-activeText') || this.options.activeTriggerText || false;
		this._isAnimating = false;
		this._isToggled = (this.options.initToggled || this.elTarget.attr('data-initRevealed') === 'true') ? true : false;

		// check urlHash
		this.focusOnInit = false;
		this.urlHash = window.location.hash.replace('#','') || false;
		if (this.urlHash && this.urlHash === this.elTarget.attr('id')) {
			this._isToggled = true;
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
		if (this._isToggled) {
			ariaSelected = 'true';
			ariaExpanded = 'true';
			ariaHidden = 'false';
			this.elContainer.addClass(this.options.activeClass);
		}

		// add aria attributes
		this.elContainer.attr({'role':'tablist', 'aria-multiselectable':'false'});
		this.elTrigger.attr({'role':'tab', 'aria-selected': ariaSelected, 'aria-controls': this.targetID});
		this.elTarget.attr({'role':'tabpanel', 'tabindex':'-1', 'aria-expanded': ariaExpanded, 'aria-hidden': ariaHidden});
		this.elAltTarget.attr({'role':'tabpanel', 'tabindex':'-1', 'aria-expanded': ariaHidden, 'aria-hidden': ariaExpanded});

		if (this._isToggled) {
			this.elTarget.show();
			this.elAltTarget.hide();
			if (this.activeTriggerText) {
				this.elTrigger.html(this.activeTriggerText);
			}
		} else {
			this.elTarget.hide();
			this.elAltTarget.show();
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

		var contentRevealed = function() {
			self.elTarget.focus();
			self._isToggled = true;
			self.elContainer.addClass(self.options.activeClass);
			$.event.trigger(self.options.customEventPrfx + ':contentRevealed', [self.elContainer]);
		};

		//update trigger
		if (this.activeTriggerText) {
			this.elTrigger.html(this.activeTriggerText);
		}
		this.elTrigger.attr({'aria-selected':'true'});

		//update targets
		this.elTarget.attr({'aria-expanded':'true', 'aria-hidden':'false'});
		this.elAltTarget.attr({'aria-expanded':'false', 'aria-hidden':'true'}).hide();
		if (this.options.useAppearEffect) {
			this._isAnimating = true;
			this.elTarget.fadeIn(self.options.animDuration, 'swing', function () {
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
			self.elAltTarget.focus();
			self._isToggled = false;
			self.elContainer.removeClass(self.options.activeClass);
			$.event.trigger(self.options.customEventPrfx + ':contentCollapsed', [self.elContainer]);
		};

		//update trigger
		if (this.activeTriggerText) {
			this.elTrigger.html(this.inactiveTriggerText);
		}
		this.elTrigger.attr({'aria-selected':'false'}).focus();

		//update targets
		this.elTarget.attr({'aria-expanded':'false', 'aria-hidden':'true'}).hide();
		this.elAltTarget.attr({'aria-expanded':'true', 'aria-hidden':'false'});
		if (this.options.useAppearEffect) {
			this._isAnimating = true;
			this.elAltTarget.fadeIn(self.options.animDuration, 'swing', function () {
				self._isAnimating = false;
				contentCollapsed();
			});
		} else {
			this.elAltTarget.show();
			contentCollapsed();
		}

	}

});
// end Toggler

// start MultiTogglerController
CNJS.UI.MultiTogglerController = Class.extend({
    init: function($elements, objOptions) {
		this.elContainers = $elements;
		this.options = objOptions;
		this.arrTogglers = [];
		var elContainer;
		for (var i=0, len = this.elContainers.length; i<len; i++) {
			elContainer = $(this.elContainers[i]);
			this.arrTogglers[i] = new CNJS.UI.Toggler(elContainer, this.options);
		}
	}
});
