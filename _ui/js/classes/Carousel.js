/*
	TITLE: Carousel

	DESCRIPTION: standard carousel

	USAGE: new CNJS.UI.Carousel('Element', 'Options')
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
	10/22/12 - CN: Inception
	--------------------------

*/

CNJS.UI.Carousel = Class.extend({
	init: function($element, objOptions) {
		var self = this;

		// defaults
		this.$window = CNJS.$window;
		this.elContainer = $element;
		this.options = $.extend({
			initialIndex: 0,
			numItemsPerGroup: 1,
			numVisibleItems: 1,
			selectorNavPrev: '.nav-prev',
			selectorNavNext: '.nav-next',
			selectorInnerTrack: 'ul.carousel-inner-track',
			selectorItems: 'li',
			disabledClass: 'disabled',			// str: set css class for disabled prev/next nav
			activeClass: 'active',				// str: set css class for active items
			autoRotate: false,					// bool: auto rotate thru all items
			autoRotateInterval: 6000,			// num: delay (in milliseconds) between auto rotations
			maxAutoRotations: 1,				// num: stop auto rotation after x cycles
			animDuration: 400,
			animEasing: 'swing',
			customEventPrfx: 'CNJS:UI:Carousel'
		}, objOptions || {});

		// element references
		this.elNavPrev = this.elContainer.find(this.options.selectorNavPrev);
		this.elNavNext = this.elContainer.find(this.options.selectorNavNext);
		this.elInnerTrack = this.elContainer.find(this.options.selectorInnerTrack);
		this.elItems = this.elInnerTrack.find(this.options.selectorItems);
		this.elItemLinks = this.elInnerTrack.find('a');

		// setup & properties
		this.containerID = this.elContainer.attr('id');
		this._isInitialized = false;
		this._isAnimating = false;
		this._len = this.elItems.length;
		this.scrollAmt = this.elItems.outerWidth(true) * -1;
		this.setAutoRotation = null;
		this.rotationInterval = null;
		this.autoRotationCounter = null;
		this.numItemsPerGroup = this.options.numItemsPerGroup;
		this.numVisibleItems = this.options.numVisibleItems;
		this.currentIndex = this.options.initialIndex;
		this.lastIndex = this._len - this.numVisibleItems;
		if (this.currentIndex >= this._len) {this.currentIndex = 0;}

		this._initDisplay();

		delete this.init;
	},

/**
*	Private Methods
**/
	_initDisplay: function() {
		var self = this;
		var leftPos = this.scrollAmt * this.currentIndex;

		// add aria attributes
		this.elContainer.attr({'role':'listbox'});
		this.elItems.attr({'role':'option', 'tabindex':'-1', 'aria-selected':'false'});
		this.elNavPrev.attr({'role':'button', 'aria-controls': this.containerID});
		this.elNavNext.attr({'role':'button', 'aria-controls': this.containerID});
		this.elItemLinks.attr({'tabindex':'-1'});
		this.updateItems();

		// disable nav links if not enough visible items
		this.updateNav();
		if (this._len <= this.numVisibleItems) {
			this.elNavPrev.addClass(this.options.disabledClass);
			this.elNavNext.addClass(this.options.disabledClass);
		}

		// adjust initial position
		this.elInnerTrack.css({left: leftPos});

		// auto-rotate items
		if (this.options.autoRotate) {
			this.rotationInterval = this.options.autoRotateInterval;
			this.autoRotationCounter = this._len * this.options.maxAutoRotations;
			this.setAutoRotation = setInterval(function() {
				self._autoRotation();
			}, self.rotationInterval);
		}

		this._isInitialized = true;

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.elContainer]);

		this._bindEvents();

	},

	_bindEvents: function() {
		var self = this;

		this.elNavPrev.on('click', function(e) {
			e.preventDefault();
			if (!self.elNavPrev.hasClass(self.options.disabledClass) && !self._isAnimating) {
				self.__clickNavPrev(e);
			}
		});
		this.elNavNext.on('click', function(e) {
			e.preventDefault();
			if (!self.elNavNext.hasClass(self.options.disabledClass) && !self._isAnimating) {
				self.__clickNavNext(e);
			}
		});

	},
	_autoRotation: function() {
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
		var self = this;

		if (this.options.autoRotate) {
			clearInterval(this.setAutoRotation);
			this.options.autoRotate = false;
		}
		this.currentIndex = this.currentIndex - this.numItemsPerGroup;
		this.updateCarousel();

	},
	__clickNavNext: function(e) {
		var self = this;

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

		this._isAnimating = true;

		this.updateNav();

		this.elItems.removeClass(this.options.activeClass).attr({'aria-selected':'false'});

		this.elInnerTrack.animate({
			left: leftPos
		}, self.options.animDuration, self.options.animEasing, function() {
			self.updateItems();
			self._isAnimating = false;
		});

		$.event.trigger(this.options.customEventPrfx + ':carouselUpdated', [this.currentIndex]);

	},
	updateItems: function() {
		var currentIndex = this.currentIndex;
		var count = currentIndex + this.numVisibleItems;
		var elCurrentItems = this.elItems.slice(currentIndex, count);
		var elCurrentItemLinks = elCurrentItems.find('a');

		elCurrentItems.addClass(this.options.activeClass).attr({'aria-selected':'true'});
		elCurrentItemLinks.attr({'tabindex':'0'});

		if (this._isInitialized) {
			$(this.elItems[currentIndex]).focus();
		}

	},
	updateNav: function() {

		this.elNavPrev.removeClass(this.options.disabledClass).attr({'tabindex':'0'});
		this.elNavNext.removeClass(this.options.disabledClass).attr({'tabindex':'0'});

		if (this.currentIndex <= 0) {
			this.elNavPrev.addClass(this.options.disabledClass).attr({'tabindex':'-1'});
		}
		if (this.currentIndex >= this.lastIndex) {
			this.elNavNext.addClass(this.options.disabledClass).attr({'tabindex':'-1'});
		}

	}

});
// end Carousel

// start MultiCarouselController
CNJS.UI.MultiCarouselController = Class.extend({
	init: function($elements, objOptions) {
		this.elContainers = $elements;
		this.options = objOptions;
		this.arrCarousels = [];
		var elContainer;
		for (var i=0, len = this.elContainers.length; i<len; i++) {
			elContainer = $(this.elContainers[i]);
			this.arrCarousels[i] = new CNJS.UI.Carousel(elContainer, this.options);
		}
	}
});
