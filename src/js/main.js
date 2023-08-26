!(function(cnv){
	const obj = {
			transX              : 50,
			transY              : 50,
			bgImgChk            : true,
			numCheck            : true,
			strokCheck          : true,
			imgSelect           : "wallpapers\\3dhuman.png",
			bgColor             : "#000000",
			bgAlpha             : 0.5,
			numColor            : "#ffffff",
			numAlpha            : 1,
			strokColor          : "#ffffff",
			strokAlpha          : 1,
			hourColor           : "#ffffff",
			minuteColor         : "#ffffff",
			secondColor         : "#ffffff",
			handAlpha           : 1,
			nameFont            : "fonts\\0016.ttf",
			sizeFont            : 0.2,
			speed               : 10,
			videoSelect         : "videos\\ioweb.mp4",
			radius              : 0.5,
			numRadius           : 0.75,
			hourWidth           : 0.005,
			munuteWidth         : 0.005,
			secondWidth         : 0.005,
			vnRadius            : 0.12,
			strockHourWidth     : 0.003,
			strockMinuteWidth   : 0.003,
			lineHourWidth       : 0.1,
			lineMinuteWidth     : 0.04,
			secondLength        : 0.9,
			munuteLength        : 0.8,
			hourLength          : 0.5,
			speed               : 100
		},
		canvas = document.getElementById(cnv),
		video = document.getElementById("video-clock"),
		ctx = canvas.getContext("2d"),
		el = canvas.parentElement;
	let font,
		tmpFontName = "",
		tmpFontSize = 0,
		tmpVideo = "",
		tmr = 0,
		radius = canvas.height / 2;

	ctx.translate(radius, radius);
	radius = radius * obj.radius;
	
	/*video.oncanplay = function() {
		videoContainer.scale = Math.min(canvas.width / this.videoWidth, canvas.height / this.videoHeight); 
		videoContainer.ready = true;
		videoContainer.drawing = obj.bgImgChk;
	}*/
	
	
	const match = /\d+(?:\.\d+)?/,
		styleSheetWriter = (
			function () {
				var selectorMap = {},
					supportsInsertRule;	
				return {
					getSheet: (function () {
						var sheet = false;
						return function () {
							if (!sheet) {
								var st = document.createElement("style");
								st.appendChild(document.createTextNode(""));
								document.head.appendChild(st);
								sheet = st.sheet;
								supportsInsertRule = (sheet.insertRule == undefined) ? false : true;
							}
							return sheet;
						};
					})(),
					setRule: function (selector, property, value) {
						var sheet = this.getSheet(),
							rules = sheet.rules || sheet.cssRules;
						property = property.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
						if (!selectorMap.hasOwnProperty(selector)){
							var index = rules.length;
							sheet.insertRule([selector, " {", property, ": ", value, ";}"].join(""), index);
							selectorMap[selector] = index;
						} else {
							rules[selectorMap[selector]].style.setProperty(property, value);
						}
					},
					clear: function(){
						var sheet = this.getSheet();
						if(sheet.rules.length){
							while(sheet.rules.length){
								sheet.deleteRule(0);
							}
						}
						selectorMap = [];
					}
				};
			}
		)(),
		play = function(){
			if(video){
				let isPlaying = !video.paused && !video.ended;
				!isPlaying && video.play().then(function(){}).catch(function(error){});
			}
		},
		setVideo = function()
		{
			if(video){
			//let isPlaying = !video.paused && !video.ended;
				if(!obj.bgImgChk){
					document.body.classList.contains('offlain') && document.body.classList.remove('offlain');
					if(tmpVideo != obj["videoSelect"].replace('\\', '/')) {
						tmpVideo = obj["videoSelect"].replace('\\', '/');
						video.src = tmpVideo;
						video.currentTime = 0;
						video.muted = true;
					}
					play();
				}else{
					tmpVideo = obj["videoSelect"].replace('\\', '/');
					video.src = tmpVideo;
					video.currentTime = 0;
					video.muted = true;
					!document.body.classList.contains('offlain') && document.body.classList.add('offlain');
					video.pause();
				}
			}
		},
		setFontSize = function()
		{
			if(tmpFontSize != radius * obj.sizeFont){
				tmpFontSize = radius * obj.sizeFont;
			}
			ctx.font =  tmpFontSize + 'px CLOCK';
		},
		hexToRgbA = function(hex, alpha)
		{
			let c = false;
			if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
				c= hex.substring(1).split('');
				if(c.length== 3){
					c= [c[0], c[0], c[1], c[1], c[2], c[2]];
				}
				c= '0x'+c.join('');
				return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + alpha + ')';
			}
			return hex;
		},
		setStyles = function()
		{
			//styleSheetWriter.clear();
			styleSheetWriter.setRule('body', 'background-image', 'unset');
			if(obj.bgImgChk){
				styleSheetWriter.setRule('body', 'background-color', "#000000");
				styleSheetWriter.setRule('body', 'background-repeat', 'no-repeat');
				styleSheetWriter.setRule('body', 'background-position', 'center center');
				styleSheetWriter.setRule('body', 'background-size', 'cover');
				styleSheetWriter.setRule('body', 'background-image', 'url("' + obj.imgSelect.replace('\\', '/') + '")');
				
			}
			if(tmpFontName != obj.nameFont){
				tmpFontName = obj.nameFont;
				font && document.fonts.delete(font);
				font = new FontFace("CLOCK", 'url(' + obj.nameFont.replace('\\', '/') + ')');
				font.load().then(function(fn) {
					font = fn;
					document.fonts.add(font);
					ctx.font = radius * obj.sizeFont + 'px CLOCK';
				});
			}
			resize();
		},
		drawClock = function() 
		{
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			!obj.bgImgChk && play();
			let x = (ctx.canvas.width * obj.transX) / 100,
				y = (ctx.canvas.height * obj.transY) / 100;
			//ctx.translate(ctx.canvas.width / 2, canvas.height / 2);
			//x = ((x * 100) / obj.transX) / 2;
			//y = ((y * 100) / obj.transY) / 2;
			ctx.translate(x, y);
			drawFace(ctx, radius, hexToRgbA(obj.bgColor, obj.bgAlpha));
			drawNumbers(ctx, radius, hexToRgbA(obj.numColor, obj.numAlpha));
			drawTime(ctx, radius);
			requestAnimationFrame(drawClock);
		},
		drawFace = function(ctx, radius, color = "black")
		{
			let strok = hexToRgbA(obj.strokColor, obj.strokAlpha);
			ctx.globalCompositeOperation = 'destination-out';
			ctx.globalCompositeOperation = 'source-over';
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(0, 0, radius, 0, 2 * Math.PI);
			ctx.fill();
			if(obj.strokCheck) {
				let angle,
					smallang = 2 * Math.PI / 60,
					minRad = 0.75,
					minWidth = 1,
					linWidth = radius * .003,
					num;
				ctx.strokeStyle = strok;
				for (num = 1; num < 13; num++) {
					angle = num * Math.PI / 6;
					ctx.rotate(angle);
					ctx.translate(0, -radius * minRad);
					ctx.rotate(-angle);
					ctx.rotate(angle);
					ctx.translate(0, radius * minRad);
					ctx.beginPath();
					ctx.lineCap = "butt";
					linWidth = radius * obj.strockHourWidth;
					ctx.lineWidth = linWidth < minWidth ? minWidth : linWidth;
					ctx.moveTo(radius,0);
					ctx.lineTo(radius - (radius * obj.lineHourWidth), 0);
					ctx.stroke();
					for(tick = 1; tick < 5; tick++){
						ctx.rotate(smallang);
						ctx.beginPath();
						ctx.lineCap = "butt";
						linWidth = radius * obj.strockMinuteWidth;
						ctx.lineWidth = linWidth < minWidth ? minWidth : linWidth;;
						ctx.moveTo(radius,0);
						ctx.lineTo(radius - (radius * obj.lineMinuteWidth), 0);
						ctx.stroke();
					}
					ctx.rotate(-smallang * 4);
					ctx.rotate(-angle);
				}
			}
		},
		drawNumbers = function(ctx, radius, color = "white")
		{
			let angle,
				smallang = 2 * Math.PI / 60,
				minRad = obj.numRadius,
				num;
			ctx.fillStyle = color;
			if(obj.numCheck) {
				setFontSize(radius * obj.sizeFont);
				ctx.textBaseline = "middle";
				ctx.textAlign = "center";
				for (num = 1; num < 13; num++) {
					angle = num * Math.PI / 6;
					ctx.rotate(angle);
					ctx.translate(0, -radius * minRad);
					ctx.rotate(-angle);
					ctx.fillText(num.toString(), 0, 0);
					ctx.rotate(angle);
					ctx.translate(0, radius * minRad);
					ctx.rotate(-angle);
				}
			}
			// точка в центре
			ctx.beginPath();
			ctx.arc(0, 0, radius * 0.02, 0, 2 * Math.PI);
			ctx.fill();
		},
		drawTime = function(ctx, radius)
		{
			let now = new Date();
			let hour = now.getHours() % 12;
			let minute = now.getMinutes();
			let second = now.getSeconds();
			let milliseconds = now.getMilliseconds();
			hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
			minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
			second = (second * Math.PI / 30) + (milliseconds * Math.PI / (30 * 1000));
			// Нужно сделать!!! Задать скорость секундной стрелки.
			drawHand(ctx, hour, radius * obj.hourLength, radius * obj.hourWidth, hexToRgbA(obj.hourColor, obj.handAlpha));
			drawHand(ctx, minute, radius * obj.munuteLength, radius * obj.munuteWidth, hexToRgbA(obj.minuteColor, obj.handAlpha));
			drawHand(ctx, second, radius * obj.secondLength, radius * obj.secondWidth, hexToRgbA(obj.secondColor, obj.handAlpha));
		},
		drawHand = function(ctx, pos, length, width, color = "red")
		{
			let vnRadius = radius * obj.vnRadius;
			ctx.beginPath();
			width = width < 1 ? 1 : width;
			ctx.lineWidth = width;
			ctx.lineCap = "butt";
			ctx.moveTo(0, 0);
			ctx.rotate(pos);
			ctx.strokeStyle = "rgba(0, 0, 0, 0.0)";
			ctx.lineTo(0, -vnRadius);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(0, -vnRadius);
			ctx.strokeStyle = color;
			ctx.lineTo(0, -length);
			ctx.stroke();
			ctx.rotate(-pos);
		},
		resize = function()
		{
			let ctr = el.getBoundingClientRect();
			ctx.canvas.width  = scaleByPixelRatio(ctr.width);
			ctx.canvas.height = scaleByPixelRatio(ctr.height);
			radius = Math.min(canvas.height / 2, ctx.canvas.width / 2) * obj.radius;
			drawClock();
		},
		init = function()
		{
			window.addEventListener('resize', resize);
			setVideo();
			setStyles();
			resize();
			//console.log("INITIALIZED");
		},
		scaleByPixelRatio = function(_number)
		{
			let pixelRatio = window.devicePixelRatio || 1;
			return Math.floor(_number * pixelRatio);
		};
	window.livelyPropertyListener = function(name, val) {
		obj[name] = val;
		setVideo();
		setStyles();
	}
	//window.livelyWallpaperPlaybackChanged = function(arg, tr) {
		/* Старт стоп воспроизведения обоев) */
		// Почему-то не работает
	//	let str = arg ? "red" : "yellow";
	//	styleSheetWriter.setRule('canvas', 'border', '3px solid ' + str);
	//}
	
	//livelySystemInformation /* Системная информация */
	//livelyCurrentTrack /* Данные о воспроизводимом треке */
	//livelyAudioListener /* Данные для audio vizualizer */
	init();
}("canvas-clock"));