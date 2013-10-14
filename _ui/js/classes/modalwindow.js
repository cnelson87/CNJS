/*
	TITLE: ModalWindow

	DESCRIPTION: Base class to create modal windows

	USAGE: new CNJS.UI.ModalWindow('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.8+
		- class.js
		- cnjs.js

*/

CNJS.UI.ModalWindow = Class.extend({
	init: function($elements, objOptions) {
		var self = this;

		// defaults
		this.$window = CNJS.$window;
		this.$document = CNJS.$document;
		this.$body = CNJS.$body;
		this.isIPhone = CNJS.Config.isIPhone;
		this.elTriggers = $elements;
		this.options = $.extend({
			modalID: 'modalwindow',
			modalClass: 'modalwindow',
			modalOverlayID: 'modaloverlay',
			closeBtnClass: 'btn-closeX',
			closeBtnInnerHTML: '<span>X</span>', //ex: '<span class="offscreen">close window</span>'
			activeClass: 'active',
			leftOffset: 0,
			topOffset: 0,
			minTopSpacing: 10,
			fadeInOutSpeed: 200,
			customEventPrfx: 'CNJS:UI:ModalWindow'
		}, objOptions || {});

		// element references
		this.elCurrentTrigger = null;
		this.elModal = null;
		this.elModalContent = null;
		this.elModalOverlay = null;
		this.btnClose = null;

		// setup & properties
		this.isModalActivated = false;
		this.isPosAbs = false; //position:absolute;
		this.contentHTML = null;
		this.currentIndex = null;

		this._initDisplay();

		this._bindEvents();

	},

/**
*	Private Methods
**/
	_initDisplay: function() {
		var self = this;

		//create overlay
		this.elModalOverlay = $('#' + this.options.modalOverlayID);
		if (!this.elModalOverlay.length) {
			this.elModalOverlay = $('<div></div>',{
				'id': this.options.modalOverlayID
			}).appendTo(this.$body).hide();
		}

		//create modal
		this.elModal = $('#' + this.options.modalID);
		if (!this.elModal.length) {
			this.elModal = $('<div></div>', {
				'id': this.options.modalID,
				'class': this.options.modalClass,
				'role': 'dialog',
				'tabindex': '-1'
			});
		}

		//create modal content
		this.elModalContent = this.elModal.find('.' + this.options.modalClass + '-content');
		if (!this.elModalContent.length) {
			this.elModalContent = $('<div></div>', {
				'class': this.options.modalClass + '-content'
			}).appendTo(this.elModal);
		}

		//insert close button
		this.btnClose = this.elModal.find('.' + this.options.closeBtnClass);
		if (!this.btnClose.length) {
			this.btnClose = $('<a></a>', {
				'class': this.options.closeBtnClass,
				'href': '#close',
				'title': 'close window'
			}).html(this.options.closeBtnInnerHTML).appendTo(this.elModal);
		}

		//insert into DOM
		this.elModal.insertAfter(this.elModalOverlay).hide();

		//top pos assumes position:fixed by defalt, if position:absolute then top pos gets trickier.
		this.isPosAbs = (this.elModal.css('position') === 'absolute') ? true : false;

	},

	_bindEvents: function() {
		var self = this;

		this.elTriggers.on('click', function(e) {
			e.preventDefault();
			if (!self.isModalActivated) {
				self.elCurrentTrigger = $(this);
				self.__clickTrigger(e);
			}
		});

		this.btnClose.on('click', function(e) {
			e.preventDefault();
			if (self.isModalActivated) {
				self.closeModal();
			}
		});

		this.elModalOverlay.on('click', function(e) {
			if (self.isModalActivated) {
				self.closeModal();
			}
		});

		this.$document.on('focusin', function(e) {
			if (self.isModalActivated && !self.elModal.get(0).contains(e.target)) {
				self.elModal.focus();
			}
		});

		this.$document.on('keydown', function(e) {
			if (self.isModalActivated && e.keyCode == 27) {
				self.closeModal();
			}
		});

		this.$window.on('resize', function(e) {
			self.setPosition();
		});

	},

/**
*	Event Handlers
**/
	__clickTrigger: function(e) {
		var self = this;
		this.currentIndex = this.elTriggers.index(this.elCurrentTrigger);
		this.openModal();
	},

/**
*	Public Methods
**/
	setPosition: function() {
		var docWidth = this.$document.width();
		var winHeight = this.$window.height();
		var winScrollTop = this.$window.scrollTop();
		var modalWidth = this.elModal.outerWidth();
		var modalHeight = this.elModal.outerHeight();
		if (this.isIPhone) {winHeight = window.innerHeight;}
		var leftPos = (((docWidth - modalWidth) / 2) + this.options.leftOffset);
		var topPos = (((winHeight - modalHeight) / 2) + this.options.topOffset);
		var minTopSpacing = this.options.minTopSpacing;

		if (this.isPosAbs) {
			topPos += winScrollTop;
			if (topPos < winScrollTop + minTopSpacing) {
				topPos = winScrollTop + minTopSpacing;
			}
		} else {
			if (topPos < minTopSpacing) {
				topPos = minTopSpacing;
			}
		}

		this.elModal.css({left: leftPos + 'px', top: topPos + 'px'});

	},

	// extend or override getContent in subclass to create custom modal
	getContent: function() {
		var self = this;
		var targetID = this.elCurrentTrigger.data('targetid') || this.elCurrentTrigger.attr('href').replace('#','');
		var targetEl = $('#' + targetID);

		this.contentHTML = targetEl.html();

		this.setContent();

	},

	// extend or override setContent in subclass to create custom modal
	setContent: function() {
		var self = this;

		this.elModalContent.html(this.contentHTML);

	},

	openModal: function() {
		var self = this;

		$.event.trigger(this.options.customEventPrfx + ':preOpenModal', [this.options.modalID]);

		this.isModalActivated = true;

		this.setPosition();

		this.elModalOverlay.fadeIn(this.options.fadeInOutSpeed, 'linear', function() {
			self.elModal.fadeIn(self.options.fadeInOutSpeed, 'linear', function() {

				self.elModal.addClass(self.options.activeClass).attr({'aria-expanded': 'true', 'aria-hidden': 'false'});

				self.elModal.focus();

				self.getContent();

				$.event.trigger(self.options.customEventPrfx + ':modalOpened', [self.options.modalID]);

			});
		});

	},

	closeModal: function() {
		var self = this;

		$.event.trigger(this.options.customEventPrfx + ':preCloseModal', [this.options.modalID]);

		this.elModal.fadeOut(this.options.fadeInOutSpeed, 'linear', function() {
			self.elModal.removeClass(self.options.activeClass).attr({'aria-expanded': 'false', 'aria-hidden': 'true'});

			self.elModalContent.empty();
			self.contentHTML = '';

			self.elModalOverlay.fadeOut(self.options.fadeInOutSpeed, 'linear');

			self.elCurrentTrigger.focus();

			self.isModalActivated = false;

			$.event.trigger(self.options.customEventPrfx + ':modalClosed', [self.options.modalID]);

		});

	}

});
// end ModalWindow
