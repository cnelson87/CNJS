/*
	TITLE: ModalVideo

	DESCRIPTION: modal video player using YouTube iframe embed

	USAGE: new CNJS.UI.ModalVideo('Elements', 'Options')
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

CNJS.UI.ModalVideo = CNJS.UI.ModalWindow.extend({
    init: function($elements, objOptions) {
		var self = this;

		// defaults
		this.elTriggers = $elements;
		this.options = $.extend({
			modalID: 'modalvideo',
			modalClass: 'modal-video',
			iframeID: 'youtubeplayer',
			iframeClass: 'youtube-player',
			customEventPrfx: 'CNJS:UI:ModalVideo'
		}, objOptions || {});

		// setup & properties
		this.videoID = null;

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
		this.videoID = this.elCurrentTrigger.data('videoid') || this.elCurrentTrigger.attr('href');
		this._super(e);
	},

/**
*	Public Methods
**/
	getContent: function() {
		var self = this;
		var iframeSrc = '//www.youtube.com/embed/' + this.videoID;

		this.contentHTML = '<iframe id="' + this.options.iframeID + '" class="' + this.options.iframeClass + '" src="' + iframeSrc + '" frameborder="0" scrolling="no"></iframe>';

		this.setContent();

	}

});
// end ModalVideo
