/*
	TITLE: ModalWindow

	DESCRIPTION: 

	USAGE: new CNJS.UI.ModalWindow('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	VERSION: 0.1.0

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.8+
		- class.js
		- cnjs.js

	CHANGE LOG
	--------------------------
	10/05/12 - CN: Inception
	--------------------------

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
			closeBtnInnerHTML: '<span>X</span>',//ex: '<span class="offscreen">close window</span>'
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
		this.isPosAbs = false;			//position:absolute;
		this.contentHTML = null;
		this.currentIndex = null;

		this._initDisplay();

        delete this.init;
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
				'tabindex': '-1',
				'aria-expanded': 'false',
				'aria-hidden': 'true'
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
		//this.setPosition();

		//top pos assumes position:fixed by defalt, if position:absolute the top pos gets trickier.
		this.isPosAbs = (this.elModal.css('position') == 'absolute') ? true : false;

		this._bindEvents();

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

		this.$document.bind('focusin', function(e) {
			if (self.isModalActivated && !self.elModal.get(0).contains(e.target)) {
				self.elModal.focus();
			}	
		});

		this.$document.bind('keydown', function(e) {
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
		var modalWidth = this.elModal.outerWidth();
		var modalHeight = this.elModal.outerHeight();
		if (this.isIPhone) {winHeight = window.innerHeight;}
		var leftPos = (((docWidth - modalWidth) / 2) + this.options.leftOffset);
		var topPos = (((winHeight - modalHeight) / 2) + this.options.topOffset);

		if (this.isPosAbs) {
			topPos = topPos + this.$window.scrollTop();
			if (topPos < this.options.minTopSpacing) {
				topPos = this.options.minTopSpacing;
			}
		}

		if (topPos < this.options.minTopSpacing && !this.isPosAbs) {
			topPos = this.options.minTopSpacing;
		}

		this.elModal.css({left: leftPos + 'px', top: topPos + 'px'});

	},

	getContent: function() {
		var self = this;
		var targetID = this.elCurrentTrigger.data('targetid') || this.elCurrentTrigger.attr('href').replace('#','');
		var targetEl = $('#' + targetID);

		this.contentHTML = targetEl.html();

		this.setContent();

	},

	setContent: function() {
		var self = this;
		var winHeight = this.$window.height();
		var modalHeight;
		var modalTop;

		this.elModalContent.html(this.contentHTML);

		modalHeight = this.elModal.outerHeight();
		modalTop = this.elModal.position().top;

		//if (modalHeight + modalTop > winHeight) {
			this.setPosition();
		//}

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
