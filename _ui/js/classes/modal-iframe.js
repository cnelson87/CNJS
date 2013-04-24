/*
	TITLE: ModalIframe

	DESCRIPTION: 

	USAGE: new CNJS.UI.ModalIframe('Elements', 'Options')
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

CNJS.UI.ModalIframe = CNJS.UI.ModalWindow.extend({
    init: function($elements, objOptions) {
		var self = this;

		// defaults
		this.elTriggers = $elements;
		this.options = $.extend({
			modalID: 'modaliframe',
			modalClass: 'modaliframe',
			customEventPrfx: 'CNJS:UI:ModalIframe'
		}, objOptions || {});

		// setup & properties
		this.iframeSrc = null;

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
		this.iframeSrc = this.elCurrentTrigger.data('iframesrc') || this.elCurrentTrigger.attr('href');
		this._super(e);
	},

/**
*	Public Methods
**/
	getContent: function() {
		var self = this;

		this.contentHTML = '<iframe src="' + this.iframeSrc + '" frameborder="0" scrolling="no"></iframe>';

		this.setContent();

	}

});
// end ModalIframe
