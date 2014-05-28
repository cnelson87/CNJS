/*
	TITLE: AjaxModal

	DESCRIPTION: AjaxModal subclass of ModalWindow retrieves & injects Ajax content

	USAGE: new CNJS.UI.AjaxModal('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- class.js
		- cnjs.js
		- utils.js
		- loader.js
		- ModalWindow.js

*/

CNJS.UI.AjaxModal = CNJS.UI.ModalWindow.extend({
	init: function($triggers, objOptions) {

		// defaults
		this.$elTriggers = $triggers;
		this.options = $.extend({
			ajaxErrorMsg: CNJS.Config.defaultAjaxErrorMessage,
			loaderDelay: 400,
			customEventPrfx: 'CNJS:UI:AjaxModal'
		}, objOptions || {});

		// setup & properties
		this.getAjaxContent = CNJS.UTILS.getAjaxContent; //shortcut to getAjaxContent utility
		this.ajaxLoader = null;

		this._super(this.$elTriggers, this.options);

	},


/**
*	Private Methods
**/

	initDisplay: function() {
		this._super();
		this.ajaxLoader = new CNJS.UI.Loader(this.$elContent);
	},


/**
*	Public Methods
**/

	getContent: function() {
		var self = this;
		var ajaxUrl = this.$elActiveTrigger.data('ajaxurl') || this.$elActiveTrigger.attr('href');
		var targetID = ajaxUrl.split('#')[1] || false;
		var targetEl;

		this.ajaxLoader.addLoader();

		$.when(self.getAjaxContent(ajaxUrl, 'html')).done(function(response) {
			//console.log(response);

			if (targetID) {
				targetEl = $(response).find('#' + targetID);
				if (targetEl.length) {
					self.contentHTML = $(response).find('#' + targetID).html();
				} else {
					self.contentHTML = $(response).html();
				}
				
			} else {
				self.contentHTML = response;
			}

			//add a small delay to show spinner
			setTimeout(function() {
				self.ajaxLoader.removeLoader();
				self.setContent();
				self.setPosition();
			}, self.options.loaderDelay);

		}).fail(function() {
			//console.log(response);
			self.contentHTML = '';

			//add a small delay to show spinner
			setTimeout(function() {
				self.ajaxLoader.removeLoader();
				self.$elContent.html(self.options.ajaxErrorMsg);
				self.setPosition();
			}, self.options.loaderDelay);

		});

	}

});
// end AjaxModal
