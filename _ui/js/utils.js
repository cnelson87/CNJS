/*
	TITLE: CNJS UTILS

	DESCRIPTION: various utility functions

	AUTHORS: CN

	DEPENDENCIES:
		- jQuery 1.8+
		- class.js
		- cnjs.js

*/

var CNJS = CNJS || {};
CNJS.UTILS = CNJS.UTILS || {};


/**
*	reate, read, destroy cookies
**/
CNJS.UTILS.Cookie = {

	checkSupport: function() {
		this.create('cookieSupportTest', 'test', 10000);
		if (this.read('cookieSupportTest')) {
			this.destroy('cookieSupportTest');
			return true;
		} else {
			return false;
		}
	},

	create: function(name, value, days) {
		var date;
		var expires;

		if (days) {
			date = new Date();
			//date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			date.setTime(date.getTime() + (days * 86400000));
			expires = "; expires=" + date.toGMTString();
		} else {
			expires = "";
		}

		document.cookie = name + "=" + value + expires + "; path=/";
	},

	read: function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		var i;
		var c;

		for (i = 0; i < ca.length; i++) {
			c = ca[i];

			while (c.charAt(0) == ' ') {
				c = c.substring(1, c.length);
			}

			if (c.indexOf(nameEQ) == 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}

		return null;
	},

	destroy: function(name) {
		this.create(name, "", -1);
	}

};

/**
*	create pseudo 'resizeEnd' event
**/
CNJS.UTILS.resizeEndEvent = function() {
	var timer = false;
	CNJS.$window.on('resize', function(e) {
		clearTimeout(timer);
		timer = setTimeout(function() {
			//console.log('resizeEnd');
			$.event.trigger('resizeEnd');
		},200);
	});
};
//$(function() {
//	CNJS.UTILS.resizeEndEvent();
//});


/**
*	create pseudo 'scrollEnd' event
**/
CNJS.UTILS.scrollEndEvent = function() {
	var timer = false;
	CNJS.$window.on('scroll', function(e) {
		clearTimeout(timer);
		timer = setTimeout(function() {
			//console.log("scrollEnd");
			$.event.trigger('scrollEnd');
		},200);
	});
};
//$(function() {
//	CNJS.UTILS.scrollEndEvent();
//});


/**
*	Submit Form on enter click
**/
CNJS.UTILS.SubmitForm = function($element, objOptions) {
	var self = this;
	this.elContainer = $element;
	this.options = $.extend({
		selectorSubmitBtn: 'input[type=submit]'
	}, objOptions || {});
	this.elSubmitBtn = this.elContainer.find(this.options.selectorSubmitBtn);
	this.elContainer.find('input,select').keydown(function(event) {
		if (event.keyCode == '13') {
			event.preventDefault();
			self.elSubmitBtn.click();
		}
	});
};


/**
*	Print Page
**/
CNJS.UTILS.PrintPage = function($links) {
	$links.bind('click', function(event) {
		event.preventDefault();
		window.print();
	});
};


/**
*	Gets URL hash & returns array
**/
CNJS.UTILS.getUrlHash = function() {
	var getUrl = window.location.hash;
	var vars = [];
	var hashes = [];
	var hash = [];
	var len = 0;
	if (getUrl) {
		hashes = getUrl.replace('#', '').split('&');
		len = hashes.length;
		for (var i = 0; i < len; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	} else {
		return false;
	}

};


/**
*	Gets query string & returns array
**/
CNJS.UTILS.getUrlQueryString = function() {
	var getUrl = window.location.href.split('?')[1];
	var vars = [];
	var hashes = [];
	var hash = [];
	var len = 0;
	if (getUrl) {
		hashes = getUrl.split('#')[0].split('&');
		len = hashes.length;
		for (var i = 0; i < len; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	} else {
		return false;
	}
};


/**
*	returns an Ajax GET request using deferred, url is required, dataType is optional
**/
CNJS.UTILS.getAjaxContent = function(url, dataType) {
	return $.ajax({
		type: 'GET',
		url: url,
		dataType: dataType || 'html'
	});
};


/**
*	returns an Ajax POST response using deferred, url & data are required, dataType is optional
**/
CNJS.UTILS.performAjaxPost = function(url, data, dataType) {
	return $.ajax({
		type: 'POST',
		url: url,
		data: data,
		dataType: dataType || 'html'
	});
};


/**
*	returns serialized form data, container element is required
	(in .NET you rarely get an actual form tags)
**/
CNJS.UTILS.serializeFormElements = function($el) {
	return $el.find('input, select, textarea').serialize();
};


/**
*	returns an element tag name
**/
CNJS.UTILS.getTagName = function($el) {
	return $el.prop('tagName').toLowerCase();
};


/**
*	returns true/false, is element in viewport? element is required, top/bot offsets are optional
**/
CNJS.UTILS.isElemInView = function($el, topOffset, botOffset) {
	if (!topOffset) {topOffset = 0}
	if (!botOffset) {botOffset = 0}
	var viewTop = CNJS.$window.scrollTop() + topOffset;
	var viewBot = viewTop + CNJS.$window.height() - topOffset;
	var elemTop = $el.offset().top;
	var elemBot = elemTop + $el.height();
	return ((elemBot >= viewTop) && (elemTop <= viewBot));
};


/**
*	Universal Ajax loader
**/
CNJS.UTILS.AjaxLoader = function($target, objOptions) {
	this.elTarget = $target;
	this.options = $.extend({
		overlay: '<div class="overlay"></div>',
		spinner: '<div class="spinner"></div>'
	}, objOptions || {});
	this.elOverlay = $(this.options.overlay);
	this.elSpinner = $(this.options.spinner);
};
CNJS.UTILS.AjaxLoader.prototype = {
	addAjaxLoader: function() {
		var self = this;
		this.elTarget.append(this.elOverlay, this.elSpinner);
		setTimeout(function() {
			self.elSpinner.click(); //spinner gif gets 'stuck' and needs a click
		}, 10);
	},
	removeAjaxLoader: function() {
		this.elOverlay.remove();
		this.elSpinner.remove();
	}
};
/*** /AjaxLoader ***/


/**
*	Sets equal height on a collection of DOM els
**/
CNJS.UTILS.HeightAdjuster = function($items, objOptions) {
	var self = this;
	this.items = $items;
	this._len = this.items.size();
	if (this._len <= 1) {return;}
	this.options = $.extend({
		elParent: false		// set height on parent element, defaults to false, or pass in $extended parent element
	}, objOptions || {});
	this.heightArr = [];
	this.maxHeight = 0;
	this.getSetHeight();
};
CNJS.UTILS.HeightAdjuster.prototype = {
	getSetHeight: function() {
		for (var i=0; i<this._len; i++) {
			this.heightArr.push($(this.items[i]).height());
			this.maxHeight = (this.heightArr[i] > this.maxHeight) ? this.heightArr[i] : this.maxHeight;
		}
		this.items.css({height: this.maxHeight});
		if (this.options.elParent) {
			this.options.elParent.css({height: this.maxHeight});
		}
	}
};
/*** /HeightAdjuster ***/


/**
*	PopupWindow
**/
CNJS.UTILS.PopupWindow = function($triggers, objOptions) {
	var self = this;
	this.elTriggers = $triggers;
	this._len = this.elTriggers.length;
	this.options = $.extend({
		popupName: 'popup',
		width: 640,
		height: 360,
		xtras: 'location=no,menubar=no,statusbar=no,toolbar=no,scrollbars=no,resizable=yes'
	}, objOptions || {});
	this.features = 'width=' + this.options.width + ',height=' + this.options.height + ',' + this.options.xtras;
	this.elTriggers.bind('click', function(event) {
		event.preventDefault();
		self.__click(event);
	});
};
CNJS.UTILS.PopupWindow.prototype = {
	__click: function(event) {
		var el = event.currentTarget;
		this.openPopup(el);
	},
	openPopup: function(el) {
		var index = this.elTriggers.index(el);
		var url = $(this.elTriggers[index]).attr('href');
		var win = window.open(url, this.options.popupName, this.features);
		win.focus();
	}
};
/**
*	ClosePopup
**/
CNJS.UTILS.ClosePopup = function($trigger) {
	this.elTrigger = $trigger;
	this.elTrigger.bind('click', function(event) {
		event.preventDefault();
		window.close();
	});
};
/*** /PopupWindow ***/
