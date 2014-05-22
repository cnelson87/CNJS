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

	CHANGE LOG
	--------------------------
	8/20/12 - CN: Inception
	--------------------------

*/

CNJS.UI.Accordion = Class.extend({
    init: function($element, objOptions) {

		// defaults
		this.elContainer = $element;
		this.options = $.extend({
			initialIndex: 0,
			selectorTabs: '.tab a',
			selectorPanels: '.panel',
			activeClass: 'active',
			setEqualHeight: false,
			selfClosing: false,
			animDuration: 400,
			customEventPrfx: 'CNJS:UI:Accordion'
	    }, objOptions || {});

		// element references
		this.elTabs = this.elContainer.find(this.options.selectorTabs);
		this.elPanels = this.elContainer.find(this.options.selectorPanels);

		// setup & properties
		this._isInitialized = false;
		this._isAnimating = false;
		this._len = this.elPanels.length;
		if (this.options.initialIndex >= this._len) {this.options.initialIndex = 0;}
		this.currentIndex = this.options.initialIndex;
		this.nextIndex = false;

		// check url hash to override currentIndex
		this.focusOnInit = false;
		this.urlHash = window.location.hash.replace('#','') || false;
		if (this.urlHash) {
			for (var i=0; i<this._len; i++) {
				if (this.elPanels[i].id === this.urlHash) {
					this.currentIndex = i;
					this.focusOnInit = true;
					break;
				}
			}
		}

		this._initDisplay();

        delete this.init;
    },

/**
*	Private Methods
**/
	_initDisplay: function() {
		var elTab;
		var elPanel;
		var index = this.currentIndex;
		var elCurrentTab = $(this.elTabs[index]);
		var elCurrentPanel = $(this.elPanels[index]);

		// set equal heights
		if (this.options.setEqualHeight) {
			this.panelHeightAdjuster = new CNJS.UTILS.HeightAdjuster(this.elPanels);
		}

		// add aria attributes
		this.elContainer.attr({'role':'tablist', 'aria-multiselectable':'false'});
		for (var i=0; i<this._len; i++) {
			elTab = $(this.elTabs[i]);
			elPanel = $(this.elPanels[i]);
			elTab.attr({'role':'tab', 'aria-selected':'false', 'aria-controls': elPanel.attr('id')});
			elPanel.attr({'role':'tabpanel', 'tabindex':'-1', 'aria-expanded':'false', 'aria-hidden':'true'}).hide();
		}
		elCurrentTab.attr('aria-selected', 'true').parent().addClass(this.options.activeClass);
		elCurrentPanel.attr({'aria-expanded': 'true', 'aria-hidden': 'false'}).show();

		if (this.focusOnInit) {
			$(window).load(function() {
				$('html, body').animate({scrollTop:0}, 1);
				elCurrentPanel.focus();
			});
		}

		this._isInitialized = true;

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.elContainer]);

		this._bindEvents();

	},

	_bindEvents: function() {
		var self = this;

		this.elTabs.on('click', function(e) {
			e.preventDefault();
			if (!self._isAnimating) {
				self.__clickTab(e);
			}
		});

	},


/**
*	Event Handlers
**/

	__clickTab: function(e) {
		var el = $(e.currentTarget);
		var index = this.elTabs.index(el);

		console.log(el);

		this.nextIndex = index;

		if (this.options.selfClosing) {
			// if selfClosing then check various states of acordion
			if ((!el.parent().hasClass(this.options.activeClass)) && (this.currentIndex !== this.nextIndex) && (this.currentIndex !== -1)) {
				// default state, same behaviour as !selfClosing
				this.animateAccordion();
			} else {
				if ((el.parent().hasClass(this.options.activeClass)) && (this.currentIndex === this.nextIndex)) {
					// currentIndex is open
					this.animateSelfClosed();
				} else {
					// currentIndex is -1, all are closed
					this.animateSelfOpen();
				}
			}
		} else {
			// else accordion operates as normal
			if (el.parent().hasClass(this.options.activeClass)) {
				console.log('has active');
				$(this.elPanels[this.nextIndex]).focus();
			} else {
				console.log('not active');
				this.animateAccordion();
			}
		}

	},


/**
*	Public Methods
**/

	animateSelfOpen: function() {
		var tab = $(this.elTabs[this.nextIndex]);
		var panel = $(this.elPanels[this.nextIndex]);

		tab.parent().addClass(this.options.activeClass);
		panel.addClass(this.options.activeClass).slideDown(this.options.animDuration, 'swing', function () {
			tab.attr('aria-selected', 'true');
			panel.attr({'aria-expanded': 'true', 'aria-hidden': 'false'}).focus();
		});
		this.currentIndex = this.nextIndex;

		$.event.trigger(this.options.customEventPrfx + ':panelOpened', [this.currentIndex]);

	},

	animateSelfClosed: function() {
		var tab = $(this.elTabs[this.nextIndex]);
		var panel = $(this.elPanels[this.nextIndex]);

		tab.parent().removeClass(this.options.activeClass);
		panel.removeClass(this.options.activeClass).slideUp(this.options.animDuration, 'swing', function () {
			tab.attr('aria-selected', 'false').focus();
			panel.attr({'aria-expanded': 'false', 'aria-hidden': 'true'});
		});
		this.currentIndex = -1;

		$.event.trigger(this.options.customEventPrfx + ':panelClosed');

	},

	animateAccordion: function() {
		var nextTab = $(this.elTabs[this.nextIndex]);
		var nextPanel = $(this.elPanels[this.nextIndex]);
		var currentTab = $(this.elTabs[this.currentIndex]);
		var currentPanel = $(this.elPanels[this.currentIndex]);
		var animDuration = this.options.animDuration;
		var activeClass = this.options.activeClass;

		nextTab.parent().addClass(activeClass);
		currentTab.parent().removeClass(activeClass);
		// wrapping in setTimeout 1ms seems to create a smoother animation
		//window.setTimeout(function(){
			nextPanel.addClass(activeClass).slideDown(animDuration, 'swing', function () {
				nextTab.attr('aria-selected', 'true');
				nextPanel.attr({'aria-expanded': 'true', 'aria-hidden': 'false'}).focus();
			});
			currentPanel.removeClass(activeClass).slideUp(animDuration, 'swing', function(){
				currentTab.attr('aria-selected', 'false');
				currentPanel.attr({'aria-expanded': 'false', 'aria-hidden': 'true'});
			});
		//},1);

		this.currentIndex = this.nextIndex;

		$.event.trigger(this.options.customEventPrfx + ':panelOpened', [this.currentIndex]);

	}

});
// end Accordion

// start MultiTabSwitcherController
CNJS.UI.MultiAccordionController = Class.extend({
    init: function($elements, objOptions) {
		this.elContainers = $elements;
		this.options = objOptions;
		this.arrAccordions = [];
		var elContainer;
		for (var i=0, len = this.elContainers.length; i<len; i++) {
			elContainer = $(this.elContainers[i]);
			this.arrAccordions[i] = new CNJS.UI.Accordion(elContainer, this.options);
		}
	}
});
