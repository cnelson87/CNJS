/*
	TITLE: ModalImage

	DESCRIPTION: 

	USAGE: new CNJS.UI.ModalImage('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- class.js
		- cnjs.js
		- ModalWindow.js

*/

CNJS.UI.ModalImage = CNJS.UI.ModalWindow.extend({
	init: function($triggers, objOptions) {

		this.options = $.extend({
			modalID: 'modalimage',
			modalClass: 'modal-image',
			customEventPrfx: 'CNJS:UI:ModalImage'
		}, objOptions || {});

		// setup & properties
		this.imageSrc = null;

		this._super($triggers, this.options);

	},


/**
*	Event Handlers
**/

	__clickTrigger: function(e) {
		this.imageSrc = this.$elActiveTrigger.data('imagesrc') || this.$elActiveTrigger.attr('href');
		this._super(e);
	},


/**
*	Public Methods
**/

	getContent: function() {
		this.contentHTML = '<img src="' + this.imageSrc + '" alt="" />';
	}

});
// end ModalImage
