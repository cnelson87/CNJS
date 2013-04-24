/*
	TITLE: Widget

	DESCRIPTION: 

	USAGE: new CNJS.UI.Widget('Element', 'Options')
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

CNJS.UI.Widget = Class.extend({
    init: function($element, objOptions) {
		var self = this;

		// defaults
		this.elContainer = $element;
		this.options = $.extend({
			option1: '',
			option2: '',
			customEventPrfx: 'CNJS:UI:Widget'
	    }, objOptions || {});

		// element references


		// setup & properties
		this._isInitialized = false;


		//if this is an inherited class
		//this._super(this.elContainer, this.options);


		this._initDisplay();

        delete this.init;
    },

/**
*	'Private' Methods
**/
	_initDisplay: function() {
		var self = this;





		this._isInitialized = true;

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.elContainer]);

		this._bindEvents();

	},

	_bindEvents: function() {
		var self = this;



	},

/**
*	Event Handlers
**/
	__onEvent: function() {
		
	},

/**
*	Public Methods
**/
	doSomething: function() {
		
	}

});
