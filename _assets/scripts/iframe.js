
var CNJS = CNJS || {};

CNJS.iframe = {
	init: function () {
		var self = this;
		console.log('CNJS.iframe.init');

		//var origin = 'http://macn-chrisn:8888/';
		var origin = '*';
		var bodyHeight = $('body').height();
		var elCloseLinks = $('.lnk-close');
		//alert(bodyHeight);
		window.parent.postMessage('bodyHeight:'+bodyHeight, origin);

		elCloseLinks.on('click', function(e){
			e.preventDefault();
			window.parent.postMessage('closeModal', origin);
		});

	}
};

$(function () {
	CNJS.iframe.init();
});
