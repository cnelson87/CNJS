/*
	TITLE: AjaxModal

	DESCRIPTION: ModalWindow subclass injects Ajax content

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
		- modalwindow.js

*/

CNJS.UI.AjaxModal = CNJS.UI.ModalWindow.extend({
	init: function($triggers, objOptions) {

		// defaults
		this.$elTriggers = $triggers;
		this.options = $.extend({
			ajaxErrorMsg: CNJS.Config.defaultAjaxErrorMessage,
			customEventPrfx: 'CNJS:UI:AjaxModal'
		}, objOptions || {});

		// setup & properties
		this.getAjaxContent = CNJS.UTILS.getAjaxContent; //shortcut to getAjaxContent utility
		this.loader = null;
		this.ajaxUrl = null;
		this.currentIndex = null;
		this.arrAjaxContent = null;

		this._super(this.$elTriggers, this.options);

		this.loader = new CNJS.UI.Loader(this.$elContent);

	},


/**
*	Event Handlers
**/

	__clickTrigger: function(e) {
		this.ajaxUrl = this.$elActiveTrigger.data('ajaxurl') || this.$elActiveTrigger.attr('href');
		this.currentIndex = this.$elTriggers.index(this.$elActiveTrigger);
		this.openModal();
	},


/**
*	Public Methods
**/

	getContent: function() {
		var self = this;

		this.loader.addLoader();

		$.when(self.getAjaxContent(self.ajaxUrl)).done(function(response) {

			self.loader.removeLoader();
			self.contentHTML = response;
			self.setContent();
			//console.log(response);

		}).fail(function() {

			self.loader.removeLoader();
			self.contentHTML = '';
			self.$elContent.html(self.options.ajaxErrorMsg);

		});

	}

});
// end AjaxModal
