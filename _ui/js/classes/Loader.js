/*
	TITLE: Loader

	DESCRIPTION: adds/removes a loading icon

	USAGE: new CNJS.UI.Loader('Element', 'Options')
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

CNJS.UI.Loader = Class.extend({
    init: function($element, objOptions) {
		var self = this;

		// defaults
		this.elContainer = $element;
		this.options = $.extend({
			overlayTemplate: '<div class="loader-overlay"></div>',
			spinnerTemplate: '<div class="loader-spinner"></div>'
	    }, objOptions || {});

		this.elOverlay = $(this.options.overlayTemplate);
		this.elSpinner = $(this.options.spinnerTemplate);

        delete this.init;
    },

/**
*	Public Methods
**/
	addLoader: function() {
		var self = this;
		this.elContainer.append(this.elOverlay, this.elSpinner);
		setTimeout(function() {
			self.elSpinner.click(); //spinner gif gets 'stuck' and needs a click
		}, 10);
	},
	removeLoader: function() {
		this.elOverlay.remove();
		this.elSpinner.remove();
	}

});
