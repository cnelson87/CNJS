/*
	TITLE: FullwidthCarousel

	DESCRIPTION: full screen carousel

	USAGE: new CNJS.UI.FullwidthCarousel('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- class.js
		- cnjs.js

*/

CNJS.UI.FullwidthCarousel = Class.extend({
	init: function($el, objOptions) {

		// defaults
		this.$window = CNJS.$window;
		this.$el = $el;
		this.options = $.extend({
			initialIndex: 0,
			numItemsPerGroup: 1,
			numVisibleItems: 3,
			selectorNavPrev: '.nav-prev',
			selectorNavNext: '.nav-next',
			selectorInnerTrack: 'div.carousel-inner-track',
			selectorItems: 'article',
			disabledClass: 'disabled',			// str: set css class for disabled prev/next nav
			activeClass: 'active',				// str: set css class for active items
			autoRotate: false,					// bool: auto rotate thru all items
			autoRotateInterval: 6000,			// num: delay (in milliseconds) between auto rotations
			maxAutoRotations: 1,				// num: stop auto rotation after x cycles
			animDuration: 400,
			animEasing: 'swing',
			customEventPrfx: 'CNJS:UI:FullwidthCarousel'
		}, objOptions || {});

		// element references
		this.$elNavPrev = this.$el.find(this.options.selectorNavPrev);
		this.$elNavNext = this.$el.find(this.options.selectorNavNext);
		this.$elInnerTrack = this.$el.find(this.options.selectorInnerTrack);
		this.$elItems = this.$elInnerTrack.find(this.options.selectorItems);
		this.$elItemLinks = this.$elInnerTrack.find('a');

		// setup & properties
		this.isInitialized = false;
		this.isAnimating = false;
		this._len = this.$elItems.length;
		this.scrollAmt = this.$elItems.outerWidth(true) * -1;
		this.setAutoRotation = null;
		this.rotationInterval = null;
		this.autoRotationCounter = null;
		this.numItemsPerGroup = this.options.numItemsPerGroup;
		this.numVisibleItems = this.options.numVisibleItems;
		this.currentIndex = this.options.initialIndex;
		this.lastIndex = this._len - this.numVisibleItems;
		if (this.currentIndex >= this._len) {this.currentIndex = 0;}

		this.initDisplay();

		this.bindEvents();

	},


/**
*	Private Methods
**/

	initDisplay: function() {
		var self = this;
		var leftPos = this.scrollAmt * this.currentIndex;

		this.$el.attr({'role':'listbox'});
		this.$elItems.attr({'role':'option', 'tabindex':'-1'});
		this.$elNavPrev.attr({'role':'button'});
		this.$elNavNext.attr({'role':'button'});
		this.$elItemLinks.attr({'tabindex':'-1'});
		this.updateItems();

		// disable nav links if not enough visible items
		this.updateNav();
		this.setNavPosition();
		if (this._len <= this.numVisibleItems) {
			this.$elNavPrev.addClass(this.options.disabledClass);
			this.$elNavNext.addClass(this.options.disabledClass);
		}

		// adjust initial position
		this.$elInnerTrack.css({left: leftPos});

		// auto-rotate items
		if (this.options.autoRotate) {
			this.rotationInterval = this.options.autoRotateInterval;
			this.autoRotationCounter = this._len * this.options.maxAutoRotations;
			this.setAutoRotation = setInterval(function() {
				self._autoRotation();
			}, self.rotationInterval);
		}

		this.isInitialized = true;

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.$el]);

	},

	bindEvents: function() {

		this.$elNavPrev.bind('click', function(e) {
			e.preventDefault();
			if (!this.$elNavPrev.hasClass(this.options.disabledClass) && !this.isAnimating) {
				this.__clickNavPrev(e);
			}
		}.bind(this));

		this.$elNavNext.bind('click', function(e) {
			e.preventDefault();
			if (!this.$elNavNext.hasClass(this.options.disabledClass) && !this.isAnimating) {
				this.__clickNavNext(e);
			}
		}.bind(this));

		this.$window.on('resize', function(e) {
			this.setNavPosition();
		}.bind(this));

	},

	_autoRotation: function () {
		this.currentIndex++;
		if (this.currentIndex === this._len) {this.currentIndex = 0;}
		this.updateCarousel();
		this.autoRotationCounter--;
		if (this.autoRotationCounter === 0) {
			clearInterval(this.setAutoRotation);
			this.options.autoRotate = false;
		}
	},


/**
*	Event Handlers
**/

	__clickNavPrev: function(e) {

		if (this.options.autoRotate) {
			clearInterval(this.setAutoRotation);
			this.options.autoRotate = false;
		}
		this.currentIndex = this.currentIndex - this.numItemsPerGroup;
		this.updateCarousel();

	},

	__clickNavNext: function(e) {

		if (this.options.autoRotate) {
			clearInterval(this.setAutoRotation);
			this.options.autoRotate = false;
		}
		this.currentIndex = this.currentIndex + this.numItemsPerGroup;
		this.updateCarousel();

	},


/**
*	Public Methods
**/

	updateCarousel: function() {
		var self = this;
		var leftPos = this.scrollAmt * this.currentIndex;

		this.isAnimating = true;

		this.updateNav();

		this.$elItems.removeClass(this.options.activeClass);
		this.$elItemLinks.attr({'tabindex':'-1'});

		this.$elInnerTrack.animate({
			left: leftPos
		}, self.options.animDuration, self.options.animEasing, function(){
			self.updateItems();
			self.isAnimating = false;
		});

		$.event.trigger(this.options.customEventPrfx + ':carouselUpdated', [this.currentIndex]);

	},

	updateItems: function() {
		var currentIndex = this.currentIndex;
		var count = currentIndex + this.numVisibleItems;
		var $elCurrentItems = this.$elItems.slice(currentIndex, count);
		var $elCurrentItemLinks = $elCurrentItems.find('a');

		$elCurrentItems.addClass(this.options.activeClass);
		$elCurrentItemLinks.attr({'tabindex':'0'});

		if (this.isInitialized) {
			$(this.$elItems[currentIndex]).focus();
		}

	},

	updateNav: function() {

		this.$elNavPrev.removeClass(this.options.disabledClass).attr({'tabindex':'0'});
		this.$elNavNext.removeClass(this.options.disabledClass).attr({'tabindex':'0'});

		if (this.currentIndex <= 0) {
			this.$elNavPrev.addClass(this.options.disabledClass).attr({'tabindex':'-1'});
		}
		if (this.currentIndex >= this.lastIndex) {
			this.$elNavNext.addClass(this.options.disabledClass).attr({'tabindex':'-1'});
		}

	},

	setNavPosition: function() {
		var horizOffset = this.$el.offset().left;
		this.$elNavPrev.css({left: - horizOffset});
		this.$elNavNext.css({right: - horizOffset});
	}

});
// end FullwidthCarousel


// start MultiCarouselController
CNJS.UI.MultiFullwidthCarouselController = Class.extend({
	init: function($els, objOptions) {
		var $els = $els;
		var len = $els.length;
		var $el;
		for (var i=0; i<len; i++) {
			$el = $($els[i]);
			new CNJS.UI.FullwidthCarousel($el, objOptions);
		}
	}
});
