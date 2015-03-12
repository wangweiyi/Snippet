(function($) {
	'use strict';

	if(!$) {
		alert('Exit: jquery or zepto is required!');
		return;
	}

	//去色，实现图像黑白色
	var Desaturate = {
		//FF10+
		svgFilter : function(img) {
			$(img).css({
				filter: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale")'
			});
		},

		//FF35+
		css3Filter : function(img) {
			$(img).css({
				'-webkit-filter': 'grayscale(100%)',
				'filter': 'grayscale(100%)'
			});
		},

		//IE6~9
		ieFilter : function(img) {
			$(img).css({
				filter: 'gray'
			});
		},

		//ie10+, ff2+, chrome4+, opera10.1+, safari3.1+, android2.1+
		canvas : function(img) {
			var canvas = document.createElement('canvas'),
		    	ctx = canvas.getContext('2d');

		    //将图像画到canvas上
		    canvas.width = img.width;
		    canvas.height = img.height;
		    ctx.drawImage(img, 
		    	0, 0, img.getAttribute('data-width'), img.getAttribute('data-height'), //注意这里要用图像的原始宽高，而非缩放后的宽高
		    	0, 0, canvas.width, canvas.height); 
		    
		    //去色
	        var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
	        for(var y = 0; y < imgPixels.height; y++) {
	                for(var x = 0; x < imgPixels.width; x++){
	                        var i = (y * 4) * imgPixels.width + x * 4;
	                        var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
	                        imgPixels.data[i] = avg; 
	                        imgPixels.data[i + 1] = avg; 
	                        imgPixels.data[i + 2] = avg;
	                        imgPixels.data[i + 3] = 255; //0完全透明, 255完全不透明
	                }
	        }
	        
	        //覆盖原图像
	        ctx.putImageData(imgPixels, 0, 0, 0, 0, $(img).width(), $(img).height());
	        img.src = canvas.toDataURL();
		}
	}

	//export
	window.Desaturate = Desaturate;
	
})(window.jQuery || window.Zepto);



