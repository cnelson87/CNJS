/*
	TITLE: ModalImage

	DESCRIPTION: 

	USAGE: new CNJS.UI.ModalImage('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	VERSION: 0.1.0

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.8+
		- class.js
		- cnjs.js
		- modalwindow.js

*/

CNJS.UI.ModalImage = CNJS.UI.ModalWindow.extend({
    init: function($elements, objOptions) {
		var self = this;

		// defaults
		this.elTriggers = $elements;
		this.options = $.extend({
			modalID: 'modalimage',
			modalClass: 'modal-image',
			customEventPrfx: 'CNJS:UI:ModalImage'
		}, objOptions || {});

		// setup & properties
		this.imageSrc = null;

		this._super(this.elTriggers, this.options);

        delete this.init;
	},

/**
*	Private Methods
**/
/*	_bindEvents: function() {
		var self = this;

		this._super();

	},*/

/**
*	Event Handlers
**/
	__clickTrigger: function(e) {
		var self = this;
		this.imageSrc = this.elCurrentTrigger.data('imagesrc') || this.elCurrentTrigger.attr('href');
		this._super(e);
	},

/**
*	Public Methods
**/
	getContent: function() {
		var self = this;

		this.contentHTML = '<img src="' + this.imageSrc + '" alt="" />';

		this.setContent();

	}

});
// end ModalImage
