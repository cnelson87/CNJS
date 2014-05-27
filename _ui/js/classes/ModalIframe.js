/*
	TITLE: ModalIframe

	DESCRIPTION: 

	USAGE: new CNJS.UI.ModalIframe('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- class.js
		- cnjs.js
		- ModalWindow.js

*/

CNJS.UI.ModalIframe = CNJS.UI.ModalWindow.extend({
	init: function($triggers, objOptions) {

		// defaults
		this.$elTriggers = $triggers;
		this.options = $.extend({
			modalID: 'modaliframe',
			modalClass: 'modaliframe',
			customEventPrfx: 'CNJS:UI:ModalIframe'
		}, objOptions || {});

		// setup & properties
		this.iframeSrc = null;

		this._super(this.$elTriggers, this.options);

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
		this.iframeSrc = this.$elActiveTrigger.data('iframesrc') || this.$elActiveTrigger.attr('href');
		this._super(e);
	},


/**
*	Public Methods
**/

	getContent: function() {
		this.contentHTML = '<iframe src="' + this.iframeSrc + '" frameborder="0" scrolling="no"></iframe>';
	}

});
// end ModalIframe
