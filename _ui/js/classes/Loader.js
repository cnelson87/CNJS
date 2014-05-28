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
			overlayTemplate: '<div class="loader-overlay"></div>',
			spinnerTemplate: '<div class="loader-spinner"></div>'
	    }, objOptions || {});

		this.$elOverlay = $(this.options.overlayTemplate);
		this.$elSpinner = $(this.options.spinnerTemplate);

	},


/**
*	Public Methods
**/

	addLoader: function() {
		var self = this;
		this.$el.append(this.$elOverlay, this.$elSpinner);
		setTimeout(function() {
			self.$elSpinner.click(); //spinner gif gets 'stuck' and needs a click
		}, 10);
	},

	removeLoader: function() {
		this.$elOverlay.remove();
		this.$elSpinner.remove();
	}

});
