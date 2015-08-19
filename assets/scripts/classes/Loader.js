/*
	TITLE: Loader

	DESCRIPTION: adds/removes a loading icon

	USAGE: new CNJS.UI.Loader('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- class.js
		- cnjs.js

*/

CNJS.UI.Loader = Class.extend({
	init: function($el, objOptions) {

		// defaults
		this.$el = $el;
		this.options = $.extend({
			overlayTemplate: '<div class="overlay"></div>',
			spinnerTemplate: '<div class="spinner"></div>'
	    }, objOptions || {});

		this.$elOverlay = $(this.options.overlayTemplate);
		this.$elSpinner = $(this.options.spinnerTemplate);

	},


/**
*	Public Methods
**/

	addLoader: function() {
		this.$el.append(this.$elOverlay, this.$elSpinner);
		setTimeout(function() {
			this.$elSpinner.click(); //spinner gif gets 'stuck' and needs a click
		}.bind(this), 10);
	},

	removeLoader: function() {
		this.$elOverlay.remove();
		this.$elSpinner.remove();
	}

});
