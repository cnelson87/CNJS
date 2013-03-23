/*
	TITLE: AjaxModal

	DESCRIPTION: 

	USAGE: new CNJS.UI.AjaxModal('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	VERSION: 0.1.0

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.8+
		- class.js
		- pop.js
		- utils.js
		- loader.js

	CHANGE LOG
	--------------------------
	10/05/12 - CN: Inception
	--------------------------

*/

CNJS.UI.AjaxModal = CNJS.UI.ModalWindow.extend({
    init: function($elements, objOptions) {
		var self = this;

		// defaults
		this.elTriggers = $elements;
		this.options = $.extend({
			cacheAjaxResponse: true,
			ajaxErrorMsg: CNJS.Config.defaultAjaxErrorMessage,
			customEventPrfx: 'CNJS:UI:AjaxModal'
		}, objOptions || {});

		// setup & properties
		this.getAjaxContent = CNJS.UTILS.getAjaxContent; //shortcut to getAjaxContent utility
		this.modalContentLoader = null;
		this.ajaxUrl = null;
		this.currentIndex = null;
		this.arrAjaxContent = null;
		if (this.options.cacheAjaxResponse) {
			this.arrAjaxContent = [];
			this.arrAjaxContent.length = this.elTriggers.length;
		}

		this._super(this.elTriggers, this.options);

        delete this.init;
	},

/**
*	Private Methods
**/


/**
*	Event Handlers
**/
	__clickTrigger: function(e) {
		var self = this;
		this.ajaxUrl = this.elCurrentTrigger.data('ajaxurl') || this.elCurrentTrigger.attr('href');
		this._super(e);
	},

/**
*	Public Methods
**/
	getContent: function() {
		var self = this;

		if (this.options.cacheAjaxResponse && this.arrAjaxContent[this.currentIndex]) {
			this.contentHTML = this.arrAjaxContent[this.currentIndex];
			this.setContent();

		} else {
			this.modalContentLoader = new CNJS.UI.Loader(this.elModalContent);
			this.modalContentLoader.addLoader();

			$.when(self.getAjaxContent(self.ajaxUrl)).done(function(response) {
				self.modalContentLoader.removeLoader();
				if (self.options.cacheAjaxResponse) {
					self.arrAjaxContent[self.currentIndex] = response;
				}
				self.contentHTML = response;
				self.setContent();
				//console.log(response);
			}).fail(function() {
				self.modalContentLoader.removeLoader();
				self.contentHTML = '';
				self.elModalContent.html(self.options.ajaxErrorMsg);
			});

		}

	}//,

/*
	setContent: function() {
		var self = this;

		this.elModalContent.html(this.contentHTML);

	}
*/

});
// end AjaxModal
