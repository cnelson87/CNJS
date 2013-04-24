/*
	TITLE: TabSwitcher

	DESCRIPTION: standard tab switcher

	USAGE: new CNJS.UI.TabSwitcher('Element', 'Options')
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

CNJS.UI.TabSwitcher = Class.extend({
    init: function($element, objOptions) {
		var self = this;

		// defaults
		this.$window = CNJS.$window;
		this.elContainer = $element;
		this.options = $.extend({
			initialIndex: 0,
			selectorTabs: 'a.tab',
			selectorPanels: 'div.panel',
			activeClass: 'active',
			useFadeEffect: true,
			animDuration: 400,
			customEventPrfx: 'CNJS:UI:TabSwitcher'
	    }, objOptions || {});

		// element references
		this.elTabs = this.elContainer.find(this.options.selectorTabs);
		this.elPanels = this.elContainer.find(this.options.selectorPanels);

		if (!this.elTabs.length || !this.elPanels.length) {return;}

		// setup & properties
		this.containerID = this.elContainer.attr('id');
		this._isInitialized = false;
		this._len = this.elTabs.length;
		if (this.options.initialIndex >= this._len) {this.options.initialIndex = 0;}
		this.currentIndex = this.options.initialIndex;
		this.prevIndex = false;

		// check urlHash
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
		var self = this;
		var elTab;
		var elPanel;
		var index = this.currentIndex;
		var elCurrentTab = $(this.elTabs[index]);
		var elCurrentPanel = $(this.elPanels[index]);

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
			self.__clickTab(e);
		});

	},

/**
*	Event Handlers
**/
	__clickTab: function(e) {
		var index = this.elTabs.index(e.currentTarget);
		$.event.trigger(this.options.customEventPrfx + ':tabClicked', [index]);
		if (this.currentIndex === index) {
			this.elPanels[index].focus();
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
		var self = this;
		var prevTab = $(this.elTabs[this.prevIndex]);
		var prevPanel = $(this.elPanels[this.prevIndex]);
		var elCurrentTab = $(this.elTabs[this.currentIndex]);
		var elCurrentPanel = $(this.elPanels[this.currentIndex]);

		//update prev tab/panel
		prevTab.attr({'aria-selected':'false'}).parent().removeClass(this.options.activeClass);
		prevPanel.attr({'aria-expanded':'false', 'aria-hidden':'true'}).hide();

		//update current tab/panel
		elCurrentTab.attr({'aria-selected':'true'}).parent().addClass(this.options.activeClass);
		elCurrentPanel.attr({'aria-expanded':'true', 'aria-hidden':'false'});

		if (this.options.useFadeEffect) {
			elCurrentPanel.fadeIn(this.options.animDuration, 'swing', function () {
				elCurrentPanel.focus();
			});
		} else {
			elCurrentPanel.show().focus();
		}

		$.event.trigger(this.options.customEventPrfx + ':panelSwitched', [this.currentIndex]);

	}

});
// end TabSwitcher

// start MultiTabSwitcherController
CNJS.UI.MultiTabSwitcherController = Class.extend({
    init: function($elements, objOptions) {
		this.elContainers = $elements;
		this.options = objOptions;
		this.arrTabSwitchers = [];
		var elContainer;
		for (var i=0, len = this.elContainers.length; i<len; i++) {
			elContainer = $(this.elContainers[i]);
			this.arrTabSwitchers[i] = new CNJS.UI.TabSwitcher(elContainer, this.options);
		}
	}
});
