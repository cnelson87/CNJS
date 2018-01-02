/*
	TITLE: Widget

	DESCRIPTION: Widget Class stub

	USAGE: new CNJS.UI.Widget('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- class.js
		- cnjs.js

*/

CNJS.UI.Widget = Class.extend({
	init: function($el, objOptions) {

		// defaults
		this.$el = $el;
		this.options = $.extend({
			option1: '',
			option2: '',
			customEventPrfx: 'CNJS:UI:Widget'
	    }, objOptions || {});

		// element references


		// setup & properties



		//if this is an inherited class
		//this._super(this.$el, this.options);


		this.initDOM();

		this.bindEvents();

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.$el]);

	},


/**
*	'Private' Methods
**/

	initDOM: function() {




	},

	bindEvents: function() {




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




		$.event.trigger(this.options.customEventPrfx + ':didSomething', [this.$el]);

	}

});
