/*
	TITLE: Tooltip

	DESCRIPTION: standard tooltip

	USAGE: new CNJS.UI.Tooltip('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.10+
		- class.js
		- cnjs.js

*/

CNJS.UI.Tooltip = Class.extend({
	init: function($triggers, objOptions) {

		// defaults
		this.$body = CNJS.$body;
		this.$elTriggers = $triggers;
		this.options = $.extend({
			tooltipID: 'tooltip',
			tooltipClass: 'tooltip',
			tooltipArrowClass: 'tooltip-arrow',
			defaultPosition: 'east',	// str: tooltip is positioned 'west', 'north', 'south', or 'east' of the trigger
			leftOffset: 0,
			topOffset: 0,
			useAppearEffect: true,
			fadeInOutSpeed: 200,
			hoverDelay: 200,
			customEventPrfx: 'CNJS:UI:Tooltip'
		}, objOptions || {});

		// ensure position is 'west', 'north', 'south', or 'east'
		if ((this.options.defaultPosition != 'west') &&
			(this.options.defaultPosition != 'north') &&
			(this.options.defaultPosition != 'south')) {
			this.options.defaultPosition = 'east';
		}

		// setup & properties
		this._len = this.$elTriggers.size();
		this.isActivated = false;
		this.enterTimeout = false;
		this.leaveTimeout = false;
		this.currentIndex = false;
		this.elTooltip = false;
		this.elTooltipContent = false;
		this.elTooltipArrow = false;
		this.tooltipHTML = '';
		this.tooltipPositionClass = this.options.tooltipClass + '-' + this.options.defaultPosition;
		this.arTargetIDs = [];
		this.elTargets = [];
		this.tooltipID = this.options.tooltipID;

		this.initDisplay();

		this.bindEvents();

	},


/**
*	'Private' Methods
**/

	initDisplay: function() {
		var elTrigger = false;

		for (var i=0; i<this._len; i++) {
			elTrigger = $(this.$elTriggers[i]);
			this.arTargetIDs[i] = elTrigger.attr('data-targetID');
			this.elTargets[i] = $('#' + this.arTargetIDs[i]);
			this.elTargets[i].hide();
		}

		this.tooltipHTML = '<div id="' + this.tooltipID + '" class="' + this.options.tooltipClass + ' ' + this.tooltipPositionClass + ' ' + '" role="tooltip" aria-expanded="false" aria-hidden="true">';
		this.tooltipHTML += '	<div class="' + this.options.tooltipClass + '-content" tabindex="-1"></div>';
		this.tooltipHTML += '	<div class="' + this.options.tooltipArrowClass + '"></div>';
		this.tooltipHTML += '</div>';
		this.elTooltip = $(this.tooltipHTML);
		this.elTooltipContent = this.elTooltip.find('.' + this.options.tooltipClass + '-content');
		this.elTooltipArrow = this.elTooltip.find('.' + this.options.tooltipArrowClass + '-content');
		this.$body.append(this.elTooltip);
		this.elTooltip.hide();

		this._isInitialized = true;

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.elContainer]);

		this._bindEvents();

	},

	bindEvents: function() {
		var self = this;

		this.$elTriggers.bind({
			click: function(event) {
				event.preventDefault();
				if (!self._isActivated) {
					self.__triggerMouseenter();
				}
			},
			mouseenter: function(event) {
				self.currentIndex = self.$elTriggers.index(event.currentTarget);
				self.__triggerMouseenter();
			},
			mouseleave: function() {
				self.__triggerMouseleave();
			}
		});

		this.elTooltip.bind({
			mouseenter: function() {
				self.__tooltipMouseenter();
			},
			mouseleave: function() {
				self.__tooltipMouseleave();
			}
		});

	},


/**
*	Event Handlers
**/

	__triggerMouseenter: function() {
		var self = this;
		clearTimeout(this.leaveTimeout);
		this.enterTimeout = setTimeout(function() {
			self.openTooltip();
		}, self.options.hoverDelay);
	},
	__triggerMouseleave: function() {
		var self = this;
		clearTimeout(this.enterTimeout);
		this.leaveTimeout = setTimeout(function() {
			self.closeTooltip();
		}, self.options.hoverDelay);
	},
	__tooltipMouseenter: function() {
		var self = this;
		clearTimeout(this.leaveTimeout);
	},
	__tooltipMouseleave: function() {
		var self = this;
		clearTimeout(this.enterTimeout);
		this.leaveTimeout = setTimeout(function() {
			self.closeTooltip();
		}, self.options.hoverDelay);
	},


/**
*	Public Methods
**/

	openTooltip: function() {
		var self = this;

		this._isActivated = true;

		this.elTooltipContent.html(this.elTargets[this.currentIndex].html());

		this.positionTooltip();

		if (this.options.useAppearEffect) {
			this.elTooltip.fadeIn(this.options.fadeInOutSpeed, 'linear', function() {
				self.elTooltipContent.focus();
				$.event.trigger(self.options.customEventPrfx + ':tooltipOpened');
			});
		} else {
			this.elTooltip.show();
			this.elTooltipContent.focus();
			$.event.trigger(this.options.customEventPrfx + ':tooltipOpened');
		}

	},

	closeTooltip: function() {
		var self = this;

		this.elTooltipContent.html('');
		if (this.options.useAppearEffect) {
			this.elTooltip.fadeOut(this.options.fadeInOutSpeed, 'linear', function() {
				self._isActivated = false;
				$.event.trigger(self.options.customEventPrfx + ':tooltipClosed');
			});
		} else {
			this.elTooltip.hide();
			this._isActivated = false;
			$.event.trigger(this.options.customEventPrfx + ':tooltipClosed');
		}
		this.$elTriggers[this.currentIndex].focus();
		//this.$elTriggers[this.currentIndex].blur();

	},

	positionTooltip: function() {
		var index = this.currentIndex;
		var elTrigger = $(this.$elTriggers[index]);
		var triggerW = elTrigger.outerWidth();
		var triggerH = elTrigger.outerHeight();
		var tooltipW = this.elTooltip.outerWidth();
		var tooltipH = this.elTooltip.outerHeight();
		var offset = elTrigger.offset();
		var triggerT = offset.top;
		var triggerL = offset.left;
		var xOffset = this.options.leftOffset;
		var yOffset = this.options.topOffset;
		var posLeft = 0;
		var posTop = 0;
		var pos = this.options.defaultPosition;

		if (pos === 'west') {
			posLeft = triggerL - (xOffset + tooltipW);
			posTop = triggerT + yOffset;
		} else if (pos === 'north') {
			posLeft = triggerL + xOffset;
			posTop = triggerT - (yOffset + tooltipH);
		} else if (pos === 'south') {
			posLeft = triggerL + xOffset;
			posTop = triggerT + (triggerH + yOffset);
		} else { //'east'
			posLeft = triggerL + (xOffset + triggerW);
			posTop = triggerT + yOffset;
		}

		this.elTooltip.css({left: posLeft + 'px', top: posTop + 'px'});

	}

});

