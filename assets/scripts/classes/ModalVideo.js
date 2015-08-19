/*
	TITLE: ModalVideo

	DESCRIPTION: modal video player using YouTube iframe embed

	USAGE: new CNJS.UI.ModalVideo('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- class.js
		- cnjs.js
		- ModalWindow.js

*/

CNJS.UI.ModalVideo = CNJS.UI.ModalWindow.extend({
	init: function($triggers, objOptions) {

		this.options = $.extend({
			modalID: 'modalvideo',
			modalClass: 'modal-video',
			iframeID: 'youtubeplayer',
			iframeClass: 'youtube-player',
			customEventPrfx: 'CNJS:UI:ModalVideo'
		}, objOptions || {});

		// setup & properties
		this.videoID = null;

		this._super($triggers, this.options);

	},


/**
*	Event Handlers
**/

	__clickTrigger: function(e) {
		this.videoID = this.$elActiveTrigger.data('videoid') || this.$elActiveTrigger.attr('href');
		this._super(e);
	},


/**
*	Public Methods
**/

	getContent: function() {
		var iframeSrc = '//www.youtube.com/embed/' + this.videoID;
		this.contentHTML = '<iframe id="' + this.options.iframeID + '" class="' + this.options.iframeClass + '" src="' + iframeSrc + '" frameborder="0" scrolling="no"></iframe>';
	}

});
// end ModalVideo
