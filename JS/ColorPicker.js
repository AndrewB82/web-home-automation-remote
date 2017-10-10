/* ColorPicker and ColorCursor largely using code from: 
https://stackoverflow.com/questions/41844110/ploting-rgb-or-hex-values-on-a-color-wheel-using-js-canvas  
and corresponding jsfiddle: http://jsfiddle.net/havdto6e/4/ , credit to this guy: 
https://stackoverflow.com/users/1579780/giladd */

/* Mouse tracking with touchscreen capabilities largely credited to http://zipso.net , specifically to: 
https://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/ */

/* ColorPicker class */

function ColorPicker(element) {
    this.element = element;

    this.init = function() {
        var diameter = this.element.offsetWidth;
        var canvas_wheel = document.createElement('canvas');
        
        canvas_wheel.width = diameter;
        canvas_wheel.height = diameter;
	    canvas_wheel.style.zIndex = "0";
        this.canvas = canvas_wheel;
        this.renderColorMap();
        element.appendChild(canvas_wheel);
    };

    this.renderColorMap = function() {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var radius = canvas.width / 2;
        var toRad = (2 * Math.PI) / 360;
        var step = 1 / radius;
        var cx = cy = radius;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);        
        for(var i = 0; i < 360; i += step) {
            var rad = i * toRad;
            var x = radius * Math.cos(rad),
                y = radius * Math.sin(rad);
            
            ctx.strokeStyle = 'hsl(' + i + ', 100%, 50%)';
            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.lineTo(cx + x, cy + y);
            ctx.stroke();
        }
	// draw saturation gradient
        var grd = ctx.createRadialGradient(cx,cy,0,cx,cx,radius);
        
        grd.addColorStop(0,'rgba(255, 255, 255, 1)');			  
	    grd.addColorStop(1,'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    };
    
    this.init();
}

/* Cursor Class */

function ColorCursor(element) {
	this.element = element;
	this.radius = 0;
	this.center_point = {};
	
	this.init = function() {
	    var canvas_dimension = this.element.offsetWidth;	
	    var canvas_cursor = document.createElement('canvas');
        
        canvas_cursor.width = canvas_dimension;
	    canvas_cursor.height = canvas_dimension;
	    canvas_cursor.style.zIndex = "1";
	    this.canvas = canvas_cursor;
	    this.radius = this.canvas.width / 2;
	    this.center_point = {'x': this.radius,'y': this.radius};
	    this.renderCursor();
	    element.appendChild(canvas_cursor);
	    this.setupColorCursorBindings();

	};

    this.renderCursor = function(x,y) {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
		var distance = Math.sqrt(Math.pow(x-this.center_point.x,2)+Math.pow(y-this.center_point.y,2));
        	
		if (distance <= this.radius) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.strokeStyle = 'rgb(255, 255, 255)';
        	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        	ctx.lineWidth = '2';
        	ctx.beginPath();
        	ctx.arc(x, y, 20, 0, Math.PI * 2, true);
        	ctx.closePath();
        	ctx.fill();
        	ctx.stroke();
		}
    };

	this.setupColorCursorBindings = function() {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var self = this;
        var container_offsetLeft = this.element.offsetLeft;
        var container_offsetTop = this.element.offsetTop; 
        var mouseX, mouseY, mouseDown, touchX, touchY = 0;
        
/* Mouse tracking with touchscreen capabilities largely credited to http://zipso.net , 
specifically to: https://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/ */

        function getMousePos(e) {
            if (!e)
                var e = event;
            mouseX = e.offsetX || e.pageX - e.target.offsetLeft - container_offsetLeft;
            mouseY = e.offsetY || e.pageY - e.target.offsetTop - container_offsetTop;
        }
        
        function getTouchPos(e) {
            if (!e)
                var e = event;

            if (e.touches) {
                if (e.touches.length == 1) { // Only deal with one finger
                    var touch = e.touches[0]; // Get the information for finger #1
                    touchX = touch.pageX - touch.target.offsetLeft - container_offsetLeft;
                    touchY = touch.pageY - touch.target.offsetTop - container_offsetTop;
                }
            }
        }

        canvas.addEventListener('mousedown', function(e) {
            getMousePos(e);
            mouseDown = 1;
            self.renderCursor(mouseX, mouseY);
        }, false);
        
        canvas.addEventListener('mousemove', function(e) {
            var param = "";
            var imgData = [], ciecolor = [];
            // Update the mouse co-ordinates when moved
            getMousePos(e);
            // Draw a pixel if the mouse button is currently being pressed 
            if (mouseDown == 1) {  
                self.renderCursor(mouseX, mouseY);
            }
        }, false);
        
        canvas.addEventListener('mouseup', function(e) {
            var param_hue, param_fibaro, color_string = "";
            var imgData = [], ciecolor = [];
            var distance = Math.sqrt(Math.pow(mouseX-self.center_point.x,2)+Math.pow(mouseY-self.center_point.y,2));
        
            if (distance <= self.radius) {
                imgData = pick.canvas.getContext('2d').getImageData(mouseX, mouseY, 1, 1).data;
                ciecolor = rgb_to_cie(imgData[0],imgData[1],imgData[2]);
                ciecolor[0] = Number(ciecolor[0]);
                ciecolor[1] = Number(ciecolor[1]);
                param_hue = JSON.stringify({"xy": ciecolor});
                param_fibaro = {p0: imgData[0], p1: imgData[1], p2: imgData[2], p3: 0};
                setLampBuffer(lights);
                setLamps(param_hue,param_fibaro,"setColor");
            }
        }, false);   
        
        window.addEventListener('mouseup', function(e) {
            mouseDown = 0;
        }, false);
        
        canvas.addEventListener('touchstart', function(e) {
            getTouchPos(e);
            self.renderCursor(touchX, touchY);
            // Prevents an additional mousedown event being triggered
            event.preventDefault();
        }, false);
        
        canvas.addEventListener('touchmove', function(e) {
            getTouchPos(e);
            // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
            self.renderCursor(touchX, touchY); 
            // Prevent a scrolling action as a result of this touchmove triggering.
            event.preventDefault();
        }, false); 

        canvas.addEventListener('touchend', function(e) {
            var param = "";
            var imgData = [], ciecolor = [];
            var distance = Math.sqrt(Math.pow(touchX-self.center_point.x,2)+Math.pow(touchY-self.center_point.y,2));
            
            if (distance <= self.radius) {
                imgData = pick.canvas.getContext('2d').getImageData(touchX, touchY, 1, 1).data;
                ciecolor = rgb_to_cie(imgData[0],imgData[1],imgData[2]);
                ciecolor[0] = Number(ciecolor[0]);
                ciecolor[1] = Number(ciecolor[1]);
                param_hue = JSON.stringify({"xy": ciecolor});
                param_fibaro = {p0: imgData[0], p1: imgData[1], p2: imgData[2], p3: 0};
                setLampBuffer(lights);
                setLamps(param_hue,param_fibaro,"setColor");
            }
        }, false);            
    };

    function rgbToHsv(r,g,b) {
        r = r/255, g = g/255, b = b/255;
        var max = Math.max(r,g,b), min = Math.min(r,g,b);
        var h, s, v = max;
        var d = max - min;
    
        s = max == 0 ? 0 : d / max;
        if (max == min) {
            h = 0; // achromatic
        } else {
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h,s,v];
    }
    	
	this.plotRgb = function(r,g,b) {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        	
        var [h,s,v] = rgbToHsv(r,g,b);
        var theta = h * 2 * Math.PI;
        var maxRadius = canvas.width / 2;
        var r = s * maxRadius;
        var x = r * Math.cos(theta) + maxRadius,
            y = r * Math.sin(theta) + maxRadius;
        this.renderCursor(x, y);        
    };

	this.init();
}
