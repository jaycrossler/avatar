/*! avatar - v0.0.7 - 2015-09-25 *//*!
* @license EaselJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011-2015 gskinner.com, inc.
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/
this.createjs=this.createjs||{},createjs.extend=function(a,b){"use strict";function c(){this.constructor=a}return c.prototype=b.prototype,a.prototype=new c},this.createjs=this.createjs||{},createjs.promote=function(a,b){"use strict";var c=a.prototype,d=Object.getPrototypeOf&&Object.getPrototypeOf(c)||c.__proto__;if(d){c[(b+="_")+"constructor"]=d.constructor;for(var e in d)c.hasOwnProperty(e)&&"function"==typeof d[e]&&(c[b+e]=d[e])}return a},this.createjs=this.createjs||{},createjs.indexOf=function(a,b){"use strict";for(var c=0,d=a.length;d>c;c++)if(b===a[c])return c;return-1},this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.type=a,this.target=null,this.currentTarget=null,this.eventPhase=0,this.bubbles=!!b,this.cancelable=!!c,this.timeStamp=(new Date).getTime(),this.defaultPrevented=!1,this.propagationStopped=!1,this.immediatePropagationStopped=!1,this.removed=!1}var b=a.prototype;b.preventDefault=function(){this.defaultPrevented=this.cancelable&&!0},b.stopPropagation=function(){this.propagationStopped=!0},b.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},b.remove=function(){this.removed=!0},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable)},b.set=function(a){for(var b in a)this[b]=a[b];return this},b.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this._listeners=null,this._captureListeners=null}var b=a.prototype;a.initialize=function(a){a.addEventListener=b.addEventListener,a.on=b.on,a.removeEventListener=a.off=b.removeEventListener,a.removeAllEventListeners=b.removeAllEventListeners,a.hasEventListener=b.hasEventListener,a.dispatchEvent=b.dispatchEvent,a._dispatchEvent=b._dispatchEvent,a.willTrigger=b.willTrigger},b.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},b.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},b.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;g>f;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},b.off=b.removeEventListener,b.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},b.dispatchEvent=function(a,b,c){if("string"==typeof a){var d=this._listeners;if(!(b||d&&d[a]))return!0;a=new createjs.Event(a,b,c)}else a.target&&a.clone&&(a=a.clone());try{a.target=this}catch(e){}if(a.bubbles&&this.parent){for(var f=this,g=[f];f.parent;)g.push(f=f.parent);var h,i=g.length;for(h=i-1;h>=0&&!a.propagationStopped;h--)g[h]._dispatchEvent(a,1+(0==h));for(h=1;i>h&&!a.propagationStopped;h++)g[h]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return!a.defaultPrevented},b.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},b.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},b.toString=function(){return"[EventDispatcher]"},b._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;try{a.currentTarget=this}catch(f){}try{a.eventPhase=b}catch(f){}a.removed=!1,e=e.slice();for(var g=0;c>g&&!a.immediatePropagationStopped;g++){var h=e[g];h.handleEvent?h.handleEvent(a):h(a),a.removed&&(this.off(a.type,h,1==b),a.removed=!1)}}},createjs.EventDispatcher=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(){throw"Ticker cannot be instantiated."}a.RAF_SYNCHED="synched",a.RAF="raf",a.TIMEOUT="timeout",a.useRAF=!1,a.timingMode=null,a.maxDelta=0,a.paused=!1,a.removeEventListener=null,a.removeAllEventListeners=null,a.dispatchEvent=null,a.hasEventListener=null,a._listeners=null,createjs.EventDispatcher.initialize(a),a._addEventListener=a.addEventListener,a.addEventListener=function(){return!a._inited&&a.init(),a._addEventListener.apply(a,arguments)},a._inited=!1,a._startTime=0,a._pausedTime=0,a._ticks=0,a._pausedTicks=0,a._interval=50,a._lastTime=0,a._times=null,a._tickTimes=null,a._timerId=null,a._raf=!0,a.setInterval=function(b){a._interval=b,a._inited&&a._setupTick()},a.getInterval=function(){return a._interval},a.setFPS=function(b){a.setInterval(1e3/b)},a.getFPS=function(){return 1e3/a._interval};try{Object.defineProperties(a,{interval:{get:a.getInterval,set:a.setInterval},framerate:{get:a.getFPS,set:a.setFPS}})}catch(b){console.log(b)}a.init=function(){a._inited||(a._inited=!0,a._times=[],a._tickTimes=[],a._startTime=a._getTime(),a._times.push(a._lastTime=0),a.interval=a._interval)},a.reset=function(){if(a._raf){var b=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame;b&&b(a._timerId)}else clearTimeout(a._timerId);a.removeAllEventListeners("tick"),a._timerId=a._times=a._tickTimes=null,a._startTime=a._lastTime=a._ticks=0,a._inited=!1},a.getMeasuredTickTime=function(b){var c=0,d=a._tickTimes;if(!d||d.length<1)return-1;b=Math.min(d.length,b||0|a.getFPS());for(var e=0;b>e;e++)c+=d[e];return c/b},a.getMeasuredFPS=function(b){var c=a._times;return!c||c.length<2?-1:(b=Math.min(c.length-1,b||0|a.getFPS()),1e3/((c[0]-c[b])/b))},a.setPaused=function(b){a.paused=b},a.getPaused=function(){return a.paused},a.getTime=function(b){return a._startTime?a._getTime()-(b?a._pausedTime:0):-1},a.getEventTime=function(b){return a._startTime?(a._lastTime||a._startTime)-(b?a._pausedTime:0):-1},a.getTicks=function(b){return a._ticks-(b?a._pausedTicks:0)},a._handleSynch=function(){a._timerId=null,a._setupTick(),a._getTime()-a._lastTime>=.97*(a._interval-1)&&a._tick()},a._handleRAF=function(){a._timerId=null,a._setupTick(),a._tick()},a._handleTimeout=function(){a._timerId=null,a._setupTick(),a._tick()},a._setupTick=function(){if(null==a._timerId){var b=a.timingMode||a.useRAF&&a.RAF_SYNCHED;if(b==a.RAF_SYNCHED||b==a.RAF){var c=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame;if(c)return a._timerId=c(b==a.RAF?a._handleRAF:a._handleSynch),void(a._raf=!0)}a._raf=!1,a._timerId=setTimeout(a._handleTimeout,a._interval)}},a._tick=function(){var b=a.paused,c=a._getTime(),d=c-a._lastTime;if(a._lastTime=c,a._ticks++,b&&(a._pausedTicks++,a._pausedTime+=d),a.hasEventListener("tick")){var e=new createjs.Event("tick"),f=a.maxDelta;e.delta=f&&d>f?f:d,e.paused=b,e.time=c,e.runTime=c-a._pausedTime,a.dispatchEvent(e)}for(a._tickTimes.unshift(a._getTime()-c);a._tickTimes.length>100;)a._tickTimes.pop();for(a._times.unshift(c);a._times.length>100;)a._times.pop()};var c=window.performance&&(performance.now||performance.mozNow||performance.msNow||performance.oNow||performance.webkitNow);a._getTime=function(){return(c&&c.call(performance)||(new Date).getTime())-a._startTime},createjs.Ticker=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(){throw"UID cannot be instantiated"}a._nextID=0,a.get=function(){return a._nextID++},createjs.UID=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c,d,e,f,g,h,i,j,k){this.Event_constructor(a,b,c),this.stageX=d,this.stageY=e,this.rawX=null==i?d:i,this.rawY=null==j?e:j,this.nativeEvent=f,this.pointerID=g,this.primary=!!h,this.relatedTarget=k}var b=createjs.extend(a,createjs.Event);b._get_localX=function(){return this.currentTarget.globalToLocal(this.rawX,this.rawY).x},b._get_localY=function(){return this.currentTarget.globalToLocal(this.rawX,this.rawY).y},b._get_isTouch=function(){return-1!==this.pointerID};try{Object.defineProperties(b,{localX:{get:b._get_localX},localY:{get:b._get_localY},isTouch:{get:b._get_isTouch}})}catch(c){}b.clone=function(){return new a(this.type,this.bubbles,this.cancelable,this.stageX,this.stageY,this.nativeEvent,this.pointerID,this.primary,this.rawX,this.rawY)},b.toString=function(){return"[MouseEvent (type="+this.type+" stageX="+this.stageX+" stageY="+this.stageY+")]"},createjs.MouseEvent=createjs.promote(a,"Event")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c,d,e,f){this.setValues(a,b,c,d,e,f)}var b=a.prototype;a.DEG_TO_RAD=Math.PI/180,a.identity=null,b.setValues=function(a,b,c,d,e,f){return this.a=null==a?1:a,this.b=b||0,this.c=c||0,this.d=null==d?1:d,this.tx=e||0,this.ty=f||0,this},b.append=function(a,b,c,d,e,f){var g=this.a,h=this.b,i=this.c,j=this.d;return(1!=a||0!=b||0!=c||1!=d)&&(this.a=g*a+i*b,this.b=h*a+j*b,this.c=g*c+i*d,this.d=h*c+j*d),this.tx=g*e+i*f+this.tx,this.ty=h*e+j*f+this.ty,this},b.prepend=function(a,b,c,d,e,f){var g=this.a,h=this.c,i=this.tx;return this.a=a*g+c*this.b,this.b=b*g+d*this.b,this.c=a*h+c*this.d,this.d=b*h+d*this.d,this.tx=a*i+c*this.ty+e,this.ty=b*i+d*this.ty+f,this},b.appendMatrix=function(a){return this.append(a.a,a.b,a.c,a.d,a.tx,a.ty)},b.prependMatrix=function(a){return this.prepend(a.a,a.b,a.c,a.d,a.tx,a.ty)},b.appendTransform=function(b,c,d,e,f,g,h,i,j){if(f%360)var k=f*a.DEG_TO_RAD,l=Math.cos(k),m=Math.sin(k);else l=1,m=0;return g||h?(g*=a.DEG_TO_RAD,h*=a.DEG_TO_RAD,this.append(Math.cos(h),Math.sin(h),-Math.sin(g),Math.cos(g),b,c),this.append(l*d,m*d,-m*e,l*e,0,0)):this.append(l*d,m*d,-m*e,l*e,b,c),(i||j)&&(this.tx-=i*this.a+j*this.c,this.ty-=i*this.b+j*this.d),this},b.prependTransform=function(b,c,d,e,f,g,h,i,j){if(f%360)var k=f*a.DEG_TO_RAD,l=Math.cos(k),m=Math.sin(k);else l=1,m=0;return(i||j)&&(this.tx-=i,this.ty-=j),g||h?(g*=a.DEG_TO_RAD,h*=a.DEG_TO_RAD,this.prepend(l*d,m*d,-m*e,l*e,0,0),this.prepend(Math.cos(h),Math.sin(h),-Math.sin(g),Math.cos(g),b,c)):this.prepend(l*d,m*d,-m*e,l*e,b,c),this},b.rotate=function(b){b*=a.DEG_TO_RAD;var c=Math.cos(b),d=Math.sin(b),e=this.a,f=this.b;return this.a=e*c+this.c*d,this.b=f*c+this.d*d,this.c=-e*d+this.c*c,this.d=-f*d+this.d*c,this},b.skew=function(b,c){return b*=a.DEG_TO_RAD,c*=a.DEG_TO_RAD,this.append(Math.cos(c),Math.sin(c),-Math.sin(b),Math.cos(b),0,0),this},b.scale=function(a,b){return this.a*=a,this.b*=a,this.c*=b,this.d*=b,this},b.translate=function(a,b){return this.tx+=this.a*a+this.c*b,this.ty+=this.b*a+this.d*b,this},b.identity=function(){return this.a=this.d=1,this.b=this.c=this.tx=this.ty=0,this},b.invert=function(){var a=this.a,b=this.b,c=this.c,d=this.d,e=this.tx,f=a*d-b*c;return this.a=d/f,this.b=-b/f,this.c=-c/f,this.d=a/f,this.tx=(c*this.ty-d*e)/f,this.ty=-(a*this.ty-b*e)/f,this},b.isIdentity=function(){return 0===this.tx&&0===this.ty&&1===this.a&&0===this.b&&0===this.c&&1===this.d},b.equals=function(a){return this.tx===a.tx&&this.ty===a.ty&&this.a===a.a&&this.b===a.b&&this.c===a.c&&this.d===a.d},b.transformPoint=function(a,b,c){return c=c||{},c.x=a*this.a+b*this.c+this.tx,c.y=a*this.b+b*this.d+this.ty,c},b.decompose=function(b){null==b&&(b={}),b.x=this.tx,b.y=this.ty,b.scaleX=Math.sqrt(this.a*this.a+this.b*this.b),b.scaleY=Math.sqrt(this.c*this.c+this.d*this.d);var c=Math.atan2(-this.c,this.d),d=Math.atan2(this.b,this.a),e=Math.abs(1-c/d);return 1e-5>e?(b.rotation=d/a.DEG_TO_RAD,this.a<0&&this.d>=0&&(b.rotation+=b.rotation<=0?180:-180),b.skewX=b.skewY=0):(b.skewX=c/a.DEG_TO_RAD,b.skewY=d/a.DEG_TO_RAD),b},b.copy=function(a){return this.setValues(a.a,a.b,a.c,a.d,a.tx,a.ty)},b.clone=function(){return new a(this.a,this.b,this.c,this.d,this.tx,this.ty)},b.toString=function(){return"[Matrix2D (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]"},a.identity=new a,createjs.Matrix2D=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c,d,e){this.setValues(a,b,c,d,e)}var b=a.prototype;b.setValues=function(a,b,c,d,e){return this.visible=null==a?!0:!!a,this.alpha=null==b?1:b,this.shadow=c,this.compositeOperation=c,this.matrix=e||this.matrix&&this.matrix.identity()||new createjs.Matrix2D,this},b.append=function(a,b,c,d,e){return this.alpha*=b,this.shadow=c||this.shadow,this.compositeOperation=d||this.compositeOperation,this.visible=this.visible&&a,e&&this.matrix.appendMatrix(e),this},b.prepend=function(a,b,c,d,e){return this.alpha*=b,this.shadow=this.shadow||c,this.compositeOperation=this.compositeOperation||d,this.visible=this.visible&&a,e&&this.matrix.prependMatrix(e),this},b.identity=function(){return this.visible=!0,this.alpha=1,this.shadow=this.compositeOperation=null,this.matrix.identity(),this},b.clone=function(){return new a(this.alpha,this.shadow,this.compositeOperation,this.visible,this.matrix.clone())},createjs.DisplayProps=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.setValues(a,b)}var b=a.prototype;b.setValues=function(a,b){return this.x=a||0,this.y=b||0,this},b.copy=function(a){return this.x=a.x,this.y=a.y,this},b.clone=function(){return new a(this.x,this.y)},b.toString=function(){return"[Point (x="+this.x+" y="+this.y+")]"},createjs.Point=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c,d){this.setValues(a,b,c,d)}var b=a.prototype;b.setValues=function(a,b,c,d){return this.x=a||0,this.y=b||0,this.width=c||0,this.height=d||0,this},b.extend=function(a,b,c,d){return c=c||0,d=d||0,a+c>this.x+this.width&&(this.width=a+c-this.x),b+d>this.y+this.height&&(this.height=b+d-this.y),a<this.x&&(this.width+=this.x-a,this.x=a),b<this.y&&(this.height+=this.y-b,this.y=b),this},b.pad=function(a,b,c,d){return this.x-=b,this.y-=a,this.width+=b+d,this.height+=a+c,this},b.copy=function(a){return this.setValues(a.x,a.y,a.width,a.height)},b.contains=function(a,b,c,d){return c=c||0,d=d||0,a>=this.x&&a+c<=this.x+this.width&&b>=this.y&&b+d<=this.y+this.height},b.union=function(a){return this.clone().extend(a.x,a.y,a.width,a.height)},b.intersection=function(b){var c=b.x,d=b.y,e=c+b.width,f=d+b.height;return this.x>c&&(c=this.x),this.y>d&&(d=this.y),this.x+this.width<e&&(e=this.x+this.width),this.y+this.height<f&&(f=this.y+this.height),c>=e||d>=f?null:new a(c,d,e-c,f-d)},b.intersects=function(a){return a.x<=this.x+this.width&&this.x<=a.x+a.width&&a.y<=this.y+this.height&&this.y<=a.y+a.height},b.isEmpty=function(){return this.width<=0||this.height<=0},b.clone=function(){return new a(this.x,this.y,this.width,this.height)},b.toString=function(){return"[Rectangle (x="+this.x+" y="+this.y+" width="+this.width+" height="+this.height+")]"},createjs.Rectangle=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c,d,e,f,g){a.addEventListener&&(this.target=a,this.overLabel=null==c?"over":c,this.outLabel=null==b?"out":b,this.downLabel=null==d?"down":d,this.play=e,this._isPressed=!1,this._isOver=!1,this._enabled=!1,a.mouseChildren=!1,this.enabled=!0,this.handleEvent({}),f&&(g&&(f.actionsEnabled=!1,f.gotoAndStop&&f.gotoAndStop(g)),a.hitArea=f))}var b=a.prototype;b.setEnabled=function(a){if(a!=this._enabled){var b=this.target;this._enabled=a,a?(b.cursor="pointer",b.addEventListener("rollover",this),b.addEventListener("rollout",this),b.addEventListener("mousedown",this),b.addEventListener("pressup",this),b._reset&&(b.__reset=b._reset,b._reset=this._reset)):(b.cursor=null,b.removeEventListener("rollover",this),b.removeEventListener("rollout",this),b.removeEventListener("mousedown",this),b.removeEventListener("pressup",this),b.__reset&&(b._reset=b.__reset,delete b.__reset))}},b.getEnabled=function(){return this._enabled};try{Object.defineProperties(b,{enabled:{get:b.getEnabled,set:b.setEnabled}})}catch(c){}b.toString=function(){return"[ButtonHelper]"},b.handleEvent=function(a){var b,c=this.target,d=a.type;"mousedown"==d?(this._isPressed=!0,b=this.downLabel):"pressup"==d?(this._isPressed=!1,b=this._isOver?this.overLabel:this.outLabel):"rollover"==d?(this._isOver=!0,b=this._isPressed?this.downLabel:this.overLabel):(this._isOver=!1,b=this._isPressed?this.overLabel:this.outLabel),this.play?c.gotoAndPlay&&c.gotoAndPlay(b):c.gotoAndStop&&c.gotoAndStop(b)},b._reset=function(){var a=this.paused;this.__reset(),this.paused=a},createjs.ButtonHelper=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c,d){this.color=a||"black",this.offsetX=b||0,this.offsetY=c||0,this.blur=d||0}var b=a.prototype;a.identity=new a("transparent",0,0,0),b.toString=function(){return"[Shadow]"},b.clone=function(){return new a(this.color,this.offsetX,this.offsetY,this.blur)},createjs.Shadow=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.EventDispatcher_constructor(),this.complete=!0,this.framerate=0,this._animations=null,this._frames=null,this._images=null,this._data=null,this._loadCount=0,this._frameHeight=0,this._frameWidth=0,this._numFrames=0,this._regX=0,this._regY=0,this._spacing=0,this._margin=0,this._parseData(a)}var b=createjs.extend(a,createjs.EventDispatcher);b.getAnimations=function(){return this._animations.slice()};try{Object.defineProperties(b,{animations:{get:b.getAnimations}})}catch(c){}b.getNumFrames=function(a){if(null==a)return this._frames?this._frames.length:this._numFrames||0;var b=this._data[a];return null==b?0:b.frames.length},b.getAnimation=function(a){return this._data[a]},b.getFrame=function(a){var b;return this._frames&&(b=this._frames[a])?b:null},b.getFrameBounds=function(a,b){var c=this.getFrame(a);return c?(b||new createjs.Rectangle).setValues(-c.regX,-c.regY,c.rect.width,c.rect.height):null},b.toString=function(){return"[SpriteSheet]"},b.clone=function(){throw"SpriteSheet cannot be cloned."},b._parseData=function(a){var b,c,d,e;if(null!=a){if(this.framerate=a.framerate||0,a.images&&(c=a.images.length)>0)for(e=this._images=[],b=0;c>b;b++){var f=a.images[b];if("string"==typeof f){var g=f;f=document.createElement("img"),f.src=g}e.push(f),f.getContext||f.naturalWidth||(this._loadCount++,this.complete=!1,function(a){f.onload=function(){a._handleImageLoad()}}(this))}if(null==a.frames);else if(a.frames instanceof Array)for(this._frames=[],e=a.frames,b=0,c=e.length;c>b;b++){var h=e[b];this._frames.push({image:this._images[h[4]?h[4]:0],rect:new createjs.Rectangle(h[0],h[1],h[2],h[3]),regX:h[5]||0,regY:h[6]||0})}else d=a.frames,this._frameWidth=d.width,this._frameHeight=d.height,this._regX=d.regX||0,this._regY=d.regY||0,this._spacing=d.spacing||0,this._margin=d.margin||0,this._numFrames=d.count,0==this._loadCount&&this._calculateFrames();if(this._animations=[],null!=(d=a.animations)){this._data={};var i;for(i in d){var j={name:i},k=d[i];if("number"==typeof k)e=j.frames=[k];else if(k instanceof Array)if(1==k.length)j.frames=[k[0]];else for(j.speed=k[3],j.next=k[2],e=j.frames=[],b=k[0];b<=k[1];b++)e.push(b);else{j.speed=k.speed,j.next=k.next;var l=k.frames;e=j.frames="number"==typeof l?[l]:l.slice(0)}(j.next===!0||void 0===j.next)&&(j.next=i),(j.next===!1||e.length<2&&j.next==i)&&(j.next=null),j.speed||(j.speed=1),this._animations.push(i),this._data[i]=j}}}},b._handleImageLoad=function(){0==--this._loadCount&&(this._calculateFrames(),this.complete=!0,this.dispatchEvent("complete"))},b._calculateFrames=function(){if(!this._frames&&0!=this._frameWidth){this._frames=[];var a=this._numFrames||1e5,b=0,c=this._frameWidth,d=this._frameHeight,e=this._spacing,f=this._margin;a:for(var g=0,h=this._images;g<h.length;g++)for(var i=h[g],j=i.width,k=i.height,l=f;k-f-d>=l;){for(var m=f;j-f-c>=m;){if(b>=a)break a;b++,this._frames.push({image:i,rect:new createjs.Rectangle(m,l,c,d),regX:this._regX,regY:this._regY}),m+=c+e}l+=d+e}this._numFrames=b}},createjs.SpriteSheet=createjs.promote(a,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this.command=null,this._stroke=null,this._strokeStyle=null,this._oldStrokeStyle=null,this._strokeDash=null,this._oldStrokeDash=null,this._strokeIgnoreScale=!1,this._fill=null,this._instructions=[],this._commitIndex=0,this._activeInstructions=[],this._dirty=!1,this._storeIndex=0,this.clear()}var b=a.prototype,c=a;a.getRGB=function(a,b,c,d){return null!=a&&null==c&&(d=b,c=255&a,b=a>>8&255,a=a>>16&255),null==d?"rgb("+a+","+b+","+c+")":"rgba("+a+","+b+","+c+","+d+")"},a.getHSL=function(a,b,c,d){return null==d?"hsl("+a%360+","+b+"%,"+c+"%)":"hsla("+a%360+","+b+"%,"+c+"%,"+d+")"},a.BASE_64={A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,a:26,b:27,c:28,d:29,e:30,f:31,g:32,h:33,i:34,j:35,k:36,l:37,m:38,n:39,o:40,p:41,q:42,r:43,s:44,t:45,u:46,v:47,w:48,x:49,y:50,z:51,0:52,1:53,2:54,3:55,4:56,5:57,6:58,7:59,8:60,9:61,"+":62,"/":63},a.STROKE_CAPS_MAP=["butt","round","square"],a.STROKE_JOINTS_MAP=["miter","round","bevel"];var d=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");d.getContext&&(a._ctx=d.getContext("2d"),d.width=d.height=1),b.getInstructions=function(){return this._updateInstructions(),this._instructions};try{Object.defineProperties(b,{instructions:{get:b.getInstructions}})}catch(e){}b.isEmpty=function(){return!(this._instructions.length||this._activeInstructions.length)},b.draw=function(a,b){this._updateInstructions();for(var c=this._instructions,d=this._storeIndex,e=c.length;e>d;d++)c[d].exec(a,b)},b.drawAsPath=function(a){this._updateInstructions();for(var b,c=this._instructions,d=this._storeIndex,e=c.length;e>d;d++)(b=c[d]).path!==!1&&b.exec(a)},b.moveTo=function(a,b){return this.append(new c.MoveTo(a,b),!0)},b.lineTo=function(a,b){return this.append(new c.LineTo(a,b))},b.arcTo=function(a,b,d,e,f){return this.append(new c.ArcTo(a,b,d,e,f))},b.arc=function(a,b,d,e,f,g){return this.append(new c.Arc(a,b,d,e,f,g))},b.quadraticCurveTo=function(a,b,d,e){return this.append(new c.QuadraticCurveTo(a,b,d,e))},b.bezierCurveTo=function(a,b,d,e,f,g){return this.append(new c.BezierCurveTo(a,b,d,e,f,g))},b.rect=function(a,b,d,e){return this.append(new c.Rect(a,b,d,e))},b.closePath=function(){return this._activeInstructions.length?this.append(new c.ClosePath):this},b.clear=function(){return this._instructions.length=this._activeInstructions.length=this._commitIndex=0,this._strokeStyle=this._oldStrokeStyle=this._stroke=this._fill=this._strokeDash=this._oldStrokeDash=null,this._dirty=this._strokeIgnoreScale=!1,this},b.beginFill=function(a){return this._setFill(a?new c.Fill(a):null)},b.beginLinearGradientFill=function(a,b,d,e,f,g){return this._setFill((new c.Fill).linearGradient(a,b,d,e,f,g))},b.beginRadialGradientFill=function(a,b,d,e,f,g,h,i){return this._setFill((new c.Fill).radialGradient(a,b,d,e,f,g,h,i))},b.beginBitmapFill=function(a,b,d){return this._setFill(new c.Fill(null,d).bitmap(a,b))},b.endFill=function(){return this.beginFill()},b.setStrokeStyle=function(a,b,d,e,f){return this._updateInstructions(!0),this._strokeStyle=this.command=new c.StrokeStyle(a,b,d,e,f),this._stroke&&(this._stroke.ignoreScale=f),this._strokeIgnoreScale=f,this},b.setStrokeDash=function(a,b){return this._updateInstructions(!0),this._strokeDash=this.command=new c.StrokeDash(a,b),this},b.beginStroke=function(a){return this._setStroke(a?new c.Stroke(a):null)},b.beginLinearGradientStroke=function(a,b,d,e,f,g){return this._setStroke((new c.Stroke).linearGradient(a,b,d,e,f,g))},b.beginRadialGradientStroke=function(a,b,d,e,f,g,h,i){return this._setStroke((new c.Stroke).radialGradient(a,b,d,e,f,g,h,i))},b.beginBitmapStroke=function(a,b){return this._setStroke((new c.Stroke).bitmap(a,b))},b.endStroke=function(){return this.beginStroke()},b.curveTo=b.quadraticCurveTo,b.drawRect=b.rect,b.drawRoundRect=function(a,b,c,d,e){return this.drawRoundRectComplex(a,b,c,d,e,e,e,e)},b.drawRoundRectComplex=function(a,b,d,e,f,g,h,i){return this.append(new c.RoundRect(a,b,d,e,f,g,h,i))},b.drawCircle=function(a,b,d){return this.append(new c.Circle(a,b,d))},b.drawEllipse=function(a,b,d,e){return this.append(new c.Ellipse(a,b,d,e))},b.drawPolyStar=function(a,b,d,e,f,g){return this.append(new c.PolyStar(a,b,d,e,f,g))},b.append=function(a,b){return this._activeInstructions.push(a),this.command=a,b||(this._dirty=!0),this},b.decodePath=function(b){for(var c=[this.moveTo,this.lineTo,this.quadraticCurveTo,this.bezierCurveTo,this.closePath],d=[2,2,4,6,0],e=0,f=b.length,g=[],h=0,i=0,j=a.BASE_64;f>e;){var k=b.charAt(e),l=j[k],m=l>>3,n=c[m];if(!n||3&l)throw"bad path data (@"+e+"): "+k;var o=d[m];m||(h=i=0),g.length=0,e++;for(var p=(l>>2&1)+2,q=0;o>q;q++){var r=j[b.charAt(e)],s=r>>5?-1:1;r=(31&r)<<6|j[b.charAt(e+1)],3==p&&(r=r<<6|j[b.charAt(e+2)]),r=s*r/10,q%2?h=r+=h:i=r+=i,g[q]=r,e+=p}n.apply(this,g)}return this},b.store=function(){return this._updateInstructions(!0),this._storeIndex=this._instructions.length,this},b.unstore=function(){return this._storeIndex=0,this},b.clone=function(){var b=new a;return b.command=this.command,b._stroke=this._stroke,b._strokeStyle=this._strokeStyle,b._strokeDash=this._strokeDash,b._strokeIgnoreScale=this._strokeIgnoreScale,b._fill=this._fill,b._instructions=this._instructions.slice(),b._commitIndex=this._commitIndex,b._activeInstructions=this._activeInstructions.slice(),b._dirty=this._dirty,b._storeIndex=this._storeIndex,b},b.toString=function(){return"[Graphics]"},b.mt=b.moveTo,b.lt=b.lineTo,b.at=b.arcTo,b.bt=b.bezierCurveTo,b.qt=b.quadraticCurveTo,b.a=b.arc,b.r=b.rect,b.cp=b.closePath,b.c=b.clear,b.f=b.beginFill,b.lf=b.beginLinearGradientFill,b.rf=b.beginRadialGradientFill,b.bf=b.beginBitmapFill,b.ef=b.endFill,b.ss=b.setStrokeStyle,b.sd=b.setStrokeDash,b.s=b.beginStroke,b.ls=b.beginLinearGradientStroke,b.rs=b.beginRadialGradientStroke,b.bs=b.beginBitmapStroke,b.es=b.endStroke,b.dr=b.drawRect,b.rr=b.drawRoundRect,b.rc=b.drawRoundRectComplex,b.dc=b.drawCircle,b.de=b.drawEllipse,b.dp=b.drawPolyStar,b.p=b.decodePath,b._updateInstructions=function(b){var c=this._instructions,d=this._activeInstructions,e=this._commitIndex;if(this._dirty&&d.length){c.length=e,c.push(a.beginCmd);var f=d.length,g=c.length;c.length=g+f;for(var h=0;f>h;h++)c[h+g]=d[h];this._fill&&c.push(this._fill),this._stroke&&(this._strokeDash!==this._oldStrokeDash&&(this._oldStrokeDash=this._strokeDash,c.push(this._strokeDash)),this._strokeStyle!==this._oldStrokeStyle&&(this._oldStrokeStyle=this._strokeStyle,c.push(this._strokeStyle)),c.push(this._stroke)),this._dirty=!1}b&&(d.length=0,this._commitIndex=c.length)},b._setFill=function(a){return this._updateInstructions(!0),this.command=this._fill=a,this},b._setStroke=function(a){return this._updateInstructions(!0),(this.command=this._stroke=a)&&(a.ignoreScale=this._strokeIgnoreScale),this},(c.LineTo=function(a,b){this.x=a,this.y=b}).prototype.exec=function(a){a.lineTo(this.x,this.y)},(c.MoveTo=function(a,b){this.x=a,this.y=b}).prototype.exec=function(a){a.moveTo(this.x,this.y)},(c.ArcTo=function(a,b,c,d,e){this.x1=a,this.y1=b,this.x2=c,this.y2=d,this.radius=e}).prototype.exec=function(a){a.arcTo(this.x1,this.y1,this.x2,this.y2,this.radius)},(c.Arc=function(a,b,c,d,e,f){this.x=a,this.y=b,this.radius=c,this.startAngle=d,this.endAngle=e,this.anticlockwise=!!f}).prototype.exec=function(a){a.arc(this.x,this.y,this.radius,this.startAngle,this.endAngle,this.anticlockwise)},(c.QuadraticCurveTo=function(a,b,c,d){this.cpx=a,this.cpy=b,this.x=c,this.y=d}).prototype.exec=function(a){a.quadraticCurveTo(this.cpx,this.cpy,this.x,this.y)},(c.BezierCurveTo=function(a,b,c,d,e,f){this.cp1x=a,this.cp1y=b,this.cp2x=c,this.cp2y=d,this.x=e,this.y=f}).prototype.exec=function(a){a.bezierCurveTo(this.cp1x,this.cp1y,this.cp2x,this.cp2y,this.x,this.y)},(c.Rect=function(a,b,c,d){this.x=a,this.y=b,this.w=c,this.h=d}).prototype.exec=function(a){a.rect(this.x,this.y,this.w,this.h)},(c.ClosePath=function(){}).prototype.exec=function(a){a.closePath()},(c.BeginPath=function(){}).prototype.exec=function(a){a.beginPath()},b=(c.Fill=function(a,b){this.style=a,this.matrix=b}).prototype,b.exec=function(a){if(this.style){a.fillStyle=this.style;var b=this.matrix;b&&(a.save(),a.transform(b.a,b.b,b.c,b.d,b.tx,b.ty)),a.fill(),b&&a.restore()}},b.linearGradient=function(b,c,d,e,f,g){for(var h=this.style=a._ctx.createLinearGradient(d,e,f,g),i=0,j=b.length;j>i;i++)h.addColorStop(c[i],b[i]);return h.props={colors:b,ratios:c,x0:d,y0:e,x1:f,y1:g,type:"linear"},this},b.radialGradient=function(b,c,d,e,f,g,h,i){for(var j=this.style=a._ctx.createRadialGradient(d,e,f,g,h,i),k=0,l=b.length;l>k;k++)j.addColorStop(c[k],b[k]);return j.props={colors:b,ratios:c,x0:d,y0:e,r0:f,x1:g,y1:h,r1:i,type:"radial"},this},b.bitmap=function(b,c){if(b.naturalWidth||b.getContext||b.readyState>=2){var d=this.style=a._ctx.createPattern(b,c||"");d.props={image:b,repetition:c,type:"bitmap"}}return this},b.path=!1,b=(c.Stroke=function(a,b){this.style=a,this.ignoreScale=b}).prototype,b.exec=function(a){this.style&&(a.strokeStyle=this.style,this.ignoreScale&&(a.save(),a.setTransform(1,0,0,1,0,0)),a.stroke(),this.ignoreScale&&a.restore())},b.linearGradient=c.Fill.prototype.linearGradient,b.radialGradient=c.Fill.prototype.radialGradient,b.bitmap=c.Fill.prototype.bitmap,b.path=!1,b=(c.StrokeStyle=function(a,b,c,d){this.width=a,this.caps=b,this.joints=c,this.miterLimit=d}).prototype,b.exec=function(b){b.lineWidth=null==this.width?"1":this.width,b.lineCap=null==this.caps?"butt":isNaN(this.caps)?this.caps:a.STROKE_CAPS_MAP[this.caps],b.lineJoin=null==this.joints?"miter":isNaN(this.joints)?this.joints:a.STROKE_JOINTS_MAP[this.joints],b.miterLimit=null==this.miterLimit?"10":this.miterLimit},b.path=!1,(c.StrokeDash=function(a,b){this.segments=a,this.offset=b||0}).prototype.exec=function(a){a.setLineDash&&(a.setLineDash(this.segments||c.StrokeDash.EMPTY_SEGMENTS),a.lineDashOffset=this.offset||0)},c.StrokeDash.EMPTY_SEGMENTS=[],(c.RoundRect=function(a,b,c,d,e,f,g,h){this.x=a,this.y=b,this.w=c,this.h=d,this.radiusTL=e,this.radiusTR=f,this.radiusBR=g,this.radiusBL=h}).prototype.exec=function(a){var b=(j>i?i:j)/2,c=0,d=0,e=0,f=0,g=this.x,h=this.y,i=this.w,j=this.h,k=this.radiusTL,l=this.radiusTR,m=this.radiusBR,n=this.radiusBL;0>k&&(k*=c=-1),k>b&&(k=b),0>l&&(l*=d=-1),l>b&&(l=b),0>m&&(m*=e=-1),m>b&&(m=b),0>n&&(n*=f=-1),n>b&&(n=b),a.moveTo(g+i-l,h),a.arcTo(g+i+l*d,h-l*d,g+i,h+l,l),a.lineTo(g+i,h+j-m),a.arcTo(g+i+m*e,h+j+m*e,g+i-m,h+j,m),a.lineTo(g+n,h+j),a.arcTo(g-n*f,h+j+n*f,g,h+j-n,n),a.lineTo(g,h+k),a.arcTo(g-k*c,h-k*c,g+k,h,k),a.closePath()},(c.Circle=function(a,b,c){this.x=a,this.y=b,this.radius=c}).prototype.exec=function(a){a.arc(this.x,this.y,this.radius,0,2*Math.PI)},(c.Ellipse=function(a,b,c,d){this.x=a,this.y=b,this.w=c,this.h=d}).prototype.exec=function(a){var b=this.x,c=this.y,d=this.w,e=this.h,f=.5522848,g=d/2*f,h=e/2*f,i=b+d,j=c+e,k=b+d/2,l=c+e/2;a.moveTo(b,l),a.bezierCurveTo(b,l-h,k-g,c,k,c),a.bezierCurveTo(k+g,c,i,l-h,i,l),a.bezierCurveTo(i,l+h,k+g,j,k,j),a.bezierCurveTo(k-g,j,b,l+h,b,l)},(c.PolyStar=function(a,b,c,d,e,f){this.x=a,this.y=b,this.radius=c,this.sides=d,this.pointSize=e,this.angle=f}).prototype.exec=function(a){var b=this.x,c=this.y,d=this.radius,e=(this.angle||0)/180*Math.PI,f=this.sides,g=1-(this.pointSize||0),h=Math.PI/f;a.moveTo(b+Math.cos(e)*d,c+Math.sin(e)*d);for(var i=0;f>i;i++)e+=h,1!=g&&a.lineTo(b+Math.cos(e)*d*g,c+Math.sin(e)*d*g),e+=h,a.lineTo(b+Math.cos(e)*d,c+Math.sin(e)*d);a.closePath()},a.beginCmd=new c.BeginPath,createjs.Graphics=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this.EventDispatcher_constructor(),this.alpha=1,this.cacheCanvas=null,this.cacheID=0,this.id=createjs.UID.get(),this.mouseEnabled=!0,this.tickEnabled=!0,this.name=null,this.parent=null,this.regX=0,this.regY=0,this.rotation=0,this.scaleX=1,this.scaleY=1,this.skewX=0,this.skewY=0,this.shadow=null,this.visible=!0,this.x=0,this.y=0,this.transformMatrix=null,this.compositeOperation=null,this.snapToPixel=!0,this.filters=null,this.mask=null,this.hitArea=null,this.cursor=null,this._cacheOffsetX=0,this._cacheOffsetY=0,this._filterOffsetX=0,this._filterOffsetY=0,this._cacheScale=1,this._cacheDataURLID=0,this._cacheDataURL=null,this._props=new createjs.DisplayProps,this._rectangle=new createjs.Rectangle,this._bounds=null
}var b=createjs.extend(a,createjs.EventDispatcher);a._MOUSE_EVENTS=["click","dblclick","mousedown","mouseout","mouseover","pressmove","pressup","rollout","rollover"],a.suppressCrossDomainErrors=!1,a._snapToPixelEnabled=!1;var c=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");c.getContext&&(a._hitTestCanvas=c,a._hitTestContext=c.getContext("2d"),c.width=c.height=1),a._nextCacheID=1,b.getStage=function(){for(var a=this,b=createjs.Stage;a.parent;)a=a.parent;return a instanceof b?a:null};try{Object.defineProperties(b,{stage:{get:b.getStage}})}catch(d){}b.isVisible=function(){return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY)},b.draw=function(a,b){var c=this.cacheCanvas;if(b||!c)return!1;var d=this._cacheScale;return a.drawImage(c,this._cacheOffsetX+this._filterOffsetX,this._cacheOffsetY+this._filterOffsetY,c.width/d,c.height/d),!0},b.updateContext=function(b){var c=this,d=c.mask,e=c._props.matrix;d&&d.graphics&&!d.graphics.isEmpty()&&(d.getMatrix(e),b.transform(e.a,e.b,e.c,e.d,e.tx,e.ty),d.graphics.drawAsPath(b),b.clip(),e.invert(),b.transform(e.a,e.b,e.c,e.d,e.tx,e.ty)),this.getMatrix(e);var f=e.tx,g=e.ty;a._snapToPixelEnabled&&c.snapToPixel&&(f=f+(0>f?-.5:.5)|0,g=g+(0>g?-.5:.5)|0),b.transform(e.a,e.b,e.c,e.d,f,g),b.globalAlpha*=c.alpha,c.compositeOperation&&(b.globalCompositeOperation=c.compositeOperation),c.shadow&&this._applyShadow(b,c.shadow)},b.cache=function(a,b,c,d,e){e=e||1,this.cacheCanvas||(this.cacheCanvas=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas")),this._cacheWidth=c,this._cacheHeight=d,this._cacheOffsetX=a,this._cacheOffsetY=b,this._cacheScale=e,this.updateCache()},b.updateCache=function(b){var c=this.cacheCanvas;if(!c)throw"cache() must be called before updateCache()";var d=this._cacheScale,e=this._cacheOffsetX*d,f=this._cacheOffsetY*d,g=this._cacheWidth,h=this._cacheHeight,i=c.getContext("2d"),j=this._getFilterBounds();e+=this._filterOffsetX=j.x,f+=this._filterOffsetY=j.y,g=Math.ceil(g*d)+j.width,h=Math.ceil(h*d)+j.height,g!=c.width||h!=c.height?(c.width=g,c.height=h):b||i.clearRect(0,0,g+1,h+1),i.save(),i.globalCompositeOperation=b,i.setTransform(d,0,0,d,-e,-f),this.draw(i,!0),this._applyFilters(),i.restore(),this.cacheID=a._nextCacheID++},b.uncache=function(){this._cacheDataURL=this.cacheCanvas=null,this.cacheID=this._cacheOffsetX=this._cacheOffsetY=this._filterOffsetX=this._filterOffsetY=0,this._cacheScale=1},b.getCacheDataURL=function(){return this.cacheCanvas?(this.cacheID!=this._cacheDataURLID&&(this._cacheDataURL=this.cacheCanvas.toDataURL()),this._cacheDataURL):null},b.localToGlobal=function(a,b,c){return this.getConcatenatedMatrix(this._props.matrix).transformPoint(a,b,c||new createjs.Point)},b.globalToLocal=function(a,b,c){return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(a,b,c||new createjs.Point)},b.localToLocal=function(a,b,c,d){return d=this.localToGlobal(a,b,d),c.globalToLocal(d.x,d.y,d)},b.setTransform=function(a,b,c,d,e,f,g,h,i){return this.x=a||0,this.y=b||0,this.scaleX=null==c?1:c,this.scaleY=null==d?1:d,this.rotation=e||0,this.skewX=f||0,this.skewY=g||0,this.regX=h||0,this.regY=i||0,this},b.getMatrix=function(a){var b=this,c=a&&a.identity()||new createjs.Matrix2D;return b.transformMatrix?c.copy(b.transformMatrix):c.appendTransform(b.x,b.y,b.scaleX,b.scaleY,b.rotation,b.skewX,b.skewY,b.regX,b.regY)},b.getConcatenatedMatrix=function(a){for(var b=this,c=this.getMatrix(a);b=b.parent;)c.prependMatrix(b.getMatrix(b._props.matrix));return c},b.getConcatenatedDisplayProps=function(a){a=a?a.identity():new createjs.DisplayProps;var b=this,c=b.getMatrix(a.matrix);do a.prepend(b.visible,b.alpha,b.shadow,b.compositeOperation),b!=this&&c.prependMatrix(b.getMatrix(b._props.matrix));while(b=b.parent);return a},b.hitTest=function(b,c){var d=a._hitTestContext;d.setTransform(1,0,0,1,-b,-c),this.draw(d);var e=this._testHit(d);return d.setTransform(1,0,0,1,0,0),d.clearRect(0,0,2,2),e},b.set=function(a){for(var b in a)this[b]=a[b];return this},b.getBounds=function(){if(this._bounds)return this._rectangle.copy(this._bounds);var a=this.cacheCanvas;if(a){var b=this._cacheScale;return this._rectangle.setValues(this._cacheOffsetX,this._cacheOffsetY,a.width/b,a.height/b)}return null},b.getTransformedBounds=function(){return this._getBounds()},b.setBounds=function(a,b,c,d){null==a&&(this._bounds=a),this._bounds=(this._bounds||new createjs.Rectangle).setValues(a,b,c,d)},b.clone=function(){return this._cloneProps(new a)},b.toString=function(){return"[DisplayObject (name="+this.name+")]"},b._cloneProps=function(a){return a.alpha=this.alpha,a.mouseEnabled=this.mouseEnabled,a.tickEnabled=this.tickEnabled,a.name=this.name,a.regX=this.regX,a.regY=this.regY,a.rotation=this.rotation,a.scaleX=this.scaleX,a.scaleY=this.scaleY,a.shadow=this.shadow,a.skewX=this.skewX,a.skewY=this.skewY,a.visible=this.visible,a.x=this.x,a.y=this.y,a.compositeOperation=this.compositeOperation,a.snapToPixel=this.snapToPixel,a.filters=null==this.filters?null:this.filters.slice(0),a.mask=this.mask,a.hitArea=this.hitArea,a.cursor=this.cursor,a._bounds=this._bounds,a},b._applyShadow=function(a,b){b=b||Shadow.identity,a.shadowColor=b.color,a.shadowOffsetX=b.offsetX,a.shadowOffsetY=b.offsetY,a.shadowBlur=b.blur},b._tick=function(a){var b=this._listeners;b&&b.tick&&(a.target=null,a.propagationStopped=a.immediatePropagationStopped=!1,this.dispatchEvent(a))},b._testHit=function(b){try{var c=b.getImageData(0,0,1,1).data[3]>1}catch(d){if(!a.suppressCrossDomainErrors)throw"An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images."}return c},b._applyFilters=function(){if(this.filters&&0!=this.filters.length&&this.cacheCanvas)for(var a=this.filters.length,b=this.cacheCanvas.getContext("2d"),c=this.cacheCanvas.width,d=this.cacheCanvas.height,e=0;a>e;e++)this.filters[e].applyFilter(b,0,0,c,d)},b._getFilterBounds=function(){var a,b=this.filters,c=this._rectangle.setValues(0,0,0,0);if(!b||!(a=b.length))return c;for(var d=0;a>d;d++){var e=this.filters[d];e.getBounds&&e.getBounds(c)}return c},b._getBounds=function(a,b){return this._transformBounds(this.getBounds(),a,b)},b._transformBounds=function(a,b,c){if(!a)return a;var d=a.x,e=a.y,f=a.width,g=a.height,h=this._props.matrix;h=c?h.identity():this.getMatrix(h),(d||e)&&h.appendTransform(0,0,1,1,0,0,0,-d,-e),b&&h.prependMatrix(b);var i=f*h.a,j=f*h.b,k=g*h.c,l=g*h.d,m=h.tx,n=h.ty,o=m,p=m,q=n,r=n;return(d=i+m)<o?o=d:d>p&&(p=d),(d=i+k+m)<o?o=d:d>p&&(p=d),(d=k+m)<o?o=d:d>p&&(p=d),(e=j+n)<q?q=e:e>r&&(r=e),(e=j+l+n)<q?q=e:e>r&&(r=e),(e=l+n)<q?q=e:e>r&&(r=e),a.setValues(o,q,p-o,r-q)},b._hasMouseEventListener=function(){for(var b=a._MOUSE_EVENTS,c=0,d=b.length;d>c;c++)if(this.hasEventListener(b[c]))return!0;return!!this.cursor},createjs.DisplayObject=createjs.promote(a,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this.DisplayObject_constructor(),this.children=[],this.mouseChildren=!0,this.tickChildren=!0}var b=createjs.extend(a,createjs.DisplayObject);b.getNumChildren=function(){return this.children.length};try{Object.defineProperties(b,{numChildren:{get:b.getNumChildren}})}catch(c){}b.initialize=a,b.isVisible=function(){var a=this.cacheCanvas||this.children.length;return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY&&a)},b.draw=function(a,b){if(this.DisplayObject_draw(a,b))return!0;for(var c=this.children.slice(),d=0,e=c.length;e>d;d++){var f=c[d];f.isVisible()&&(a.save(),f.updateContext(a),f.draw(a),a.restore())}return!0},b.addChild=function(a){if(null==a)return a;var b=arguments.length;if(b>1){for(var c=0;b>c;c++)this.addChild(arguments[c]);return arguments[b-1]}return a.parent&&a.parent.removeChild(a),a.parent=this,this.children.push(a),a.dispatchEvent("added"),a},b.addChildAt=function(a,b){var c=arguments.length,d=arguments[c-1];if(0>d||d>this.children.length)return arguments[c-2];if(c>2){for(var e=0;c-1>e;e++)this.addChildAt(arguments[e],d+e);return arguments[c-2]}return a.parent&&a.parent.removeChild(a),a.parent=this,this.children.splice(b,0,a),a.dispatchEvent("added"),a},b.removeChild=function(a){var b=arguments.length;if(b>1){for(var c=!0,d=0;b>d;d++)c=c&&this.removeChild(arguments[d]);return c}return this.removeChildAt(createjs.indexOf(this.children,a))},b.removeChildAt=function(a){var b=arguments.length;if(b>1){for(var c=[],d=0;b>d;d++)c[d]=arguments[d];c.sort(function(a,b){return b-a});for(var e=!0,d=0;b>d;d++)e=e&&this.removeChildAt(c[d]);return e}if(0>a||a>this.children.length-1)return!1;var f=this.children[a];return f&&(f.parent=null),this.children.splice(a,1),f.dispatchEvent("removed"),!0},b.removeAllChildren=function(){for(var a=this.children;a.length;)this.removeChildAt(0)},b.getChildAt=function(a){return this.children[a]},b.getChildByName=function(a){for(var b=this.children,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},b.sortChildren=function(a){this.children.sort(a)},b.getChildIndex=function(a){return createjs.indexOf(this.children,a)},b.swapChildrenAt=function(a,b){var c=this.children,d=c[a],e=c[b];d&&e&&(c[a]=e,c[b]=d)},b.swapChildren=function(a,b){for(var c,d,e=this.children,f=0,g=e.length;g>f&&(e[f]==a&&(c=f),e[f]==b&&(d=f),null==c||null==d);f++);f!=g&&(e[c]=b,e[d]=a)},b.setChildIndex=function(a,b){var c=this.children,d=c.length;if(!(a.parent!=this||0>b||b>=d)){for(var e=0;d>e&&c[e]!=a;e++);e!=d&&e!=b&&(c.splice(e,1),c.splice(b,0,a))}},b.contains=function(a){for(;a;){if(a==this)return!0;a=a.parent}return!1},b.hitTest=function(a,b){return null!=this.getObjectUnderPoint(a,b)},b.getObjectsUnderPoint=function(a,b,c){var d=[],e=this.localToGlobal(a,b);return this._getObjectsUnderPoint(e.x,e.y,d,c>0,1==c),d},b.getObjectUnderPoint=function(a,b,c){var d=this.localToGlobal(a,b);return this._getObjectsUnderPoint(d.x,d.y,null,c>0,1==c)},b.getBounds=function(){return this._getBounds(null,!0)},b.getTransformedBounds=function(){return this._getBounds()},b.clone=function(b){var c=this._cloneProps(new a);return b&&this._cloneChildren(c),c},b.toString=function(){return"[Container (name="+this.name+")]"},b._tick=function(a){if(this.tickChildren)for(var b=this.children.length-1;b>=0;b--){var c=this.children[b];c.tickEnabled&&c._tick&&c._tick(a)}this.DisplayObject__tick(a)},b._cloneChildren=function(a){a.children.length&&a.removeAllChildren();for(var b=a.children,c=0,d=this.children.length;d>c;c++){var e=this.children[c].clone(!0);e.parent=a,b.push(e)}},b._getObjectsUnderPoint=function(b,c,d,e,f,g){if(g=g||0,!g&&!this._testMask(this,b,c))return null;var h,i=createjs.DisplayObject._hitTestContext;f=f||e&&this._hasMouseEventListener();for(var j=this.children,k=j.length,l=k-1;l>=0;l--){var m=j[l],n=m.hitArea;if(m.visible&&(n||m.isVisible())&&(!e||m.mouseEnabled)&&(n||this._testMask(m,b,c)))if(!n&&m instanceof a){var o=m._getObjectsUnderPoint(b,c,d,e,f,g+1);if(!d&&o)return e&&!this.mouseChildren?this:o}else{if(e&&!f&&!m._hasMouseEventListener())continue;var p=m.getConcatenatedDisplayProps(m._props);if(h=p.matrix,n&&(h.appendMatrix(n.getMatrix(n._props.matrix)),p.alpha=n.alpha),i.globalAlpha=p.alpha,i.setTransform(h.a,h.b,h.c,h.d,h.tx-b,h.ty-c),(n||m).draw(i),!this._testHit(i))continue;if(i.setTransform(1,0,0,1,0,0),i.clearRect(0,0,2,2),!d)return e&&!this.mouseChildren?this:m;d.push(m)}}return null},b._testMask=function(a,b,c){var d=a.mask;if(!d||!d.graphics||d.graphics.isEmpty())return!0;var e=this._props.matrix,f=a.parent;e=f?f.getConcatenatedMatrix(e):e.identity(),e=d.getMatrix(d._props.matrix).prependMatrix(e);var g=createjs.DisplayObject._hitTestContext;return g.setTransform(e.a,e.b,e.c,e.d,e.tx-b,e.ty-c),d.graphics.drawAsPath(g),g.fillStyle="#000",g.fill(),this._testHit(g)?(g.setTransform(1,0,0,1,0,0),g.clearRect(0,0,2,2),!0):!1},b._getBounds=function(a,b){var c=this.DisplayObject_getBounds();if(c)return this._transformBounds(c,a,b);var d=this._props.matrix;d=b?d.identity():this.getMatrix(d),a&&d.prependMatrix(a);for(var e=this.children.length,f=null,g=0;e>g;g++){var h=this.children[g];h.visible&&(c=h._getBounds(d))&&(f?f.extend(c.x,c.y,c.width,c.height):f=c.clone())}return f},createjs.Container=createjs.promote(a,"DisplayObject")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.Container_constructor(),this.autoClear=!0,this.canvas="string"==typeof a?document.getElementById(a):a,this.mouseX=0,this.mouseY=0,this.drawRect=null,this.snapToPixelEnabled=!1,this.mouseInBounds=!1,this.tickOnUpdate=!0,this.mouseMoveOutside=!1,this.preventSelection=!0,this._pointerData={},this._pointerCount=0,this._primaryPointerID=null,this._mouseOverIntervalID=null,this._nextStage=null,this._prevStage=null,this.enableDOMEvents(!0)}var b=createjs.extend(a,createjs.Container);b._get_nextStage=function(){return this._nextStage},b._set_nextStage=function(a){this._nextStage&&(this._nextStage._prevStage=null),a&&(a._prevStage=this),this._nextStage=a};try{Object.defineProperties(b,{nextStage:{get:b._get_nextStage,set:b._set_nextStage}})}catch(c){}b.update=function(a){if(this.canvas&&(this.tickOnUpdate&&this.tick(a),this.dispatchEvent("drawstart",!1,!0)!==!1)){createjs.DisplayObject._snapToPixelEnabled=this.snapToPixelEnabled;var b=this.drawRect,c=this.canvas.getContext("2d");c.setTransform(1,0,0,1,0,0),this.autoClear&&(b?c.clearRect(b.x,b.y,b.width,b.height):c.clearRect(0,0,this.canvas.width+1,this.canvas.height+1)),c.save(),this.drawRect&&(c.beginPath(),c.rect(b.x,b.y,b.width,b.height),c.clip()),this.updateContext(c),this.draw(c,!1),c.restore(),this.dispatchEvent("drawend")}},b.tick=function(a){if(this.tickEnabled&&this.dispatchEvent("tickstart",!1,!0)!==!1){var b=new createjs.Event("tick");if(a)for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);this._tick(b),this.dispatchEvent("tickend")}},b.handleEvent=function(a){"tick"==a.type&&this.update(a)},b.clear=function(){if(this.canvas){var a=this.canvas.getContext("2d");a.setTransform(1,0,0,1,0,0),a.clearRect(0,0,this.canvas.width+1,this.canvas.height+1)}},b.toDataURL=function(a,b){var c,d=this.canvas.getContext("2d"),e=this.canvas.width,f=this.canvas.height;if(a){c=d.getImageData(0,0,e,f);var g=d.globalCompositeOperation;d.globalCompositeOperation="destination-over",d.fillStyle=a,d.fillRect(0,0,e,f)}var h=this.canvas.toDataURL(b||"image/png");return a&&(d.putImageData(c,0,0),d.globalCompositeOperation=g),h},b.enableMouseOver=function(a){if(this._mouseOverIntervalID&&(clearInterval(this._mouseOverIntervalID),this._mouseOverIntervalID=null,0==a&&this._testMouseOver(!0)),null==a)a=20;else if(0>=a)return;var b=this;this._mouseOverIntervalID=setInterval(function(){b._testMouseOver()},1e3/Math.min(50,a))},b.enableDOMEvents=function(a){null==a&&(a=!0);var b,c,d=this._eventListeners;if(!a&&d){for(b in d)c=d[b],c.t.removeEventListener(b,c.f,!1);this._eventListeners=null}else if(a&&!d&&this.canvas){var e=window.addEventListener?window:document,f=this;d=this._eventListeners={},d.mouseup={t:e,f:function(a){f._handleMouseUp(a)}},d.mousemove={t:e,f:function(a){f._handleMouseMove(a)}},d.dblclick={t:this.canvas,f:function(a){f._handleDoubleClick(a)}},d.mousedown={t:this.canvas,f:function(a){f._handleMouseDown(a)}};for(b in d)c=d[b],c.t.addEventListener(b,c.f,!1)}},b.clone=function(){throw"Stage cannot be cloned."},b.toString=function(){return"[Stage (name="+this.name+")]"},b._getElementRect=function(a){var b;try{b=a.getBoundingClientRect()}catch(c){b={top:a.offsetTop,left:a.offsetLeft,width:a.offsetWidth,height:a.offsetHeight}}var d=(window.pageXOffset||document.scrollLeft||0)-(document.clientLeft||document.body.clientLeft||0),e=(window.pageYOffset||document.scrollTop||0)-(document.clientTop||document.body.clientTop||0),f=window.getComputedStyle?getComputedStyle(a,null):a.currentStyle,g=parseInt(f.paddingLeft)+parseInt(f.borderLeftWidth),h=parseInt(f.paddingTop)+parseInt(f.borderTopWidth),i=parseInt(f.paddingRight)+parseInt(f.borderRightWidth),j=parseInt(f.paddingBottom)+parseInt(f.borderBottomWidth);return{left:b.left+d+g,right:b.right+d-i,top:b.top+e+h,bottom:b.bottom+e-j}},b._getPointerData=function(a){var b=this._pointerData[a];return b||(b=this._pointerData[a]={x:0,y:0}),b},b._handleMouseMove=function(a){a||(a=window.event),this._handlePointerMove(-1,a,a.pageX,a.pageY)},b._handlePointerMove=function(a,b,c,d,e){if((!this._prevStage||void 0!==e)&&this.canvas){var f=this._nextStage,g=this._getPointerData(a),h=g.inBounds;this._updatePointerPosition(a,b,c,d),(h||g.inBounds||this.mouseMoveOutside)&&(-1===a&&g.inBounds==!h&&this._dispatchMouseEvent(this,h?"mouseleave":"mouseenter",!1,a,g,b),this._dispatchMouseEvent(this,"stagemousemove",!1,a,g,b),this._dispatchMouseEvent(g.target,"pressmove",!0,a,g,b)),f&&f._handlePointerMove(a,b,c,d,null)}},b._updatePointerPosition=function(a,b,c,d){var e=this._getElementRect(this.canvas);c-=e.left,d-=e.top;var f=this.canvas.width,g=this.canvas.height;c/=(e.right-e.left)/f,d/=(e.bottom-e.top)/g;var h=this._getPointerData(a);(h.inBounds=c>=0&&d>=0&&f-1>=c&&g-1>=d)?(h.x=c,h.y=d):this.mouseMoveOutside&&(h.x=0>c?0:c>f-1?f-1:c,h.y=0>d?0:d>g-1?g-1:d),h.posEvtObj=b,h.rawX=c,h.rawY=d,(a===this._primaryPointerID||-1===a)&&(this.mouseX=h.x,this.mouseY=h.y,this.mouseInBounds=h.inBounds)},b._handleMouseUp=function(a){this._handlePointerUp(-1,a,!1)},b._handlePointerUp=function(a,b,c,d){var e=this._nextStage,f=this._getPointerData(a);if(!this._prevStage||void 0!==d){var g=null,h=f.target;d||!h&&!e||(g=this._getObjectsUnderPoint(f.x,f.y,null,!0)),f.down&&(this._dispatchMouseEvent(this,"stagemouseup",!1,a,f,b,g),f.down=!1),g==h&&this._dispatchMouseEvent(h,"click",!0,a,f,b),this._dispatchMouseEvent(h,"pressup",!0,a,f,b),c?(a==this._primaryPointerID&&(this._primaryPointerID=null),delete this._pointerData[a]):f.target=null,e&&e._handlePointerUp(a,b,c,d||g&&this)}},b._handleMouseDown=function(a){this._handlePointerDown(-1,a,a.pageX,a.pageY)},b._handlePointerDown=function(a,b,c,d,e){this.preventSelection&&b.preventDefault(),(null==this._primaryPointerID||-1===a)&&(this._primaryPointerID=a),null!=d&&this._updatePointerPosition(a,b,c,d);var f=null,g=this._nextStage,h=this._getPointerData(a);e||(f=h.target=this._getObjectsUnderPoint(h.x,h.y,null,!0)),h.inBounds&&(this._dispatchMouseEvent(this,"stagemousedown",!1,a,h,b,f),h.down=!0),this._dispatchMouseEvent(f,"mousedown",!0,a,h,b),g&&g._handlePointerDown(a,b,c,d,e||f&&this)},b._testMouseOver=function(a,b,c){if(!this._prevStage||void 0!==b){var d=this._nextStage;if(!this._mouseOverIntervalID)return void(d&&d._testMouseOver(a,b,c));var e=this._getPointerData(-1);if(e&&(a||this.mouseX!=this._mouseOverX||this.mouseY!=this._mouseOverY||!this.mouseInBounds)){var f,g,h,i=e.posEvtObj,j=c||i&&i.target==this.canvas,k=null,l=-1,m="";!b&&(a||this.mouseInBounds&&j)&&(k=this._getObjectsUnderPoint(this.mouseX,this.mouseY,null,!0),this._mouseOverX=this.mouseX,this._mouseOverY=this.mouseY);var n=this._mouseOverTarget||[],o=n[n.length-1],p=this._mouseOverTarget=[];for(f=k;f;)p.unshift(f),m||(m=f.cursor),f=f.parent;for(this.canvas.style.cursor=m,!b&&c&&(c.canvas.style.cursor=m),g=0,h=p.length;h>g&&p[g]==n[g];g++)l=g;for(o!=k&&this._dispatchMouseEvent(o,"mouseout",!0,-1,e,i,k),g=n.length-1;g>l;g--)this._dispatchMouseEvent(n[g],"rollout",!1,-1,e,i,k);for(g=p.length-1;g>l;g--)this._dispatchMouseEvent(p[g],"rollover",!1,-1,e,i,o);o!=k&&this._dispatchMouseEvent(k,"mouseover",!0,-1,e,i,o),d&&d._testMouseOver(a,b||k&&this,c||j&&this)}}},b._handleDoubleClick=function(a,b){var c=null,d=this._nextStage,e=this._getPointerData(-1);b||(c=this._getObjectsUnderPoint(e.x,e.y,null,!0),this._dispatchMouseEvent(c,"dblclick",!0,-1,e,a)),d&&d._handleDoubleClick(a,b||c&&this)},b._dispatchMouseEvent=function(a,b,c,d,e,f,g){if(a&&(c||a.hasEventListener(b))){var h=new createjs.MouseEvent(b,c,!1,e.x,e.y,f,d,d===this._primaryPointerID||-1===d,e.rawX,e.rawY,g);a.dispatchEvent(h)}},createjs.Stage=createjs.promote(a,"Container")}(),this.createjs=this.createjs||{},function(){function a(a){this.DisplayObject_constructor(),"string"==typeof a?(this.image=document.createElement("img"),this.image.src=a):this.image=a,this.sourceRect=null}var b=createjs.extend(a,createjs.DisplayObject);b.initialize=a,b.isVisible=function(){var a=this.image,b=this.cacheCanvas||a&&(a.naturalWidth||a.getContext||a.readyState>=2);return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY&&b)},b.draw=function(a,b){if(this.DisplayObject_draw(a,b)||!this.image)return!0;var c=this.image,d=this.sourceRect;if(d){var e=d.x,f=d.y,g=e+d.width,h=f+d.height,i=0,j=0,k=c.width,l=c.height;0>e&&(i-=e,e=0),g>k&&(g=k),0>f&&(j-=f,f=0),h>l&&(h=l),a.drawImage(c,e,f,g-e,h-f,i,j,g-e,h-f)}else a.drawImage(c,0,0);return!0},b.getBounds=function(){var a=this.DisplayObject_getBounds();if(a)return a;var b=this.image,c=this.sourceRect||b,d=b&&(b.naturalWidth||b.getContext||b.readyState>=2);return d?this._rectangle.setValues(0,0,c.width,c.height):null},b.clone=function(){var b=new a(this.image);return this.sourceRect&&(b.sourceRect=this.sourceRect.clone()),this._cloneProps(b),b},b.toString=function(){return"[Bitmap (name="+this.name+")]"},createjs.Bitmap=createjs.promote(a,"DisplayObject")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.DisplayObject_constructor(),this.currentFrame=0,this.currentAnimation=null,this.paused=!0,this.spriteSheet=a,this.currentAnimationFrame=0,this.framerate=0,this._animation=null,this._currentFrame=null,this._skipAdvance=!1,null!=b&&this.gotoAndPlay(b)}var b=createjs.extend(a,createjs.DisplayObject);b.initialize=a,b.isVisible=function(){var a=this.cacheCanvas||this.spriteSheet.complete;return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY&&a)},b.draw=function(a,b){if(this.DisplayObject_draw(a,b))return!0;this._normalizeFrame();var c=this.spriteSheet.getFrame(0|this._currentFrame);if(!c)return!1;var d=c.rect;return d.width&&d.height&&a.drawImage(c.image,d.x,d.y,d.width,d.height,-c.regX,-c.regY,d.width,d.height),!0},b.play=function(){this.paused=!1},b.stop=function(){this.paused=!0},b.gotoAndPlay=function(a){this.paused=!1,this._skipAdvance=!0,this._goto(a)},b.gotoAndStop=function(a){this.paused=!0,this._goto(a)},b.advance=function(a){var b=this.framerate||this.spriteSheet.framerate,c=b&&null!=a?a/(1e3/b):1;this._normalizeFrame(c)},b.getBounds=function(){return this.DisplayObject_getBounds()||this.spriteSheet.getFrameBounds(this.currentFrame,this._rectangle)},b.clone=function(){return this._cloneProps(new a(this.spriteSheet))},b.toString=function(){return"[Sprite (name="+this.name+")]"},b._cloneProps=function(a){return this.DisplayObject__cloneProps(a),a.currentFrame=this.currentFrame,a.currentAnimation=this.currentAnimation,a.paused=this.paused,a.currentAnimationFrame=this.currentAnimationFrame,a.framerate=this.framerate,a._animation=this._animation,a._currentFrame=this._currentFrame,a._skipAdvance=this._skipAdvance,a},b._tick=function(a){this.paused||(this._skipAdvance||this.advance(a&&a.delta),this._skipAdvance=!1),this.DisplayObject__tick(a)},b._normalizeFrame=function(a){a=a||0;var b,c=this._animation,d=this.paused,e=this._currentFrame;if(c){var f=c.speed||1,g=this.currentAnimationFrame;if(b=c.frames.length,g+a*f>=b){var h=c.next;if(this._dispatchAnimationEnd(c,e,d,h,b-1))return;if(h)return this._goto(h,a-(b-g)/f);this.paused=!0,g=c.frames.length-1}else g+=a*f;this.currentAnimationFrame=g,this._currentFrame=c.frames[0|g]}else if(e=this._currentFrame+=a,b=this.spriteSheet.getNumFrames(),e>=b&&b>0&&!this._dispatchAnimationEnd(c,e,d,b-1)&&(this._currentFrame-=b)>=b)return this._normalizeFrame();e=0|this._currentFrame,this.currentFrame!=e&&(this.currentFrame=e,this.dispatchEvent("change"))},b._dispatchAnimationEnd=function(a,b,c,d,e){var f=a?a.name:null;if(this.hasEventListener("animationend")){var g=new createjs.Event("animationend");g.name=f,g.next=d,this.dispatchEvent(g)}var h=this._animation!=a||this._currentFrame!=b;return h||c||!this.paused||(this.currentAnimationFrame=e,h=!0),h},b._goto=function(a,b){if(this.currentAnimationFrame=0,isNaN(a)){var c=this.spriteSheet.getAnimation(a);c&&(this._animation=c,this.currentAnimation=a,this._normalizeFrame(b))}else this.currentAnimation=this._animation=null,this._currentFrame=a,this._normalizeFrame()},createjs.Sprite=createjs.promote(a,"DisplayObject")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.DisplayObject_constructor(),this.graphics=a?a:new createjs.Graphics}var b=createjs.extend(a,createjs.DisplayObject);b.isVisible=function(){var a=this.cacheCanvas||this.graphics&&!this.graphics.isEmpty();return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY&&a)},b.draw=function(a,b){return this.DisplayObject_draw(a,b)?!0:(this.graphics.draw(a,this),!0)},b.clone=function(b){var c=b&&this.graphics?this.graphics.clone():this.graphics;return this._cloneProps(new a(c))},b.toString=function(){return"[Shape (name="+this.name+")]"},createjs.Shape=createjs.promote(a,"DisplayObject")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.DisplayObject_constructor(),this.text=a,this.font=b,this.color=c,this.textAlign="left",this.textBaseline="top",this.maxWidth=null,this.outline=0,this.lineHeight=0,this.lineWidth=null}var b=createjs.extend(a,createjs.DisplayObject),c=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");c.getContext&&(a._workingContext=c.getContext("2d"),c.width=c.height=1),a.H_OFFSETS={start:0,left:0,center:-.5,end:-1,right:-1},a.V_OFFSETS={top:0,hanging:-.01,middle:-.4,alphabetic:-.8,ideographic:-.85,bottom:-1},b.isVisible=function(){var a=this.cacheCanvas||null!=this.text&&""!==this.text;return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY&&a)},b.draw=function(a,b){if(this.DisplayObject_draw(a,b))return!0;var c=this.color||"#000";return this.outline?(a.strokeStyle=c,a.lineWidth=1*this.outline):a.fillStyle=c,this._drawText(this._prepContext(a)),!0},b.getMeasuredWidth=function(){return this._getMeasuredWidth(this.text)},b.getMeasuredLineHeight=function(){return 1.2*this._getMeasuredWidth("M")},b.getMeasuredHeight=function(){return this._drawText(null,{}).height},b.getBounds=function(){var b=this.DisplayObject_getBounds();if(b)return b;if(null==this.text||""===this.text)return null;var c=this._drawText(null,{}),d=this.maxWidth&&this.maxWidth<c.width?this.maxWidth:c.width,e=d*a.H_OFFSETS[this.textAlign||"left"],f=this.lineHeight||this.getMeasuredLineHeight(),g=f*a.V_OFFSETS[this.textBaseline||"top"];return this._rectangle.setValues(e,g,d,c.height)},b.getMetrics=function(){var b={lines:[]};return b.lineHeight=this.lineHeight||this.getMeasuredLineHeight(),b.vOffset=b.lineHeight*a.V_OFFSETS[this.textBaseline||"top"],this._drawText(null,b,b.lines)},b.clone=function(){return this._cloneProps(new a(this.text,this.font,this.color))},b.toString=function(){return"[Text (text="+(this.text.length>20?this.text.substr(0,17)+"...":this.text)+")]"},b._cloneProps=function(a){return this.DisplayObject__cloneProps(a),a.textAlign=this.textAlign,a.textBaseline=this.textBaseline,a.maxWidth=this.maxWidth,a.outline=this.outline,a.lineHeight=this.lineHeight,a.lineWidth=this.lineWidth,a},b._prepContext=function(a){return a.font=this.font||"10px sans-serif",a.textAlign=this.textAlign||"left",a.textBaseline=this.textBaseline||"top",a},b._drawText=function(b,c,d){var e=!!b;e||(b=a._workingContext,b.save(),this._prepContext(b));for(var f=this.lineHeight||this.getMeasuredLineHeight(),g=0,h=0,i=String(this.text).split(/(?:\r\n|\r|\n)/),j=0,k=i.length;k>j;j++){var l=i[j],m=null;if(null!=this.lineWidth&&(m=b.measureText(l).width)>this.lineWidth){var n=l.split(/(\s)/);l=n[0],m=b.measureText(l).width;for(var o=1,p=n.length;p>o;o+=2){var q=b.measureText(n[o]+n[o+1]).width;m+q>this.lineWidth?(e&&this._drawTextLine(b,l,h*f),d&&d.push(l),m>g&&(g=m),l=n[o+1],m=b.measureText(l).width,h++):(l+=n[o]+n[o+1],m+=q)}}e&&this._drawTextLine(b,l,h*f),d&&d.push(l),c&&null==m&&(m=b.measureText(l).width),m>g&&(g=m),h++}return c&&(c.width=g,c.height=h*f),e||b.restore(),c},b._drawTextLine=function(a,b,c){this.outline?a.strokeText(b,0,c,this.maxWidth||65535):a.fillText(b,0,c,this.maxWidth||65535)},b._getMeasuredWidth=function(b){var c=a._workingContext;c.save();var d=this._prepContext(c).measureText(b).width;return c.restore(),d},createjs.Text=createjs.promote(a,"DisplayObject")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.Container_constructor(),this.text=a||"",this.spriteSheet=b,this.lineHeight=0,this.letterSpacing=0,this.spaceWidth=0,this._oldProps={text:0,spriteSheet:0,lineHeight:0,letterSpacing:0,spaceWidth:0}}var b=createjs.extend(a,createjs.Container);a.maxPoolSize=100,a._spritePool=[],b.draw=function(a,b){this.DisplayObject_draw(a,b)||(this._updateText(),this.Container_draw(a,b))},b.getBounds=function(){return this._updateText(),this.Container_getBounds()},b.isVisible=function(){var a=this.cacheCanvas||this.spriteSheet&&this.spriteSheet.complete&&this.text;return!!(this.visible&&this.alpha>0&&0!==this.scaleX&&0!==this.scaleY&&a)},b.clone=function(){return this._cloneProps(new a(this.text,this.spriteSheet))},b.addChild=b.addChildAt=b.removeChild=b.removeChildAt=b.removeAllChildren=function(){},b._cloneProps=function(a){return this.Container__cloneProps(a),a.lineHeight=this.lineHeight,a.letterSpacing=this.letterSpacing,a.spaceWidth=this.spaceWidth,a},b._getFrameIndex=function(a,b){var c,d=b.getAnimation(a);return d||(a!=(c=a.toUpperCase())||a!=(c=a.toLowerCase())||(c=null),c&&(d=b.getAnimation(c))),d&&d.frames[0]},b._getFrame=function(a,b){var c=this._getFrameIndex(a,b);return null==c?c:b.getFrame(c)},b._getLineHeight=function(a){var b=this._getFrame("1",a)||this._getFrame("T",a)||this._getFrame("L",a)||a.getFrame(0);return b?b.rect.height:1},b._getSpaceWidth=function(a){var b=this._getFrame("1",a)||this._getFrame("l",a)||this._getFrame("e",a)||this._getFrame("a",a)||a.getFrame(0);return b?b.rect.width:1},b._updateText=function(){var b,c=0,d=0,e=this._oldProps,f=!1,g=this.spaceWidth,h=this.lineHeight,i=this.spriteSheet,j=a._spritePool,k=this.children,l=0,m=k.length;for(var n in e)e[n]!=this[n]&&(e[n]=this[n],f=!0);if(f){var o=!!this._getFrame(" ",i);o||g||(g=this._getSpaceWidth(i)),h||(h=this._getLineHeight(i));for(var p=0,q=this.text.length;q>p;p++){var r=this.text.charAt(p);if(" "!=r||o)if("\n"!=r&&"\r"!=r){var s=this._getFrameIndex(r,i);null!=s&&(m>l?b=k[l]:(k.push(b=j.length?j.pop():new createjs.Sprite),b.parent=this,m++),b.spriteSheet=i,b.gotoAndStop(s),b.x=c,b.y=d,l++,c+=b.getBounds().width+this.letterSpacing)}else"\r"==r&&"\n"==this.text.charAt(p+1)&&p++,c=0,d+=h;else c+=g}for(;m>l;)j.push(b=k.pop()),b.parent=null,m--;j.length>a.maxPoolSize&&(j.length=a.maxPoolSize)}},createjs.BitmapText=createjs.promote(a,"Container")}(),this.createjs=this.createjs||{},function(){"use strict";function a(){throw"SpriteSheetUtils cannot be instantiated"}var b=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");b.getContext&&(a._workingCanvas=b,a._workingContext=b.getContext("2d"),b.width=b.height=1),a.addFlippedFrames=function(b,c,d,e){if(c||d||e){var f=0;c&&a._flip(b,++f,!0,!1),d&&a._flip(b,++f,!1,!0),e&&a._flip(b,++f,!0,!0)}},a.extractFrame=function(b,c){isNaN(c)&&(c=b.getAnimation(c).frames[0]);var d=b.getFrame(c);if(!d)return null;var e=d.rect,f=a._workingCanvas;f.width=e.width,f.height=e.height,a._workingContext.drawImage(d.image,e.x,e.y,e.width,e.height,0,0,e.width,e.height);var g=document.createElement("img");return g.src=f.toDataURL("image/png"),g},a.mergeAlpha=function(a,b,c){c||(c=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas")),c.width=Math.max(b.width,a.width),c.height=Math.max(b.height,a.height);var d=c.getContext("2d");return d.save(),d.drawImage(a,0,0),d.globalCompositeOperation="destination-in",d.drawImage(b,0,0),d.restore(),c},a._flip=function(b,c,d,e){for(var f=b._images,g=a._workingCanvas,h=a._workingContext,i=f.length/c,j=0;i>j;j++){var k=f[j];k.__tmp=j,h.setTransform(1,0,0,1,0,0),h.clearRect(0,0,g.width+1,g.height+1),g.width=k.width,g.height=k.height,h.setTransform(d?-1:1,0,0,e?-1:1,d?k.width:0,e?k.height:0),h.drawImage(k,0,0);
var l=document.createElement("img");l.src=g.toDataURL("image/png"),l.width=k.width,l.height=k.height,f.push(l)}var m=b._frames,n=m.length/c;for(j=0;n>j;j++){k=m[j];var o=k.rect.clone();l=f[k.image.__tmp+i*c];var p={image:l,rect:o,regX:k.regX,regY:k.regY};d&&(o.x=l.width-o.x-o.width,p.regX=o.width-k.regX),e&&(o.y=l.height-o.y-o.height,p.regY=o.height-k.regY),m.push(p)}var q="_"+(d?"h":"")+(e?"v":""),r=b._animations,s=b._data,t=r.length/c;for(j=0;t>j;j++){var u=r[j];k=s[u];var v={name:u+q,speed:k.speed,next:k.next,frames:[]};k.next&&(v.next+=q),m=k.frames;for(var w=0,x=m.length;x>w;w++)v.frames.push(m[w]+n*c);s[v.name]=v,r.push(v.name)}},createjs.SpriteSheetUtils=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this.EventDispatcher_constructor(),this.maxWidth=2048,this.maxHeight=2048,this.spriteSheet=null,this.scale=1,this.padding=1,this.timeSlice=.3,this.progress=-1,this._frames=[],this._animations={},this._data=null,this._nextFrameIndex=0,this._index=0,this._timerID=null,this._scale=1}var b=createjs.extend(a,createjs.EventDispatcher);a.ERR_DIMENSIONS="frame dimensions exceed max spritesheet dimensions",a.ERR_RUNNING="a build is already running",b.addFrame=function(b,c,d,e,f){if(this._data)throw a.ERR_RUNNING;var g=c||b.bounds||b.nominalBounds;return!g&&b.getBounds&&(g=b.getBounds()),g?(d=d||1,this._frames.push({source:b,sourceRect:g,scale:d,funct:e,data:f,index:this._frames.length,height:g.height*d})-1):null},b.addAnimation=function(b,c,d,e){if(this._data)throw a.ERR_RUNNING;this._animations[b]={frames:c,next:d,frequency:e}},b.addMovieClip=function(b,c,d,e,f,g){if(this._data)throw a.ERR_RUNNING;var h=b.frameBounds,i=c||b.bounds||b.nominalBounds;if(!i&&b.getBounds&&(i=b.getBounds()),i||h){var j,k,l=this._frames.length,m=b.timeline.duration;for(j=0;m>j;j++){var n=h&&h[j]?h[j]:i;this.addFrame(b,n,d,this._setupMovieClipFrame,{i:j,f:e,d:f})}var o=b.timeline._labels,p=[];for(var q in o)p.push({index:o[q],label:q});if(p.length)for(p.sort(function(a,b){return a.index-b.index}),j=0,k=p.length;k>j;j++){for(var r=p[j].label,s=l+p[j].index,t=l+(j==k-1?m:p[j+1].index),u=[],v=s;t>v;v++)u.push(v);(!g||(r=g(r,b,s,t)))&&this.addAnimation(r,u,!0)}}},b.build=function(){if(this._data)throw a.ERR_RUNNING;for(this._startBuild();this._drawNext(););return this._endBuild(),this.spriteSheet},b.buildAsync=function(b){if(this._data)throw a.ERR_RUNNING;this.timeSlice=b,this._startBuild();var c=this;this._timerID=setTimeout(function(){c._run()},50-50*Math.max(.01,Math.min(.99,this.timeSlice||.3)))},b.stopAsync=function(){clearTimeout(this._timerID),this._data=null},b.clone=function(){throw"SpriteSheetBuilder cannot be cloned."},b.toString=function(){return"[SpriteSheetBuilder]"},b._startBuild=function(){var b=this.padding||0;this.progress=0,this.spriteSheet=null,this._index=0,this._scale=this.scale;var c=[];this._data={images:[],frames:c,animations:this._animations};var d=this._frames.slice();if(d.sort(function(a,b){return a.height<=b.height?-1:1}),d[d.length-1].height+2*b>this.maxHeight)throw a.ERR_DIMENSIONS;for(var e=0,f=0,g=0;d.length;){var h=this._fillRow(d,e,g,c,b);if(h.w>f&&(f=h.w),e+=h.h,!h.h||!d.length){var i=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");i.width=this._getSize(f,this.maxWidth),i.height=this._getSize(e,this.maxHeight),this._data.images[g]=i,h.h||(f=e=0,g++)}}},b._setupMovieClipFrame=function(a,b){var c=a.actionsEnabled;a.actionsEnabled=!1,a.gotoAndStop(b.i),a.actionsEnabled=c,b.f&&b.f(a,b.d,b.i)},b._getSize=function(a,b){for(var c=4;Math.pow(2,++c)<a;);return Math.min(b,Math.pow(2,c))},b._fillRow=function(b,c,d,e,f){var g=this.maxWidth,h=this.maxHeight;c+=f;for(var i=h-c,j=f,k=0,l=b.length-1;l>=0;l--){var m=b[l],n=this._scale*m.scale,o=m.sourceRect,p=m.source,q=Math.floor(n*o.x-f),r=Math.floor(n*o.y-f),s=Math.ceil(n*o.height+2*f),t=Math.ceil(n*o.width+2*f);if(t>g)throw a.ERR_DIMENSIONS;s>i||j+t>g||(m.img=d,m.rect=new createjs.Rectangle(j,c,t,s),k=k||s,b.splice(l,1),e[m.index]=[j,c,t,s,d,Math.round(-q+n*p.regX-f),Math.round(-r+n*p.regY-f)],j+=t)}return{w:j,h:k}},b._endBuild=function(){this.spriteSheet=new createjs.SpriteSheet(this._data),this._data=null,this.progress=1,this.dispatchEvent("complete")},b._run=function(){for(var a=50*Math.max(.01,Math.min(.99,this.timeSlice||.3)),b=(new Date).getTime()+a,c=!1;b>(new Date).getTime();)if(!this._drawNext()){c=!0;break}if(c)this._endBuild();else{var d=this;this._timerID=setTimeout(function(){d._run()},50-a)}var e=this.progress=this._index/this._frames.length;if(this.hasEventListener("progress")){var f=new createjs.Event("progress");f.progress=e,this.dispatchEvent(f)}},b._drawNext=function(){var a=this._frames[this._index],b=a.scale*this._scale,c=a.rect,d=a.sourceRect,e=this._data.images[a.img],f=e.getContext("2d");return a.funct&&a.funct(a.source,a.data),f.save(),f.beginPath(),f.rect(c.x,c.y,c.width,c.height),f.clip(),f.translate(Math.ceil(c.x-d.x*b),Math.ceil(c.y-d.y*b)),f.scale(b,b),a.source.draw(f),f.restore(),++this._index<this._frames.length},createjs.SpriteSheetBuilder=createjs.promote(a,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.DisplayObject_constructor(),"string"==typeof a&&(a=document.getElementById(a)),this.mouseEnabled=!1;var b=a.style;b.position="absolute",b.transformOrigin=b.WebkitTransformOrigin=b.msTransformOrigin=b.MozTransformOrigin=b.OTransformOrigin="0% 0%",this.htmlElement=a,this._oldProps=null}var b=createjs.extend(a,createjs.DisplayObject);b.isVisible=function(){return null!=this.htmlElement},b.draw=function(){return!0},b.cache=function(){},b.uncache=function(){},b.updateCache=function(){},b.hitTest=function(){},b.localToGlobal=function(){},b.globalToLocal=function(){},b.localToLocal=function(){},b.clone=function(){throw"DOMElement cannot be cloned."},b.toString=function(){return"[DOMElement (name="+this.name+")]"},b._tick=function(a){var b=this.getStage();b&&b.on("drawend",this._handleDrawEnd,this,!0),this.DisplayObject__tick(a)},b._handleDrawEnd=function(){var a=this.htmlElement;if(a){var b=a.style,c=this.getConcatenatedDisplayProps(this._props),d=c.matrix,e=c.visible?"visible":"hidden";if(e!=b.visibility&&(b.visibility=e),c.visible){var f=this._oldProps,g=f&&f.matrix,h=1e4;if(!g||!g.equals(d)){var i="matrix("+(d.a*h|0)/h+","+(d.b*h|0)/h+","+(d.c*h|0)/h+","+(d.d*h|0)/h+","+(d.tx+.5|0);b.transform=b.WebkitTransform=b.OTransform=b.msTransform=i+","+(d.ty+.5|0)+")",b.MozTransform=i+"px,"+(d.ty+.5|0)+"px)",f||(f=this._oldProps=new createjs.DisplayProps(!0,0/0)),f.matrix.copy(d)}f.alpha!=c.alpha&&(b.opacity=""+(c.alpha*h|0)/h,f.alpha=c.alpha)}}},createjs.DOMElement=createjs.promote(a,"DisplayObject")}(),this.createjs=this.createjs||{},function(){"use strict";function a(){}var b=a.prototype;b.getBounds=function(a){return a},b.applyFilter=function(a,b,c,d,e,f,g,h){f=f||a,null==g&&(g=b),null==h&&(h=c);try{var i=a.getImageData(b,c,d,e)}catch(j){return!1}return this._applyFilter(i)?(f.putImageData(i,g,h),!0):!1},b.toString=function(){return"[Filter]"},b.clone=function(){return new a},b._applyFilter=function(){return!0},createjs.Filter=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){(isNaN(a)||0>a)&&(a=0),(isNaN(b)||0>b)&&(b=0),(isNaN(c)||1>c)&&(c=1),this.blurX=0|a,this.blurY=0|b,this.quality=0|c}var b=createjs.extend(a,createjs.Filter);a.MUL_TABLE=[1,171,205,293,57,373,79,137,241,27,391,357,41,19,283,265,497,469,443,421,25,191,365,349,335,161,155,149,9,278,269,261,505,245,475,231,449,437,213,415,405,395,193,377,369,361,353,345,169,331,325,319,313,307,301,37,145,285,281,69,271,267,263,259,509,501,493,243,479,118,465,459,113,446,55,435,429,423,209,413,51,403,199,393,97,3,379,375,371,367,363,359,355,351,347,43,85,337,333,165,327,323,5,317,157,311,77,305,303,75,297,294,73,289,287,71,141,279,277,275,68,135,67,133,33,262,260,129,511,507,503,499,495,491,61,121,481,477,237,235,467,232,115,457,227,451,7,445,221,439,218,433,215,427,425,211,419,417,207,411,409,203,202,401,399,396,197,49,389,387,385,383,95,189,47,187,93,185,23,183,91,181,45,179,89,177,11,175,87,173,345,343,341,339,337,21,167,83,331,329,327,163,81,323,321,319,159,79,315,313,39,155,309,307,153,305,303,151,75,299,149,37,295,147,73,291,145,289,287,143,285,71,141,281,35,279,139,69,275,137,273,17,271,135,269,267,133,265,33,263,131,261,130,259,129,257,1],a.SHG_TABLE=[0,9,10,11,9,12,10,11,12,9,13,13,10,9,13,13,14,14,14,14,10,13,14,14,14,13,13,13,9,14,14,14,15,14,15,14,15,15,14,15,15,15,14,15,15,15,15,15,14,15,15,15,15,15,15,12,14,15,15,13,15,15,15,15,16,16,16,15,16,14,16,16,14,16,13,16,16,16,15,16,13,16,15,16,14,9,16,16,16,16,16,16,16,16,16,13,14,16,16,15,16,16,10,16,15,16,14,16,16,14,16,16,14,16,16,14,15,16,16,16,14,15,14,15,13,16,16,15,17,17,17,17,17,17,14,15,17,17,16,16,17,16,15,17,16,17,11,17,16,17,16,17,16,17,17,16,17,17,16,17,17,16,16,17,17,17,16,14,17,17,17,17,15,16,14,16,15,16,13,16,15,16,14,16,15,16,12,16,15,16,17,17,17,17,17,13,16,15,17,17,17,16,15,17,17,17,16,15,17,17,14,16,17,17,16,17,17,16,15,17,16,14,17,16,15,17,16,17,17,16,17,15,16,17,14,17,16,15,17,16,17,13,17,16,17,17,16,17,14,17,16,17,16,17,16,17,9],b.getBounds=function(a){var b=0|this.blurX,c=0|this.blurY;if(0>=b&&0>=c)return a;var d=Math.pow(this.quality,.2);return(a||new createjs.Rectangle).pad(b*d+1,c*d+1,b*d+1,c*d+1)},b.clone=function(){return new a(this.blurX,this.blurY,this.quality)},b.toString=function(){return"[BlurFilter]"},b._applyFilter=function(b){var c=this.blurX>>1;if(isNaN(c)||0>c)return!1;var d=this.blurY>>1;if(isNaN(d)||0>d)return!1;if(0==c&&0==d)return!1;var e=this.quality;(isNaN(e)||1>e)&&(e=1),e|=0,e>3&&(e=3),1>e&&(e=1);var f=b.data,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=c+c+1|0,w=d+d+1|0,x=0|b.width,y=0|b.height,z=x-1|0,A=y-1|0,B=c+1|0,C=d+1|0,D={r:0,b:0,g:0,a:0},E=D;for(i=1;v>i;i++)E=E.n={r:0,b:0,g:0,a:0};E.n=D;var F={r:0,b:0,g:0,a:0},G=F;for(i=1;w>i;i++)G=G.n={r:0,b:0,g:0,a:0};G.n=F;for(var H=null,I=0|a.MUL_TABLE[c],J=0|a.SHG_TABLE[c],K=0|a.MUL_TABLE[d],L=0|a.SHG_TABLE[d];e-->0;){m=l=0;var M=I,N=J;for(h=y;--h>-1;){for(n=B*(r=f[0|l]),o=B*(s=f[l+1|0]),p=B*(t=f[l+2|0]),q=B*(u=f[l+3|0]),E=D,i=B;--i>-1;)E.r=r,E.g=s,E.b=t,E.a=u,E=E.n;for(i=1;B>i;i++)j=l+((i>z?z:i)<<2)|0,n+=E.r=f[j],o+=E.g=f[j+1],p+=E.b=f[j+2],q+=E.a=f[j+3],E=E.n;for(H=D,g=0;x>g;g++)f[l++]=n*M>>>N,f[l++]=o*M>>>N,f[l++]=p*M>>>N,f[l++]=q*M>>>N,j=m+((j=g+c+1)<z?j:z)<<2,n-=H.r-(H.r=f[j]),o-=H.g-(H.g=f[j+1]),p-=H.b-(H.b=f[j+2]),q-=H.a-(H.a=f[j+3]),H=H.n;m+=x}for(M=K,N=L,g=0;x>g;g++){for(l=g<<2|0,n=C*(r=f[l])|0,o=C*(s=f[l+1|0])|0,p=C*(t=f[l+2|0])|0,q=C*(u=f[l+3|0])|0,G=F,i=0;C>i;i++)G.r=r,G.g=s,G.b=t,G.a=u,G=G.n;for(k=x,i=1;d>=i;i++)l=k+g<<2,n+=G.r=f[l],o+=G.g=f[l+1],p+=G.b=f[l+2],q+=G.a=f[l+3],G=G.n,A>i&&(k+=x);if(l=g,H=F,e>0)for(h=0;y>h;h++)j=l<<2,f[j+3]=u=q*M>>>N,u>0?(f[j]=n*M>>>N,f[j+1]=o*M>>>N,f[j+2]=p*M>>>N):f[j]=f[j+1]=f[j+2]=0,j=g+((j=h+C)<A?j:A)*x<<2,n-=H.r-(H.r=f[j]),o-=H.g-(H.g=f[j+1]),p-=H.b-(H.b=f[j+2]),q-=H.a-(H.a=f[j+3]),H=H.n,l+=x;else for(h=0;y>h;h++)j=l<<2,f[j+3]=u=q*M>>>N,u>0?(u=255/u,f[j]=(n*M>>>N)*u,f[j+1]=(o*M>>>N)*u,f[j+2]=(p*M>>>N)*u):f[j]=f[j+1]=f[j+2]=0,j=g+((j=h+C)<A?j:A)*x<<2,n-=H.r-(H.r=f[j]),o-=H.g-(H.g=f[j+1]),p-=H.b-(H.b=f[j+2]),q-=H.a-(H.a=f[j+3]),H=H.n,l+=x}}return!0},createjs.BlurFilter=createjs.promote(a,"Filter")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.alphaMap=a,this._alphaMap=null,this._mapData=null}var b=createjs.extend(a,createjs.Filter);b.clone=function(){var b=new a(this.alphaMap);return b._alphaMap=this._alphaMap,b._mapData=this._mapData,b},b.toString=function(){return"[AlphaMapFilter]"},b._applyFilter=function(a){if(!this.alphaMap)return!0;if(!this._prepAlphaMap())return!1;for(var b=a.data,c=this._mapData,d=0,e=b.length;e>d;d+=4)b[d+3]=c[d]||0;return!0},b._prepAlphaMap=function(){if(!this.alphaMap)return!1;if(this.alphaMap==this._alphaMap&&this._mapData)return!0;this._mapData=null;var a,b=this._alphaMap=this.alphaMap,c=b;b instanceof HTMLCanvasElement?a=c.getContext("2d"):(c=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas"),c.width=b.width,c.height=b.height,a=c.getContext("2d"),a.drawImage(b,0,0));try{var d=a.getImageData(0,0,b.width,b.height)}catch(e){return!1}return this._mapData=d.data,!0},createjs.AlphaMapFilter=createjs.promote(a,"Filter")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.mask=a}var b=createjs.extend(a,createjs.Filter);b.applyFilter=function(a,b,c,d,e,f,g,h){return this.mask?(f=f||a,null==g&&(g=b),null==h&&(h=c),f.save(),a!=f?!1:(f.globalCompositeOperation="destination-in",f.drawImage(this.mask,g,h),f.restore(),!0)):!0},b.clone=function(){return new a(this.mask)},b.toString=function(){return"[AlphaMaskFilter]"},createjs.AlphaMaskFilter=createjs.promote(a,"Filter")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c,d,e,f,g,h){this.redMultiplier=null!=a?a:1,this.greenMultiplier=null!=b?b:1,this.blueMultiplier=null!=c?c:1,this.alphaMultiplier=null!=d?d:1,this.redOffset=e||0,this.greenOffset=f||0,this.blueOffset=g||0,this.alphaOffset=h||0}var b=createjs.extend(a,createjs.Filter);b.toString=function(){return"[ColorFilter]"},b.clone=function(){return new a(this.redMultiplier,this.greenMultiplier,this.blueMultiplier,this.alphaMultiplier,this.redOffset,this.greenOffset,this.blueOffset,this.alphaOffset)},b._applyFilter=function(a){for(var b=a.data,c=b.length,d=0;c>d;d+=4)b[d]=b[d]*this.redMultiplier+this.redOffset,b[d+1]=b[d+1]*this.greenMultiplier+this.greenOffset,b[d+2]=b[d+2]*this.blueMultiplier+this.blueOffset,b[d+3]=b[d+3]*this.alphaMultiplier+this.alphaOffset;return!0},createjs.ColorFilter=createjs.promote(a,"Filter")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c,d){this.setColor(a,b,c,d)}var b=a.prototype;a.DELTA_INDEX=[0,.01,.02,.04,.05,.06,.07,.08,.1,.11,.12,.14,.15,.16,.17,.18,.2,.21,.22,.24,.25,.27,.28,.3,.32,.34,.36,.38,.4,.42,.44,.46,.48,.5,.53,.56,.59,.62,.65,.68,.71,.74,.77,.8,.83,.86,.89,.92,.95,.98,1,1.06,1.12,1.18,1.24,1.3,1.36,1.42,1.48,1.54,1.6,1.66,1.72,1.78,1.84,1.9,1.96,2,2.12,2.25,2.37,2.5,2.62,2.75,2.87,3,3.2,3.4,3.6,3.8,4,4.3,4.7,4.9,5,5.5,6,6.5,6.8,7,7.3,7.5,7.8,8,8.4,8.7,9,9.4,9.6,9.8,10],a.IDENTITY_MATRIX=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],a.LENGTH=a.IDENTITY_MATRIX.length,b.setColor=function(a,b,c,d){return this.reset().adjustColor(a,b,c,d)},b.reset=function(){return this.copy(a.IDENTITY_MATRIX)},b.adjustColor=function(a,b,c,d){return this.adjustHue(d),this.adjustContrast(b),this.adjustBrightness(a),this.adjustSaturation(c)},b.adjustBrightness=function(a){return 0==a||isNaN(a)?this:(a=this._cleanValue(a,255),this._multiplyMatrix([1,0,0,0,a,0,1,0,0,a,0,0,1,0,a,0,0,0,1,0,0,0,0,0,1]),this)},b.adjustContrast=function(b){if(0==b||isNaN(b))return this;b=this._cleanValue(b,100);var c;return 0>b?c=127+b/100*127:(c=b%1,c=0==c?a.DELTA_INDEX[b]:a.DELTA_INDEX[b<<0]*(1-c)+a.DELTA_INDEX[(b<<0)+1]*c,c=127*c+127),this._multiplyMatrix([c/127,0,0,0,.5*(127-c),0,c/127,0,0,.5*(127-c),0,0,c/127,0,.5*(127-c),0,0,0,1,0,0,0,0,0,1]),this},b.adjustSaturation=function(a){if(0==a||isNaN(a))return this;a=this._cleanValue(a,100);var b=1+(a>0?3*a/100:a/100),c=.3086,d=.6094,e=.082;return this._multiplyMatrix([c*(1-b)+b,d*(1-b),e*(1-b),0,0,c*(1-b),d*(1-b)+b,e*(1-b),0,0,c*(1-b),d*(1-b),e*(1-b)+b,0,0,0,0,0,1,0,0,0,0,0,1]),this},b.adjustHue=function(a){if(0==a||isNaN(a))return this;a=this._cleanValue(a,180)/180*Math.PI;var b=Math.cos(a),c=Math.sin(a),d=.213,e=.715,f=.072;return this._multiplyMatrix([d+b*(1-d)+c*-d,e+b*-e+c*-e,f+b*-f+c*(1-f),0,0,d+b*-d+.143*c,e+b*(1-e)+.14*c,f+b*-f+c*-.283,0,0,d+b*-d+c*-(1-d),e+b*-e+c*e,f+b*(1-f)+c*f,0,0,0,0,0,1,0,0,0,0,0,1]),this},b.concat=function(b){return b=this._fixMatrix(b),b.length!=a.LENGTH?this:(this._multiplyMatrix(b),this)},b.clone=function(){return(new a).copy(this)},b.toArray=function(){for(var b=[],c=0,d=a.LENGTH;d>c;c++)b[c]=this[c];return b},b.copy=function(b){for(var c=a.LENGTH,d=0;c>d;d++)this[d]=b[d];return this},b.toString=function(){return"[ColorMatrix]"},b._multiplyMatrix=function(a){var b,c,d,e=[];for(b=0;5>b;b++){for(c=0;5>c;c++)e[c]=this[c+5*b];for(c=0;5>c;c++){var f=0;for(d=0;5>d;d++)f+=a[c+5*d]*e[d];this[c+5*b]=f}}},b._cleanValue=function(a,b){return Math.min(b,Math.max(-b,a))},b._fixMatrix=function(b){return b instanceof a&&(b=b.toArray()),b.length<a.LENGTH?b=b.slice(0,b.length).concat(a.IDENTITY_MATRIX.slice(b.length,a.LENGTH)):b.length>a.LENGTH&&(b=b.slice(0,a.LENGTH)),b},createjs.ColorMatrix=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.matrix=a}var b=createjs.extend(a,createjs.Filter);b.toString=function(){return"[ColorMatrixFilter]"},b.clone=function(){return new a(this.matrix)},b._applyFilter=function(a){for(var b,c,d,e,f=a.data,g=f.length,h=this.matrix,i=h[0],j=h[1],k=h[2],l=h[3],m=h[4],n=h[5],o=h[6],p=h[7],q=h[8],r=h[9],s=h[10],t=h[11],u=h[12],v=h[13],w=h[14],x=h[15],y=h[16],z=h[17],A=h[18],B=h[19],C=0;g>C;C+=4)b=f[C],c=f[C+1],d=f[C+2],e=f[C+3],f[C]=b*i+c*j+d*k+e*l+m,f[C+1]=b*n+c*o+d*p+e*q+r,f[C+2]=b*s+c*t+d*u+e*v+w,f[C+3]=b*x+c*y+d*z+e*A+B;return!0},createjs.ColorMatrixFilter=createjs.promote(a,"Filter")}(),this.createjs=this.createjs||{},function(){"use strict";function a(){throw"Touch cannot be instantiated"}a.isSupported=function(){return!!("ontouchstart"in window||window.navigator.msPointerEnabled&&window.navigator.msMaxTouchPoints>0||window.navigator.pointerEnabled&&window.navigator.maxTouchPoints>0)},a.enable=function(b,c,d){return b&&b.canvas&&a.isSupported()?b.__touch?!0:(b.__touch={pointers:{},multitouch:!c,preventDefault:!d,count:0},"ontouchstart"in window?a._IOS_enable(b):(window.navigator.msPointerEnabled||window.navigator.pointerEnabled)&&a._IE_enable(b),!0):!1},a.disable=function(b){b&&("ontouchstart"in window?a._IOS_disable(b):(window.navigator.msPointerEnabled||window.navigator.pointerEnabled)&&a._IE_disable(b),delete b.__touch)},a._IOS_enable=function(b){var c=b.canvas,d=b.__touch.f=function(c){a._IOS_handleEvent(b,c)};c.addEventListener("touchstart",d,!1),c.addEventListener("touchmove",d,!1),c.addEventListener("touchend",d,!1),c.addEventListener("touchcancel",d,!1)},a._IOS_disable=function(a){var b=a.canvas;if(b){var c=a.__touch.f;b.removeEventListener("touchstart",c,!1),b.removeEventListener("touchmove",c,!1),b.removeEventListener("touchend",c,!1),b.removeEventListener("touchcancel",c,!1)}},a._IOS_handleEvent=function(a,b){if(a){a.__touch.preventDefault&&b.preventDefault&&b.preventDefault();for(var c=b.changedTouches,d=b.type,e=0,f=c.length;f>e;e++){var g=c[e],h=g.identifier;g.target==a.canvas&&("touchstart"==d?this._handleStart(a,h,b,g.pageX,g.pageY):"touchmove"==d?this._handleMove(a,h,b,g.pageX,g.pageY):("touchend"==d||"touchcancel"==d)&&this._handleEnd(a,h,b))}}},a._IE_enable=function(b){var c=b.canvas,d=b.__touch.f=function(c){a._IE_handleEvent(b,c)};void 0===window.navigator.pointerEnabled?(c.addEventListener("MSPointerDown",d,!1),window.addEventListener("MSPointerMove",d,!1),window.addEventListener("MSPointerUp",d,!1),window.addEventListener("MSPointerCancel",d,!1),b.__touch.preventDefault&&(c.style.msTouchAction="none")):(c.addEventListener("pointerdown",d,!1),window.addEventListener("pointermove",d,!1),window.addEventListener("pointerup",d,!1),window.addEventListener("pointercancel",d,!1),b.__touch.preventDefault&&(c.style.touchAction="none")),b.__touch.activeIDs={}},a._IE_disable=function(a){var b=a.__touch.f;void 0===window.navigator.pointerEnabled?(window.removeEventListener("MSPointerMove",b,!1),window.removeEventListener("MSPointerUp",b,!1),window.removeEventListener("MSPointerCancel",b,!1),a.canvas&&a.canvas.removeEventListener("MSPointerDown",b,!1)):(window.removeEventListener("pointermove",b,!1),window.removeEventListener("pointerup",b,!1),window.removeEventListener("pointercancel",b,!1),a.canvas&&a.canvas.removeEventListener("pointerdown",b,!1))},a._IE_handleEvent=function(a,b){if(a){a.__touch.preventDefault&&b.preventDefault&&b.preventDefault();var c=b.type,d=b.pointerId,e=a.__touch.activeIDs;if("MSPointerDown"==c||"pointerdown"==c){if(b.srcElement!=a.canvas)return;e[d]=!0,this._handleStart(a,d,b,b.pageX,b.pageY)}else e[d]&&("MSPointerMove"==c||"pointermove"==c?this._handleMove(a,d,b,b.pageX,b.pageY):("MSPointerUp"==c||"MSPointerCancel"==c||"pointerup"==c||"pointercancel"==c)&&(delete e[d],this._handleEnd(a,d,b)))}},a._handleStart=function(a,b,c,d,e){var f=a.__touch;if(f.multitouch||!f.count){var g=f.pointers;g[b]||(g[b]=!0,f.count++,a._handlePointerDown(b,c,d,e))}},a._handleMove=function(a,b,c,d,e){a.__touch.pointers[b]&&a._handlePointerMove(b,c,d,e)},a._handleEnd=function(a,b,c){var d=a.__touch,e=d.pointers;e[b]&&(d.count--,a._handlePointerUp(b,c,!0),delete e[b])},createjs.Touch=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=createjs.EaselJS=createjs.EaselJS||{};a.version="NEXT",a.buildDate="Thu, 21 May 2015 16:16:14 GMT"}();;
// Copyright (c) 2008-2013, Andrew Brehaut, Tim Baumann, Matt Wilson,
//                          Simon Heimler, Michel Vielmetter
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above copyright notice,
//   this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

// color.js - version 1.0.1
//
// HSV <-> RGB code based on code from http://www.cs.rit.edu/~ncs/color/t_convert.html
// object function created by Douglas Crockford.
// Color scheme degrees taken from the colorjack.com colorpicker
//
// HSL support kindly provided by Tim Baumann - http://github.com/timjb

// create namespaces
/*global net */
if ("undefined" == typeof net) { var net = {}; }
if (!net.brehaut) { net.brehaut = {}; }

// this module function is called with net.brehaut as 'this'
(function ( ) {
  "use strict";
  // Constants

  // css_colors maps color names onto their hex values
  // these names are defined by W3C
  var css_colors = {aliceblue:'#F0F8FF',antiquewhite:'#FAEBD7',aqua:'#00FFFF',aquamarine:'#7FFFD4',azure:'#F0FFFF',beige:'#F5F5DC',bisque:'#FFE4C4',black:'#000000',blanchedalmond:'#FFEBCD',blue:'#0000FF',blueviolet:'#8A2BE2',brown:'#A52A2A',burlywood:'#DEB887',cadetblue:'#5F9EA0',chartreuse:'#7FFF00',chocolate:'#D2691E',coral:'#FF7F50',cornflowerblue:'#6495ED',cornsilk:'#FFF8DC',crimson:'#DC143C',cyan:'#00FFFF',darkblue:'#00008B',darkcyan:'#008B8B',darkgoldenrod:'#B8860B',darkgray:'#A9A9A9',darkgrey:'#A9A9A9',darkgreen:'#006400',darkkhaki:'#BDB76B',darkmagenta:'#8B008B',darkolivegreen:'#556B2F',darkorange:'#FF8C00',darkorchid:'#9932CC',darkred:'#8B0000',darksalmon:'#E9967A',darkseagreen:'#8FBC8F',darkslateblue:'#483D8B',darkslategray:'#2F4F4F',darkslategrey:'#2F4F4F',darkturquoise:'#00CED1',darkviolet:'#9400D3',deeppink:'#FF1493',deepskyblue:'#00BFFF',dimgray:'#696969',dimgrey:'#696969',dodgerblue:'#1E90FF',firebrick:'#B22222',floralwhite:'#FFFAF0',forestgreen:'#228B22',fuchsia:'#FF00FF',gainsboro:'#DCDCDC',ghostwhite:'#F8F8FF',gold:'#FFD700',goldenrod:'#DAA520',gray:'#808080',grey:'#808080',green:'#008000',greenyellow:'#ADFF2F',honeydew:'#F0FFF0',hotpink:'#FF69B4',indianred:'#CD5C5C',indigo:'#4B0082',ivory:'#FFFFF0',khaki:'#F0E68C',lavender:'#E6E6FA',lavenderblush:'#FFF0F5',lawngreen:'#7CFC00',lemonchiffon:'#FFFACD',lightblue:'#ADD8E6',lightcoral:'#F08080',lightcyan:'#E0FFFF',lightgoldenrodyellow:'#FAFAD2',lightgray:'#D3D3D3',lightgrey:'#D3D3D3',lightgreen:'#90EE90',lightpink:'#FFB6C1',lightsalmon:'#FFA07A',lightseagreen:'#20B2AA',lightskyblue:'#87CEFA',lightslategray:'#778899',lightslategrey:'#778899',lightsteelblue:'#B0C4DE',lightyellow:'#FFFFE0',lime:'#00FF00',limegreen:'#32CD32',linen:'#FAF0E6',magenta:'#FF00FF',maroon:'#800000',mediumaquamarine:'#66CDAA',mediumblue:'#0000CD',mediumorchid:'#BA55D3',mediumpurple:'#9370D8',mediumseagreen:'#3CB371',mediumslateblue:'#7B68EE',mediumspringgreen:'#00FA9A',mediumturquoise:'#48D1CC',mediumvioletred:'#C71585',midnightblue:'#191970',mintcream:'#F5FFFA',mistyrose:'#FFE4E1',moccasin:'#FFE4B5',navajowhite:'#FFDEAD',navy:'#000080',oldlace:'#FDF5E6',olive:'#808000',olivedrab:'#6B8E23',orange:'#FFA500',orangered:'#FF4500',orchid:'#DA70D6',palegoldenrod:'#EEE8AA',palegreen:'#98FB98',paleturquoise:'#AFEEEE',palevioletred:'#D87093',papayawhip:'#FFEFD5',peachpuff:'#FFDAB9',peru:'#CD853F',pink:'#FFC0CB',plum:'#DDA0DD',powderblue:'#B0E0E6',purple:'#800080',rebeccapurple:'#663399',red:'#FF0000',rosybrown:'#BC8F8F',royalblue:'#4169E1',saddlebrown:'#8B4513',salmon:'#FA8072',sandybrown:'#F4A460',seagreen:'#2E8B57',seashell:'#FFF5EE',sienna:'#A0522D',silver:'#C0C0C0',skyblue:'#87CEEB',slateblue:'#6A5ACD',slategray:'#708090',slategrey:'#708090',snow:'#FFFAFA',springgreen:'#00FF7F',steelblue:'#4682B4',tan:'#D2B48C',teal:'#008080',thistle:'#D8BFD8',tomato:'#FF6347',turquoise:'#40E0D0',violet:'#EE82EE',wheat:'#F5DEB3',white:'#FFFFFF',whitesmoke:'#F5F5F5',yellow:'#FFFF00',yellowgreen:'#9ACD32'};

  // CSS value regexes, according to http://www.w3.org/TR/css3-values/
  var css_integer = '(?:\\+|-)?\\d+';
  var css_float = '(?:\\+|-)?\\d*\\.\\d+';
  var css_number = '(?:' + css_integer + ')|(?:' + css_float + ')';
  css_integer = '(' + css_integer + ')';
  css_float = '(' + css_float + ')';
  css_number = '(' + css_number + ')';
  var css_percentage = css_number + '%';
  var css_whitespace = '\\s*?';

  // http://www.w3.org/TR/2003/CR-css3-color-20030514/
  var hsl_hsla_regex = new RegExp([
    '^hsl(a?)\\(', css_number, ',', css_percentage, ',', css_percentage, '(,(', css_number, '))?\\)$'
  ].join(css_whitespace) );
  var rgb_rgba_integer_regex = new RegExp([
    '^rgb(a?)\\(', css_integer, ',', css_integer, ',', css_integer, '(,(', css_number, '))?\\)$'
  ].join(css_whitespace) );
  var rgb_rgba_percentage_regex = new RegExp([
    '^rgb(a?)\\(', css_percentage, ',', css_percentage, ',', css_percentage, '(,(', css_number, '))?\\)$'
  ].join(css_whitespace) );

  // Package wide variables

  // becomes the top level prototype object
  var color;

  /* registered_models contains the template objects for all the
   * models that have been registered for the color class.
   */
  var registered_models = [];


  /* factories contains methods to create new instance of
   * different color models that have been registered.
   */
  var factories = {};

  // Utility functions

  /* object is Douglas Crockfords object function for prototypal
   * inheritance.
   */
  if (!this.object) {
    this.object = function (o) {
      function F () { }
      F.prototype = o;
      return new F();
    };
  }
  var object = this.object;

  /* takes a value, converts to string if need be, then pads it
   * to a minimum length.
   */
  function pad ( val, len ) {
    val = val.toString();
    var padded = [];

    for (var i = 0, j = Math.max( len - val.length, 0); i < j; i++) {
      padded.push('0');
    }

    padded.push(val);
    return padded.join('');
  }


  /* takes a string and returns a new string with the first letter
   * capitalised
   */
  function capitalise ( s ) {
    return s.slice(0,1).toUpperCase() + s.slice(1);
  }

  /* removes leading and trailing whitespace
   */
  function trim ( str ) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  /* used to apply a method to object non-destructively by
   * cloning the object and then apply the method to that
   * new object
   */
  function cloneOnApply( meth ) {
    return function ( ) {
      var cloned = this.clone();
      meth.apply(cloned, arguments);
      return cloned;
    };
  }


  /* registerModel is used to add additional representations
   * to the color code, and extend the color API with the new
   * operation that model provides. see before for examples
   */
  function registerModel( name, model ) {
    var proto = object(color);
    var fields = []; // used for cloning and generating accessors

    var to_meth = 'to'+ capitalise(name);

    function convertAndApply( meth ) {
      return function ( ) {
        return meth.apply(this[to_meth](), arguments);
      };
    }

    for (var key in model) if (model.hasOwnProperty(key)) {
      proto[key] = model[key];
      var prop = proto[key];

      if (key.slice(0,1) == '_') { continue; }
      if (!(key in color) && "function" == typeof prop) {
        // the method found on this object is a) public and b) not
        // currently supported by the color object. Create an impl that
        // calls the toModel function and passes that new object
        // onto the correct method with the args.
        color[key] = convertAndApply(prop);
      }
      else if ("function" != typeof prop) {
        // we have found a public property. create accessor methods
        // and bind them up correctly
        fields.push(key);
        var getter = 'get'+capitalise(key);
        var setter = 'set'+capitalise(key);

        color[getter] = convertAndApply(
          proto[getter] = (function ( key ) {
            return function ( ) {
              return this[key];
            };
          })( key )
        );

        color[setter] = convertAndApply(
          proto[setter] = (function ( key ) {
            return function ( val ) {
              var cloned = this.clone();
              cloned[key] = val;
              return cloned;
            };
          })( key )
        );
      }
    } // end of for over model

    // a method to create a new object - largely so prototype chains dont
    // get insane. This uses an unrolled 'object' so that F is cached
    // for later use. this is approx a 25% speed improvement
    function F () { }
    F.prototype = proto;
    function factory ( ) {
      return new F();
    }
    factories[name] = factory;

    proto.clone = function () {
      var cloned = factory();
      for (var i = 0, j = fields.length; i < j; i++) {
        var key = fields[i];
        cloned[key] = this[key];
      }
      return cloned;
    };

    color[to_meth] = function ( ) {
      return factory();
    };

    registered_models.push(proto);

    return proto;
  }// end of registerModel

  // Template Objects

  /* color is the root object in the color hierarchy. It starts
   * life as a very simple object, but as color models are
   * registered it has methods programmatically added to manage
   * conversions as needed.
   */
  color = {
    /* fromObject takes an argument and delegates to the internal
     * color models to try to create a new instance.
     */
    fromObject: function ( o ) {
      if (!o) {
        return object(color);
      }

      for (var i = 0, j = registered_models.length; i < j; i++) {
        var nu = registered_models[i].fromObject(o);
        if (nu) {
          return nu;
        }
      }

      return object(color);
    },

    toString: function ( ) {
      return this.toCSS();
    }
  };

  var transparent = null; // defined with an RGB later.

  /* RGB is the red green blue model. This definition is converted
   * to a template object by registerModel.
   */
  registerModel('RGB', {
    red:    0,
    green:  0,
    blue:   0,
    alpha:  0,

    /* getLuminance returns a value between 0 and 1, this is the
     * luminance calcuated according to
     * http://www.poynton.com/notes/colour_and_gamma/ColorFAQ.html#RTFToC9
     */
    getLuminance: function ( ) {
      return (this.red * 0.2126) + (this.green * 0.7152) + (this.blue * 0.0722);
    },

    /* does an alpha based blend of color onto this. alpha is the
     * amount of 'color' to use. (0 to 1)
     */
    blend: function ( color , alpha ) {
      color = color.toRGB();
      alpha = Math.min(Math.max(alpha, 0), 1);
      var rgb = this.clone();

      rgb.red = (rgb.red * (1 - alpha)) + (color.red * alpha);
      rgb.green = (rgb.green * (1 - alpha)) + (color.green * alpha);
      rgb.blue = (rgb.blue * (1 - alpha)) + (color.blue * alpha);
      rgb.alpha = (rgb.alpha * (1 - alpha)) + (color.alpha * alpha);

      return rgb;
    },

    /* fromObject attempts to convert an object o to and RGB
     * instance. This accepts an object with red, green and blue
     * members or a string. If the string is a known CSS color name
     * or a hexdecimal string it will accept it.
     */
    fromObject: function ( o ) {
      if (o instanceof Array) {
        return this._fromRGBArray ( o );
      }
      if ("string" == typeof o) {
        return this._fromCSS( trim( o ) );
      }
      if (o.hasOwnProperty('red') &&
          o.hasOwnProperty('green') &&
          o.hasOwnProperty('blue')) {
        return this._fromRGB ( o );
      }
      // nothing matchs, not an RGB object
    },

    _stringParsers: [
        // CSS RGB(A) literal:
        function ( css ) {
          css = trim(css);

          var withInteger = match(rgb_rgba_integer_regex, 255);
          if(withInteger) {
            return withInteger;
          }
          return match(rgb_rgba_percentage_regex, 100);

          function match(regex, max_value) {
            var colorGroups = css.match( regex );

            // If there is an "a" after "rgb", there must be a fourth parameter and the other way round
            if (!colorGroups || (!!colorGroups[1] + !!colorGroups[5] === 1)) {
              return null;
            }

            var rgb = factories.RGB();
            rgb.red   = Math.min(1, Math.max(0, colorGroups[2] / max_value));
            rgb.green = Math.min(1, Math.max(0, colorGroups[3] / max_value));
            rgb.blue  = Math.min(1, Math.max(0, colorGroups[4] / max_value));
            rgb.alpha = !!colorGroups[5] ? Math.min(Math.max(parseFloat(colorGroups[6]), 0), 1) : 1;

            return rgb;
          }
        },

        function ( css ) {
            var lower = css.toLowerCase();
            if (lower in css_colors) {
              css = css_colors[lower];
            }

            if (!css.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)) {
              return;
            }

            css = css.replace(/^#/,'');

            var bytes = css.length / 3;

            var max = Math.pow(16, bytes) - 1;

            var rgb = factories.RGB();
            rgb.red =   parseInt(css.slice(0, bytes), 16) / max;
            rgb.green = parseInt(css.slice(bytes * 1,bytes * 2), 16) / max;
            rgb.blue =  parseInt(css.slice(bytes * 2), 16) / max;
            rgb.alpha = 1;
            return rgb;
        },

        function ( css ) {
            if (css.toLowerCase() !== 'transparent') return;

            return transparent;
        }
    ],

    _fromCSS: function ( css ) {
      var color = null;
      for (var i = 0, j = this._stringParsers.length; i < j; i++) {
          color = this._stringParsers[i](css);
          if (color) return color;
      }
    },

    _fromRGB: function ( RGB ) {
      var newRGB = factories.RGB();

      newRGB.red = RGB.red;
      newRGB.green = RGB.green;
      newRGB.blue = RGB.blue;
      newRGB.alpha = RGB.hasOwnProperty('alpha') ? RGB.alpha : 1;

      return newRGB;
    },

    _fromRGBArray: function ( RGB ) {
      var newRGB = factories.RGB();

      newRGB.red = Math.max(0, Math.min(1, RGB[0] / 255));
      newRGB.green = Math.max(0, Math.min(1, RGB[1] / 255));
      newRGB.blue = Math.max(0, Math.min(1, RGB[2] / 255));
      newRGB.alpha = RGB[3] !== undefined ? Math.max(0, Math.min(1, RGB[3])) : 1;

      return newRGB;
    },

    // convert to a CSS string. defaults to two bytes a value
    toCSSHex: function ( bytes ) {
        bytes = bytes || 2;

        var max = Math.pow(16, bytes) - 1;
        var css = [
          "#",
          pad ( Math.round(this.red * max).toString( 16 ).toUpperCase(), bytes ),
          pad ( Math.round(this.green * max).toString( 16 ).toUpperCase(), bytes ),
          pad ( Math.round(this.blue * max).toString( 16 ).toUpperCase(), bytes )
        ];

        return css.join('');
    },

    toCSS: function ( bytes ) {
      if (this.alpha === 1) return this.toCSSHex(bytes);

      var max = 255;

      var components = [
        'rgba(',
        Math.max(0, Math.min(max, Math.round(this.red * max))), ',',
        Math.max(0, Math.min(max, Math.round(this.green * max))), ',',
        Math.max(0, Math.min(max, Math.round(this.blue * max))), ',',
        Math.max(0, Math.min(1, this.alpha)),
        ')'
      ];

      return components.join('');
    },

    toHSV: function ( ) {
      var hsv = factories.HSV();
      var min, max, delta;

      min = Math.min(this.red, this.green, this.blue);
      max = Math.max(this.red, this.green, this.blue);
      hsv.value = max; // v

      delta = max - min;

      if( delta == 0 ) { // white, grey, black
        hsv.hue = hsv.saturation = 0;
      }
      else { // chroma
        hsv.saturation = delta / max;

        if( this.red == max ) {
          hsv.hue = ( this.green - this.blue ) / delta; // between yellow & magenta
        }
        else if( this.green  == max ) {
          hsv.hue = 2 + ( this.blue - this.red ) / delta; // between cyan & yellow
        }
        else {
          hsv.hue = 4 + ( this.red - this.green ) / delta; // between magenta & cyan
        }

        hsv.hue = ((hsv.hue * 60) + 360) % 360; // degrees
      }

      hsv.alpha = this.alpha;

      return hsv;
    },
    toHSL: function ( ) {
      return this.toHSV().toHSL();
    },

    toRGB: function ( ) {
      return this.clone();
    }
  });

  transparent = color.fromObject({red: 0, blue: 0, green: 0, alpha: 0});


  /* Like RGB above, this object describes what will become the HSV
   * template object. This model handles hue, saturation and value.
   * hue is the number of degrees around the color wheel, saturation
   * describes how much color their is and value is the brightness.
   */
  registerModel('HSV', {
    hue: 0,
    saturation: 0,
    value: 1,
    alpha: 1,

    shiftHue: cloneOnApply(function ( degrees ) {
      var hue = (this.hue + degrees) % 360;
      if (hue < 0) {
        hue = (360 + hue) % 360;
      }

      this.hue = hue;
    }),

    devalueByAmount: cloneOnApply(function ( val ) {
      this.value = Math.min(1, Math.max(this.value - val, 0));
    }),

    devalueByRatio: cloneOnApply(function ( val ) {
      this.value = Math.min(1, Math.max(this.value * (1 - val), 0));
    }),

    valueByAmount: cloneOnApply(function ( val ) {
      this.value = Math.min(1, Math.max(this.value + val, 0));
    }),

    valueByRatio: cloneOnApply(function ( val ) {
      this.value = Math.min(1, Math.max(this.value * (1 + val), 0));
    }),

    desaturateByAmount: cloneOnApply(function ( val ) {
      this.saturation = Math.min(1, Math.max(this.saturation - val, 0));
    }),

    desaturateByRatio: cloneOnApply(function ( val ) {
      this.saturation = Math.min(1, Math.max(this.saturation * (1 - val), 0));
    }),

    saturateByAmount: cloneOnApply(function ( val ) {
      this.saturation = Math.min(1, Math.max(this.saturation + val, 0));
    }),

    saturateByRatio: cloneOnApply(function ( val ) {
      this.saturation = Math.min(1, Math.max(this.saturation * (1 + val), 0));
    }),

    schemeFromDegrees: function ( degrees ) {
      var newColors = [];
      for (var i = 0, j = degrees.length; i < j; i++) {
        var col = this.clone();
        col.hue = (this.hue + degrees[i]) % 360;
        newColors.push(col);
      }
      return newColors;
    },

    complementaryScheme: function ( ) {
      return this.schemeFromDegrees([0,180]);
    },

    splitComplementaryScheme: function ( ) {
      return this.schemeFromDegrees([0,150,320]);
    },

    splitComplementaryCWScheme: function ( ) {
      return this.schemeFromDegrees([0,150,300]);
    },

    splitComplementaryCCWScheme: function ( ) {
      return this.schemeFromDegrees([0,60,210]);
    },

    triadicScheme: function ( ) {
      return this.schemeFromDegrees([0,120,240]);
    },

    clashScheme: function ( ) {
      return this.schemeFromDegrees([0,90,270]);
    },

    tetradicScheme: function ( ) {
      return this.schemeFromDegrees([0,90,180,270]);
    },

    fourToneCWScheme: function ( ) {
      return this.schemeFromDegrees([0,60,180,240]);
    },

    fourToneCCWScheme: function ( ) {
      return this.schemeFromDegrees([0,120,180,300]);
    },

    fiveToneAScheme: function ( ) {
      return this.schemeFromDegrees([0,115,155,205,245]);
    },

    fiveToneBScheme: function ( ) {
      return this.schemeFromDegrees([0,40,90,130,245]);
    },

    fiveToneCScheme: function ( ) {
      return this.schemeFromDegrees([0,50,90,205,320]);
    },

    fiveToneDScheme: function ( ) {
      return this.schemeFromDegrees([0,40,155,270,310]);
    },

    fiveToneEScheme: function ( ) {
      return this.schemeFromDegrees([0,115,230,270,320]);
    },

    sixToneCWScheme: function ( ) {
      return this.schemeFromDegrees([0,30,120,150,240,270]);
    },

    sixToneCCWScheme: function ( ) {
      return this.schemeFromDegrees([0,90,120,210,240,330]);
    },

    neutralScheme: function ( ) {
      return this.schemeFromDegrees([0,15,30,45,60,75]);
    },

    analogousScheme: function ( ) {
      return this.schemeFromDegrees([0,30,60,90,120,150]);
    },

    fromObject: function ( o ) {
      if (o.hasOwnProperty('hue') &&
          o.hasOwnProperty('saturation') &&
          o.hasOwnProperty('value')) {
        var hsv = factories.HSV();

        hsv.hue = o.hue;
        hsv.saturation = o.saturation;
        hsv.value = o.value;
        hsv.alpha = o.hasOwnProperty('alpha') ? o.alpha : 1;

        return hsv;
      }
      // nothing matches, not an HSV object
      return null;
    },

    _normalise: function ( ) {
       this.hue %= 360;
       this.saturation = Math.min(Math.max(0, this.saturation), 1);
       this.value = Math.min(Math.max(0, this.value));
       this.alpha = Math.min(1, Math.max(0, this.alpha));
    },

    toRGB: function ( ) {
      this._normalise();

      var rgb = factories.RGB();
      var i;
      var f, p, q, t;

      if( this.saturation === 0 ) {
        // achromatic (grey)
        rgb.red = this.value;
        rgb.green = this.value;
        rgb.blue = this.value;
        rgb.alpha = this.alpha;
        return rgb;
      }

      var h = this.hue / 60;			// sector 0 to 5
      i = Math.floor( h );
      f = h - i;			// factorial part of h
      p = this.value * ( 1 - this.saturation );
      q = this.value * ( 1 - this.saturation * f );
      t = this.value * ( 1 - this.saturation * ( 1 - f ) );

      switch( i ) {
        case 0:
          rgb.red = this.value;
          rgb.green = t;
          rgb.blue = p;
          break;
        case 1:
          rgb.red = q;
          rgb.green = this.value;
          rgb.blue = p;
          break;
        case 2:
          rgb.red = p;
          rgb.green = this.value;
          rgb.blue = t;
          break;
        case 3:
          rgb.red = p;
          rgb.green = q;
          rgb.blue = this.value;
          break;
        case 4:
          rgb.red = t;
          rgb.green = p;
          rgb.blue = this.value;
          break;
        default:		// case 5:
          rgb.red = this.value;
          rgb.green = p;
          rgb.blue = q;
          break;
      }

      rgb.alpha = this.alpha;

      return rgb;
    },
    toHSL: function() {
      this._normalise();

      var hsl = factories.HSL();

      hsl.hue = this.hue;
      var l = (2 - this.saturation) * this.value,
          s = this.saturation * this.value;
      if(l && 2 - l) {
        s /= (l <= 1) ? l : 2 - l;
      }
      l /= 2;
      hsl.saturation = s;
      hsl.lightness = l;
      hsl.alpha = this.alpha;

      return hsl;
    },

    toHSV: function ( ) {
      return this.clone();
    }
  });

  registerModel('HSL', {
    hue: 0,
    saturation: 0,
    lightness: 0,
    alpha: 1,

    darkenByAmount: cloneOnApply(function ( val ) {
      this.lightness = Math.min(1, Math.max(this.lightness - val, 0));
    }),

    darkenByRatio: cloneOnApply(function ( val ) {
      this.lightness = Math.min(1, Math.max(this.lightness * (1 - val), 0));
    }),

    lightenByAmount: cloneOnApply(function ( val ) {
      this.lightness = Math.min(1, Math.max(this.lightness + val, 0));
    }),

    lightenByRatio: cloneOnApply(function ( val ) {
      this.lightness = Math.min(1, Math.max(this.lightness * (1 + val), 0));
    }),

    fromObject: function ( o ) {
      if ("string" == typeof o) {
        return this._fromCSS( o );
      }
      if (o.hasOwnProperty('hue') &&
          o.hasOwnProperty('saturation') &&
          o.hasOwnProperty('lightness')) {
        return this._fromHSL ( o );
      }
      // nothing matchs, not an RGB object
    },

    _fromCSS: function ( css ) {
      var colorGroups = trim( css ).match( hsl_hsla_regex );

      // if there is an "a" after "hsl", there must be a fourth parameter and the other way round
      if (!colorGroups || (!!colorGroups[1] + !!colorGroups[5] === 1)) {
        return null;
      }

      var hsl = factories.HSL();
      hsl.hue        = (colorGroups[2] % 360 + 360) % 360;
      hsl.saturation = Math.max(0, Math.min(parseInt(colorGroups[3], 10) / 100, 1));
      hsl.lightness  = Math.max(0, Math.min(parseInt(colorGroups[4], 10) / 100, 1));
      hsl.alpha      = !!colorGroups[5] ? Math.max(0, Math.min(1, parseFloat(colorGroups[6]))) : 1;

      return hsl;
    },

    _fromHSL: function ( HSL ) {
      var newHSL = factories.HSL();

      newHSL.hue = HSL.hue;
      newHSL.saturation = HSL.saturation;
      newHSL.lightness = HSL.lightness;

      newHSL.alpha = HSL.hasOwnProperty('alpha') ? HSL.alpha : 1;

      return newHSL;
    },

    _normalise: function ( ) {
       this.hue = (this.hue % 360 + 360) % 360;
       this.saturation = Math.min(Math.max(0, this.saturation), 1);
       this.lightness = Math.min(Math.max(0, this.lightness));
       this.alpha = Math.min(1, Math.max(0, this.alpha));
    },

    toHSL: function() {
      return this.clone();
    },
    toHSV: function() {
      this._normalise();

      var hsv = factories.HSV();

      // http://ariya.blogspot.com/2008/07/converting-between-hsl-and-hsv.html
      hsv.hue = this.hue; // H
      var l = 2 * this.lightness,
          s = this.saturation * ((l <= 1) ? l : 2 - l);
      hsv.value = (l + s) / 2; // V
      hsv.saturation = ((2 * s) / (l + s)) || 0; // S
      hsv.alpha = this.alpha;

      return hsv;
    },
    toRGB: function() {
      return this.toHSV().toRGB();
    }
  });

  // Package specific exports

  /* the Color function is a factory for new color objects.
   */
  function Color( o ) {
    return color.fromObject( o );
  }
  Color.isValid = function( str ) {
    var key, c = Color( str );

    var length = 0;
    for(key in c) {
      if(c.hasOwnProperty(key)) {
        length++;
      }
    }

    return length > 0;
  };
  net.brehaut.Color = Color;
}).call(net.brehaut);

/* Export to CommonJS
*/
if(typeof module !== 'undefined') {
  module.exports = net.brehaut.Color;
};
/*
 Colors JS Library v1.2.4
 Copyright 2012-2013 Matt Jordan
 Licensed under Creative Commons Attribution-ShareAlike 3.0 Unported. (http://creativecommons.org/licenses/by-sa/3.0/)
 https://github.com/mbjordan/Colors
*/
(function(n){var l={},g={};l.render=function(a,b){var d={},c;if("object"==typeof a)return"rgb"===b&&(c=["R","G","B","RGB"]),"hsv"===b&&(c=["H","S","V","HSV"]),"hsl"===b&&(c=["H","S","L","HSL"]),d[c[0]]=a[0],d[c[1]]=a[1],d[c[2]]=a[2],d[c[3]]=a[0]+" "+a[1]+" "+a[2],d.a=a,d};l.paddedHex=function(a){a=(10>a?"0":"")+a.toString(16);return 1===a.length?"0"+a:a};Number.prototype.round=function(a){return parseFloat(this.toFixed(a||10))};g.rgb2hex=function(a,b,d){a=l.paddedHex(a);b=void 0!==b?l.paddedHex(b):
a;d=void 0!==d?l.paddedHex(d):a;return"#"+a+b+d};g.hex2rgb=function(a){a=a.replace("#","");return 6===a.length?l.render([parseInt(a.substr(0,2),16),parseInt(a.substr(2,2),16),parseInt(a.substr(4,2),16)],"rgb"):parseInt(a,16)};g.hex2hsv=function(a){a="#"==a.charAt(0)?a.substring(1,7):a;var b=parseInt(a.substring(0,2),16)/255,d=parseInt(a.substring(2,4),16)/255;a=parseInt(a.substring(4,6),16)/255;var c=0,e=0,h=0,e=Math.min(b,d,a),k=Math.max(b,d,a),f=k-e,m,g,h=k;0===f?e=c=0:(e=f/k,m=((k-b)/6+f/2)/f,
g=((k-d)/6+f/2)/f,f=((k-a)/6+f/2)/f,b==k?c=f-g:d==k?c=1/3+m-f:a==k&&(c=2/3+g-m),0>c&&(c+=1),1<c&&(c-=1));return l.render([Math.round(360*c),Math.round(100*e),Math.round(100*h)],"hsv")};g.hsv2rgb=function(a,b,d){var c=[],e,h,k;"object"==typeof a?(e=a[0],b=a[1],a=a[2]):(e=a,a=d);b/=100;a/=100;d=Math.floor(e/60%6);h=e/60-d;e=a*(1-b);k=a*(1-h*b);b=a*(1-(1-h)*b);switch(d){case 0:c=[a,b,e];break;case 1:c=[k,a,e];break;case 2:c=[e,a,b];break;case 3:c=[e,k,a];break;case 4:c=[b,e,a];break;case 5:c=[a,e,k]}return l.render([Math.min(255,
Math.floor(256*c[0])),Math.min(255,Math.floor(256*c[1])),Math.min(255,Math.floor(256*c[2]))],"rgb")};g.rgb2hsl=function(a,b,d){var c,e,h,k,f;"object"===typeof a?(c=a[0],b=a[1],a=a[2]):(c=a,a=d);c/=255;b/=255;a/=255;d=Math.max(c,b,a);e=Math.min(c,b,a);k=(d+e)/2;if(d==e)h=e=0;else{f=d-e;e=0.5<k?f/(2-d-e):f/(d+e);switch(d){case c:h=(b-a)/f+(b<a?6:0);break;case b:h=(a-c)/f+2;break;case a:h=(c-b)/f+4}h/=6}return l.render([Math.floor(360*h),(100*e).round(1),(100*k).round(1)],"hsl")};g.hsv2hsl=function(a,
b,d){var c,e,h,k,f,g;"object"==typeof a?(c=a[0],e=a[1],h=a[2]):(c=a,e=b,h=d);h=this.hsv2rgb(c,e,h);c=h.R/255;e=h.G/255;k=h.B/255;f=Math.max(c,e,k);g=Math.min(c,e,k);h=(f+g)/2;f!=g&&(b=0.5>h?(f-g)/(f+g):(f-g)/(2-f-g),a=c==f?(e-k)/(f-g):e==f?2+(k-c)/(f-g):4+(c-e)/(f-g));return l.render([Math.floor(a),Math.floor(b),Math.floor(d)],"hsl")};g.name2hex=function(a){a=a.toLowerCase();a={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",
black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",
darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",
hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",
lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",
orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",
snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"}[a];return void 0===a?"Invalid Color Name":a};g.name2rgb=function(a){a=this.name2hex(a);return/^[a-fA-F0-9#]{7}$/.test(a)?this.hex2rgb(a):l.render(["Invalid Color Name","Invalid Color Name","Invalid Color Name"],"rgb")};g.name2hsv=function(a){a=this.name2hex(a);
return/^[a-fA-F0-9#]{7}$/.test(a)?this.hex2hsv(a):l.render(["Invalid Color Name","Invalid Color Name","Invalid Color Name"],"hsv")};g.complement=function(a,b,d){var c;if("string"==typeof a&&/(#([A-Fa-f0-9]){3}(([A-Fa-f0-9]){3})?)/.test(a))return a=a.replace("#",""),b="#",6===a.length&&(b+=l.paddedHex(255-this.hex2rgb(a.substr(0,2))),b+=l.paddedHex(255-this.hex2rgb(a.substr(2,2))),b+=l.paddedHex(255-this.hex2rgb(a.substr(4,2)))),3===a.length&&(b+=l.paddedHex(255-this.hex2rgb(a.substr(0,1)+a.substr(0,
1))),b+=l.paddedHex(255-this.hex2rgb(a.substr(1,1)+a.substr(1,1))),b+=l.paddedHex(255-this.hex2rgb(a.substr(2,1)+a.substr(2,1)))),b;void 0!==a&&void 0!==b&&void 0!==d&&(c=[255-a,255-b,255-d]);"object"==typeof a&&(c=[255-a[0],255-a[1],255-a[2]]);return l.render(c,"rgb")};g.rand=function(a){var b,d;if("hex"===a||void 0===a){a="";for(d=0;6>d;d++)b=Math.floor(16*Math.random()),a+="0123456789abcdef".substring(b,b+1);return"#"+a}if("rgb"==a)return a=Math.floor(-254*Math.random()+255),b=Math.floor(-254*
Math.random()+255),d=Math.floor(-254*Math.random()+255),l.render([a,b,d],"rgb")};n.Colors=n.$c=g})(window);;
//Jay's math helpers
_.mixin({ deepClone: function (p_object) {
    return JSON.parse(JSON.stringify(p_object));
} });

var maths = {};
maths.clamp = function (number, min, max) {
    return Math.min(Math.max(number, min), max);
};
maths.heightOnSin = function (theta_min, theta_max, step, steps, amplitude, func) {
    func = func || Math.sin; //Find the Sin value by default, you can also pass in Math.cos

    var percent = step / steps;
    var theta = theta_min + ((theta_max - theta_min) * percent);
    return Math.sin(theta * Math.PI) * amplitude;
};
maths.sizeFromAmountRange = function (size_min, size_max, amount, amount_min, amount_max) {
    var percent = (amount - amount_min) / (amount_max - amount_min);
    return size_min + (percent * (size_max - size_min));
};
maths.colorBlendFromAmountRange = function (color_start, color_end, amount, amount_min, amount_max) {
    var percent = (amount - amount_min) / (amount_max - amount_min);

    if (color_start.substring(0, 1) == "#") color_start = color_start.substring(1, 7);
    if (color_end.substring(0, 1) == "#") color_end = color_end.substring(1, 7);

    var s_r = color_start.substring(0, 2);
    var s_g = color_start.substring(2, 4);
    var s_b = color_start.substring(4, 6);
    var e_r = color_end.substring(0, 2);
    var e_g = color_end.substring(2, 4);
    var e_b = color_end.substring(4, 6);

    var n_r = Math.abs(parseInt((parseInt(s_r, 16) * percent) + (parseInt(e_r, 16) * (1 - percent))));
    var n_g = Math.abs(parseInt((parseInt(s_g, 16) * percent) + (parseInt(e_g, 16) * (1 - percent))));
    var n_b = Math.abs(parseInt((parseInt(s_b, 16) * percent) + (parseInt(e_b, 16) * (1 - percent))));
    var rgb = maths.decimalToHex(n_r) + maths.decimalToHex(n_g) + maths.decimalToHex(n_b);

    return "#" + rgb;
};
maths.decimalToHex = function (d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
};
maths.idealTextColor = function (bgColor) {

    var nThreshold = 150;
    var components = maths.getRGBComponents(bgColor);
    var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
};
maths.getRGBComponents = function (color) {

    var r = color.substring(1, 3);
    var g = color.substring(3, 5);
    var b = color.substring(5, 7);

    return {
        R: parseInt(r, 16),
        G: parseInt(g, 16),
        B: parseInt(b, 16)
    };
};
maths.hexColorToRGBA = function (color, transparency) {
    var rgb;
    if (!color) return "rgba(0,0,0,1)";
    var newColor, rgbArr;
    if (color.indexOf("rgb(")==0 && color.indexOf(",")>5) {
        //Is in format of rgb(215,159,102)
        newColor = color.substr(0, color.length - 1);
        newColor = newColor.substr(4);
        rgbArr = newColor.split(",");
        rgb = {R: rgbArr[0], G: rgbArr[1], B: rgbArr[2]}
    } else if (color.indexOf("rgba(")==0 && color.indexOf(",")>5) {
        //Is in format of rgba(215,159,102,.6)
        newColor = color.substr(0, color.length - 1);
        newColor = newColor.substr(5);
        rgbArr = newColor.split(",");
        rgb = {R: rgbArr[0], G: rgbArr[1], B: rgbArr[2]}
    } else if (color.indexOf("#")==0){
        rgb = maths.getRGBComponents(color);
    } else {
        //is likely a color name
        newColor = net.brehaut.Color(color).toString();
        rgb = maths.getRGBComponents(newColor);
    }
    transparency = transparency || 1;
    return "rgba(" + rgb.R + "," + rgb.G + "," + rgb.B + "," + transparency + ")";
};;
//--------------------------------------------
// Library of commonly used generic functions.
//--------------------------------------------

var Helpers = Helpers || {};
Helpers.between = function(s, prefix, suffix, suffixAtEnd, prefixAtEnd) {
    if (!s.lastIndexOf || !s.indexOf) {
        return s;
    }
    var i = prefixAtEnd ? s.lastIndexOf(prefix) : s.indexOf(prefix);
    if (i >= 0) {
        s = s.substring(i + prefix.length);
    }
    else {
        return '';
    }
    if (suffix) {
        i = suffixAtEnd ? s.lastIndexOf(suffix) : s.indexOf(suffix);
        if (i >= 0) {
            s = s.substring(0, i);
        }
        else {
            return '';
        }
    }
    return s;
};

Helpers.randomSetSeed = function(seed){
    Helpers._randseed = seed || 42;
};
Helpers.random = function(){
    Helpers._randseed = Helpers._randseed || 42;
    var x = Math.sin(Helpers._randseed++) * 10000;
    return x - Math.floor(x);
};
Helpers.randInt = function(max){
    max = max || 100;
    return parseInt(Helpers.random() * max +1);
};
Helpers.randOption = function(options){
    var len = options.length;
    return options[Helpers.randInt(len)-1];
};

Helpers.dateFromPythonDate=function(date,defaultVal){
    //Requires moment.js

    if (date == 'None') date=undefined;
    if (date == null) date=undefined;
    if (date == '') date=undefined;

    var output = defaultVal;
    if (date) {
        date = date.replace(/p.m./,'pm');
        date = date.replace(/a.m./,'am');
        date = date.replace(/\. /," ");
        //TODO: Get to work with Zulu times
        output = moment(date);
    }
    if (output && output.isValid && !output.isValid()) output = defaultVal || moment();
    return output;
};

Helpers.knownFileExt=function(ext){
    var exts = ",3gp,7z,ace,ai,aif,aiff,amr,asf,aspx,asx,bat,bin,bmp,bup,cab,cbr,cda,cdl,cdr,chm,dat,divx,dll,dmg,doc,docx,dss,dvf,dwg,eml,eps,exe,fla,flv,gif,gz,hqx,htm,html,ifo,indd,iso,jar,jp2,jpeg,jpg,kml,kmz,lnk,log,m4a,m4b,m4p,m4v,mcd,mdb,mid,mov,mp2,mp4,mpeg,mpg,msi,mswmm,ogg,pdf,png,pps,ppt,pptx,ps,psd,pst,ptb,pub,qbb,qbw,qxd,ram,rar,rm,rmvb,rtf,sea,ses,sit,sitx,ss,swf,tgz,thm,tif,tmp,torrent,ttf,txt,vcd,vob,wav,wma,wmv,wps,xls,xpi,zip,";
    return (exts.indexOf(","+ext+",") > -1);
};

Helpers.thousandsFormatter = function(num) {
    return num > 999 ? (num/1000).toFixed(1) + 'k' : num;
};
Helpers.invertColor=function(hexTripletColor) {
    var color = hexTripletColor;
    color = color.substring(1);           // remove #
    color = parseInt(color, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    color = color.toString(16);           // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color;                  // prepend #
    return color;
};
Helpers.rgb2hex=function(rgb) {
    if (typeof rgb != "string") return rgb;
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    if (rgb && rgb.search("rgb") == -1 ) {
        rgb = rgb.split(',');
        if (rgb.length>=3) {
            return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
        }
        return rgb;
    } else if (rgb) {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    } else {
        return rgb;
    }
};
Helpers.getRGBComponents=function(color) {
    var r = color.substring(1, 3),
        g = color.substring(3, 5),
        b = color.substring(5, 7);
    return {
        R: parseInt(r, 16),
        G: parseInt(g, 16),
        B: parseInt(b, 16)
    };
};
Helpers.idealTextColor=function(bgColor) {
    if (bgColor.length === 4) {
        bgColor = '#' + bgColor[1] + bgColor[1] + bgColor[2] + bgColor[2] + bgColor[3] + bgColor;
    }
    var nThreshold = 105,
        components = Helpers.getRGBComponents(bgColor),
        bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
};
Helpers.getColorWithBackground=function(bg_color,useInvertedInsteadOfBlackWhite){
    var color = Helpers.rgb2hex(bg_color);
    var overColor = useInvertedInsteadOfBlackWhite?Helpers.invertColor(color):Helpers.idealTextColor('#'+color);
    return overColor;
};

Helpers.getQueryString=function() {
    var result = {}, queryString = location.search.substring(1),
        re = /([^&=]+)=([^&]*)/g, m;
    while (m = re.exec(queryString)) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return result;
};
Helpers.exists=function() {
    //Check if variables exist
    var allExist = true;
    for( var i = 0; i < arguments.length; i++ ) {
        //TODO: Should it check for null as well?
        if (typeof arguments[i] == "undefined" ) { allExist = false; break;}
    }
    return allExist;
};
Helpers.upperCase=function(input,eachword) {
    if (typeof input == "undefined") return;

    if (eachword) {
        return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    } else {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }
};
Helpers.MakeSureClassExists= function (pointer){
    //usage: HelperFunctions.MakeSureClassExists('Settings.data');

    var classArr = pointer.split(".");

    var newClass = {};

    if (classArr.length && classArr.length > 0) {
        //It's a multiple-level class

        var rootClass = classArr[0];
        if (window[rootClass]) {
            newClass = window[rootClass];
        } else {
            eval(rootClass+' = {}');
        }

        var classEval = rootClass;
        for (var i=1;i<classArr.length;i++){
            //Loop through everything beyond the first level and make sub objects
            classEval += "['"+classArr[i]+"']";
            if (eval("typeof "+classEval) == 'undefined'){
                eval(classEval + " = {}")
            }
        }
    }
};
Helpers.dateCameBefore=function(dateToCheck){
    var isADate = false;
    var result = false;
    if (dateToCheck && dateToCheck.isValid){
        isADate=true;
    } else {
        dateToCheck=moment(dateToCheck);
    }
    if (dateToCheck && dateToCheck.isValid && dateToCheck.isValid()){
        var now = moment();
        var timeDiff =now.diff(dateToCheck);
        if (timeDiff > 0) result=true;
    } else {
        result = "Invalid Date";
    }
    return result;
};
Helpers.buildBootstrapDropdown=function(title,items){
    var $group = $("<span class='btn-group'>");
    $("<a class='btn dropdown-toggle btn-mini' data-toggle='dropdown' href='#'>"+title+"<span class='caret'></span></a>")
        .appendTo($group);
    var $ul =$("<ul class='dropdown-menu'>")
        .appendTo($group);
    _.each(items,function(dd){
        var $li = $("<li>").appendTo($ul);
        var $a =$("<a>")
            .attr({target:'_blank', alt:(dd.alt||dd.name||"")})
            .text(dd.title||"Item")
            .appendTo($li);
        if (dd.url){
            $a.attr({href:dd.href});
        }
        if (dd.onclick){
            $a.on('click',dd.onclick);
        }
    });
    return $group;
};
Helpers.buildBootstrapInputDropdown=function(title,items,$input){
    var $group = $("<span class='input-append btn-group'>");
    var $group_holder = $("<a class='btn dropdown-toggle btn-mini' data-toggle='dropdown' href='#'>")
        .css({float:"none"})
        .appendTo($group);
    var $group_title = $("<span>")
        .text(title)
        .appendTo($group_holder);
    $("<span>")
        .addClass('caret')
        .appendTo($group_holder);

    var $ul = $("<ul class='dropdown-menu'>")
        .appendTo($group);
    _.each(items,function(dd){
        var $li = $("<li>").appendTo($ul);
        var $a = $("<a>")
            .attr({alt:(dd.alt||dd.name||"")})
            .attr({href:"#"})
            .on('click',function(){
                var value = $(this).text();
                $input.val(value);
                $group_title.text(value);
            })
            .appendTo($li);
        if (dd.imgSrc){
            $("<img>")
                .attr({src:dd.imgSrc})
                .appendTo($a);
        }
        $('<span>')
            .text(dd.title||"Item")
            .appendTo($a);
    });
    return $group;
};
Helpers.tryToMakeDate=function(val,fieldName){
    var returnVal;
    var name = (fieldName && fieldName.toLowerCase) ? fieldName.toLowerCase() : "";

    if (name && (name=="date" || name=="created" || name=="updated" || name=="datetime")){
        var testDate = moment(val);
        if (testDate.isValid()) {
            returnVal = val + " <b>("+testDate.calendar()+")</b>";
        }
    }
    return (returnVal || val);
};
Helpers.randomLetters=function(n){
    var out = "";
    n = n || 1;
    for (var i=0;i<n;i++){
        out+=String.fromCharCode("a".charCodeAt(0)+(Math.random()*26)-1)
    }
    return out;
};
Helpers.pluralize=function(str){
    var uncountable_words= [
        'equipment', 'information', 'rice', 'money', 'species', 'series',
        'fish', 'sheep', 'moose', 'deer', 'news'
    ];
    var plural_rules= [
        [new RegExp('(m)an$', 'gi'),                 '$1en'],
        [new RegExp('(pe)rson$', 'gi'),              '$1ople'],
        [new RegExp('(child)$', 'gi'),               '$1ren'],
        [new RegExp('^(ox)$', 'gi'),                 '$1en'],
        [new RegExp('(ax|test)is$', 'gi'),           '$1es'],
        [new RegExp('(octop|vir)us$', 'gi'),         '$1i'],
        [new RegExp('(alias|status)$', 'gi'),        '$1es'],
        [new RegExp('(bu)s$', 'gi'),                 '$1ses'],
        [new RegExp('(buffal|tomat|potat)o$', 'gi'), '$1oes'],
        [new RegExp('([ti])um$', 'gi'),              '$1a'],
        [new RegExp('sis$', 'gi'),                   'ses'],
        [new RegExp('(?:([^f])fe|([lr])f)$', 'gi'),  '$1$2ves'],
        [new RegExp('(hive)$', 'gi'),                '$1s'],
        [new RegExp('([^aeiouy]|qu)y$', 'gi'),       '$1ies'],
        [new RegExp('(x|ch|ss|sh)$', 'gi'),          '$1es'],
        [new RegExp('(matr|vert|ind)ix|ex$', 'gi'),  '$1ices'],
        [new RegExp('([m|l])ouse$', 'gi'),           '$1ice'],
        [new RegExp('(quiz)$', 'gi'),                '$1zes'],
        [new RegExp('s$', 'gi'),                     's'],
        [new RegExp('$', 'gi'),                      's']
    ];
    var ignore = _.indexOf(uncountable_words,str.toLowerCase()) > -1;
    if (!ignore){
        for (var x = 0; x < plural_rules.length; x++){
            if (str.match(plural_rules[x][0])){
                str = str.replace(plural_rules[x][0], plural_rules[x][1]);
                break;
            }
        }
    }
    return str;
};
Helpers.stringAfterString=function(string,after,valIfNotFound){
    var inLoc = string.indexOf(after);
    if (Helpers.exists(inLoc) && inLoc > -1){
        return string.substr(inLoc+after.length);
    } else {
        return valIfNotFound || string;
    }
};
Helpers.isNumeric=function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
};
Helpers.nameOfUSState=function(code, withComma){
    var lookup=  {AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'};
    var state = lookup[code.toUpperCase()];
    var output = "";
    if (state) output = withComma? ", "+state : state;
    return output;
};
Helpers.getQueryVariable = function(variable) {
    var query = window.location.search.substring(1);
    var output = query;
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            output = pair[1];
            break;
        }
    }
    return output;
};
Helpers.createCSSClass=function(selector, style) {
//FROM: http://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply
    if (!document.styleSheets) {
        return;
    }

    if (document.getElementsByTagName("head").length == 0) {
        return;
    }

    var styleSheet;
    var mediaType;
    var media;
    if (document.styleSheets.length > 0) {
        for (i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].disabled) {
                continue;
            }
            media = document.styleSheets[i].media;
            mediaType = typeof media;

            if (mediaType == "string") {
                if (media == "" || (media.indexOf("screen") != -1)) {
                    styleSheet = document.styleSheets[i];
                }
            } else if (mediaType == "object" && media.mediaText) {
                if (media.mediaText == "" || (media.mediaText.indexOf("screen") != -1)) {
                    styleSheet = document.styleSheets[i];
                }
            }

            if (Helpers.exists(styleSheet)) {
                break;
            }
        }
    }

    if (Helpers.exists(styleSheet)) {
        var styleSheetElement = document.createElement("style");
        styleSheetElement.type = "text/css";

        document.getElementsByTagName("head")[0].appendChild(styleSheetElement);

        for (i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].disabled) {
                continue;
            }
            styleSheet = document.styleSheets[i];
        }

        media = styleSheet.media;
        mediaType = typeof media;
    }

    var i;
    if (mediaType == "string") {
        for (i = 0; i < styleSheet.rules.length; i++) {
            if (styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.rules[i].style.cssText = style;
                return;
            }
        }
        styleSheet.addRule(selector, style);
    } else if (mediaType == "object") {
        for (i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.cssRules[i].style.cssText = style;
                return;
            }
        }
        styleSheet.insertRule(selector + "{" + style + "}", 0);
    }
};
Helpers.loadCSSFiles = function(cssArray){
    if (typeof(cssArray)=='string') cssArray = [cssArray];
    if (!_.isArray(cssArray)) cssArray=[];

    for (var c=0;c<cssArray.length;c++){
        var link = document.createElement("link");
        link.setAttribute("rel","stylesheet");
        link.setAttribute("type","text/css");
        link.setAttribute("href",cssArray[c]);
        document.getElementsByTagName("head")[0].appendChild(link);
    }
};
Helpers.directoryOfPage=function(url){
    url = url || document.location.href;
    var lio = url.lastIndexOf("/");
    return url.substr(0,lio+1);
};
Helpers.randomcolor = function(brightness){
    if (!Helpers.exists(brightness)) return '#'+Math.floor(Math.random()*16777215).toString(16);

    //6 levels of brightness from 0 to 5, 0 being the darkest
    var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
    var mixed_rgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return Math.round(x/2.0)});
    return "rgb(" + mixed_rgb.join(",") + ")";
};
Helpers.randRange = function (minVal,maxVal,floatVal){
    //From: JSEDI
    //optional Floatval specifies number of decimal points
    var randVal = minVal+(Math.random()*(maxVal-minVal+1));
    return (Helpers.exists(floatVal))?Math.round(randVal-.5):randVal.toFixed(floatVal);
};
Helpers.round = function(num,dec){
    return (Math.round(num * (Math.pow(10,dec)))/Math.pow(10,dec));
};
Helpers.hexFromDec =function(decimal){
    var code = Math.round(decimal).toString(16);
    (code.length > 1) || (code = '0' + code);
    return code;
};
Helpers.randomcolor_basedon = function(colorrgb){
    colorrgb = colorrgb || "#505050";
    if (colorrgb.indexOf("#") == 0) colorrgb = colorrgb.substr(1);
    if (colorrgb.length && colorrgb.length==3)
        colorrgb = colorrgb.substr(0,1) + "0" + colorrgb.substr(1,1) + "0" + colorrgb.substr(2,1) + "0";
    var r = parseInt(colorrgb.substr(0,2),16);
    var g = parseInt(colorrgb.substr(2,2),16);
    var b = parseInt(colorrgb.substr(4,2),16);
    var range=16;
    r = Helpers.hexFromDec(r+Helpers.randRange(0,range)-(range/2));
    g = Helpers.hexFromDec(g+Helpers.math.randRange(0,range)-(range/2));
    b = Helpers.hexFromDec(b+Helpers.math.randRange(0,range)-(range/2));
    return "#"+r+g+b;
};
Helpers.color_transparency = function(colorrgb,trans){
    colorrgb = colorrgb || "#505050";
    if (colorrgb.indexOf("#") == 0) colorrgb = colorrgb.substr(1);
    if (colorrgb.length && colorrgb.length==3)
        colorrgb = colorrgb.substr(0,1) + "0" + colorrgb.substr(1,1) + "0" + colorrgb.substr(2,1) + "0";
    var r = parseInt(colorrgb.substr(0,2),16);
    var g = parseInt(colorrgb.substr(2,2),16);
    var b = parseInt(colorrgb.substr(4,2),16);
    return "rgba("+r+","+g+","+b+","+trans+")";
};

Helpers.steppedGYR=function(percentage){
    percentage = percentage || 0;
    var ret;
    if (percentage<=.5){
        ret = Helpers.blendColors("#00ff00",'#ffff00',percentage*2);
    } else {
        ret = Helpers.blendColors('#ffff00',"#ff0000",(percentage -.5)*2);
    }
    return ret;
};
Helpers.blendColors=function(c1,c2,percentage){
    if (typeof Colors == 'undefined') {
        throw "Requires colors.min.js library";
    }
    if (!c1 || !c2) return c1;

    c1 = (c1.indexOf('#') == 0) ? c1 = Colors.hex2rgb(c1) : Colors.name2rgb(c1);
    c2 = (c2.indexOf('#') == 0) ? c2 = Colors.hex2rgb(c2) : Colors.name2rgb(c2);

    var rDiff = (c2.R-c1.R) * percentage;
    var gDiff = (c2.G-c1.G) * percentage;
    var bDiff = (c2.B-c1.B) * percentage;


    var result = Colors.rgb2hex(parseInt(c1.R+rDiff), parseInt(c1.G+gDiff), parseInt(c1.B+bDiff));
    if (result.indexOf('#') != 0) {
        result = c1;
    }
    return result;
};
Helpers.bw=function(color){
//r must be an rgb color array of 3 integers between 0 and 255.
    if (typeof Colors == 'undefined') {
        throw "Requires colors.min.js library";
    }

    var r = Colors.hex2rgb(color).a;

    var contrast= function(B, F){
        var abs= Math.abs,
            BG= (B[0]*299 + B[1]*587 + B[2]*114)/1000,
            FG= (F[0]*299 + F[1]*587 + F[2]*114)/1000,
            bright= Math.round(Math.abs(BG - FG)),
            diff= abs(B[0]-F[0])+abs(B[1]-F[1])+abs(B[2]-F[2]);
        return [bright, diff];
    };
    var c, w= [255, 255, 255], b= [0, 0, 0];
    if(r[1]> 200 && (r[0]+r[2])<50) c= b;
    else{
        var bc= contrast(b, r);
        var wc= contrast(w, r);
        if((bc[0]*4+bc[1])> (wc[0]*4+wc[1])) c= b;
        else if((wc[0]*4+wc[1])> (bc[0]*4+bc[1])) c= w;
        else c= (bc[0]< wc[0])? w:b;
    }
    return 'rgb('+c.join(',')+')';
};
Helpers.removeMobileAddressBar = function(doItNow) {
    function fixSize(){
        // Get rid of address bar on iphone/ipod
        window.scrollTo(0, 0);
        document.body.style.height = '100%';
        if (!(/(iphone|ipod)/.test(navigator.userAgent.toLowerCase()))) {
            if (document.body.parentNode) {
                document.body.parentNode.style.height = '100%';
            }
        }
    }
    if (doItNow){
        fixSize();
    } else {
        setTimeout(fixSize, 700);
        setTimeout(fixSize, 1500);
    }
};

Helpers.orientationInfo=function(x,y){
    x = x || $(window).width();
    y = y || $(window).height();
    var layout = (x>y)?'horizontal':'vertical';

    return {layout:layout,ratio:x/y};
};
Helpers.dots= function(num){
        var output = "";
        for(var i=0;i<num;i++) {
            if (i%5 ==0) output += " ";
            output+="&#149;";
        }
        if (num == 0){
            output="0";
        }
        return output;
    };
Helpers.isIOS= function(){
    navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/);
};
Helpers.exists= function() {
    //Check if variables exist
    var allExist = true;
    for( var i = 0; i < arguments.length; i++ ) {
        if (typeof arguments[i] == "undefined" ) { allExist = false; break;}
    }
    return allExist;
};
Helpers.distanceXY=function(p1, p2){
    return Math.sqrt( (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y) );
};
Helpers.isInArray=function(searchFor,searchIn,ignoreCase){
    if (!Helpers.exists(searchFor) || !Helpers.exists(searchIn)) return false;
    if (!Helpers.isArray(searchFor)) searchFor = [searchFor];
    if (!Helpers.isArray(searchIn)) searchIn = [searchIn];
    var found = false;
    for (var i=0;i<searchFor.length;i++){
        for (var j=0;j<searchIn.length;j++){
            var s_f = searchFor[i];
            var s_i = searchIn[j];
            if (ignoreCase && typeof s_f=='string' && typeof s_i=='string') {
                if (s_f.toLowerCase() == s_i.toLowerCase()) {
                    found=true;
                    break;
                }
            } else {
                if (s_f == s_i) {
                    found=true;
                    break;
                }
            }
        }
    }
    return found;
};


(function($){
    // eventType - "click", "mouseover" etc.
    // destination - either jQuery object, dom element or selector
    // clearCurrent - if true it will clear current handlers at destination - default false
    $.fn.copyEventTo = function(eventType, destination, clearCurrent) {
        var events = [];
        this.each(function(){
            var allEvents = jQuery._data(this, "events");
            if (typeof allEvents === "object") {
                var thoseEvents = allEvents[eventType];
                if (typeof thoseEvents === "object") {
                    for (var i = 0; i<thoseEvents.length; i++) {
                        events.push(allEvents[eventType][i].handler);
                    }
                }
            }
        });
        if (typeof destination === "string") {
            destination = $(destination);
        } else if (typeof destination === "object") {
            if (typeof destination.tagName === "string") {
                destination = $(destination);
            }
        }
        if (clearCurrent === true) destination.off(eventType);
        destination.each(function(){
            for(var i = 0; i<events.length; i++) {
                destination.bind(eventType, events[i]);
            }
        });
        return this;
    }

})(jQuery);
;
var Avatar = (function ($, _, net, createjs, Helpers, maths) {
    //Uses jquery and Underscore and colors.js and createjs's easel.js

    //TODO: Have a skull-width and jaw-width, and then combine this with thickness to determine face type
    //TODO: Use age, thickness, and musculature to determine which muscles/lines to draw

    //TODO: Problem with this face: new Avatar({"rand_seed":263080,"face_shape":"Diamond"}), and new Avatar({rand_seed: 146994, age:38});

    //TODO: Add oval decoration
    //TODO: Add descendant page with Procyon
    //TODO: Add a character builder
    //TODO: Add a python service to build this image headless
    //TODO: Decorations are weird on faces.html

    //TODO: Have a shape builder function to standardize and make reusable
    //TODO: Generate points for each important face zone, generate all these first before rendering

    //TODO: Scars and Jewelery
    //TODO: Sag wrinkles when older
    //TODO: Sprite images
    //TODO: Emotions
    //TODO: Moving eyes
    //TODO: Outfits and standing avatar
    //TODO: Check big noses don't go over eyes

    //TODO: Three levels of cheek curves
    //TODO: Multiline function has shadow, offset shadow
    //TODO: Eyes get eyelashes
    //TODO: Iris smaller with variable shapes, pattern in retina


    //-----------------------------
    //Private Global variables
    var VERSION = '0.0.7',
        summary = 'Drawing procedurally rendered people on HTML5 canvas.',
        author = 'Jay Crossler - http://github.com/jaycrossler',
        file_name = 'avatar.js';

    var _stage_options = {
        percent_height: 1,
        buffer: 0.1,
        x: 0,
        y: 0
    };
    var STAGES = []; //Global list of all stages used to lookup any existing ones

    //-----------------------------
    var _face_options = {};
    var _data = {'Human': {}};

    //-----------------------------
    //Initialization
    function AvatarClass(option1, option2, option3) {
        this.version = file_name + ' (version ' + VERSION + ') - ' + summary + ' by ' + author;
        if (option1 == 'get_linked_template') {
            option2 = option2 || getFirstRaceFromData();
            return this.data[option2] || {error: 'race does not exist'};
        } else if (option1 == 'copy_data_template') {
            option2 = option2 || getFirstRaceFromData();
            if (this.data[option2]) {
                var data = this.data[option2];
                data = JSON.parse(JSON.stringify(data));
                return data;
            } else {
                return {error: 'race does not exist'};
            }

        } else if (option1 == 'add_render_function') {
            this.renderers.push(option2);

        } else if (option1 == 'get_render_functions') {
            return this.renderers;

        } else if (option1 == 'get_private_functions') {
            return this._private_functions;

        } else if (option1 == 'set_data_template') {
            this.data[option2] = option3;

        } else if (option1 == 'get_races') {
            var races = [];
            for (var race in this.data) {
                races.push(race);
            }
            return races;

        } else if (option1 == '') {
            return {details: 'avatar class initialized'};

        } else {
            this.drawOrRedraw(option1, option2, option3);
        }
    }

    AvatarClass.prototype.renderers = [];
    AvatarClass.prototype.data = _data;

    AvatarClass.prototype.initializeOptions = function (face_options_basic, human_data_options) {
        _face_options = face_options_basic;
        _data['Human'] = human_data_options;
    };

    AvatarClass.prototype.drawOrRedraw = function (face_options, stage_options, canvas_name) {
        if (this.face_options === null) {
            this.initialization_seed = null;
        }

        this.initialization_options = face_options || this.initialization_options || {};

        this.face_options = $.extend({}, this.face_options || _face_options, face_options || {});
        this.stage_options = $.extend({}, this.stage_options || _stage_options, stage_options || {});
        this.event_list = this.event_list || [];
        this.registered_points = this.registered_points || [];
        this.textures = this.textures || [];

        //Determine the random seed to use.  Either use the one passed in, the existing one, or a random one.
        face_options = face_options || {};
        var rand_seed = face_options.rand_seed || this.initialization_seed || Math.floor(Math.random() * 100000);
        this.initialization_seed = rand_seed;
        this.initialization_options.rand_seed = rand_seed;
        //Set this random seed to be used throughout the avatar's lifespan
        this.randomSetSeed(rand_seed);

        //Determine the race, and pick random variables to use for unspecified values
        this.face_options.race = this.face_options.race || getFirstRaceFromData();

        var race_data = this.getRaceData();
        for (var key in race_data) {
            this.randomFaceOption(key, true, true);
        }

        //Find the canvas that the stage should be drawn on (possibly multiple stages per canvas)
        if (canvas_name) {
            this.stage_options.canvas_name = canvas_name;
        }
        if (this.stage_options.canvas_name) {
            canvas_name = this.stage_options.canvas_name;
            if (canvas_name && canvas_name instanceof jQuery) {
                this.stage_options.canvas_name = canvas_name.attr('id') || canvas_name.selector || "canvas";
                this.$canvas = canvas_name;
            }
            var existing_stage = findStageByCanvas(this.stage_options.canvas_name);
            if (!this.$canvas && $(this.stage_options.canvas_name)) {
                this.$canvas = $('#' + this.stage_options.canvas_name);
            }

            if (existing_stage) {
                this.stage = existing_stage;
            } else {
                this.stage = setupStage(this.stage_options.canvas_name);
                if (!this.stage.canvas) {
                    throw "The canvas was not properly initialized in the stage, maybe jquery hadn't finished building it yet."
                }
                addStageByCanvas({canvas_id: this.stage_options.canvas_name, $canvas: this.$canvas, stage: this.stage});
            }
        }

        //Draw the faces
        if (this.stage) {
            this.erase();

            this.randomSetSeed(rand_seed);
            generateSkinAndHairColors(this);
            if (this._private_functions.generateTextures) { //Should be in avatar-textures.js
                this._private_functions.generateTextures(this);
            }

            this.randomSetSeed(rand_seed); //Reset the random seed after textures are generated

            var face = this.buildFace();
            this.drawOnStage(face, this.stage);
            this.faceShapeCollection = face;

            registerEvents(this);

            this.stage.update();
        }
    };

    //-----------------------------
    //Supporting functions
    AvatarClass.prototype.getSeed = function (showAsString) {
        var result = this.initialization_options || {};
        return showAsString ? JSON.stringify(result) : result;
    };
    AvatarClass.prototype.erase = function () {
        if (this.faceShapeCollection) {
            this.faceShapeCollection.removeAllChildren();
            this.faceShapeCollection.visible = false;
        }
    };
    AvatarClass.prototype.getRaceData = function () {
        var race = this.face_options.race || getFirstRaceFromData();
        return _data[race] || _data[getFirstRaceFromData()];
    };
    AvatarClass.prototype.removeFromStage = function () {
        if (this.stage) {
            if (this.faceShapeCollection) {
                this.faceShapeCollection.removeAllChildren();
                this.faceShapeCollection.visible = false;
                this.stage.update();
            }
        }
    };
    AvatarClass.prototype.drawOnStage = function (face, stage) {
        stage.addChild(face);
        stage.update();
    };
    function turnWordToNumber(word, min, max, options) {
        options = options || "Darkest,Darker,Dark,Very Low,Low,Less,Below,Reduce,Raised,Above,More,High,Very High,Bright,Brighter,Brightest";
        if (typeof options == "string") options = options.split(",");

        var pos = _.indexOf(options, word);
        var val = (min + max) / 2;
        if (pos > -1) {
            var percent = pos / options.length;
            val = min + (percent * (max - min));
        }
        return val;
    }

    function generateSkinAndHairColors(avatar) {

        //TODO: vary colors based on charisma and age
        //Merge and tweak colors
        var skinColor = '';
        if (_.isString(avatar.face_options.skin_colors)) {
            skinColor = net.brehaut.Color(avatar.face_options.skin_colors);
            avatar.face_options.skin_colors = {name: avatar.face_options.skin_colors, skin: skinColor.toString()};
        } else if (avatar.face_options.skin_colors.skin) {
            skinColor = net.brehaut.Color(avatar.face_options.skin_colors.skin);
        }

        var skin_darken_amount, R, G, B;
        //Based on math from http://johnthemathguy.blogspot.com/2013/08/what-color-is-human-skin.html
        if (avatar.face_options.skin_shade == "Light") {
            skin_darken_amount = turnWordToNumber(avatar.face_options.skin_shade_tint, -3.5, 0.5);
            R = 224.3 + 9.6 * skin_darken_amount;
            G = 193.1 + 17.0 * skin_darken_amount;
            B = 177.6 + 21.0 * skin_darken_amount;
            skinColor = net.brehaut.Color("rgb(" + parseInt(R) + "," + parseInt(G) + "," + parseInt(B) + ")");
            avatar.face_options.skin_colors = {name: "light:" + skin_darken_amount, skin: skinColor.toString()};
        } else if (avatar.face_options.skin_shade == "Dark") {
            skin_darken_amount = turnWordToNumber(avatar.face_options.skin_shade_tint, -3.5, 3);
            R = 168.8 + 38.5 * skin_darken_amount;
            G = 122.5 + 32.1 * skin_darken_amount;
            B = 96.7 + 26.3 * skin_darken_amount;
            skinColor = net.brehaut.Color("rgb(" + parseInt(R) + "," + parseInt(G) + "," + parseInt(B) + ")");
            avatar.face_options.skin_colors = {name: "dark:" + skin_darken_amount, skin: skinColor.toString()};
        }

        if (!_.isObject(avatar.face_options.skin_colors)) {
            avatar.face_options.skin_colors = {name: 'skin', skin: 'rgb(228,131,86)'};
        }

        //TODO: Check that skin is not too white
        var red = net.brehaut.Color('#885544');
        if (!avatar.face_options.skin_colors.highlights) avatar.face_options.skin_colors.highlights = skinColor.lightenByRatio(.4).toString();
        if (!avatar.face_options.skin_colors.cheek) avatar.face_options.skin_colors.cheek = skinColor.blend(red, .1).darkenByRatio(.2).toString();
        if (!avatar.face_options.skin_colors.darkflesh) avatar.face_options.skin_colors.darkflesh = skinColor.blend(red, .1).darkenByRatio(.3).toString();
        if (!avatar.face_options.skin_colors.deepshadow) avatar.face_options.skin_colors.deepshadow = skinColor.darkenByRatio(.4).toString();

        //TODO: Hair color should be more affected by age and stress?
        var age_hair_percent = Math.min(Math.max(0, avatar.face_options.age - 35) / 60, 1);
        var hairColor = net.brehaut.Color(avatar.face_options.hair_color_roots);
        if (!avatar.face_options.hair_color) {
            var gray = net.brehaut.Color('#eeeeee');
            avatar.face_options.hair_color = hairColor.blend(gray, age_hair_percent).desaturateByRatio(age_hair_percent).toString();
        }
        if (!avatar.face_options.beard_color) {
            var gray_d = net.brehaut.Color('#dddddd');
            avatar.face_options.beard_color = hairColor.blend(gray_d, age_hair_percent).desaturateByRatio(age_hair_percent).toString();
        }
    }

    AvatarClass.prototype.buildFace = function () {
        var container = new createjs.Container();
        this.lines = [];
        var avatar = this;

        var face_zones = buildFaceZones(avatar);
        var race_data = avatar.getRaceData();

        //Loop through each rendering order and draw each layer
        _.each(race_data.rendering_order || [], function (layer) {
            avatar.randomSetSeed(avatar.face_options.rand_seed); //Reset the random seed before each rendering

            if (layer.decoration) {
                addSceneChildren(container, buildDecoration(avatar, layer));

            } else if (layer.feature) {
                var render_layer = _.find(avatar.renderers, function (rend) {
                    return (rend.style == layer.style) && (rend.feature == layer.feature);
                });
                if (render_layer && render_layer.renderer) {
                    var feature_shapes = render_layer.renderer(face_zones, avatar, layer);
                    addSceneChildren(container, feature_shapes);
                } else {
                    console.error("avatar.js - Renderer named " + layer.feature + " not found, skipping.");
                }
            }
        });

        return container;
    };
    AvatarClass.prototype.randomFaceOption = function (key, dontForceSetting, skipRedraw) {
        var option_name = '';
        var result, currentVal;
        var data = this.getRaceData();
        if (_.str.endsWith(key, '_options') && data[key]) {
            var options = data[key];
            option_name = key.split('_options')[0];
            currentVal = this.face_options[option_name];

            if (!dontForceSetting || (dontForceSetting && !this.face_options[option_name])) {
                //Set a random option
                result = randOption(options, this.face_options, currentVal);
                this.face_options[option_name] = result;
            } else if (_.isObject(options[0]) && _.isString(currentVal)) {
                //The value is set as text, if it's an array of objects then set the object to the val
                var obj = _.find(options, function (opt) {
                    return opt.name == currentVal;
                });
                if (obj) this.face_options[option_name] = obj;
            }
        }

        if (!skipRedraw) {
            this.drawOrRedraw();
        }
        return result;
    };
    AvatarClass.prototype.unregisterEvent = function (shapeNames) {
        var avatar = this;
        if (shapeNames == 'all') {
            _.each(avatar.event_list, function (event) {
                if (event.shape) {
                    event.shape.removeEventListener(event.eventType || 'click');
                }
            });
            avatar.event_list = [];
        }

        var newEventList = [];
        _.each(avatar.event_list, function (event) {
            if (event.shapeNames == shapeNames && event.shape) {
                event.shape.removeEventListener(event.eventType || 'click');
            } else {
                newEventList.push(event);
            }
        });
        avatar.event_list = newEventList;
    };
    AvatarClass.prototype.registerEvent = function (shapeNames, functionToRun, eventType, dontRegister) {
        eventType = eventType || 'click';
        if (!functionToRun) return;
        var avatar = this;

        if (!dontRegister) {
            avatar.event_list.push({shapeNames: shapeNames, functionToRun: functionToRun, eventType: eventType});
        }

        _.each(shapeNames.split(","), function (shapeName) {
            var shape = findShape(avatar.lines, shapeName);
            if (shape && shape.shape) {
                shape.shape.addEventListener(eventType, function () {
                    functionToRun(avatar);
                });
            }
        });
    };
    AvatarClass.prototype.getBounds = function () {
        var p1 = findPoint(this, 'facezone topleft');
        var p2 = findPoint(this, 'facezone bottomright');
        var p2x = parseInt(p2.x - p1.x);
        var p2y = parseInt(p2.y - p1.y);

        return ({top_x: parseInt(p1.x), top_y: parseInt(p1.y), bottom_x: p2x, bottom_y: p2y});
    };

    //================
    //Private functions
    function getFirstRaceFromData() {
        for (key in _data) {
            //wonky way to get first key
            return key;
        }
        throw "No first race found in _data";
    }

    function registerEvents(avatar) {
        var usesMouseOver = false;
        _.each(avatar.event_list, function (event) {
            avatar.registerEvent(event.shapeNames, event.functionToRun, event.eventType, true);
            if (event.eventType == 'mouseover' || event.eventType == 'mouseout') usesMouseOver = true;
        });
        if (usesMouseOver) {
            avatar.stage.enableMouseOver();
        }
    }

    function buildDecoration(avatar, decoration) {
        var shapes = [];

        var data = avatar.getRaceData();
        var data_item = _.find(data.decorations || [], function (dec) {
            return dec.name == decoration.decoration;
        });
        if (data_item) {
            decoration = JSON.parse(JSON.stringify(decoration)); //Deep-copy this
            $.extend(decoration, data_item);
        }

        if (decoration.type == 'rectangle') {
            var p1, p2;
            if (decoration.docked) {
                var image_tl = findPoint(avatar, 'facezone topleft');
                var image_br = findPoint(avatar, 'facezone bottomright');
                var height = decoration.height || 16;
                var width = decoration.width || 16;
                if (decoration.docked == "bottom") {
                    p1 = {x: image_tl.x, y: image_br.y - height};
                    p2 = {x: image_br.x, y: image_br.y};

                    if (decoration.forceInBounds) {
                        var canvas_h = avatar.$canvas.height();
                        if (p2.y > canvas_h) {
                            p1.y += (canvas_h - p2.y);
                            p2.y += (canvas_h - p2.y);
                        }
                    }
                } //TODO: Add other docked locations


            } else {
                p1 = (_.isString(decoration.p1)) ? findPoint(avatar, decoration.p1) : decoration.p1;
                p2 = (_.isString(decoration.p2)) ? findPoint(avatar, decoration.p2) : decoration.p2;
            }
            if (p1 && _.isObject(p1) && p2 && _.isObject(p2)) {
                var p1x = parseInt(p1.x);
                var p1y = parseInt(p1.y);
                var p2x = parseInt(p2.x - p1.x);
                var p2y = parseInt(p2.y - p1.y);

                if (decoration.forceInBounds) {
                    var canvas_w = avatar.$canvas.width();
                    var canvas_h = avatar.$canvas.height();
                    if (p1x < 1) p1x = 1;
                    if (p1y < 1) p1y = 1;
                    if (p2x > canvas_w) p2x = (canvas_w - p1x) - 2;
                    if (p2y > canvas_h) p2y = (canvas_h - p1y) - 2;
                }

                var rect = new createjs.Shape();
                if (decoration.size) rect.graphics.setStrokeStyle(decoration.size);
                if (decoration.line_color || decoration.color) rect.graphics.beginStroke(decoration.line_color || decoration.color);
                if (decoration.fill_color || decoration.color) rect.graphics.beginFill(decoration.fill_color || decoration.color);
                rect.alpha = decoration.alpha || 1;
                rect.graphics.drawRect(p1x, p1y, p2x, p2y);
                rect.graphics.endFill();
                shapes.push(rect);
                avatar.lines.push({name: decoration.name || 'decoration ' + (decoration.name || "item"), line: [p1, {x: p2x, y: p2y}], shape: rect, scale_x: 1, scale_y: 1, x: 1, y: 1});

                if (decoration.text) {
                    var font_size = decoration.font_size || 10;
                    var font_name = decoration.font_name || "Arial";
                    var font_color = decoration.font_color || decoration.color || "Black";
                    var font_text = decoration.text;

                    if (font_text.indexOf("{{") > -1) {
                        _.templateSettings = {
                            interpolate: /\{\{(.+?)\}\}/g
                        };

                        var text_template = _.template(font_text);
                        try {
                            font_text = text_template(avatar.face_options);
                        } catch (ex) {
                            //Decoration couldn't parse variable
                            font_text = "";
                        }
                    }

                    var text = new createjs.Text(font_text, font_size + "px " + font_name, font_color);
                    var textBounds = text.getBounds();
                    var textWidth = p2x;
                    if (textBounds && textBounds.width) {
                        textWidth = textBounds.width;
                    }
                    text.x = p1x + ((p2x - textWidth) / 2);
                    text.y = ((p2y - font_size) / 2) + p1y + (p2y / 2);
                    text.textBaseline = "alphabetic";
                    shapes.push(text);
                }


            }
        } else if (decoration.type == 'image') {
            //TODO: Add images - is there a way to do this from a local file?
        }

        return shapes;
    }

    function getHeightOfStage(avatar) {
        var stage = avatar.stage;
        var stage_options = avatar.stage_options;

        var height = (stage_options.height || stage_options.size || (stage.canvas.height * stage_options.percent_height)) * (1 - stage_options.buffer);
        var full_height = height;

        var age = maths.clamp(avatar.face_options.age, 4, 25);
        var age_size = (50 + age) / 75;  //TODO: Use a Height in Inches
        height *= age_size;

        var height_offset = (stage_options.size || (stage.canvas.height * stage_options.percent_height)) * (stage_options.buffer / 2);

        var resolution = height / 200;

        return {height: height, height_offset: height_offset, full_height: full_height, age_size: age_size, resolution: resolution};
    }

    function buildFaceZones(avatar) {
        var face_options = avatar.face_options;
        var stage_options = avatar.stage_options;

        var face_zones = {neck: {}, face: {}, nose: {}, ears: {}, eyes: {}, chin: {}, hair: {}};

        var height_object = getHeightOfStage(avatar);
        var height = height_object.height;
        var height_offset = height_object.height_offset;
        var full_height = height_object.full_height;

        stage_options.height_offset = height_offset;

        var half_height = height / 2;
        stage_options.half_height = half_height;
        face_zones.face_width = half_height * (0.55 + (face_options.thickness / 35));

        var eye_spacing = 0.005;
        if (face_options.eye_spacing == "Pinched") {
            eye_spacing = 0;
        } else if (face_options.eye_spacing == "Squeezed") {
            eye_spacing = -.005;
        } else if (face_options.eye_spacing == "Thin") {
            eye_spacing = 0.01;
        } else if (face_options.eye_spacing == "Wide") {
            eye_spacing = 0.013;
        }

        var eye_size = 1;
        if (face_options.eye_size == "Tiny") {
            eye_size = .8;
        } else if (face_options.eye_size == "Small") {
            eye_size = .9;
        } else if (face_options.eye_size == "Big") {
            eye_size = 1.05;
        } else if (face_options.eye_size == "Large") {
            eye_size = 1.1;
            eye_size += .01;
        } else if (face_options.eye_size == "Massive") {
            eye_size = 1.2;
            eye_size += .017;
        } else if (face_options.eye_size == "Big Eyed") {
            eye_size = 1.3;
            eye_spacing += .022;
        } else if (face_options.eye_size == "Huge Eyed") {
            eye_size = 1.4;
            eye_spacing += .026;
        } else if (face_options.eye_size == "Giant") {
            eye_size = 1.5;
            eye_spacing += .03;
        }

        var mouth_height = 0.05;
        if (face_options.mouth_height == "Low") {
            mouth_height = 0.04;
        } else if (face_options.mouth_height == "Raised") {
            mouth_height = 0.06;
        } else if (face_options.mouth_height == "High") {
            mouth_height = 0.07;
        }

        var nose_height = 0.01;
        if (face_options.nose_height == "Low") {
            nose_height = 0;
        } else if (face_options.nose_height == "Raised") {
            nose_height = 0.02;
        }

        var forehead_height = 0.01;
        if (face_options.forehead_height == "Under") {
            forehead_height = 0.1;
        } else if (face_options.forehead_height == "Low") {
            forehead_height = 0.11;
        } else if (face_options.forehead_height == "Less") {
            forehead_height = 0.12;
        } else if (face_options.forehead_height == "Normal") {
            forehead_height = 0.13;
        } else if (face_options.forehead_height == "Above") {
            forehead_height = 0.14;
        } else if (face_options.forehead_height == "Raised") {
            forehead_height = 0.15;
        } else if (face_options.forehead_height == "High") {
            forehead_height = 0.16;
        } else if (face_options.forehead_height == "Floating") {
            forehead_height = 0.17;
        }


        var x = stage_options.x;
        var y = stage_options.y;

        if (height_object.age_size < 1) {
            y += (full_height - height + 2);
            x += (full_height - height) / 2;
        }

        face_zones.thick_unit = face_zones.face_width * .007;

        face_zones.neck = {
            left: -face_zones.face_width * .7,
            top: 0,
            right: 1.4 * face_zones.face_width,
            bottom: height * .6,
            x: x + half_height,
            y: y + height_offset + half_height
        };
        face_zones.face = {
            left: -face_zones.face_width,
            top: -half_height,
            right: 2 * face_zones.face_width,
            bottom: height,
            x: x + half_height,
            y: y + height_offset + half_height
        };

        face_zones.eyes = {
            top: (-half_height / 16) * eye_size,
            bottom: (2 * half_height / 12) * eye_size,
            y: y + height_offset + (half_height * (0.8 + forehead_height)),

            left: (-half_height / 8) * eye_size,
            right: (2 * half_height / 8) * eye_size,
            left_x: x + (half_height * (0.75 - eye_spacing)),
            right_x: x + (half_height * (1.25 + eye_spacing)),

            iris: {
                top: -half_height / 24,
                bottom: 2 * half_height / 16,
                y: y + height_offset + (half_height * (0.8 + forehead_height)),

                left: -half_height / 16,
                right: 2 * half_height / 16,
                left_x: x + (half_height * (0.75 - eye_spacing)),
                right_x: x + (half_height * (1.25 + eye_spacing))
            },

            pupil: {
                top: -half_height / 65,
                bottom: 2 * half_height / 28,
                y: y + height_offset + (half_height * (0.805 + forehead_height)),

                left: -half_height / 32,
                right: 2 * half_height / 32,
                left_x: x + (half_height * (0.75 - eye_spacing)),
                right_x: x + (half_height * (1.25 + eye_spacing))
            }
        };

        face_zones.ears = {
            top: -half_height / 5,
            bottom: 2 * half_height / 5,
            y: y + height_offset + (half_height * (0.9 + forehead_height)),

            left: -half_height / 16,
            right: 2 * half_height / 16,
            left_x: x + half_height + face_zones.face.left,
            right_x: x + half_height + (face_zones.face.right / 2)
        };

        face_zones.nose = {
            left: -half_height / 15, top: -half_height / 15,
            right: 2 * half_height / 15, bottom: 2 * half_height / 15,
            radius: half_height / 15,
            x: x + half_height,
            y: y + height_offset + (half_height * (1.13 + (forehead_height * 1.2) + nose_height))
        };

        face_zones.mouth = {
            left: -half_height / 6, top: -half_height / 18,
            right: 2 * half_height / 6, bottom: 2 * half_height / 18,
            x: x + half_height,
            y: y + height_offset + (half_height * (1.5 + (forehead_height / 2) + nose_height + mouth_height))
        };

        namePoint(avatar, 'facezone topleft', {
            x: face_zones.ears.left_x + (2 * face_zones.ears.left),
            y: y
        });
        namePoint(avatar, 'facezone bottomright', {
            x: face_zones.ears.right_x + face_zones.ears.right,
            y: face_zones.neck.y + face_zones.neck.bottom
        });

        return face_zones;
    }


    //-----------------------------
    //Drawing Helpers

    function addSceneChildren(container, children) {
        _.each(children, function (c) {
            if (_.isArray(c)) {
                addSceneChildren(container, c);
            } else {
                container.addChild(c);
            }
        });
        return container;
    }

    function transformLineToGlobalCoordinates(lines, shape_name) {
        var line_new = [];

        var shape = findShape(lines, shape_name);

        _.each(shape.line, function (point) {
            var new_point = _.clone(point);
            new_point.x = (shape.x || 0) + ((shape.scale_x || 1) * .1 * point.x);
            new_point.y = (shape.y || 0) + ((shape.scale_y || 1) * .1 * point.y);

            line_new.push(new_point);
        });
        return line_new;

    }

    function lineSegmentCompared(source_line, compare_line, method, level_adjust) {
        level_adjust = level_adjust || 0;
        method = method || 'above';
        var return_line = [];

        if (method == 'above') {
            var highest_compare_point = Number.MAX_VALUE;
            _.each(compare_line, function (point) {
                if (point.y < highest_compare_point) {
                    highest_compare_point = point.y;
                }
            });

            _.each(source_line, function (point) {
                if ((point.y + level_adjust) <= highest_compare_point) {
                    return_line.push(point);
                }
            })
        } else if (method == 'below') {
            var lowest_compare_point = Number.MIN_VALUE;
            _.each(compare_line, function (point) {
                if (point.y > lowest_compare_point) {
                    lowest_compare_point = point.y;
                }
            });

            _.each(source_line, function (point) {
                if ((point.y - level_adjust) >= lowest_compare_point) {
                    return_line.push(point);
                }
            })
        }
        return return_line;
    }

    function transformShapeLine(options_lists, face_options, existing_list) {
        if (!_.isArray(options_lists)) options_lists = [options_lists];

        if (existing_list) {
            existing_list = JSON.parse(JSON.stringify(existing_list));
        } else {
            existing_list = [];
        }

        _.each(options_lists, function (options) {
            var type = options.type || 'circle';
            var steps = options.steps || 18;
            options.radius = options.radius || 1;

            var starting_step = options.starting_step || 0;
            var ending_step = options.ending_step || existing_list.length || steps;

            var c, x, y;
            if (type == 'smooth') {
                if (options.starting_step !== undefined) starting_step = (existing_list.length + options.starting_step) % (existing_list.length);
                if (options.ending_step !== undefined) ending_step = (existing_list.length + options.ending_step) % (existing_list.length);

                if (starting_step < ending_step) {
                    for (c = starting_step; c < ending_step; c++) {
                        existing_list[c].line = false;
                    }
                } else {
                    for (c = 0; c < ending_step; c++) {
                        existing_list[c].line = false;
                    }
                    for (c = starting_step; c < existing_list.length; c++) {
                        existing_list[c].line = false;
                    }
                }
            } else if (type == 'contract') {
                var mid_x = comparePoints(existing_list, 'x', 'middle');
                var mid_y = comparePoints(existing_list, 'y', 'middle');

                if (options.starting_step !== undefined) starting_step = (existing_list.length + options.starting_step) % (existing_list.length);
                if (options.ending_step !== undefined) ending_step = (existing_list.length + options.ending_step) % (existing_list.length);

                if (starting_step < ending_step) {
                    for (c = starting_step; c < ending_step; c++) {
                        existing_list[c].x = mid_x - ((mid_x - existing_list[c].x) * (options.multiplier || .9));
                        existing_list[c].y = mid_y - ((mid_y - existing_list[c].y) * (options.multiplier || .9));
                    }
                } else {
                    for (c = 0; c < ending_step; c++) {
                        existing_list[c].x = mid_x - ((mid_x - existing_list[c].x) * (options.multiplier || .9));
                        existing_list[c].y = mid_y - ((mid_y - existing_list[c].y) * (options.multiplier || .9));
                    }
                    for (c = starting_step; c < existing_list.length; c++) {
                        existing_list[c].x = mid_x - ((mid_x - existing_list[c].x) * (options.multiplier || .9));
                        existing_list[c].y = mid_y - ((mid_y - existing_list[c].y) * (options.multiplier || .9));
                    }
                }
            } else if (type == 'midline of loop') {
                //Takes a loop and averages the points through the middle
                var e_length = existing_list.length;
                var e_length_mid = e_length / 2;
                var new_list = [];

                for (c = 0; c < e_length_mid; c++) {
                    var xy = _.clone(existing_list[c]);
                    new_list.push(xy);
                }
                var id = 0;
                for (c = e_length - 1; c > e_length_mid; c--) {
                    var point_c = existing_list[c];
                    new_list[id].x += point_c.x;
                    new_list[id].x /= 2;
                    new_list[id].y += point_c.y;
                    new_list[id].y /= 2;
                    id++;
                }
                existing_list = new_list;

            } else if (type == 'reverse') {
                var axis = options.axis || 0;
                if (axis == 'left') {
                    axis = comparePoints(existing_list, 'x', 'lowest');
                } else if (axis == 'right') {
                    axis = comparePoints(existing_list, 'x', 'highest');
                } else if (axis == 'top') {
                    axis = comparePoints(existing_list, 'y', 'lowest');
                } else if (axis == 'bottom') {
                    axis = comparePoints(existing_list, 'y', 'highest');
                }

                if (options.direction == 'vertical') {
                    for (c = 0; c < existing_list.length; c++) {
                        existing_list[c].y = axis - (existing_list[c].y - axis);
                    }
                } else {  //Assume horizontal
                    for (c = 0; c < existing_list.length; c++) {
                        existing_list[c].x = axis - (existing_list[c].x - axis);
                    }
                }
            } else if (type == 'shift') {
                if (options.starting_step !== undefined) starting_step = (existing_list.length + options.starting_step) % (existing_list.length);
                if (options.ending_step !== undefined) ending_step = (existing_list.length + options.ending_step) % (existing_list.length);

                if (starting_step < ending_step) {
                    for (c = starting_step; c < ending_step; c++) {
                        existing_list[c].x += options.x_offset || 0;
                        existing_list[c].y += options.y_offset || 0;
                    }
                } else {
                    for (c = 0; c < ending_step; c++) {
                        existing_list[c].x += options.x_offset || 0;
                        existing_list[c].y += options.y_offset || 0;
                    }
                    for (c = starting_step; c < existing_list.length; c++) {
                        existing_list[c].x += options.x_offset || 0;
                        existing_list[c].y += options.y_offset || 0;
                    }

                }

            } else if (type == 'pinch') {
                if (options.starting_step !== undefined) starting_step = (existing_list.length + options.starting_step) % (existing_list.length);
                if (options.ending_step !== undefined) ending_step = (existing_list.length + options.ending_step) % (existing_list.length);

                if (starting_step < ending_step) {
                    for (c = starting_step; c < ending_step; c++) {
                        existing_list[c].y *= options.pinch_amount || .8;
                    }
                } else {
                    //TODO: There's a better way to do this double loop
                    for (c = 0; c < ending_step; c++) {
                        existing_list[c].y *= options.pinch_amount || .8;
                    }
                    for (c = starting_step; c < existing_list.length; c++) {
                        existing_list[c].y *= options.pinch_amount || .8;
                    }

                }
            }
            else if (type == 'randomize') {
                if (options.starting_step !== undefined) starting_step = (existing_list.length + options.starting_step) % (existing_list.length);
                if (options.ending_step !== undefined) ending_step = (existing_list.length + options.ending_step) % (existing_list.length);

                for (c = starting_step; c < ending_step; c++) {
                    var point = existing_list[c];
                    point.x += ((random(face_options) - .5) * options.x_range || .1);
                    point.y += ((random(face_options) - .5) * options.y_range || .1);
                    existing_list[c] = point;
                }

            } else if (type == 'circle') {
                for (c = starting_step; c < ending_step; c++) {
                    x = Math.cos(c / steps * 2 * Math.PI);
                    y = Math.sin(c / steps * 2 * Math.PI);

                    existing_list.push({x: x * (options.radius_x || options.radius), y: y * (options.radius_y || options.radius)});
                }
            } else if (type == 'oval') {
                for (c = starting_step; c < ending_step; c++) {
                    x = Math.cos(c / steps * 2 * Math.PI);
                    y = Math.sin(c / steps * 2 * Math.PI);

                    x = x < 0 ? -Math.pow(Math.abs(x), options.warp_x || 1) : Math.pow(x, options.warp_x || 1);
                    x = x < 0 ? x * (options.shrink_left || 1) : x * (options.shrink_right || 1);

                    y = y < 0 ? -Math.pow(Math.abs(y), options.warp_y || 1) : Math.pow(y, options.warp_y || 1);
                    y = y < 0 ? y * (options.shrink_top || 1) : y * (options.shrink_bottom || 1);

                    if (options.pinch_bottom && y > 0) {
                        x = x < 0 ? -Math.pow(Math.abs(x), options.pinch_bottom || 1) : Math.pow(x, options.pinch_bottom || 1);
                    }
                    if (options.pinch_top && y < 0) {
                        x = x < 0 ? -Math.pow(Math.abs(x), options.pinch_top || 1) : Math.pow(x, options.pinch_top || 1);
                    }
                    if (options.warp_y_bottom && y > 0) {
                        y = Math.pow(y, options.warp_y_bottom || 1);
                    }
                    if ((typeof options.raise_below == "number") && y > options.raise_below) {
                        y *= options.raise_below_amount || .9;
                    }
                    var point_b = {x: x * (options.radius_x || options.radius), y: y * (options.radius_y || options.radius)};
                    if ((typeof options.facet_below == "number") && (y > options.facet_below)) {
                        var next_y = Math.sin((c + 1) / steps * 2 * Math.PI);

                        if ((typeof options.dont_facet_below == "number") && y > options.dont_facet_below && next_y > options.dont_facet_below) {
                            // Don't make the lower points a line
                        } else {
                            point_b.line = true;
                        }
                    }

                    existing_list.push(point_b);
                }
            } else if (_.str.startsWith(type, 'almond-horizontal')) {
                for (c = starting_step; c < ending_step; c++) {
                    x = Math.cos(c / steps * 2 * Math.PI) * (options.radius_x || options.radius);
                    y = Math.sin(c / steps * 2 * Math.PI) * (options.radius_y || options.radius) * .5;
                    existing_list.push({x: x, y: y});
                    if (c % (steps / 2)) {
                        existing_list.push({x: x, y: y});
                    }
                }
            } else if (type == 'neck') {
                existing_list = [
                    {x: -options.radius, y: -options.radius},
                    {x: -options.radius, y: -options.radius},
                    {x: options.radius, y: -options.radius},
                    {x: options.radius, y: -options.radius},
                    {x: options.radius * (options.curvature || 1), y: 0},
                    {x: options.radius, y: options.radius},
                    {x: options.radius, y: options.radius},
                    {x: -options.radius, y: options.radius},
                    {x: -options.radius, y: options.radius},
                    {x: -options.radius * (options.curvature || 1), y: 0}
                ];
            }
        });
        return existing_list;
    }

    function comparePoints(existing_list, attribute, cardinality, returnPoint) {
        var result = null;
        var best_point = null;
        if (attribute == 'height') {
            var y_max = comparePoints(existing_list, 'y', 'highest');
            var y_min = comparePoints(existing_list, 'y', 'lowest');
            result = Math.max(y_max - y_min, y_min - y_max);

        } else if (attribute == 'width') {
            var x_max = comparePoints(existing_list, 'x', 'highest');
            var x_min = comparePoints(existing_list, 'x', 'lowest');
            result = Math.max(x_max - x_min, x_min - x_max);

        } else if (attribute == 'closest') {
            var closest_distance = Number.MAX_VALUE;
            var closest_point = null;
            for (var c = 0; c < existing_list.length; c++) {
                var point = existing_list[c];
                var dist = Helpers.distanceXY(point, cardinality);
                if (dist < closest_distance) {
                    closest_point = point;
                    closest_distance = dist;
                }
            }
            result = closest_point;

        } else if (attribute == 'crosses x') {
            for (var d = 0; d < existing_list.length - 1; d++) {
                var current_point = existing_list[d];
                var next_point = existing_list[d + 1];

                if ((current_point.x <= cardinality && next_point.x >= cardinality) ||
                    (current_point.x >= cardinality && next_point.x <= cardinality)) {
                    //This line segment crosses the desired y
                    if (current_point.x == next_point.x) {
                        result = current_point.y;
                    } else if (current_point.y == next_point.y) {
                        result = current_point.y;
                    } else {
                        var intersect = checkLineIntersection(current_point, next_point,
                            {x: cardinality, y: current_point.y}, {x: cardinality, y: next_point.y});
                        result = intersect.y;
                    }
                    break;
                }
            }
            if (result == null) debugger;

        } else {
            var lowest = Number.MAX_VALUE;
            var highest = Number.MIN_VALUE;

            _.each(existing_list, function (point) {
                if (point[attribute] > highest) {
                    highest = point[attribute];
                    if (cardinality == 'highest') {
                        best_point = point;
                    }
                }
                if (point[attribute] < lowest) {
                    lowest = point[attribute];
                    if (cardinality == 'lowest') {
                        best_point = point;
                    }
                }
            });

            if (cardinality == 'highest') {
                result = highest;
            } else if (cardinality == 'lowest') {
                result = lowest;
            } else if (cardinality == 'middle') {
                result = (highest + lowest) / 2;
                //TODO: Return point if returnPoint requested
            }
        }
        if (returnPoint) {
            result = best_point;
        }
        return result;
    }

    function midPointBetween(p1, p2) {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        }
    }

    //Point and line tracking
    function findShape(lines, name, empty_value, attribute_name) {
        var shape = _.find(lines, function (shape) {
            return shape.name == name
        });
        if (!shape && !attribute_name) {
            console.error("avatar.js - Error: " + name + " not found when trying to 'findShape'");
        }
        var result;
        if (attribute_name && shape && shape[attribute_name]) {
            result = shape[attribute_name];
        } else {
            result = shape || (typeof empty_value == "undefined" ? {} : empty_value);
        }
        return result;
    }

    function findPoint(avatar, name) {
        var existingPoint = _.find(avatar.registered_points, function (point) {
            return point.name == name;
        });
        var found = null;
        if (existingPoint && existingPoint.point) {
            found = existingPoint.point;
        } else {
            console.error("avatar.js - Error: " + name + " not found when trying to 'findPoint'");
        }
        return found || {};
    }

    function namePoint(avatar, name, point) {
        var existingPoint = _.find(avatar.registered_points, function (point) {
            return point.name == name;
        });
        if (existingPoint) {
            existingPoint.point = point;
        } else {
            avatar.registered_points = avatar.registered_points || [];
            avatar.registered_points.push({name: name, point: point});
        }
    }

    //Path creation and editing
    function transformPathFromLocalCoordinates(points_local, width_radius, height_radius, center_x, center_y) {
        if (!_.isArray(points_local)) points_local = [points_local];

        var points = [];
        for (var p = 0; p < points_local.length; p++) {
            var point = _.clone(points_local[p]);
            var x = (width_radius * point.x / 10) + (center_x || 0);
            var y = (height_radius * point.y / 10) + (center_y || 0);
            point.x = x;
            point.y = y;
            points.push(point);
        }
        return points;
    }

    function transformPathFromGlobalCoordinates(points_global, width_radius, height_radius, center_x, center_y) {
        //NOTE: Untested function
        if (!_.isArray(points_global)) points_global = [points_global];

        var points = [];
        for (var p = 0; p < points_global.length; p++) {
            var point = _.clone(points_global[p]);
            var x = point.x - (center_x || 0);
            var y = point.y - (center_y || 0);
            point.x = x / width_radius * 10;
            point.y = y / height_radius * 10;
            points.push(point);
        }
        return points;
    }

    function createPathFromLocalCoordinates(points_local, style, width_radius, height_radius) {
        var points = transformPathFromLocalCoordinates(points_local, width_radius, height_radius);
        return createPath(points, style);
    }

    function createPath(points, style) {
        if (!points || !points.length || points.length < 2) return null;
        style = style || {};

        var color = style.line_color || style.color || 'black';
        if (color == 'blank') color = 'rgba(0,0,0,0)';
        var thickness = style.thickness || 1;
        var fill_color = style.fill_color || null;

        var returnedShapes = [];

        if (style.dot_array) {

            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                var circle = new createjs.Shape();
                circle.graphics.beginStroke(color).drawEllipse(point.x - (thickness / 2), point.y - (thickness / 2), thickness, thickness);

                if (style.x) circle.x = style.x;
                if (style.y) circle.y = style.y;
                if (style.alpha) circle.alpha = style.alpha;
                if (style.rotation) circle.rotation = style.rotation;
                returnedShapes.push(circle);
            }

        } else {
            var line = new createjs.Shape();

            line.graphics.beginStroke(color).setStrokeStyle(thickness);

            //TODO: Have multiple fills?
            if (style.fill_canvas) {
                line.graphics.beginBitmapFill(style.fill_canvas)
            } else if (fill_color) {
                line.graphics.beginFill(fill_color);
            } else if (style.fill_colors) {
                var x_offset_start, x_offset_end, y_offset_start, y_offset_end, radius, fill_steps;
                if (style.fill_method == 'linear') {
                    x_offset_start = assignNumbersInOrder(style.x_offset_start, -style.radius, comparePoints(points, 'x', 'lowest'), 0);
                    x_offset_end = assignNumbersInOrder(style.x_offset_end, style.radius, comparePoints(points, 'x', 'highest'), 0);
                    y_offset_start = assignNumbersInOrder(style.y_offset_start, 0);
                    y_offset_end = assignNumbersInOrder(style.y_offset_end, 0);
                    fill_steps = style.fill_steps || [0, 1];

                    line.graphics.beginLinearGradientFill(
                        style.fill_colors, fill_steps, x_offset_start, y_offset_start, x_offset_end, y_offset_end)

                } else { //Assume Radial
                    x_offset_start = assignNumbersInOrder(style.x_offset_start, style.x_offset, comparePoints(points, 'x', 'middle'), 0);
                    x_offset_end = assignNumbersInOrder(style.x_offset_end, style.x_offset, comparePoints(points, 'x', 'middle'), 0);
                    y_offset_start = assignNumbersInOrder(style.y_offset_start, style.y_offset, comparePoints(points, 'y', 'middle'), 0);
                    y_offset_end = assignNumbersInOrder(style.y_offset_end, style.y_offset, comparePoints(points, 'y', 'middle'), 0);
                    fill_steps = style.fill_steps || [0, 1];
                    radius = style.radius || 10;

                    line.graphics.beginRadialGradientFill(
                        style.fill_colors, fill_steps, x_offset_start, y_offset_start, 0, x_offset_end, y_offset_end, radius);
                }
            }

            var p1, p2, p3, mid;

            if (style.close_line) {
                p1 = points[0];
                p2 = points[1];
                mid = midPointBetween(p1, p2);
                line.graphics.moveTo(mid.x, mid.y);
            } // TODO: There's some overlap if closed - maybe don't draw p0, and just loop through p1,p2?

            if (style.x) line.x = style.x;
            if (style.y) line.y = style.y;
            if (style.alpha) line.alpha = style.alpha;
            if (style.rotation) line.rotation = style.rotation;

            for (var j = 1; j < points.length; j++) {
                p1 = points[(points.length + j - 1) % (points.length)];
                p2 = points[j];
                mid = midPointBetween(p1, p2);
                if (p1.line) {
                    line.graphics.lineTo(p1.x, p1.y);
                } else {
                    line.graphics.quadraticCurveTo(p1.x, p1.y, mid.x, mid.y);
                }
            }

            if (style.close_line) {
                p1 = points[points.length - 1];
                p2 = points[0];
                p3 = points[1];
                mid = midPointBetween(p1, p2);
                line.graphics.quadraticCurveTo(p1.x, p1.y, mid.x, mid.y);
                mid = midPointBetween(p2, p3);
                line.graphics.quadraticCurveTo(p2.x, p2.y, mid.x, mid.y);

            } else {
                line.graphics.lineTo(points[points.length - 1].x, points[points.length - 1].y);
            }
            returnedShapes.push(line);
        }
        if (returnedShapes.length && returnedShapes.length == 1) {
            return returnedShapes[0];
        } else {
            return returnedShapes;
        }
    }

    function assignNumbersInOrder(num1, num2, num3, num4, num5) {
        var result = num1;
        if (typeof num1 != 'number' || isNaN(num1)) {
            result = num2;
            if (typeof num2 != 'number' || isNaN(num2)) {
                result = num3;
                if (typeof num3 != 'number' || isNaN(num3)) {
                    result = num4;
                    if (typeof num4 != 'number' || isNaN(num4)) {
                        result = num5;
                        if (typeof num5 != 'number' || isNaN(num5)) {
                            result = 0;
                        }
                    }
                }
            }
        }
        return result
    }

    function createMultiPathFromLocalCoordinates(points_local, style, width_radius, height_radius) {
        var points = transformPathFromLocalCoordinates(points_local, width_radius, height_radius);
        return createMultiPath(points, style);
    }

    function amountFromVarOrRange(point_amount, gradient, setting, percent, isColor) {
        var amount = setting;

        if (point_amount) {
            amount = point_amount;
        } else if (gradient) {
            if (!_.isArray(gradient)) gradient = [gradient];
            var grad_length = gradient.length;
            if (grad_length == 1) {
                amount = gradient[0];
            } else {
                var pos_percent = percent * (grad_length - 1);
                var pos_floor = Math.floor(pos_percent);
                var pos_ceil = Math.ceil(pos_percent);

                if (pos_floor == pos_ceil) {
                    amount = gradient[pos_floor];
                } else {
                    var val_at_pos_floor = gradient[pos_floor];
                    var val_at_pos_ceil = gradient[pos_ceil];

                    var pos_percent_at_floor = pos_floor / (grad_length - 1);
                    var pos_percent_at_ceil = pos_ceil / (grad_length - 1);

                    var percent_between_floor_and_ceil = (percent - pos_percent_at_floor) / (pos_percent_at_ceil - pos_percent_at_floor);
                    if (isColor) {
                        var color_floor = net.brehaut.Color(val_at_pos_floor);
                        var color_ceil = net.brehaut.Color(val_at_pos_ceil);
                        amount = color_floor.blend(color_ceil, percent_between_floor_and_ceil).toString();
                    } else {
                        amount = ((val_at_pos_ceil - val_at_pos_floor) * percent_between_floor_and_ceil) + val_at_pos_floor;
                    }
                }
            }
        }

        return amount;
    }

    function createMultiPath(points, style) {
        if (!points || !points.length || points.length < 2) return null;
        style = style || {};

        //NOTE: Color, Thickness, and Alpha can be:
        // 1) Specified on each line segment (highest priority)
        // 2) Given as a range (e.g. '[0,.1,.9,1]'
        // 3) Given as a standard variable (e.g. 'style.thickness')

        var color = style.line_color || 'black';
        var thickness = style.thickness || 1;

        if (style.break_line_every) {
            points = hydratePointsAlongLine(points, style.break_line_every, true);
        }

        var returnedShapes = [];

        var line = new createjs.Shape();
        for (var i = 1; i < points.length; i++) {

            var p1 = points[i - 1];
            var p2 = points[i];
            var p3 = points[i + 1];

            //TODO: get p3 and do a mid for quads?

            var percent = (i / points.length);
            var thickness_now = amountFromVarOrRange(p1.thickness, style.thickness_gradients, thickness, percent);
            var color_now = amountFromVarOrRange(p1.color, style.line_color_gradients, color, percent, true);

            if (thickness_now > 0) {
                line.graphics.beginStroke(color_now).setStrokeStyle(thickness_now);

                if (style.dot_array) {
                    line.graphics.drawEllipse(p1.x - (thickness / 2), p1.y - (thickness / 2), thickness, thickness);
                } else if (!p1.line && p3) {
                    line.graphics.moveTo(p1.x, p1.y).quadraticCurveTo(p2.x, p2.y, p3.x, p3.y);
                } else {
                    line.graphics.moveTo(p1.x, p1.y).lineTo(p2.x, p2.y);
                }
            }
        }

        if (style.alpha !== undefined) line.alpha = style.alpha;
        if (style.x) line.x = style.x;
        if (style.y) line.y = style.y;
        if (style.rotation) line.rotation = style.rotation;

        line.graphics.endStroke();

        returnedShapes.push(line);

        return returnedShapes;
    }

    function extrudeHorizontalArc(linePoints, distX, distY, distPeak) {
        //Have distY be positive to do an inner arc
        var newPoints = [];

        var midX = 0;
        _.each(linePoints, function (point) {
            midX += point.x;
        });
        midX /= linePoints.length;

        if (distY > 0) {
            _.each(linePoints, function (point) {
                var usePoint = true;
                var newX, newY;

                if (point.x < midX) {
                    newX = point.x + distX;
                    newY = point.y + distY;
                    if (newX > midX) usePoint = false;
                } else if (point.x > midX) {
                    newX = point.x - distX;
                    newY = point.y + distY;
                    if (newX < midX) usePoint = false;
                }
                if (usePoint) {
                    var newPoint = _.clone(point);
                    newPoint.x = newX;
                    newPoint.y = newY;
                    newPoints.push(newPoint);
                }
            });
            if (typeof distPeak == "number" && newPoints.length && newPoints.length > 2) {
                var midPos = Math.ceil(newPoints.length / 2);

                var newPoint = _.clone(newPoints[midPos]);
                newPoint.x = midX;
                newPoint.y += distPeak;
                newPoints.splice(midPos, 0, newPoint);
            }

        } else {

            _.each(linePoints, function (point) {
                var newX, newY;

                if (point.x < midX) {
                    newX = point.x - distX;
                    newY = point.y + distY;
                } else if (point.x >= midX) {
                    newX = point.x + distX;
                    newY = point.y + distY;
                }
                var newPoint = _.clone(point);
                newPoint.x = newX;
                newPoint.y = newY;
                newPoints.push(newPoint);
            });

        }
        return newPoints;
    }

    function distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    function angleBetween(point1, point2) {
        return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    function hydratePointsAlongLine(line, spacing, dontLinkLastFirst) {
        spacing = spacing || 5;
        var newLine = [];
        var lastPoint = line[0];

        var currentPoint;
        _.each(line, function (currentPoint) {
            var dist = distanceBetween(lastPoint, currentPoint);
            var angle = angleBetween(lastPoint, currentPoint);
            for (var i = 0; i < dist; i += spacing) {
                var newPoint = _.clone(currentPoint);
                newPoint.x = lastPoint.x + (Math.sin(angle) * i);
                newPoint.y = lastPoint.y + (Math.cos(angle) * i);
                newLine.push(newPoint);
            }
            lastPoint = currentPoint;
        });

        if (!dontLinkLastFirst) {
            //Do again for last-first point
            lastPoint = line[line.length - 1];
            currentPoint = line[0];
            var dist = distanceBetween(lastPoint, currentPoint);
            var angle = angleBetween(lastPoint, currentPoint);
            for (var i = 0; i < dist; i += spacing) {
                var newPoint = _.clone(currentPoint);
                newPoint.x = lastPoint.x + (Math.sin(angle) * i);
                newPoint.y = lastPoint.y + (Math.cos(angle) * i);
                newLine.push(newPoint);
            }
        }
        return newLine;
    }

    function constrainPolyLineToBox(poly_line, box) {
        var constrained_line = [];

        var last_crossed = null;
        var last_point = null;
        _.each(poly_line, function (point, i) {
            var directionOfCurrentPoint = whereIsPointInBox(point, box);
            if (!last_point || !last_point.inside || !directionOfCurrentPoint.inside) {
                var i_last = (i - 1 + poly_line.length) % poly_line.length;
                var line_start = poly_line[i_last]; //Find previous point, or last point if less
                var line_end = point;

                //Track where points crossed boundary lines
                var cross_points = [];
                var cross_top = checkLineIntersection(line_start, line_end, box.tl, {x: box.br.x, y: box.tl.y}, 'top');
                if (cross_top.onLine1 && cross_top.onLine2) cross_points.push(cross_top);

                var cross_right = checkLineIntersection(line_start, line_end, box.br, {x: box.br.x, y: box.tl.y}, 'right');
                if (cross_right.onLine1 && cross_right.onLine2) cross_points.push(cross_right);

                var cross_bottom = checkLineIntersection(line_start, line_end, box.br, {x: box.tl.x, y: box.br.y}, 'bottom');
                if (cross_bottom.onLine1 && cross_bottom.onLine2) cross_points.push(cross_bottom);

                var cross_left = checkLineIntersection(line_start, line_end, box.tl, {x: box.tl.x, y: box.br.y}, 'left');
                if (cross_left.onLine1 && cross_left.onLine2) cross_points.push(cross_left);

                //The closest should be the next in line
                cross_points = cross_points.sort(function (point_crossed) {
                    return Helpers.distanceXY(point, point_crossed)
                });
                cross_points = cross_points.reverse();

                //For all points that cross the boundary, add cross points and corner points
                _.each(cross_points, function (cross_point) {
                    var point_clone = _.clone(point);
                    point_clone.line = true;
                    point_clone.x = cross_point.x;
                    point_clone.y = cross_point.y;

                    if (last_crossed && (cross_point.crossed != last_crossed)) {
                        //Cover corner points
                        var point_clone2 = _.clone(point);
                        point_clone2.line = true;

                        if ((cross_point.crossed == 'top' && last_crossed == 'right') || (cross_point.crossed == 'right' && last_crossed == 'top')) {
                            point_clone2.x = box.br.x;
                            point_clone2.y = box.tl.y;
                            constrained_line.push(point_clone2);
                        } else if ((cross_point.crossed == 'top' && last_crossed == 'left') || (cross_point.crossed == 'left' && last_crossed == 'top')) {
                            point_clone2.x = box.tl.x;
                            point_clone2.y = box.tl.y;
                            constrained_line.push(point_clone2);
                        } else if ((cross_point.crossed == 'bottom' && last_crossed == 'right') || (cross_point.crossed == 'right' && last_crossed == 'bottom')) {
                            point_clone2.x = box.br.x;
                            point_clone2.y = box.br.y;
                            constrained_line.push(point_clone2);
                        } else if ((cross_point.crossed == 'bottom' && last_crossed == 'left') || (cross_point.crossed == 'left' && last_crossed == 'bottom')) {
                            point_clone2.x = box.tl.x;
                            point_clone2.y = box.br.y;
                            constrained_line.push(point_clone2);
                        } else if (cross_point.crossed == 'right' && last_crossed == 'left') {
//                        if (directionOfCurrentPoint.bottom) { //TODO: This wont work for everything
                            point_clone2.x = box.tl.x;
                            point_clone2.y = box.br.y;
                            constrained_line.push(point_clone2);
                            var p3 = _.clone(point_clone2);
                            p3.x = box.br.x;
                            constrained_line.push(p3);
                        } else if (cross_point.crossed == 'left' && last_crossed == 'right') {
//                        if (directionOfCurrentPoint.bottom) { //TODO: This wont work for everything
                            point_clone2.x = box.tl.x;
                            point_clone2.y = box.br.y;
                            var p4 = _.clone(point_clone2);
                            p4.x = box.br.x;
                            constrained_line.push(point_clone2);
                            constrained_line.push(p4);
                        }
//                    last_crossed = cross_point.crossed;
                    }
                    constrained_line.push(point_clone);

                    if (cross_point.crossed) {
                        last_crossed = cross_point.crossed;
                    }
                });
            }
            if (directionOfCurrentPoint.inside) {
                constrained_line.push(_.clone(point));
            }

            last_point = point;
        });

        return constrained_line;
    }

    function whereIsPointInBox(point, box) {
        // point = {x, y}
        // box = {tl.x, tl.y, br.x, br.y}

        var whereIsPoint = {};
        if (point.x <= box.br.x && point.x >= box.tl.x &&
            point.y <= box.br.y && point.y >= box.tl.y) {
            whereIsPoint.inside = true;
        } else if (point.x >= box.br.x) {
            if (point.y < box.tl.y) {
                whereIsPoint.top = true;
                whereIsPoint.right = true;
            } else if (point.y > box.br.y) {
                whereIsPoint.bottom = true;
                whereIsPoint.right = true;
            } else {
                whereIsPoint.middle = true;
                whereIsPoint.right = true;
            }
        } else if (point.x <= box.tl.x) {
            if (point.y < box.tl.y) {
                whereIsPoint.top = true;
                whereIsPoint.left = true;
            } else if (point.y > box.br.y) {
                whereIsPoint.bottom = true;
                whereIsPoint.left = true;
            } else {
                whereIsPoint.middle = true;
                whereIsPoint.left = true;
            }
        } else {
            if (point.y < box.tl.y) {
                whereIsPoint.top = true;
                whereIsPoint.middle = true;
            } else if (point.y > box.br.y) {
                whereIsPoint.bottom = true;
                whereIsPoint.middle = true;
            } else {
                whereIsPoint.inside = true;
            }
        }

        return whereIsPoint;
    }

    function checkLineIntersection(line1Start, line1End, line2Start, line2End, crossedName) {
        //From: http://jsfiddle.net/justin_c_rounds/Gd2S2/
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite)
        // and booleans for whether line segment 1 or line segment 2 contain the point

        var denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
        denominator = ((line2End.y - line2Start.y) * (line1End.x - line1Start.x)) - ((line2End.x - line2Start.x) * (line1End.y - line1Start.y));
        if (denominator == 0) {
            return result;
        }
        a = line1Start.y - line2Start.y;
        b = line1Start.x - line2Start.x;
        numerator1 = ((line2End.x - line2Start.x) * a) - ((line2End.y - line2Start.y) * b);
        numerator2 = ((line1End.x - line1Start.x) * a) - ((line1End.y - line1Start.y) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        // if we cast these lines infinitely in both directions, they intersect here:
        result.x = line1Start.x + (a * (line1End.x - line1Start.x));
        result.y = line1Start.y + (a * (line1End.y - line1Start.y));

        // it is worth noting that this should be the same as:
        // x = line2Start.x + (b * (line2End.x - line2Start.x));
        // y = line2Start.x + (b * (line2End.y - line2Start.y));

        // if line1 is a segment and line2 is infinite, they intersect if:
        if (a > 0 && a < 1) {
            result.onLine1 = true;
        }
        // if line2 is a segment and line1 is infinite, they intersect if:
        if (b > 0 && b < 1) {
            result.onLine2 = true;
        }
        if (crossedName) {
            result.crossed = crossedName;
        }
        // if line1 and line2 are segments, they intersect if both of the above are true
        return result;
    }

    //---------------------
    //Stage management
    function setupStage(canvas) {
        return new createjs.Stage(canvas);
    }

    function findStageByCanvas(canvas_id) {
        var isString = typeof canvas_id == "string";
        var stage = null;

        //Search by canvas_id or $canvas
        for (var i = 0; i < STAGES.length; i++) { //Searches through the main 'avatar' class, not just this instance
            var STAGE = STAGES[i];
            if (isString) {
                if (STAGE.canvas_id == canvas_id) {
                    stage = STAGE.stage;
                    break;
                }
            } else {
                if (STAGE.$canvas == canvas_id) {
                    stage = STAGE.stage;
                    break;
                }
            }
        }
        return stage;
    }

    function addStageByCanvas(options) {
        var item = {};
        if (options.canvas_id) {
            item.canvas_id = options.canvas_id;
            item.$canvas = $(item.canvas_id);
        }
        if (options.$canvas) {
            item.$canvas = options.$canvas;
        }
        if (options.stage) {
            item.stage = options.stage;
        } else {
            throw "error in avatar.js - addStageByCanvas needs a stage to be passed in"
        }
        STAGES.push(item);
    }

    //----------------------
    //Random numbers
    AvatarClass.prototype.randomSetSeed = function (seed) {
        this.face_options = this.face_options || {};
        this.face_options.rand_seed = seed || Math.random();
    };

    function random(face_options) {
        face_options = face_options || {};
        face_options.rand_seed = face_options.rand_seed || Math.random();
        var x = Math.sin(face_options.rand_seed++) * 300000;
        return x - Math.floor(x);
    }

    function randInt(max, face_options) {
        max = max || 100;
        return parseInt(random(face_options) * max + 1);
    }

    function randOption(options, face_options, dontUseVal) {
        var len = options.length;
        var numChosen = randInt(len, face_options) - 1;
        var result = options[numChosen];
        if (dontUseVal) {
            if (result == dontUseVal) {
                numChosen = (numChosen + 1) % len;
                result = options[numChosen];
            }
        }
        return result;
    }

    AvatarClass.prototype._private_functions = {
        getFirstRaceFromData: getFirstRaceFromData,
        registerEvents: registerEvents,
        buildDecoration: buildDecoration,
        buildFaceZones: buildFaceZones,
        addSceneChildren: addSceneChildren,
        transformPathFromLocalCoordinates: transformPathFromLocalCoordinates,
        transformPathFromGlobalCoordinates: transformPathFromGlobalCoordinates,
        transformLineToGlobalCoordinates: transformLineToGlobalCoordinates,
        lineSegmentCompared: lineSegmentCompared,
        transformShapeLine: transformShapeLine,
        comparePoints: comparePoints,
        midPointBetween: midPointBetween,
        createPathFromLocalCoordinates: createPathFromLocalCoordinates,
        createPath: createPath,
        createMultiPathFromLocalCoordinates: createMultiPathFromLocalCoordinates,
        createMultiPath: createMultiPath,
        amountFromVarOrRange: amountFromVarOrRange,
        namePoint: namePoint,
        findPoint: findPoint,
        findShape: findShape,
        turnWordToNumber: turnWordToNumber,
        whereIsPointInBox: whereIsPointInBox,
        checkLineIntersection: checkLineIntersection,
        extrudeHorizontalArc: extrudeHorizontalArc,
        distanceBetween: distanceBetween,
        constrainPolyLineToBox: constrainPolyLineToBox,
        angleBetween: angleBetween,
        hydratePointsAlongLine: hydratePointsAlongLine,
        setupStage: setupStage,
        getHeightOfStage: getHeightOfStage,
        findStageByCanvas: findStageByCanvas,
        addStageByCanvas: addStageByCanvas,
        random: random,
        randInt: randInt,
        randOption: randOption
    };

    return AvatarClass;
})($, _, net, createjs, Helpers, maths);

//TODO: Is this the best way to have helper functions?
Avatar.getRaces = function () {
    return new Avatar('get_races');
};
Avatar.initializeOptions = function (face_options_basic, human_data_options) {
    var av_pointer = new Avatar('initialize');
    av_pointer.initializeOptions(face_options_basic, human_data_options);
};;
(function (AvatarClass) {

    var _face_options = {
        style: 'lines',
        race: 'Human',
        rand_seed: 0,

        //'Living' settings that can change over time
        age: 30,
        era: 'Industrial',
        thickness: 0,
        cleanliness: 0,

        hair_style: null,
        hair_pattern: null,
        hair_texture: 'Smooth',
        hair_color: null,

        beard_color: null,
        beard_style: null,
        stubble_style: null,
        mustache_style: null,
        mustache_width: null,
        mustache_height: null,
        acne_style: null,
        acne_amount: null,
        skin_texture: 'Normal',
        teeth_condition: 'Normal',
        lip_color: null,

        emotionality: 0,
        emotion_shown: 'none', //TODO: Have an array of current emotions?
        tattoos: [],
        jewelry: [],
        scars: [],

        //DNA settings that don't change easily
        gender: null,
        height: 0,

        skin_shade_tint: null,
        skin_shade: null,
        skin_colors: null,
        face_shape: null,
        skull_thickness: 'Normal',
        chin_divot: null,
        chin_shape: null,

        neck_size: null,

        eye_color: null,
        eye_shape: null,
        eye_spacing: null,
        eye_size: null,
        eye_rotation: null,
        eyelid_shape: null,
        eye_cloudiness: null,
        eyebrow_shape: null,
        pupil_color: null,
        eye_sunken: null,

        head_size: 'Normal',
        hairiness: null,
        forehead_height: null,
        hair_color_roots: null,

        nose_shape: null,
        nose_size: null,
        nose_height: null,

        teeth_shape: 'Normal',
        lip_shape: null,
        mouth_height: null,
        mouth_left_upturn: null,
        mouth_right_upturn: null,
        mouth_width: null,
        mouth_upturn: null,
        mouth_downturn: null,
        lip_bottom_height: null,
        lip_top_height: null,
        lip_bottom_bottom: null,
        lip_top_top: null,

        ear_shape: null,
        ear_thickness: null,
        ear_lobe_left: null,
        ear_lobe_right: null,

        wrinkle_pattern_mouth: null,
        wrinkle_mouth_width: null,
        wrinkle_mouth_height: null,
        wrinkle_resistance: null

    };

    var _human_options = {
        rendering_order: [
            {decoration: "box-behind"},
            {feature: "shoulders", style: "lines"},
            {feature: "neck", style: "lines"},
            {feature: "face", style: "lines"},
            {feature: "eye_position", style: "lines"},
            {feature: "nose", style: "lines"}, //Uses: right eye intermost
            {feature: "chin", style: "lines"}, //Uses: chin mid line, face
            {feature: "mouth", style: "lines"}, //NOTE: Shown twice to predraw positions
            {feature: "wrinkles", style: "lines"}, //Uses: face, left eye, right eye, lips, full nose, chin top line
            {feature: "beard", style: "lines"}, //Uses: face, left eye
            {feature: "mouth", style: "lines"},
            {feature: "mustache", style: "lines"},
            {feature: "eyes", style: "lines"},
            {feature: "hair", style: "lines"}, //Uses: face, left eye
            {feature: "ears", style: "lines"},
            {decoration: "name-plate"}
        ],

        //If Preset, then use one of the skin_color_options and change tint, otherwise calculate by tint and lightness
        skin_shade_options: "Light,Dark,Preset".split(","),
        skin_shade_tint_options: "Darkest,Darker,Dark,Very Low,Low,Less,Below,Reduce,Raised,Above,More,High,Very High,Bright,Brighter,Brightest".split(","),
        skin_colors_options: [
            {name: 'Fair', highlights: 'rgb(254,202,182)', skin: 'rgb(245,185,158)', cheek: 'rgb(246,171,142)', darkflesh: 'rgb(217,118,76)', deepshadow: 'rgb(202,168,110'},
            {name: 'Brown', highlights: 'rgb(229,144,90)', skin: 'rgb(228,131,86)', cheek: ' rgb(178,85,44)', darkflesh: 'rgb(143,70,29)', deepshadow: 'rgb(152,57,17'},
            {name: 'Tanned', highlights: 'rgb(245,194,151)', skin: 'rgb(234,154,95)', cheek: 'rgb(208,110,56)', darkflesh: 'rgb(168,66,17)', deepshadow: 'rgb(147,68,27'},
            {name: 'White', highlights: 'rgb(250,220,196)', skin: 'rgb(245,187,149)', cheek: 'rgb(239,165,128)', darkflesh: 'rgb(203,137,103)', deepshadow: 'rgb(168,102,68'},
            {name: 'Medium', highlights: 'rgb(247,188,154)', skin: 'rgb(243,160,120)', cheek: 'rgb(213,114,75)', darkflesh: 'rgb(154,79,48)', deepshadow: 'rgb(127,67,41'},
            {name: 'Yellow', highlights: 'rgb(255,218,179)', skin: 'rgb(250,187,134)', cheek: 'rgb(244,159,104)', darkflesh: 'rgb(189,110,46)', deepshadow: 'rgb(138,67,3'},
            {name: 'Pink', highlights: 'rgb(253,196,179)', skin: 'rgb(245,158,113)', cheek: 'rgb(236,134,86)', darkflesh: 'rgb(182,88,34)', deepshadow: 'rgb(143,60,18'},
            {name: 'Bronzed', highlights: 'rgb(236,162,113)', skin: 'rgb(233,132,86)', cheek: 'rgb(219,116,75)', darkflesh: 'rgb(205,110,66)', deepshadow: 'rgb(173,83,46'},
            {name: 'Light Brown', highlights: 'rgb(242,207,175)', skin: 'rgb(215,159,102)', cheek: 'rgb(208,138,86)', darkflesh: 'rgb(195,134,80)', deepshadow: 'rgb(168,112,63'},
            {name: 'Peach', highlights: 'rgb(247,168,137)', skin: 'rgb(221,132,98)', cheek: 'rgb(183,90,57)', darkflesh: 'rgb(165,87,51)', deepshadow: 'rgb(105,29,15'},
            {name: 'Black', highlights: 'rgb(140,120,110)', skin: 'rgb(160,90,66)', cheek: 'rgb(140,80,40)', darkflesh: 'rgb(120,90,29)', deepshadow: 'rgb(30,30,30'},
            {name: 'Deep Black', highlights: 'rgb(40,40,50)', skin: 'rgb(80,80,80)', cheek: 'rgb(70,70,70)', darkflesh: 'rgb(80,70,29)', deepshadow: 'rgb(30,30,30'}
        ],

        gender_options: "Male,Female".split(","),
        thickness_options: [-1.5, -1, -.5, 0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6],  //TODO: Turn these to word options

        face_shape_options: "Oblong,Oval,Round,Rectangular,Square,Triangular,Diamond,Inverted Triangle,Heart".split(","),
        acne_style_options: "None,Very Light,Light,Medium,Heavy".split(","),
        acne_amount_options: 'None,Very Light,Light,Few,Some,Spattering,Speckled,Heavy,Very Heavy'.split(","),
        chin_divot_options: "Double,Small,Large,Smooth".split(","),
        chin_shape_options: "Pronounced,Smooth".split(","),

        hair_color_roots_options: "Yellow,Brown,Black,White,Gray,Dark Brown,Dark Yellow,Red".split(","),
        hair_style_options: "Bald,Droopy".split(","),
        hair_pattern_options: "Mid Bump,Side Part,Eye Droop,Receding,Bowl,Bowl with Peak,Bowl with Big Peak,Side Part2,Twin Peaks".split(","),
        hairiness_options: "Bald,Thin Hair,Thick Hair,Hairy,Fuzzy,Bearded,Covered in Hair,Fury".split(","), //TODO

        beard_color_options: "Hair,Black,Gray".split(","),
        beard_style_options: "None,Full Chin,Chin Warmer,Soup Catcher,Thin Chin Wrap,Thin Low Chin Wrap".split(","),
        mustache_style_options: "None,Propeller,Butterfly,Fu Manchu,Lower Dali,Dali,Sparrow,Zappa,Anchor,Copstash,Handlebar,Low Handlebar,Long Curled Handlebar,Curled Handlebar".split(","),
        mustache_width_options: "Small,Short,Medium,Long,Large".split(","),
        mustache_height_options: "Small,Short,Medium,Long,Large".split(","),
        stubble_style_options: "None,Light,Medium,Heavy".split(","),
        neck_size_options: "Thick,Concave".split(","),

        nose_shape_options: "Flat,Wide,Thin,Turned up/perky,Normal,Hooked down,Bulbous,Giant Nostrils".split(","),
        nose_size_options: "Tiny,Small,Normal,Large,Big,Giant,Huge".split(","),
        nose_height_options: "Low,Normal,Raised".split(","),

        eye_spacing_options: "Pinched,Thin,Normal,Wide".split(","),
        eye_size_options: "Small,Normal,Big".split(","),
        eye_shape_options: "Almond".split(","),
        eye_color_options: "Hazel,Amber,Green,Blue,Gray,Brown,Dark Brown,Black".split(","),
        eye_lids_options: "None,Smooth,Folded,Thick".split(","), //TODO
        eye_cloudiness_options: "Normal,Clear,Misty".split(","),
        eyebrow_shape_options: "Straight,Squiggle,Squiggle Flip,Slim,Lifted,Arch,Thick Arch,Caterpiller,Wide Caterpiller,Unibrow".split(","),
        eye_rotation_options: "Flat,Small,Medium,Large,Slanted".split(","),
        pupil_color_options: "Black".split(","),
        eye_sunken_options: "Cavernous,Deep,Dark,Light,Smooth,None".split(","),

        ear_shape_options: "Round".split(","),
        ear_thickness_options: "Wide,Normal,Big,Tall,Splayed".split(","),
        ear_lobe_left_options: "Hanging,Attached".split(","),
        ear_lobe_right_options: "Hanging,Attached,Same".split(","),

        mouth_height_options: "Low,Normal,Raised,High".split(","),
        mouth_left_upturn_options: "Down,Low,Normal,Raised,High".split(","),
        mouth_right_upturn_options: "Down,Low,Normal,Raised,High".split(","),
        mouth_width_options: "Wide,Big,Normal,Short,Small,Tiny".split(","),
        mouth_upturn_options: "Large,Short,Small,Tiny".split(","),
        mouth_downturn_options: "Large,Short,Small,Tiny".split(","),

        lip_color_options: "#f00,#e00,#d00,#c00,#f10,#f01,#b22,#944".split(","),
        lip_bottom_height_options: "Down,Low,Normal,Raised,High".split(","),
        lip_top_height_options: "Down,Low,Normal,Raised,High".split(","),
        lip_bottom_bottom_options: "Down,Low,Normal,Raised,High".split(","),
        lip_top_top_options: "Down,Low,Normal,Raised,High".split(","),
        lip_shape_options: "Puckered,Thin,Thick".split(","),

        wrinkle_pattern_mouth_options: "None,Gentle,Straight,Top,Middle,Bottom,Heavy".split(","),
        wrinkle_resistance_options: "Very Low,Low,Less,Below,Reduce,Raised,Above,More,High,Very High".split(","),
        wrinkle_mouth_width_options: "Far Out,Out,Middle,In,Far In".split(","),
        wrinkle_mouth_height_options: "Far Up,Up,Middle,Down,Far Down".split(","),

        forehead_height_options: "Under,Low,Less,Normal,Above,Raised,High,Floating".split(","),

        decorations: [
            {name: "box-behind", type: 'rectangle', p1: 'facezone topleft', p2: 'facezone bottomright',
                fill_color: 'blue', alpha: 0.3, line_color: 'light blue', size: '2', forceInBounds: true},
            {name: "name-plate", type: 'rectangle', height: 16, docked: 'bottom', forceInBounds: true, font_size: 9,
                text: '{{name}}', text_color: 'black', line_color: 'brown', fill_color: 'white', alpha: 0.8}
        ]
    };

    AvatarClass.initializeOptions(_face_options, _human_options);

})(Avatar);;
(function (Avatar, net) {
    //TODO: Have textures be removed based on face_options modified

    var a = new Avatar('get_private_functions');

    //-----------------------------
    //Textures
    a.generateTextures = function (avatar) {
        //TODO: Have Some of these run for the entire class?

        avatar.textures = _.without(avatar.textures, function (tex) {
            return tex.type == 'single use'
        });
        avatar.textures = [];

        var height_object = a.getHeightOfStage(avatar);
        var resolution = height_object.resolution;


        //Build stubble colors
        var hair_tinted_gray = avatar.face_options.beard_color;
        var hair_tinted_gray2 = avatar.face_options.beard_color;

        if (avatar.face_options.hair_color && hair_tinted_gray && hair_tinted_gray == 'Hair') {
            hair_tinted_gray = avatar.face_options.hair_color;
            hair_tinted_gray2 = avatar.face_options.hair_color;
        }
        if (!hair_tinted_gray) {
            hair_tinted_gray = net.brehaut.Color('#666666').toString();
            hair_tinted_gray2 = net.brehaut.Color('#888888').toString();
        }
        hair_tinted_gray = net.brehaut.Color('#444444').blend(net.brehaut.Color(hair_tinted_gray), .1).toString();
        hair_tinted_gray2 = net.brehaut.Color('#666666').blend(net.brehaut.Color(hair_tinted_gray2), .2).toString();

        var canvas_size = 64;
        //Build Stubble texture
        var canvas = document.createElement('canvas');
        canvas.width = canvas_size;
        canvas.height = canvas_size;
        var context = canvas.getContext('2d');

        addRandomLines(context, avatar.face_options, canvas_size, resolution * 80, resolution * 4, resolution / 2, hair_tinted_gray);
        addRandomLines(context, avatar.face_options, canvas_size, resolution * 140, resolution, resolution / 2, hair_tinted_gray2);
        addRandomLines(context, avatar.face_options, canvas_size, resolution * 300, resolution * 8, resolution / 2, '#444');
        avatar.textures.push({type: 'single use', name: 'stubble lines', canvas: canvas, context: context});


        var canvas3 = document.createElement('canvas');
        canvas3.width = canvas_size;
        canvas3.height = canvas_size;
        var context3 = canvas.getContext('2d');

        addRandomLines(context3, avatar.face_options, canvas_size, resolution * 80, resolution / 2, resolution * 4, hair_tinted_gray);
        addRandomLines(context3, avatar.face_options, canvas_size, resolution * 140, resolution / 2, resolution, hair_tinted_gray2);
        avatar.textures.push({type: 'single use', name: 'hair horizontal lines', canvas: canvas3, context: context3});


        var skin_color = avatar.face_options.skin_colors.skin;
        var skin_lighter_2 = net.brehaut.Color(skin_color).lightenByRatio(.02).toString();
        var skin_darker_1 = net.brehaut.Color(skin_color).darkenByRatio(.01).toString();

        //Build Skin texture
        var canvas2 = document.createElement('canvas');
        canvas2.width = canvas_size;
        canvas2.height = canvas_size;
        var context2 = canvas2.getContext('2d');
        addRandomSpots(context2, avatar.face_options, canvas_size, resolution * 10, resolution * 1.5, skin_lighter_2);
        addRandomSpots(context2, avatar.face_options, canvas_size, resolution * 10, resolution * 1.5, skin_darker_1);
        avatar.textures.push({type: 'single use', name: 'face bumps', canvas: canvas2, context: context2});


        //Build Acne texture
        var acne_amount = a.turnWordToNumber(avatar.face_options.acne_amount, 0, 9, 'None,Very Light,Light,Few,Some,Spattering,Speckled,Heavy,Very Heavy');

        var face_reddish = net.brehaut.Color(skin_color).blend(net.brehaut.Color('#f00'), .15).toString();
        var canvas4 = document.createElement('canvas');
        canvas4.width = canvas_size * 5;
        canvas4.height = canvas_size * 5;
        var context4 = canvas4.getContext('2d');
        addRandomSpots(context4, avatar.face_options, canvas_size * 5, resolution * acne_amount, resolution * 2, face_reddish);
        avatar.textures.push({type: 'single use', name: 'face spots', canvas: canvas4, context: context4});

    };

    function addRandomSpots(context, face_options, context_size, number, radius, color) {
        context.strokeStyle = color;
        for (var i = 0; i < number; i++) {
            var x = a.randInt(context_size, face_options);
            var y = a.randInt(context_size, face_options);
            var rad = a.randInt(radius, face_options);

            context.fillStyle = color;
            context.beginPath();
            context.moveTo(x, y);
            context.arc(x, y, parseInt(rad), 0, 2 * Math.PI);
            context.closePath();
            context.fill();
            context.stroke();
        }
        return context;
    }

    function addRandomLines(context, face_options, context_size, number, length_y, length_x, color) {
        context.strokeStyle = color;
        for (var i = 0; i < number; i++) {
            var x = a.randInt(context_size, face_options);
            var y = a.randInt(context_size, face_options);
            var x_off = parseInt(a.randInt(length_x * 2, face_options) - length_x);
            var y_off = parseInt(a.randInt(length_y * 2, face_options) - length_y);

            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + x_off, y + y_off);
            context.closePath();
            context.stroke()
        }
        return context;
    }

})(Avatar, net);;
//-----------------------------------------
//Avatar.js (lines and circle styles)
//This set of functions adds rendering capabilities to avatar.js, specifically to draw things like human faces
//-----------------------------------------

//=====Line Styles==========
//face
new Avatar('add_render_function', {style: 'lines', feature: 'face', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var squish = 2.94; //2.9 - 3.1 (also adjust ears x offset)

    var zone = f.face;
    var radius_x = 10 * (zone.right - zone.left) / squish;
    var radius_y = 10 * (zone.bottom - zone.top) / squish;
    var options = {type: 'circle'};
    if (face_options.face_shape == 'Oblong') {
        options = {type: 'oval', warp_y: 0.7};
    } else if (face_options.face_shape == 'Oval') {
        options = {type: 'oval', warp_y: 0.55};
    } else if (face_options.face_shape == 'Rectangle') {
        options = {type: 'oval', facet_below: 0.1, warp_y: 0.3};
    } else if (face_options.face_shape == 'Square') {
        options = {type: 'oval', facet_below: 0.1, warp_y: 0.22};
    } else if (face_options.face_shape == 'Inverted Triangle') {
        options = {type: 'oval', facet_below: 0.1, warp_x: 0.6, pinch_bottom: 2};
    } else if (face_options.face_shape == 'Diamond') {
        options = {type: 'oval', warp_x: 0.3};
    } else if (face_options.face_shape == 'Triangular') {
        options = {type: 'oval', raise_below: 0.6, pinch_top: 2, steps: 36};
    } else if (face_options.face_shape == 'Heart') {
        options = {type: 'oval', facet_below: 0.1, warp_x: 0.3, pinch_bottom: 2};
    }
    options = $.extend({}, {facet_below: 0.4, dont_facet_below: 0.8, warp_x: 0.6, warp_y_bottom: 2}, options);

    var face_line = a.transformShapeLine(options, face_options);

    //TODO: Add Some skin variations, noise, dirtiness
    var skin_lighter = net.brehaut.Color(face_options.skin_colors.skin).lightenByRatio(0.05).toString();
    var skin_bright = net.brehaut.Color(face_options.skin_colors.skin).lightenByRatio(0.1).toString();
    var cheek_darker = net.brehaut.Color(face_options.skin_colors.cheek).darkenByRatio(0.05).toString();
    var fill_colors = [cheek_darker, skin_lighter, skin_bright, skin_lighter, cheek_darker];
    var fill_steps = [0, .25, .5, .75, 1];

    var face = a.createPathFromLocalCoordinates(face_line, {
            close_line: true, line_color: face_options.skin_colors.highlights,
            fill_method: 'linear', fill_colors: fill_colors, fill_steps: fill_steps,
            radius: radius_x * .1},
        radius_x, radius_y);
    face.x = zone.x;
    face.y = zone.y;
    lines.push({name: 'face', line: face_line, shape: face, scale_x: radius_x, scale_y: radius_y, x: zone.x, y: zone.y});
    shapes.push(face);


    var acne_alpha = 0;
    if (face_options.acne_style == "Very Light") {
        acne_alpha = 0.1;
    } else if (face_options.acne_style == "Light") {
        acne_alpha = 0.2;
    } else if (face_options.acne_style == "Medium") {
        acne_alpha = 0.3;
    } else if (face_options.acne_style == "Heavy") {
        acne_alpha = 0.4;
    }
    if (face_options.age > 25) {
        acne_alpha *= .8;
    } else if (face_options.age > 35) {
        acne_alpha *= .5;
    } else if (face_options.age > 45) {
        acne_alpha *= .2;
    } else if (face_options.age < 12) {
        acne_alpha *= .2;
    }

    var skin_texture_fill_canvas = a.findShape(avatar.textures, 'face bumps', null, 'canvas');
    var face_overlay = a.createPathFromLocalCoordinates(face_line, {
            close_line: true, line_color: 'blank',
            fill_canvas: skin_texture_fill_canvas
        },
        radius_x, radius_y);
    face_overlay.x = zone.x;
    face_overlay.y = zone.y;
    face_overlay.alpha = acne_alpha;
    lines.push({name: 'face bumps', line: face_line, shape: face_overlay, scale_x: radius_x, scale_y: radius_y, x: zone.x, y: zone.y});
    shapes.push(face_overlay);


    var skin_texture_fill_canvas2 = a.findShape(avatar.textures, 'face spots', null, 'canvas');
    var face_overlay2 = a.createPathFromLocalCoordinates(face_line, {
            close_line: true, line_color: 'blank',
            fill_canvas: skin_texture_fill_canvas2
        },
        radius_x, radius_y);
    face_overlay2.x = zone.x;
    face_overlay2.y = zone.y;
    face_overlay2.alpha = acne_alpha * 2;
    shapes.push(face_overlay2);


    return shapes;
}});

//shoulders
new Avatar('add_render_function', {style: 'lines', feature: 'shoulders', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

//TODO: Adjust by strength, align with bottom of neck
    var shoulder_shape_line = [
        {x: -4, y: -10},
        {x: -5, y: -9},
        {x: -10, y: 0},
        {x: -10, y: 0},
        {x: -10, y: 10},

        {x: 10, y: 10},
        {x: 10, y: 0},
        {x: 10, y: 0},
        {x: 5, y: -9},
        {x: 4, y: -10}
    ];

    var scale_y = f.thick_unit * 80;
    var scale_x = f.thick_unit * 200;
    var x = f.neck.x;
    var y = f.neck.y + (f.thick_unit * 300);

    var skin_lighter = net.brehaut.Color(face_options.skin_colors.skin).toString();
    var skin_bright = net.brehaut.Color(face_options.skin_colors.skin).lightenByRatio(0.05).toString();
    var cheek_darker = net.brehaut.Color(face_options.skin_colors.cheek).darkenByRatio(0.05).toString();
    var fill_colors = [skin_bright, skin_lighter, cheek_darker, skin_lighter, skin_bright];
    var fill_steps = [0, .25, .5, .75, 1];

    var image_tl = a.findPoint(avatar, 'facezone topleft');
    var image_br = a.findPoint(avatar, 'facezone bottomright');

    var shoulder_shape_line_global = a.transformPathFromLocalCoordinates(shoulder_shape_line, scale_x, scale_y, x, y);


    shoulder_shape_line_global = a.constrainPolyLineToBox(shoulder_shape_line_global, {tl: image_tl, br: image_br});

    var shoulder_shape = a.createPath(shoulder_shape_line_global, {
        fill_method: 'linear', fill_colors: fill_colors, fill_steps: fill_steps,
        line_color: face_options.skin_colors.highlights, radius: (f.thick_unit * 300),
        close_line: true
    });
    lines.push({name: 'shoulder', line: shoulder_shape_line, shape: shoulder_shape, scale_x: scale_x, scale_y: scale_y, x: x, y: y});
    shapes = shapes.concat(shoulder_shape);


    return shapes;
}});


//neck
new Avatar('add_render_function', {style: 'lines', feature: 'neck', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var neck_width = 0.75; //.5-.85
    var neck_curvature = 0.85; //.7 - .95
    var apple_transparency = 0.4; //.3 - .6
    var apple_height = 1.4; //0-2
    if (face_options.gender == 'Female') {
        neck_width *= 0.9;
    }
    if (face_options.face_shape == "Inverted Triangle") {
        neck_width *= 0.9;
    }

    var image_tl = a.findPoint(avatar, 'facezone topleft');
    var image_br = a.findPoint(avatar, 'facezone bottomright');

    var zone = f.neck;
    var scale_x = (zone.right - zone.left) * neck_width;
    var scale_y = (zone.bottom - zone.top) / 1.2;

    var skin_lighter = net.brehaut.Color(face_options.skin_colors.skin).toString();
    var skin_bright = net.brehaut.Color(face_options.skin_colors.skin).lightenByRatio(0.05).toString();
    var cheek_darker = net.brehaut.Color(face_options.skin_colors.cheek).darkenByRatio(0.05).toString();
    var fill_colors = [cheek_darker, skin_lighter, skin_bright, skin_lighter, cheek_darker];
    var fill_steps = [0, .25, .5, .75, 1];

    var x = zone.x;
    var y = zone.y + (f.thick_unit * 195);

    var neck_draw_options = {
        fill_method: 'linear', fill_colors: fill_colors, fill_steps: fill_steps,
        line_color: 'blank',
        close_line: true
    };

    var neck_line, neck;
    if (face_options.neck_size == 'Concave') {
        neck_line = a.transformShapeLine({type: 'neck', radius: 5, curvature: neck_curvature}, face_options);
        neck_line = a.transformPathFromLocalCoordinates(neck_line, scale_x, scale_y, x, y);
        neck_line = a.constrainPolyLineToBox(neck_line, {tl: image_tl, br: image_br});

        neck = a.createPath(neck_line, neck_draw_options);

        lines.push({name: 'neck', line: neck_line, shape: neck});
        shapes.push(neck);

    } else if (face_options.neck_size == 'Thick') {
        neck_line = [
            {x: -10, y: -10},
            {x: -10, y: -9},
            {x: -9, y: 0},
            {x: -8, y: 9},
            {x: -8, y: 10},

            {x: 8, y: 10},
            {x: 8, y: 9},
            {x: 9, y: 0},
            {x: 10, y: -9},
            {x: 10, y: -10}
        ];

        scale_y = (zone.bottom - zone.top) / 2.3;
        scale_x = (f.face.right - f.face.left) / 3.5;

        if (face_options.gender == 'Female') {
            scale_x *= .9;
        }
        if (face_options.face_shape == 'Inverted Triangle') {
            scale_x *= .8;
        }

        neck_line = a.transformPathFromLocalCoordinates(neck_line, scale_x, scale_y, x, y);
        neck_line = a.constrainPolyLineToBox(neck_line, {tl: image_tl, br: image_br});
        neck = a.createPath(neck_line, neck_draw_options);

        lines.push({name: 'neck', line: neck_line, shape: neck});
        shapes = shapes.concat(neck);
    }

    if (face_options.gender == 'Male') {
        var darker_skin = net.brehaut.Color(face_options.skin_colors.skin).darkenByRatio(0.2).toString();
        var neck_apple_line = a.transformShapeLine({type: 'circle', radius: 0.5}, face_options);
        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top) * apple_height;

        var neck_apple = a.createPathFromLocalCoordinates(neck_apple_line, {close_line: true, line_color: face_options.skin_colors.skin, fill_color: darker_skin}, scale_x, scale_y);
        neck_apple.x = zone.x;
        neck_apple.y = zone.y + (f.thick_unit * 225);
        neck_apple.alpha = apple_transparency;
        lines.push({name: 'neck_apple', line: neck_apple_line, shape: neck_apple, scale_x: scale_x, scale_y: scale_y, x: zone.x, y: zone.y + (f.thick_unit * 225)});
        shapes.push(neck_apple);
    }

    return shapes;
}});

//ears
new Avatar('add_render_function', {style: 'lines', feature: 'ears', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var zone = f.ears;
    var width = 0.5 * (zone.right - zone.left);
    var height = 0.6 * (zone.bottom - zone.top);

    var ear_height_adjust = 1; //.3-1.2
    var ear_width_adjust = 1; //.7-2
    var right_lobe_height = 0; //0-3
    var left_lobe_height = 0; //0-3
    var inner_cavity_size_adjust = .2; //.3-.6
    var ear_inset_adjust = 2;  //0-5
    var ear_head_height_adjust = 0;  //-20 - 20
    ear_head_height_adjust -= 10;

    if (face_options.ear_thickness == "Wide") {
        ear_width_adjust = 1.5;
        ear_height_adjust = 1.1;
    } else if (face_options.ear_thickness == "Big") {
        ear_width_adjust = 1.9;
        ear_height_adjust = 1.3;

    } else if (face_options.ear_thickness == "Tall") {
        ear_width_adjust = 1.4;
        ear_height_adjust = 1.2;
        ear_head_height_adjust = 5;
    } else if (face_options.ear_thickness == "Small") {
        ear_width_adjust = .8;
        ear_height_adjust = .7;
    } else if (face_options.ear_thickness == "Tiny") {
        ear_width_adjust = .7;
        ear_height_adjust = .4;
        inner_cavity_size_adjust = .25;
    } else if (face_options.ear_thickness == "Splayed") {
        ear_width_adjust = 2;
        ear_height_adjust = 1.2;
        inner_cavity_size_adjust = .3;
    }

    if (face_options.ear_lobe_left == "Hanging") {
        left_lobe_height = 3;
    } else if (face_options.ear_lobe_left == "Attached") {
        left_lobe_height = 0;
    }

    if (face_options.ear_lobe_right == "Hanging") {
        right_lobe_height = 3;
    } else if (face_options.ear_lobe_right == "Attached") {
        right_lobe_height = 0;
    } else if (face_options.ear_lobe_right == "Same") {
        right_lobe_height = left_lobe_height;
    }

    var ear_line_side;
    if (face_options.ear_shape == 'Pointed') {
        ear_line_side = [
            {x: -3, y: -4},
            {x: -5, y: -6, line: true},
            {x: 3, y: -12, line: true},
            {x: 9, y: -6, line: true},
            {x: 3, y: -0},
            {x: 6, y: 4},
            {x: 3, y: 5},
            {x: -3, y: 3}
        ];
    } else {
        ear_line_side = [
            {x: -3, y: -4},
            {x: -5, y: -6},
            {x: 3, y: -8},
            {x: 9, y: -6},
            {x: 3, y: -0},
            {x: 6, y: 4},
            {x: 3, y: 5},
            {x: -3, y: 3}
        ];
    }
    var ear_line_l = [];
    var ear_line_r = [];
    var y;
    for (var i = 0; i < ear_line_side.length; i++) {
        y = ear_height_adjust * ear_line_side[i].y;
        var l_offset = 0;
        var r_offset = 0;
        if (i == ear_line_side.length - 1) {
            l_offset = left_lobe_height;
            r_offset = right_lobe_height;
        }
        ear_line_l.push({x: ear_width_adjust * ear_line_side[i].x, y: y + l_offset});
        ear_line_r.push({x: -ear_width_adjust * ear_line_side[i].x, y: y + r_offset});
    }

    var ear_r = a.createPathFromLocalCoordinates(ear_line_r, {close_line: true, thickness: f.thick_unit, fill_color: face_options.skin_colors.skin, color: face_options.skin_colors.deepshadow}, width, height);
    var x = zone.left_x - (f.thick_unit * ear_inset_adjust);
    y = zone.y - (f.thick_unit * ear_head_height_adjust);
    ear_r.x = x;
    ear_r.y = y;
    lines.push({name: 'ear right line', line: ear_line_r, shape: ear_r, scale_x: width, scale_y: height, x: x, y: y});
    shapes.push(ear_r);

    var ear_l = a.createPathFromLocalCoordinates(ear_line_l, {close_line: true, thickness: f.thick_unit, fill_color: face_options.skin_colors.skin, color: face_options.skin_colors.deepshadow}, width, height);
    x = zone.right_x + (f.thick_unit * ear_inset_adjust);
    y = zone.y - (f.thick_unit * ear_head_height_adjust);
    ear_l.x = x;
    ear_l.y = y;
    lines.push({name: 'ear left line', line: ear_line_l, shape: ear_l, scale_x: width, scale_y: height, x: x, y: y});
    shapes.push(ear_l);


    var in_scale = .7;
    var in_x_offset = 2;
    var in_y_offset = -8;
    var darker_ear = net.brehaut.Color(face_options.skin_colors.skin).darkenByRatio(0.2).toString();
    var ear_r_in_top = a.createPathFromLocalCoordinates(ear_line_r, {close_line: true, thickness: f.thick_unit, fill_color: darker_ear, color: face_options.skin_colors.deepshadow}, width * in_scale, height * in_scale);
    x = zone.left_x - (f.thick_unit * ear_inset_adjust) + (f.thick_unit * in_x_offset);
    y = zone.y - (f.thick_unit * ear_head_height_adjust) + (f.thick_unit * in_y_offset);
    ear_r_in_top.x = x;
    ear_r_in_top.y = y;
    lines.push({name: 'ear right line top in', line: ear_line_r, shape: ear_r_in_top, scale_x: width * in_scale, scale_y: height * in_scale, x: x, y: y});
    shapes.push(ear_r_in_top);

    var ear_l_in_top = a.createPathFromLocalCoordinates(ear_line_l, {close_line: true, thickness: f.thick_unit, fill_color: darker_ear, color: face_options.skin_colors.deepshadow}, width * in_scale, height * in_scale);
    x = zone.right_x + (f.thick_unit * ear_inset_adjust) - (f.thick_unit * in_x_offset);
    y = zone.y - (f.thick_unit * ear_head_height_adjust) + (f.thick_unit * in_y_offset);
    ear_l_in_top.x = x;
    ear_l_in_top.y = y;
    lines.push({name: 'ear left line top in', line: ear_line_l, shape: ear_l_in_top, scale_x: width * in_scale, scale_y: height * in_scale, x: x, y: y});
    shapes.push(ear_l_in_top);


    width *= inner_cavity_size_adjust;
    height *= inner_cavity_size_adjust;
    in_x_offset = 4;
    in_y_offset = 6;

    var ear_r_in = a.createPathFromLocalCoordinates(ear_line_r, {close_line: true, thickness: f.thick_unit, fill_color: face_options.skin_colors.darkflesh, color: face_options.skin_colors.deepshadow}, width, height);
    x = zone.left_x - (f.thick_unit * ear_inset_adjust) + (f.thick_unit * in_x_offset);
    y = zone.y - (f.thick_unit * ear_head_height_adjust) + (f.thick_unit * in_y_offset);
    ear_r_in.x = x;
    ear_r_in.y = y;
    ear_r_in.rotation = 6;
    lines.push({name: 'ear right line in', line: ear_line_r, shape: ear_r_in, scale_x: 1, scale_y: 1, x: x, y: y});
    shapes.push(ear_r_in);

    var ear_l_in = a.createPathFromLocalCoordinates(ear_line_l, {close_line: true, thickness: f.thick_unit, fill_color: face_options.skin_colors.darkflesh, color: face_options.skin_colors.deepshadow}, width, height);
    x = zone.right_x + (f.thick_unit * ear_inset_adjust) - (f.thick_unit * in_x_offset);
    y = zone.y - (f.thick_unit * ear_head_height_adjust) + (f.thick_unit * in_y_offset);
    ear_l_in.x = x;
    ear_l_in.y = y;
    ear_l_in.rotation = -6;
    lines.push({name: 'ear left line in', line: ear_line_l, shape: ear_l_in, scale_x: 1, scale_y: 1, x: x, y: y});
    shapes.push(ear_l_in);

    return shapes;
}});

//eye_positioner
new Avatar('add_render_function', {style: 'lines', feature: 'eye_position', renderer: function (face_zones, avatar) {
    //This doesn't draw anything, just pre-generates the positions that othes will use to guide off of
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;

    var rotation_amount = 4; //-6 to 15, sets emotion
    if (face_options.eye_rotation == "Flat") {
        rotation_amount = -2;
    } else if (face_options.eye_rotation == "Small") {
        rotation_amount = 2;
    } else if (face_options.eye_rotation == "Medium") {
        rotation_amount = 4;
    } else if (face_options.eye_rotation == "Large") {
        rotation_amount = 7;
    } else if (face_options.eye_rotation == "Slanted") {
        rotation_amount = 11;
    }

    var eye_squint = 1.4;
    var width_eye = (f.eyes.right - f.eyes.left);
    var height_eye = (f.eyes.bottom - f.eyes.top) * eye_squint;

    var zone = f.eyes;
    var eye_radius = 4.2;
    var x = zone.left_x;
    var y = zone.y;
    var left_eye_line = [];
    if (face_options.eye_shape == 'Almond') {
        left_eye_line = a.transformShapeLine([
            {type: 'almond-horizontal', modifier: 'left', radius: eye_radius},
            {type: 'pinch', pinch_amount: 0.6, starting_step: -3, ending_step: 4},
            {type: 'pinch', pinch_amount: 0.9, starting_step: -3, ending_step: 9}
        ], face_options);
    }

    var left_eye = a.createPathFromLocalCoordinates(left_eye_line, {close_line: true}, width_eye, height_eye);
    left_eye.x = x;
    left_eye.y = y;
    left_eye.rotation = rotation_amount;
    lines.push({name: 'left eye', line: left_eye_line, shape: left_eye, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount});


    zone = f.eyes;
    x = zone.right_x;
    y = zone.y;
    var right_eye_line = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eye_line);
    var right_eye = a.createPathFromLocalCoordinates(right_eye_line, {close_line: true}, width_eye, height_eye);

    right_eye.x = x;
    right_eye.y = y;
    right_eye.rotation = -rotation_amount;
    lines.push({name: 'right eye', line: right_eye_line, shape: right_eye, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});

    var inner_point_x = a.comparePoints(right_eye_line, 'x', 'lowest');
    var inner_point_y = a.comparePoints(right_eye_line, 'y', 'middle');
    inner_point_x = x + (inner_point_x * width_eye / 2 / eye_radius);
    inner_point_y = y + (inner_point_y * height_eye / 2 / eye_radius);
    a.namePoint(avatar, 'right eye innermost', {x: inner_point_x, y: inner_point_y});

}});

//eyes
new Avatar('add_render_function', {style: 'lines', feature: 'eyes', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    if (!face_options.eye_shape) {
        console.error("ERROR - face_options.eye_shape not set - likely no face_options were set");
    }

    var rotation_amount = 4; //-6 to 15, sets emotion
    if (face_options.eye_rotation == "Flat") {
        rotation_amount = -2;
    } else if (face_options.eye_rotation == "Small") {
        rotation_amount = 2;
    } else if (face_options.eye_rotation == "Medium") {
        rotation_amount = 4;
    } else if (face_options.eye_rotation == "Large") {
        rotation_amount = 7;
    } else if (face_options.eye_rotation == "Slanted") {
        rotation_amount = 11;
    }

    var iris_size = 3.6;  // 3.5 to 3.9
    var iris_lift = 1.3;
    var pupil_transparency = 0.7; //.1 - .9 for weird eyes, but .7 works best
    var iris_transparency = 0.5; //.1 - .9 for weird eyes, but .5 works best
    var pupil_color = face_options.pupil_color; //best dark colors, black or dark blue. red looks freaky
    var eyebrow_thick_start = 4;
    var eyebrow_thick_stop = 2 * f.thick_unit;
    var eye_squint = 1.4;
    var iris_side_movement = -0; // -8 - 8  //TODO: Can go farther once eyes are overdrawn

    var eyebrow_height = 20; //15 - 40
    var eyebrow_transparency = 0.9;
    var eyebrow_rotation = -6; //-6 to 10
    var eyeline_transparency = 0.8;

    if (face_options.gender == 'Female') {
        eyebrow_thick_start *= 1.2;
        eyebrow_thick_stop *= 1.2;
    }

    eyebrow_thick_start += parseInt(face_options.age / 12);

    var eye_fill_colors = ["#fff", "#cbb", "#444"];
    var eye_fill_steps = [0, .92, 1];
    if (face_options.eye_cloudiness == 'Clear') {
        eye_fill_colors = ["#fff", "#edd", "#444"];
    } else if (face_options.eye_cloudiness == 'Pink') {
        eye_fill_colors = ["#fcc", "#e88", "#833"];
    } else if (face_options.eye_cloudiness == 'Dark') {
        eye_fill_colors = ["#fff", "#988", "#444"];
    } else if (face_options.eye_cloudiness == 'Misty') {
        eye_fill_colors = ["#fff", "#baa", "#444"];
    } else if (face_options.eye_cloudiness == 'Blue') {
        eye_fill_steps = [0, .8, .92, 1];
        eye_fill_colors = ["#fff", "#99e", "#ddf", "#444"];
    }

    //TODO: Have eyebrow patterns shift

    //Scales
    var width_eye = (f.eyes.right - f.eyes.left);
    var height_eye = (f.eyes.bottom - f.eyes.top) * eye_squint;
    var width_pupil = (f.eyes.pupil.right - f.eyes.pupil.left);
    var height_pupil = (f.eyes.pupil.bottom - f.eyes.pupil.top);
    var width_iris = (f.eyes.iris.right - f.eyes.iris.left);
    var height_iris = (f.eyes.iris.bottom - f.eyes.iris.top);


    eyebrow_thick_start *= f.thick_unit;


    var eyeliner_color = face_options.skin_colors.darkflesh;
    var eyeliner_alpha = eyeline_transparency;
    var eyeliner_thickness = f.thick_unit * 5;
    if (face_options.gender == "Female") {
        eyeliner_color = '#000';
        eyeliner_alpha = .6;
        eyeliner_thickness = f.thick_unit * 2;
    }

    var sunken_color = '#500';
    var sunken_amount = 0.6;
    var socket_size = 65;
    var socket_y_offset = 1;
    if (face_options.eye_sunken == "Cavernous") {
        sunken_color = '#A00';
        sunken_amount = 0.8;
        socket_size = 72;
        socket_y_offset = 3;
    } else if (face_options.eye_sunken == "Deep") {
        sunken_color = '#400';
        sunken_amount = 0.6;
        socket_size = 73;
        socket_y_offset = 2;
    } else if (face_options.eye_sunken == "Dark") {
        sunken_color = '#000';
        sunken_amount = 0.55;
        socket_size = 85;
        socket_y_offset = 1;
    } else if (face_options.eye_sunken == "Smooth") {
        sunken_color = '#100';
        sunken_amount = 0.2;
        socket_size = 70;
        socket_y_offset = 0;
    } else if (face_options.eye_sunken == "None") {
        sunken_amount = 0;
        socket_y_offset = 0;
    }


    //Eye background color ovals
    var right_eyesocket_oval = a.transformShapeLine({type: 'oval', radius: width_eye * .75});

    var skin_lighter = net.brehaut.Color(face_options.skin_colors.skin).blend(net.brehaut.Color(sunken_color), 0.05).toString();
    skin_lighter = maths.hexColorToRGBA(skin_lighter, .8);
    var skin_darker = net.brehaut.Color(face_options.skin_colors.skin).blend(net.brehaut.Color(sunken_color), sunken_amount).toString();
    skin_lighter = maths.hexColorToRGBA(skin_lighter, .02);

    var fill_colors = [skin_darker, skin_lighter, 'rgba(0,0,0,0)'];
    var fill_steps = [0, .85, 1];

    var left_eyesocket = a.createPath(right_eyesocket_oval, {
        close_line: true, thickness: f.thick_unit,
        line_color: 'rgba(0,0,0,0)',
        fill_colors: fill_colors, fill_method: 'radial',
        fill_steps: fill_steps, radius: (f.thick_unit * socket_size)
    });
    left_eyesocket.x = f.eyes.left_x;
    left_eyesocket.y = f.eyes.y + (socket_y_offset * f.thick_unit);
    left_eyesocket.scaleY = .6;
    shapes.push(left_eyesocket);


    var right_eyesocket = a.createPath(right_eyesocket_oval, {
        close_line: true, thickness: f.thick_unit,
        line_color: 'rgba(0,0,0,0)',
        fill_colors: fill_colors, fill_method: 'radial',
        fill_steps: fill_steps, radius: (f.thick_unit * socket_size)
    });
    right_eyesocket.x = f.eyes.right_x;
    right_eyesocket.y = f.eyes.y + (socket_y_offset * f.thick_unit);
    ;
    right_eyesocket.scaleY = .6;
    shapes.push(right_eyesocket);


    //Left Eye
    var zone = f.eyes;
    var eye_radius = 4.2;
    var x = zone.left_x;
    var y = zone.y;
    var left_eye_line = [];
    if (face_options.eye_shape == 'Almond') {
        left_eye_line = a.transformShapeLine([
            {type: 'almond-horizontal', modifier: 'left', radius: eye_radius},
            {type: 'pinch', pinch_amount: 0.6, starting_step: -3, ending_step: 4},
            {type: 'pinch', pinch_amount: 0.9, starting_step: -3, ending_step: 9}
        ], face_options);
    }

    var left_eye = a.createPathFromLocalCoordinates(left_eye_line, {
            close_line: true, line_color: face_options.skin_colors.darkflesh,
            fill_colors: eye_fill_colors, fill_method: 'radial',
            fill_steps: eye_fill_steps, radius: width_eye * .37, x_offset: -(2 * f.thick_unit)},
        width_eye, height_eye);
    left_eye.x = x;
    left_eye.y = y;
    left_eye.rotation = rotation_amount;
    lines.push({name: 'left eye', line: left_eye_line, shape: left_eye, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount});
    shapes.push(left_eye);

    var inner_point_x = a.comparePoints(left_eye_line, 'x', 'highest');
    var inner_point_y = a.comparePoints(left_eye_line, 'y', 'middle');
    inner_point_x = x + (inner_point_x * width_eye / 2 / eye_radius);
    inner_point_y = y + (inner_point_y * height_eye / 2 / eye_radius);
    a.namePoint(avatar, 'left eye innermost', {x: inner_point_x, y: inner_point_y});


    x = zone.left_x;
    y = zone.y - (f.thick_unit * 4);
    var left_eye_line_top = [];
    if (face_options.eye_shape == 'Almond') {
        left_eye_line_top = a.transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: eye_radius, starting_step: 11, ending_step: 19}, face_options);
    }
    var left_eye_top = a.createPathFromLocalCoordinates(left_eye_line_top, {close_line: false, line_color: face_options.skin_colors.cheek, thickness: f.thick_unit * 5}, width_eye, height_eye);
    left_eye_top.x = x;
    left_eye_top.y = y;
    left_eye_top.alpha = eyeline_transparency;
    left_eye_top.rotation = rotation_amount;
    lines.push({name: 'left eye top', line: left_eye_line_top, shape: left_eye_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount});
    shapes.push(left_eye_top);


    x = zone.left_x + f.thick_unit;
    y = zone.y + (f.thick_unit * 1.5);
    var left_eye_line_bottom = [];
    if (face_options.eye_shape == 'Almond') {
        left_eye_line_bottom = a.transformShapeLine([
                {type: 'almond-horizontal', modifier: 'left', radius: eye_radius, starting_step: 0, ending_step: 9},
                {type: 'pinch', pinch_amount: 0.7, starting_step: -3, ending_step: 4}
            ]
            , face_options);
    }
    var left_eye_bottom = a.createPathFromLocalCoordinates(left_eye_line_bottom, {close_line: false, line_color: face_options.skin_colors.darkflesh}, width_eye, height_eye);
    left_eye_bottom.x = x;
    left_eye_bottom.y = y;
    left_eye_bottom.alpha = eyeline_transparency;
    left_eye_bottom.rotation = rotation_amount;
    lines.push({name: 'left eye bottom', line: left_eye_line_bottom, shape: left_eye_bottom, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount});
    shapes.push(left_eye_bottom);

    var left_eyebrow_line_top = [
        {x: 10, y: 2},
        {x: -2, y: -6},
        {x: -10, y: 1}
    ];
    if (face_options.eyebrow_shape == "Slim") {
        left_eyebrow_line_top = [
            {x: 10, y: 1},
            {x: -2, y: -6},
            {x: -10, y: 1}
        ];
        eyebrow_thick_start /= 2;
    } else if (face_options.eyebrow_shape == "Squiggle") {
        left_eyebrow_line_top = [
            {x: 12, y: -1},
            {x: 4, y: 2},
            {x: -2, y: -5},
            {x: -10, y: 1}
        ];
    } else if (face_options.eyebrow_shape == "Squiggle Flip") {
        left_eyebrow_line_top = [
            {x: 12, y: 1},
            {x: 4, y: -4},
            {x: -2, y: -2},
            {x: -10, y: -3}
        ];
    } else if (face_options.eyebrow_shape == "Arch") {
        left_eyebrow_line_top = [
            {x: 11, y: 0},
            {x: 4, y: -3, thickness: 8 * f.thick_unit},
            {x: -2, y: -5, thickness: 8 * f.thick_unit},
            {x: -10, y: 2}
        ];
    } else if (face_options.eyebrow_shape == "Caterpiller") {
        left_eyebrow_line_top = [
            {x: 11, y: 6},
            {x: -1, y: -2},
            {x: -6, y: -2},
            {x: -10, y: 1},
            {x: -13, y: 5}
        ];
        eyebrow_thick_stop = eyebrow_thick_start *= 1.5;
    } else if (face_options.eyebrow_shape == "Wide Caterpiller") {
        left_eyebrow_line_top = [
            {x: 11, y: 6},
            {x: 2, y: -2},
            {x: -6, y: -2},
            {x: -13, y: 7}
        ];
        eyebrow_thick_stop = eyebrow_thick_start * 1.5;
    } else if (face_options.eyebrow_shape == "Thick Arch") {
        left_eyebrow_line_top = [
            {x: 11, y: 6},
            {x: -5, y: -2},
            {x: -14, y: 7}
        ];
        eyebrow_thick_stop = eyebrow_thick_start * 1.5;
    } else if (face_options.eyebrow_shape == "Unibrow") {
        left_eyebrow_line_top = [
            {x: 20, y: 6},
            {x: 11, y: 6},
            {x: -5, y: -2},
            {x: -14, y: 7}
        ];
        eyebrow_thick_stop = eyebrow_thick_start * 1.5;
    }

    x = zone.left_x;
    y = zone.y - (f.thick_unit * 1.5 * eyebrow_height);
    var width_eyebrow = width_eye / 2.5;
    var height_eyebrow = height_eye / 4;

    var eyebrow_fade_color = net.brehaut.Color(face_options.hair_color).desaturateByRatio(.1);
    eyebrow_fade_color.alpha = .5;
    eyebrow_fade_color = eyebrow_fade_color.toString();

    var left_eyebrow_top = a.createMultiPathFromLocalCoordinates(left_eyebrow_line_top, {
        break_line_every: 5,
        line_color_gradients: [face_options.hair_color, eyebrow_fade_color],
        thickness_gradients: [eyebrow_thick_start, eyebrow_thick_stop],
        x: x, y: y, rotation: rotation_amount + eyebrow_rotation
    }, width_eyebrow, height_eyebrow);
    lines.push({name: 'left eyebrow top set', line: left_eyebrow_line_top, shape: left_eyebrow_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount + eyebrow_rotation, alpha: eyebrow_transparency});
    shapes = shapes.concat(left_eyebrow_top);

    inner_point_x = a.comparePoints(left_eyebrow_line_top, 'x', 'lowest');
    inner_point_y = a.comparePoints(left_eyebrow_line_top, 'y', 'middle');
    inner_point_x = x + (inner_point_x * width_eyebrow / 2 / eye_radius);
    inner_point_y = y + (inner_point_y * height_eyebrow / 2 / eye_radius);
    a.namePoint(avatar, 'left eyebrow innermost', {x: inner_point_x, y: inner_point_y});


    x = zone.left_x + (f.thick_unit * 4);
    y = zone.y - (f.thick_unit * 8);
    var left_eyebrow_line_inside = a.transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: eye_radius, starting_step: 14, ending_step: 19}, face_options);
    var left_eyebrow_inside = a.createPathFromLocalCoordinates(left_eyebrow_line_inside, {close_line: false, line_color: face_options.skin_colors.darkflesh}, width_eye, height_eye);
    left_eyebrow_inside.x = x;
    left_eyebrow_inside.y = y;
    left_eyebrow_inside.alpha = eyeline_transparency;
    left_eyebrow_inside.rotation = rotation_amount + 10;
    lines.push({name: 'left eyebrow inside', line: left_eyebrow_line_inside, shape: left_eyebrow_inside, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount + 10});
    shapes.push(left_eyebrow_inside);


    zone = f.eyes.iris;
    x = zone.left_x + (f.thick_unit * iris_side_movement);
    y = zone.y - (f.thick_unit * iris_lift);
    var left_iris_line = a.transformShapeLine({type: 'circle', radius: iris_size}, face_options);
    var left_iris = a.createPathFromLocalCoordinates(left_iris_line, {close_line: true, fill_color: face_options.eye_color}, width_iris, height_iris);
    left_iris.x = x;
    left_iris.y = y;
    left_iris.alpha = iris_transparency;
    lines.push({name: 'left iris', line: left_iris_line, shape: left_iris, scale_x: width_iris, scale_y: height_iris, x: x, y: y, alpha: iris_transparency});
    shapes.push(left_iris);


    zone = f.eyes;
    x = zone.left_x;
    y = zone.y;
    var left_eye_round = a.createPathFromLocalCoordinates(left_eye_line, {
        close_line: true, line_color: eyeliner_color, thickness: eyeliner_thickness
    }, width_eye, height_eye);
    left_eye_round.x = x;
    left_eye_round.y = y;
    left_eye_round.alpha = eyeliner_alpha;
    left_eye_round.rotation = rotation_amount;
    lines.push({name: 'left eye round', line: left_eye_line, shape: left_eye_round, scale_x: width_eye, scale_y: height_eye, x: x, y: y});
    shapes.push(left_eye_round);


    zone = f.eyes.pupil;
    x = zone.left_x + (f.thick_unit * iris_side_movement);
    y = zone.y - (6 * f.thick_unit) - (iris_lift * f.thick_unit);
    var left_pupil = new createjs.Shape();
    left_pupil.graphics.beginFill(pupil_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    left_pupil.x = x;
    left_pupil.y = y;
    left_pupil.alpha = pupil_transparency;
    lines.push({name: 'left pupil', line: [], shape: left_pupil, scale_x: width_pupil, scale_y: height_pupil, x: x, y: y});
    shapes.push(left_pupil);


    //Right Eye
    zone = f.eyes;
    x = zone.right_x;
    y = zone.y;
    var right_eye_line = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eye_line);
    var right_eye = a.createPathFromLocalCoordinates(right_eye_line, {
            close_line: true, line_color: face_options.skin_colors.darkflesh,
            fill_colors: eye_fill_colors, fill_steps: eye_fill_steps, radius: width_eye * .37, x_offset: +(2 * f.thick_unit)},
        width_eye, height_eye);

    right_eye.x = x;
    right_eye.y = y;
    right_eye.rotation = -rotation_amount;
    lines.push({name: 'right eye', line: right_eye_line, shape: right_eye, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});
    shapes.push(right_eye);


    x = zone.right_x;
    y = zone.y - (f.thick_unit * 4);
    var right_eye_line_top = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eye_line_top);
    var right_eye_top = a.createPathFromLocalCoordinates(right_eye_line_top, {close_line: false, line_color: face_options.skin_colors.cheek, thickness: f.thick_unit * 5}, width_eye, height_eye);
    right_eye_top.x = x;
    right_eye_top.y = y;
    right_eye_top.rotation = -rotation_amount;
    right_eye_top.alpha = eyeline_transparency;
    lines.push({name: 'right eye top', line: right_eye_line_top, shape: right_eye_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});
    shapes.push(right_eye_top);


    x = zone.right_x - f.thick_unit;
    y = zone.y + (f.thick_unit * 1.5);
    var right_eye_line_bottom = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eye_line_bottom);
    var right_eye_bottom = a.createPathFromLocalCoordinates(right_eye_line_bottom, {close_line: false, line_color: face_options.skin_colors.darkflesh, thickness: f.thick_unit}, width_eye, height_eye);
    right_eye_bottom.x = x;
    right_eye_bottom.y = y;
    right_eye_bottom.rotation = -rotation_amount;
    right_eye_bottom.alpha = eyeline_transparency;
    lines.push({name: 'right eye bottom', line: right_eye_line_bottom, shape: right_eye_bottom, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});
    shapes.push(right_eye_bottom);


    x = zone.right_x;
    y = zone.y - (f.thick_unit * 1.5 * eyebrow_height);
    var right_eyebrow_line_top = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eyebrow_line_top);
    var right_eyebrow_top = a.createMultiPathFromLocalCoordinates(right_eyebrow_line_top, {
        break_line_every: 5,
        line_color_gradients: [face_options.hair_color, eyebrow_fade_color],
        thickness_gradients: [eyebrow_thick_start, eyebrow_thick_stop],
        x: x, y: y, rotation: -rotation_amount - eyebrow_rotation, alpha: eyebrow_transparency
    }, width_eyebrow, height_eyebrow);
    lines.push({name: 'right eyebrow top set', line: right_eyebrow_line_top, shape: right_eyebrow_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount - eyebrow_rotation, alpha: eyebrow_transparency});
    shapes = shapes.concat(right_eyebrow_top);


    inner_point_x = a.comparePoints(right_eyebrow_line_top, 'x', 'lowest');
    inner_point_y = a.comparePoints(right_eyebrow_line_top, 'y', 'middle');
    inner_point_x = x + (inner_point_x * width_eyebrow / 2 / eye_radius);
    inner_point_y = y + (inner_point_y * height_eyebrow / 2 / eye_radius);
    a.namePoint(avatar, 'right eyebrow innermost', {x: inner_point_x, y: inner_point_y});

    x = zone.right_x - (f.thick_unit * 4);
    y = zone.y - (f.thick_unit * 8);
    var right_eyebrow_line_inside = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eyebrow_line_inside);
    var right_eyebrow_inside = a.createPathFromLocalCoordinates(right_eyebrow_line_inside, {close_line: false, line_color: face_options.skin_colors.darkflesh}, width_eye, height_eye);
    right_eyebrow_inside.x = x;
    right_eyebrow_inside.y = y;
    right_eyebrow_inside.rotation = -rotation_amount - 10;
    right_eyebrow_inside.alpha = eyeline_transparency;
    lines.push({name: 'right eyebrow inside', line: right_eyebrow_line_inside, shape: right_eyebrow_inside, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount - 10});
    shapes.push(right_eyebrow_inside);


    zone = f.eyes.iris;
    x = zone.right_x + (f.thick_unit * iris_side_movement);
    y = zone.y - (f.thick_unit * iris_lift);
    var right_iris_line = a.transformShapeLine({type: 'circle', radius: iris_size}, face_options);
    var right_iris = a.createPathFromLocalCoordinates(right_iris_line, {close_line: true, fill_color: face_options.eye_color}, width_iris, height_iris);
    right_iris.x = x;
    right_iris.y = y;
    right_iris.alpha = iris_transparency;
    lines.push({name: 'right iris', line: right_iris_line, shape: right_iris, scale_x: width_iris, scale_y: height_iris, x: x, y: y, alpha: iris_transparency});
    shapes.push(right_iris);


    zone = f.eyes;
    x = zone.right_x;
    y = zone.y;
    var right_eye_round = a.createPathFromLocalCoordinates(right_eye_line, {
        close_line: true, line_color: eyeliner_color, thickness: eyeliner_thickness
    }, width_eye, height_eye);
    right_eye_round.x = x;
    right_eye_round.y = y;
    right_eye_round.alpha = eyeliner_alpha;
    right_eye_round.rotation = -rotation_amount;
    lines.push({name: 'right eye round', line: right_eye_line, shape: right_eye_round, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});
    shapes.push(right_eye_round);


    zone = f.eyes.pupil;
    x = zone.right_x + (f.thick_unit * iris_side_movement);
    y = zone.y - (6 * f.thick_unit) - (iris_lift * f.thick_unit);
    var right_pupil = new createjs.Shape();
    right_pupil.graphics.beginFill(pupil_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    right_pupil.x = x;
    right_pupil.y = y;
    right_pupil.alpha = pupil_transparency;
    lines.push({name: 'right pupil', line: [], shape: right_pupil, scale_x: width_pupil, scale_y: height_pupil, x: x, y: y, alpha: pupil_transparency});
    shapes.push(right_pupil);

    return shapes;
}});

//nose
new Avatar('add_render_function', {style: 'lines', feature: 'nose', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var zone = f.nose;

    var width = zone.radius;
    var height = zone.radius * 1.5;
    var nose_side_offset = 1;
    if (face_options.nose_shape == 'Flat') {
        width *= 0.8;
        nose_side_offset /= 2;
    } else if (face_options.nose_shape == 'Wide') {
        width *= 1.1;
    } else if (face_options.nose_shape == 'Thin') {
        width *= 0.9;
    } else if (face_options.nose_shape == 'Bulbous') {
        width *= 1.2;
        height *= 1.3;
        nose_side_offset++;
    } else if (face_options.nose_shape == 'Giant Nostrils') {
        width *= 1.3;
        height *= 0.8;
        nose_side_offset++;
    }

    var nose_length = 5;
    var thickness = f.thick_unit;
    if (face_options.nose_size == 'Small') {
        nose_length = 4;
    } else if (face_options.nose_size == 'Tiny') {
        nose_length = 3;
    } else if (face_options.nose_size == 'Large') {
        nose_length = 6;
        width *= 1.1;
        height *= 1.1;
        thickness *= 1.1;
    } else if (face_options.nose_size == 'Big') {
        nose_length = 7;
        width *= 1.15;
        height *= 1.3;
        thickness *= 1.4;
        nose_side_offset++;
    } else if (face_options.nose_size == 'Giant') {
        nose_length = 8;
        width *= 1.2;
        height *= 1.4;
        thickness *= 1.5;
        nose_side_offset += 2;
    } else if (face_options.nose_size == 'Huge') {
        nose_length = 9;
        width *= 1.3;
        height *= 1.6;
        thickness *= 2;
        nose_side_offset += 3;
    }

    //Nose bottom line
    var nose_line = [
        {x: 5, y: 5},
        {x: 10, y: 5},
        {x: 8, y: 2},
        {x: 5, y: 5},
        {x: 0, y: 8},
        {x: -5, y: 5},
        {x: -8, y: 2},
        {x: -10, y: 5},
        {x: -5, y: 5},
        {x: 0, y: 8}

    ];
    var x = zone.x;
    var y = zone.y;
    var nose_bottom_squiggle = a.createPathFromLocalCoordinates(nose_line, {
        close_line: true, thickness: 1.2 * thickness,
        color: face_options.skin_colors.deepshadow, fill_color: face_options.skin_colors.deepshadow
    }, width, height);
    nose_bottom_squiggle.x = x;
    nose_bottom_squiggle.y = y;
    lines.push({name: 'nose bottom line', line: nose_line, shape: nose_bottom_squiggle, x: x, y: y, scale_x: width, scale_y: height});


    //Sides of nose, that get taller based on size
    var nose_line_side = [
        {x: 12, y: 8},
        {x: 16, y: 3},
        {x: 9, y: -4},
        {x: 7, y: -7},
        {x: 7, y: -12},
        {x: 6, y: -14},
        {x: 7, y: -16},
        {x: 8, y: -18},
        {x: 8, y: -24}
    ];
    var nose_line_l = [];
    var nose_line_r = [];
    var nose_line_l_full = [];
    var nose_line_r_full = [];

    //Find the left eye point, convert it into the nose coordinate scheme, add it to the nose line
    var right_eye_in_point = a.findPoint(avatar, 'right eye innermost');
    right_eye_in_point = a.transformPathFromGlobalCoordinates(right_eye_in_point, width, height, zone.x, zone.y);
    nose_line_side = nose_line_side.concat(right_eye_in_point);

    //Start building the two nose shapes (lines as well as fill)
    for (var i = 0; i < nose_line_side.length; i++) { //Only draw as many points as nose_size
        if (i < nose_length) {
            nose_line_r.push({x: nose_side_offset + nose_line_side[i].x, y: nose_line_side[i].y});
            nose_line_l.push({x: -nose_side_offset + (-1 * nose_line_side[i].x), y: nose_line_side[i].y});
        }
        nose_line_r_full.push({x: nose_side_offset + nose_line_side[i].x, y: nose_line_side[i].y});
        nose_line_l_full.push({x: -nose_side_offset + (-1 * nose_line_side[i].x), y: nose_line_side[i].y});
    }

    var nose_full_line = nose_line_l_full.concat(nose_line_r_full.reverse());
    var full_nose_line = a.transformShapeLine({type: 'smooth'}, face_options, nose_full_line);
    var alpha = 1;

    var nose_top_color = net.brehaut.Color(face_options.skin_colors.skin).lightenByRatio(0.07).toString();
    var face_bright_color = net.brehaut.Color(face_options.skin_colors.skin).lightenByRatio(0.03).toString();
    var nose_fill_colors = [
        face_options.skin_colors.highlights,
        maths.hexColorToRGBA(nose_top_color, .6),
        maths.hexColorToRGBA(face_bright_color, .25)];
    var nose_fill_steps = [0, .7, 1];

    var full_nose = a.createPathFromLocalCoordinates(full_nose_line, {
        close_line: true, thickness: f.thick_unit * .2, line_color: 'rgba(0,0,0,0)',
        fill_colors: nose_fill_colors, fill_method: 'radial',
        fill_steps: nose_fill_steps, y_offset: (5 * f.thick_unit), radius: (50 * f.thick_unit)
    }, width, height);
    full_nose.x = zone.x;
    full_nose.y = zone.y;
    full_nose.alpha = alpha;
    lines.push({name: 'full nose', line: full_nose_line, shape: full_nose, x: zone.x, y: zone.y, scale_x: width, scale_y: height, alpha: alpha});
    shapes = shapes.concat(full_nose);

    shapes.push(nose_bottom_squiggle);

    var l_r = a.createPathFromLocalCoordinates(nose_line_r, {thickness: thickness, color: face_options.skin_colors.cheek}, width, height);
    l_r.x = zone.x;
    l_r.y = zone.y;
    lines.push({name: 'nose right line', line: nose_line_r, shape: l_r, x: zone.x, y: zone.y, scale_x: width, scale_y: height});
    shapes.push(l_r);

    var l_l = a.createPathFromLocalCoordinates(nose_line_l, {thickness: thickness, color: face_options.skin_colors.cheek}, width, height);
    l_l.x = zone.x;
    l_l.y = zone.y;
    lines.push({name: 'nose left line', line: nose_line_l, shape: l_l, x: zone.x, y: zone.y, scale_x: width, scale_y: height});
    shapes.push(l_l);


    //TODO: These should connect to nose
    var mouth_high_left_line = [
        {x: -3.5, y: -4},
        {x: -4, y: -2},
        {x: -3.7, y: 0},
        {x: -3.5, y: 2}
    ];
    var l5 = a.createPathFromLocalCoordinates(mouth_high_left_line, {close_line: false, thickness: 0, color: face_options.skin_colors.deepshadow, fill_color: 'pink'}, width, height);
    l5.x = f.mouth.x;
    l5.y = f.mouth.y - (f.thick_unit * 24);
    l5.alpha = 0.5;
    lines.push({name: 'above lip left line', line: mouth_high_left_line, shape: l5, x: f.mouth.x, y: f.mouth.y - (f.thick_unit * 24), scale_x: width, scale_y: height});
    shapes.push(l5);

    var mouth_high_right_line = a.transformShapeLine({type: 'reverse'}, face_options, mouth_high_left_line);
    var l6 = a.createPathFromLocalCoordinates(mouth_high_right_line, {close_line: false, thickness: 0, color: face_options.skin_colors.deepshadow, fill_color: 'pink'}, width, height);
    l6.x = f.mouth.x;
    l6.y = f.mouth.y - (f.thick_unit * 24);
    l6.alpha = 0.5;
    lines.push({name: 'above lip right line', line: mouth_high_right_line, shape: l6, x: f.mouth.x, y: f.mouth.y - (f.thick_unit * 24), scale_x: width, scale_y: height});
    shapes.push(l6);


    return shapes;
}});

//wrinkles
new Avatar('add_render_function', {style: 'lines', feature: 'wrinkles', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var wrinkle_resistance = a.turnWordToNumber(face_options.wrinkle_resistance, 50, -100);
    var wrinkle_age = face_options.age + wrinkle_resistance;

    var wrinkle_lines = parseInt(wrinkle_age / 15);
    var head_line = a.transformLineToGlobalCoordinates(lines, 'face');
    var left_eye_line = a.transformLineToGlobalCoordinates(lines, 'left eye');

    head_line = a.hydratePointsAlongLine(head_line, f.thick_unit * 30);

    var hair_line = a.lineSegmentCompared(head_line, left_eye_line, 'above');

    if (hair_line && hair_line.length) {
//        var hair_dot_array = a.createPath(hair_line, {close_line: true, thickness: f.thick_unit * 5, line_color: face_options.hair_color});
//        lines.push({name: 'hair dot line', line: hair_line, shape: hair_dot_array, x: 0, y: 0, scale_x: 1, scale_y: 1});
//            shapes = shapes.concat(hair_dot_array);

        var mid_x = a.comparePoints(hair_line, 'x', 'middle');
        var mid_y = a.comparePoints(hair_line, 'y', 'middle') + (f.thick_unit * 30);
        var base_width = (f.thick_unit * 220);
        var height = (f.thick_unit * 100);

        var forehead_wrinkle_line = [
            {x: -4, y: 0},
            {x: -3, y: -.5},
            {x: -1, y: 0},
            {x: -.5, y: -.5},
            {x: 0, y: -.5},
            {x: .5, y: -.5},
            {x: 1, y: 0},
            {x: 3, y: -.5},
            {x: 4, y: 0}
        ];

        var x, y, width;
        var alpha = .2;

        if (face_options.gender == 'female') {
            alpha /= 3;
        }

        for (var i = 0; i < wrinkle_lines; i++) {
            width = base_width - (f.thick_unit * i * 25);
            var forehead_wrinkle = a.createPathFromLocalCoordinates(forehead_wrinkle_line, {close_line: false, thickness: (f.thick_unit * 2), color: face_options.skin_colors.deepshadow}, width, height);
            x = mid_x;
            y = mid_y - (f.thick_unit * i * 15);
            forehead_wrinkle.x = x;
            forehead_wrinkle.y = y;
            forehead_wrinkle.alpha = alpha;
            lines.push({name: 'forehead wrinkle line ' + i, line: forehead_wrinkle_line, shape: forehead_wrinkle, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
            shapes.push(forehead_wrinkle);
        }
    }

    var right_eye_line = a.transformLineToGlobalCoordinates(lines, 'right eye');
    mid_x = a.comparePoints(head_line, 'x', 'middle');
    mid_y = right_eye_line[0].y;
    x = mid_x - (f.thick_unit * 10);
    y = mid_y - (f.thick_unit * 25);

    var mid_nose_divot_line = [
        {x: -1, y: -3},
        {x: 0, y: -1.5},
        {x: -.5, y: 3}
    ];

    height /= 1.2;
    var divot_line = a.createPathFromLocalCoordinates(mid_nose_divot_line, {close_line: false, thickness: (f.thick_unit * 2), color: face_options.skin_colors.deepshadow}, width, height);
    alpha = (wrinkle_age / 350);
    divot_line.x = x;
    divot_line.y = y;
    divot_line.alpha = alpha;
    lines.push({name: 'mid nose divot line', line: mid_nose_divot_line, shape: divot_line, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
    shapes.push(divot_line);

    var divot_line_r_2 = a.transformShapeLine({type: 'reverse', direction: 'horizontal'}, face_options, mid_nose_divot_line);
    var divot_line_2 = a.createPathFromLocalCoordinates(divot_line_r_2, {close_line: false, thickness: (f.thick_unit * 2), color: face_options.skin_colors.deepshadow}, width, height);
    x = mid_x + (f.thick_unit * 10);
    divot_line_2.x = x;
    divot_line_2.y = y;
    divot_line_2.alpha = alpha;
    lines.push({name: 'mid nose divot line 2', line: divot_line_r_2, shape: divot_line_2, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
    shapes.push(divot_line_2);

    var nose_divot_line = [
        {x: 0, y: -3},
        {x: 0, y: -1.5},
        {x: 0, y: 1.5},
        {x: 0, y: 3}
    ];
    height *= (wrinkle_age / 50);
    var divot_line_3 = a.createPathFromLocalCoordinates(nose_divot_line, {close_line: false, thickness: (f.thick_unit), color: face_options.skin_colors.deepshadow}, width, height);
    x = mid_x;
    y = mid_y - (f.thick_unit * 35);
    alpha = (wrinkle_age / 400);
    divot_line_3.x = x;
    divot_line_3.y = y;
    divot_line_3.alpha = alpha;
    lines.push({name: 'mid nose divot line', line: nose_divot_line, shape: divot_line_3, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
    shapes.push(divot_line_3);

    var mouth_line = a.transformLineToGlobalCoordinates(lines, 'lips');
    var mouth_left_point = a.comparePoints(mouth_line, 'x', 'lowest', true);
    var mouth_right_point = a.comparePoints(mouth_line, 'x', 'highest', true);

    var mouth_side_lines_height_up = 6;
    if (face_options.mouth_upturn == "Large") {
        mouth_side_lines_height_up = 6;
    } else if (face_options.mouth_upturn == "Short") {
        mouth_side_lines_height_up = 4;
    } else if (face_options.mouth_upturn == "Small") {
        mouth_side_lines_height_up = 2;
    } else if (face_options.mouth_upturn == "Tiny") {
        mouth_side_lines_height_up = 0;
    }
    var mouth_side_lines_height_down = 6;
    if (face_options.mouth_upturn == "Large") {
        mouth_side_lines_height_down = 6;
    } else if (face_options.mouth_upturn == "Short") {
        mouth_side_lines_height_down = 4;
    } else if (face_options.mouth_upturn == "Small") {
        mouth_side_lines_height_down = 2;
    } else if (face_options.mouth_upturn == "Tiny") {
        mouth_side_lines_height_down = 0;
    }


    var mouth_side_lines_width = 1;
    if (mouth_side_lines_height_up + mouth_side_lines_height_down > 0) {
        //TODO: Convert to path
        var left_mouth_wrinkle = [];
        left_mouth_wrinkle.push({x: mouth_left_point.x - (f.thick_unit * mouth_side_lines_width), y: mouth_left_point.y - (f.thick_unit * mouth_side_lines_height_up)});
        left_mouth_wrinkle.push({x: mouth_left_point.x - (f.thick_unit * mouth_side_lines_width), y: mouth_left_point.y - (f.thick_unit * mouth_side_lines_height_up * .5)});
        left_mouth_wrinkle.push({x: mouth_left_point.x + (f.thick_unit), y: mouth_left_point.y});
        left_mouth_wrinkle.push({x: mouth_left_point.x - (f.thick_unit * mouth_side_lines_width), y: mouth_left_point.y + (f.thick_unit * mouth_side_lines_height_down * .5)});
        left_mouth_wrinkle.push({x: mouth_left_point.x - (f.thick_unit * mouth_side_lines_width), y: mouth_left_point.y + (f.thick_unit * mouth_side_lines_height_down)});

        var left_mouth_curve1 = a.createPath(left_mouth_wrinkle, {
            thickness: 2 * f.thick_unit, line_color: face_options.skin_colors.darkflesh
        });
        shapes.push(left_mouth_curve1);

        var right_mouth_wrinkle = [];
        right_mouth_wrinkle.push({x: mouth_right_point.x + (f.thick_unit * mouth_side_lines_width), y: mouth_right_point.y - (f.thick_unit * mouth_side_lines_height_up)});
        right_mouth_wrinkle.push({x: mouth_right_point.x + (f.thick_unit * mouth_side_lines_width), y: mouth_right_point.y - (f.thick_unit * mouth_side_lines_height_up * .5)});
        right_mouth_wrinkle.push({x: mouth_right_point.x - (f.thick_unit), y: mouth_right_point.y});
        right_mouth_wrinkle.push({x: mouth_right_point.x + (f.thick_unit * mouth_side_lines_width), y: mouth_right_point.y + (f.thick_unit * mouth_side_lines_height_down * .5)});
        right_mouth_wrinkle.push({x: mouth_right_point.x + (f.thick_unit * mouth_side_lines_width), y: mouth_right_point.y + (f.thick_unit * mouth_side_lines_height_down)});

        var right_mouth_curve1 = a.createPath(right_mouth_wrinkle, {
            thickness: 2 * f.thick_unit, line_color: face_options.skin_colors.darkflesh
        });
        shapes.push(right_mouth_curve1);


    }

    //Lines to nose-mouth wrinkles uses wrinkle_mouth_width/height
    var chin_top_line = a.transformLineToGlobalCoordinates(lines, 'chin top line');
    var left_chin_line_point = a.comparePoints(chin_top_line, 'x', 'lowest', true);
    var right_chin_line_point = a.comparePoints(chin_top_line, 'x', 'highest', true);
    var nose_full_line = a.transformLineToGlobalCoordinates(lines, 'full nose');
    if (wrinkle_age > 16) {
        var mouth_line_curve_alpha = (wrinkle_age - 15) / 150;
        if (face_options.gender == 'Female') {
            mouth_line_curve_alpha /= 3;
        }

        //Left chin mouth line
        var left_nose_round_top_point = nose_full_line[2];

        var left_nose_mouth_wrinkle = [];

        left_nose_round_top_point.x -= (f.thick_unit * .5);
        left_nose_round_top_point.y -= (f.thick_unit * 5);
        left_nose_mouth_wrinkle.push(_.clone(left_nose_round_top_point));

        left_nose_round_top_point.x -= (f.thick_unit * 8);
        left_nose_round_top_point.y -= (f.thick_unit * 5);
        left_nose_mouth_wrinkle.push(_.clone(left_nose_round_top_point));

        mouth_left_point.x -= (f.thick_unit * 25);
        mouth_left_point.y += (f.thick_unit * 8);
        if (face_options.wrinkle_mouth_width == "Far Out") {
            mouth_left_point.x -= (f.thick_unit * 8)
        } else if (face_options.wrinkle_mouth_width == "Out") {
            mouth_left_point.x -= (f.thick_unit * 3)
        } else if (face_options.wrinkle_mouth_width == "In") {
            mouth_left_point.x += (f.thick_unit * 3)
        } else if (face_options.wrinkle_mouth_width == "Far In") {
            mouth_left_point.x += (f.thick_unit * 8)
        }

        var mid_point;
        mid_point = (mouth_left_point.y + left_nose_round_top_point.y) / 2 - (f.thick_unit * 5);
        left_nose_mouth_wrinkle.push({x: mouth_left_point.x - (f.thick_unit), y: mid_point});

        mid_point = (mouth_left_point.y + left_nose_round_top_point.y) / 2;
        left_nose_mouth_wrinkle.push({x: mouth_left_point.x, y: mid_point});


        if (face_options.wrinkle_mouth_height == "Far Up") {
            mouth_left_point.y -= (f.thick_unit * 10)
        } else if (face_options.wrinkle_mouth_height == "Up") {
            mouth_left_point.y -= (f.thick_unit * 5)
        } else if (face_options.wrinkle_mouth_height == "Down") {
            mouth_left_point.y += (f.thick_unit * 5)
        } else if (face_options.wrinkle_mouth_height == "Far Down") {
            mouth_left_point.y += (f.thick_unit * 10)
        }
        left_nose_mouth_wrinkle.push(mouth_left_point);

        left_chin_line_point.x -= (f.thick_unit * 4);
        left_nose_mouth_wrinkle.push(left_chin_line_point);


        //Right chin mouth line
        var right_nose_round_top_point = nose_full_line[nose_full_line.length - 3];

        var right_nose_mouth_wrinkle = [];

        right_nose_round_top_point.x += (f.thick_unit * .5);
        right_nose_round_top_point.y -= (f.thick_unit * 5);
        right_nose_mouth_wrinkle.push(_.clone(right_nose_round_top_point));

        right_nose_round_top_point.x += (f.thick_unit * 8);
        right_nose_round_top_point.y -= (f.thick_unit * 5);
        right_nose_mouth_wrinkle.push(_.clone(right_nose_round_top_point));

        mouth_right_point.x += (f.thick_unit * 25);
        mouth_right_point.y += (f.thick_unit * 8);
        if (face_options.wrinkle_mouth_width == "Far Out") {
            mouth_right_point.x += (f.thick_unit * 8)
        } else if (face_options.wrinkle_mouth_width == "Out") {
            mouth_right_point.x += (f.thick_unit * 3)
        } else if (face_options.wrinkle_mouth_width == "In") {
            mouth_right_point.x -= (f.thick_unit * 3)
        } else if (face_options.wrinkle_mouth_width == "Far In") {
            mouth_right_point.x -= (f.thick_unit * 8)
        }

        mid_point = (mouth_right_point.y + right_nose_round_top_point.y) / 2 - (f.thick_unit * 5);
        right_nose_mouth_wrinkle.push({x: mouth_right_point.x + (f.thick_unit), y: mid_point});

        mid_point = (mouth_right_point.y + right_nose_round_top_point.y) / 2;
        right_nose_mouth_wrinkle.push({x: mouth_right_point.x, y: mid_point});

        if (face_options.wrinkle_mouth_height == "Far Up") {
            mouth_right_point.y -= (f.thick_unit * 10)
        } else if (face_options.wrinkle_mouth_height == "Up") {
            mouth_right_point.y -= (f.thick_unit * 5)
        } else if (face_options.wrinkle_mouth_height == "Down") {
            mouth_right_point.y += (f.thick_unit * 5)
        } else if (face_options.wrinkle_mouth_height == "Far Down") {
            mouth_right_point.y += (f.thick_unit * 10)
        }
        right_nose_mouth_wrinkle.push(mouth_right_point);

        right_chin_line_point.x += (f.thick_unit * 4);
        right_nose_mouth_wrinkle.push(right_chin_line_point);

        // Add 3 lines of different thickness to each side
        //                  -thick---   -alpha-  -movex-
        var alpha_widths = [16, 8, 10, 5, 4, .5, 10, 2, 1];

        var curve_thick1 = alpha_widths[0] * f.thick_unit;
        var curve_thick3 = alpha_widths[2] * f.thick_unit;

        if (face_options.gender == 'female') {
            curve_thick1 /= 4;
            curve_thick3 /= 4;
        }

        var curve_thicknessess = [1, .5, .2, .1, 0, .05, 0];

        if (face_options.wrinkle_pattern_mouth == "None") {
            curve_thicknessess = [0];
        } else if (face_options.wrinkle_pattern_mouth == "Gentle") {
            curve_thicknessess = [.4, .3, .2, .1, .1, .05, .1];
        } else if (face_options.wrinkle_pattern_mouth == "Straight") {
            curve_thicknessess = [1, .7, .6, .4, .5, .4, .3];
        } else if (face_options.wrinkle_pattern_mouth == "Middle") {
            curve_thicknessess = [.3, .2, .7, .7, .6, .1, 0];
        } else if (face_options.wrinkle_pattern_mouth == "Bottom") {
            curve_thicknessess = [.3, .1, 0, .3, .3, .7, .6];
        } else if (face_options.wrinkle_pattern_mouth == "Heavy") {
            curve_thicknessess = [1, .9, .8, .9, .7, .8, .4];
        }
        for (var piece = 0; piece < curve_thicknessess.length; piece++) {
            curve_thicknessess[piece] *= (wrinkle_age / 200);
        }

        var curve_thicknessess1 = _.map(curve_thicknessess, function (b) {
            return maths.clamp(b * curve_thick1, 0, 8)
        });
        var curve_thicknessess3 = _.map(curve_thicknessess, function (b) {
            return maths.clamp(b * curve_thick3, 0, 5)
        });

        var curve_settings1 = {
            break_line_every: 5,
            thickness_gradients: curve_thicknessess1,
            alpha: maths.clamp(mouth_line_curve_alpha / alpha_widths[3], 0, .6),
            line_color: face_options.skin_colors.darkflesh
        };
        var curve_settings3 = {
            break_line_every: 20,
            thickness_gradients: curve_thicknessess3,
            alpha: maths.clamp(mouth_line_curve_alpha / alpha_widths[5], 0, .5),
            line_color: face_options.skin_colors.cheek
        };

        var left_nose_curve1 = a.createMultiPath(left_nose_mouth_wrinkle, curve_settings1);
        left_nose_curve1.x = -(alpha_widths[6] * f.thick_unit);
        var left_nose_curve3 = a.createMultiPath(left_nose_mouth_wrinkle, curve_settings3);
        left_nose_curve3.x = -(alpha_widths[8] * f.thick_unit);

        var right_nose_curve1 = a.createMultiPath(right_nose_mouth_wrinkle, curve_settings1);
        right_nose_curve1.x = (alpha_widths[6] * f.thick_unit);
        var right_nose_curve3 = a.createMultiPath(right_nose_mouth_wrinkle, curve_settings3);
        right_nose_curve3.x = (alpha_widths[8] * f.thick_unit);

        shapes.push(left_nose_curve1);
        shapes.push(left_nose_curve3);
        shapes.push(right_nose_curve1);
        shapes.push(right_nose_curve3);
    }


    // Cheekbones
    var chin_bottom_line = a.transformLineToGlobalCoordinates(lines, 'chin bottom line');
    var right_cheekbone_wrinkle = [];
    var right_cheekbone_wrinkle_curve1;
    var chin_bottom_line_right = _.clone(a.comparePoints(chin_bottom_line, 'x', 'highest', true));
    var left_cheekbone_wrinkle = [];
    var left_cheekbone_wrinkle_curve1;
    var axis;
    var eye_right_right = a.comparePoints(right_eye_line, 'x', 'highest');
    var eye_left_left = a.comparePoints(left_eye_line, 'x', 'lowest');


    //Cheek color ovals
    var right_cheek_oval = head_line;//a.transformShapeLine({type: 'oval',radius: 60 * f.thick_unit});
    var skin_lighter = maths.hexColorToRGBA(face_options.skin_colors.skin, .1);
    var cheek_darker = maths.hexColorToRGBA(face_options.skin_colors.skin, 1);

    var fill_colors = [cheek_darker, skin_lighter];
    var fill_steps = [.1, 1];

    var nose_bottom_y = a.comparePoints(nose_full_line, 'y', 'highest');
    var cheek_y = (nose_bottom_y + mid_y) / 2;

    var right_cheek = a.createPath(right_cheek_oval, {
        close_line: true, thickness: f.thick_unit,
        line_color: 'rgba(0,0,0,0)',
        fill_colors: fill_colors, fill_method: 'radial',
        x_offset_start: eye_right_right - (f.thick_unit * 5),
        x_offset_end: eye_right_right - (f.thick_unit * 5),
        y_offset_start: cheek_y,
        y_offset_end: cheek_y,
        fill_steps: fill_steps, radius: (f.thick_unit * 75)
    });
    shapes.push(right_cheek);

    var left_cheek = a.createPath(right_cheek_oval, {
        close_line: true, thickness: f.thick_unit,
        line_color: 'rgba(0,0,0,0)',
        fill_colors: fill_colors, fill_method: 'radial',
        x_offset_start: eye_left_left + (f.thick_unit * 5),
        x_offset_end: eye_left_left + (f.thick_unit * 5),
        y_offset_start: cheek_y,
        y_offset_end: cheek_y,
        fill_steps: fill_steps, radius: (f.thick_unit * 75)
    });
    shapes.push(left_cheek);


    //Cheek lines
    mid_y = right_eye_line[0].y;
    var cheekbone_lines = [];

    if (face_options.gender == 'Male') {
        cheekbone_lines.push("140-180");
    }
    if (face_options.gender == 'Female') {
//        cheekbone_lines.push("L");
    }

    if (_.indexOf(cheekbone_lines, 'J') > -1) {

        mid_x = a.comparePoints(head_line, 'x', 'highest');
        right_cheekbone_wrinkle.push({x: mid_x, y: mid_y});

        x = mid_x - (f.thick_unit * 30);
        y = mid_y + (f.thick_unit * 25);

        right_cheekbone_wrinkle.push({x: x, y: y});
        right_cheekbone_wrinkle.push({x: x, y: y}); //TODO: Play with these

        right_cheekbone_wrinkle.push({x: eye_right_right, y: mouth_right_point.y});

        var chin_point = _.clone(chin_bottom_line_right);
        chin_point.y += 20 * f.thick_unit;
        var newPoint = a.comparePoints(head_line, 'closest', chin_point);
        right_cheekbone_wrinkle.push(newPoint);

        right_cheekbone_wrinkle_curve1 = a.createPath(right_cheekbone_wrinkle, {
            break_line_every: 20,
            thickness_gradients: [16 * f.thick_unit, 3.5 * f.thick_unit, 0],
            line_color: face_options.skin_colors.darkflesh,
            alpha: .25
        });
        shapes.push(right_cheekbone_wrinkle_curve1);


        axis = a.comparePoints(chin_bottom_line, 'x', 'middle');
        left_cheekbone_wrinkle = a.transformShapeLine({type: 'reverse', axis: axis}, face_options, right_cheekbone_wrinkle);
        left_cheekbone_wrinkle_curve1 = a.createPath(left_cheekbone_wrinkle, {
            break_line_every: 20,
            thickness_gradients: [16 * f.thick_unit, 3.5 * f.thick_unit, 0],
            line_color: face_options.skin_colors.darkflesh,
            alpha: .25
        });
        shapes.push(left_cheekbone_wrinkle_curve1);

    }


//TODO: Have a "half-to" or "fifth-to" function
    var cheek_line_options = {
        break_line_every: 20, dot_array: false,
        thickness_gradients: [12 * f.thick_unit, 3.5 * f.thick_unit, 0],
        line_color: face_options.skin_colors.darkflesh,
        alpha: wrinkle_age / 200
    };

    if (_.indexOf(cheekbone_lines, '140-180') > -1) {

        mid_x = a.comparePoints(head_line, 'x', 'highest');

        right_cheekbone_wrinkle.push({x: mid_x - (5 * f.thick_unit), y: mid_y + (3 * f.thick_unit)});
        right_cheekbone_wrinkle.push({x: mid_x - (10 * f.thick_unit), y: mid_y - (1 * f.thick_unit)});

        right_nose_round_top_point = nose_full_line[nose_full_line.length - 3];

        right_cheekbone_wrinkle.push({x: eye_right_right, y: right_nose_round_top_point.y});
        right_cheekbone_wrinkle.push({x: eye_right_right - (10 * f.thick_unit), y: right_nose_round_top_point.y + (6 * f.thick_unit) });

        //Curves 1
        right_cheekbone_wrinkle_curve1 = a.createPath(right_cheekbone_wrinkle, cheek_line_options);
        shapes.push(right_cheekbone_wrinkle_curve1);
        axis = a.comparePoints(chin_bottom_line, 'x', 'middle');
        left_cheekbone_wrinkle = a.transformShapeLine({type: 'reverse', axis: axis}, face_options, right_cheekbone_wrinkle);
        left_cheekbone_wrinkle_curve1 = a.createPath(left_cheekbone_wrinkle, cheek_line_options);
        shapes.push(left_cheekbone_wrinkle_curve1);


        var right_cheekbone_wrinkle2 = [];
        right_cheekbone_wrinkle2.push({x: eye_right_right, y: right_nose_round_top_point.y});

        right_cheekbone_wrinkle2.push({x: eye_right_right, y: right_nose_round_top_point.y});

        right_cheekbone_wrinkle2.push({x: eye_right_right - (1 * f.thick_unit), y: mouth_right_point.y});


        var chin_point = _.clone(chin_bottom_line_right);
        chin_point.y += 20 * f.thick_unit;
        var newPoint = a.comparePoints(head_line, 'closest', chin_point);
        right_cheekbone_wrinkle2.push({x: newPoint.x, y: newPoint.y - (2 * f.thick_unit)});

        //Curves 2
        var right_cheekbone_wrinkle_curve2 = a.createPath(right_cheekbone_wrinkle2, cheek_line_options);
        shapes.push(right_cheekbone_wrinkle_curve2);
        axis = a.comparePoints(chin_bottom_line, 'x', 'middle');
        left_cheekbone_wrinkle = a.transformShapeLine({type: 'reverse', axis: axis}, face_options, right_cheekbone_wrinkle2);
        var left_cheekbone_wrinkle_curve2 = a.createPath(left_cheekbone_wrinkle, cheek_line_options);
        shapes.push(left_cheekbone_wrinkle_curve2);


    }


    if (_.indexOf(cheekbone_lines, 'L') > -1) {

        mid_x = a.comparePoints(head_line, 'x', 'highest');
        x = mid_x - (f.thick_unit * 10);
        right_cheekbone_wrinkle.push({x: x, y: mid_y});

        right_cheekbone_wrinkle.push({x: eye_right_right, y: mouth_right_point.y});

        chin_bottom_line_right.x += 10 * f.thick_unit;
        right_cheekbone_wrinkle.push(chin_bottom_line_right);

        right_cheekbone_wrinkle_curve1 = a.createPath(right_cheekbone_wrinkle, {
            break_line_every: 20,
            thickness_gradients: [12 * f.thick_unit, 3.5 * f.thick_unit, 0],
            line_color: face_options.skin_colors.darkflesh,
            alpha: .25
        });
        shapes.push(right_cheekbone_wrinkle_curve1);

        axis = a.comparePoints(chin_bottom_line, 'x', 'middle');
        left_cheekbone_wrinkle = a.transformShapeLine({type: 'reverse', axis: axis}, face_options, right_cheekbone_wrinkle);
        left_cheekbone_wrinkle_curve1 = a.createPath(left_cheekbone_wrinkle, {
            break_line_every: 20,
            thickness_gradients: [12 * f.thick_unit, 3.5 * f.thick_unit, 0],
            line_color: face_options.skin_colors.darkflesh,
            alpha: .25
        });
        shapes.push(left_cheekbone_wrinkle_curve1);
    }


    return shapes;
}});

//chin
new Avatar('add_render_function', {style: 'lines', feature: 'chin', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var mouth_width = 1; //.6 - 1.3
    var width = (f.mouth.right - f.mouth.left) / 2.6 * mouth_width;
    var height = (f.mouth.bottom - f.mouth.top);

    var chin_line = [
        {x: -5, y: 0},
        {x: 0, y: 1},
        {x: 5, y: 0}
    ];
    var chin_top_line = a.createPathFromLocalCoordinates(chin_line, {close_line: false, thickness: (f.thick_unit * 2), color: face_options.skin_colors.deepshadow}, width, height);
    var x = f.mouth.x;
    var y = f.mouth.y + (f.thick_unit * 30);
    var alpha = .5;
    chin_top_line.x = x;
    chin_top_line.y = y;
    chin_top_line.alpha = alpha;
    lines.push({name: 'chin top line', line: chin_line, shape: chin_top_line, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
    shapes.push(chin_top_line);

    var chin_mid_line = a.createPathFromLocalCoordinates(chin_line, {close_line: false, thickness: (f.thick_unit * 7), color: face_options.skin_colors.deepshadow}, width * .9, height);
    x = f.mouth.x;
    y = f.mouth.y + (f.thick_unit * 32);
    alpha = .2;
    chin_mid_line.x = x;
    chin_mid_line.y = y;
    chin_mid_line.alpha = alpha;
    lines.push({name: 'chin mid line', line: chin_line, shape: chin_mid_line, x: x, y: y, alpha: alpha, scale_x: width * .9, scale_y: height});
    shapes.push(chin_mid_line);

    var chin_line_lower = [
        {x: -5, y: 1},
        {x: 0, y: 0},
        {x: 5, y: 1}
    ];
    width *= 1.5;
    var chin_under_line = a.createPathFromLocalCoordinates(chin_line_lower, {close_line: false, thickness: (f.thick_unit * 1.5), color: face_options.skin_colors.deepshadow}, width, height);
    x = f.mouth.x;
    y = f.mouth.y + (f.thick_unit * 45);
    alpha = .15;
    chin_under_line.x = x;
    chin_under_line.y = y;
    chin_under_line.alpha = alpha;
    lines.push({name: 'chin bottom line', line: chin_line_lower, shape: chin_under_line, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
    shapes.push(chin_under_line);

    var head_line = a.transformLineToGlobalCoordinates(lines, 'face');
    var chin_mid_line_piece = a.transformLineToGlobalCoordinates(lines, 'chin mid line');
    var chin = a.lineSegmentCompared(head_line, chin_mid_line_piece, 'below', f.thick_unit * -5);

    var chin_fill_colors = [face_options.skin_colors.cheek, face_options.skin_colors.skin];
    var chin_fill_steps = [0, 1];
    var chin_height, chin_shape;
    if (face_options.chin_shape == 'Pronounced') {
        //TODO: This could use some work to make it look more realistic

        if (chin && chin.length && chin.length > 2 && face_options.age < 20) {
            chin = a.transformShapeLine({type: 'contract', multiplier: 0.7}, face_options, chin);
            chin_height = a.comparePoints(chin, 'height');

            chin_shape = a.createPath(chin, {
                close_line: true, thickness: f.thick_unit, smooth: true, line_color: face_options.skin_colors.skin,
                fill_colors: chin_fill_colors, fill_method: 'radial',
                fill_steps: chin_fill_steps, radius: chin_height / 1.5
            });
            chin_shape.y = (f.thick_unit * 10);
            shapes.push(chin_shape);
        }

    } else if (face_options.chin_shape == 'Oval') {

        if (chin && chin.length && chin.length > 2 && face_options.age < 20) {
            chin_height = a.comparePoints(chin, 'height');

            chin_shape = a.createPath(chin, {
                close_line: true, thickness: f.thick_unit, smooth: true, line_color: face_options.skin_colors.skin,
                fill_colors: chin_fill_colors, fill_method: 'radial',
                fill_steps: chin_fill_steps, radius: chin_height / 2
            });
            chin_shape.y = -f.thick_unit;
            shapes.push(chin_shape);
        }
    }

    var draw_divot = false;
    if (face_options.chin_divot == 'Small') {
        draw_divot = true;
        height /= 2;
    } else if (face_options.chin_divot == 'Large') {
        draw_divot = true;
    } else if (face_options.chin_divot == 'Double') {
        draw_divot = true;
    }

    if (draw_divot && face_options.age < 20) {
        var mid_x = a.comparePoints(chin, 'x', 'middle');
        var mid_y = a.comparePoints(chin, 'y', 'middle');

        var chin_divot_line = [
            {x: 0, y: -3},
            {x: 0, y: 0},
            {x: -.5, y: 3}
        ];

        var divot_line = a.createPathFromLocalCoordinates(chin_divot_line, {close_line: false, thickness: (f.thick_unit * 5), color: face_options.skin_colors.deepshadow}, width, height);
        x = mid_x - (f.thick_unit);
        y = mid_y + (f.thick_unit * 8);
        alpha = .1;
        divot_line.x = x;
        divot_line.y = y;
        divot_line.alpha = alpha;
        lines.push({name: 'chin divot line', line: chin_divot_line, shape: divot_line, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
        shapes.push(divot_line);

        if (face_options.chin_divot == 'Double') {
            chin_divot_line = a.transformShapeLine({type: 'reverse', direction: 'horizontal'}, face_options, chin_divot_line);
            var divot_line_2 = a.createPathFromLocalCoordinates(chin_divot_line, {close_line: false, thickness: (f.thick_unit * 5), color: face_options.skin_colors.deepshadow}, width, height);
            divot_line_2.x = x + (f.thick_unit * 6);
            divot_line_2.y = y;
            divot_line_2.alpha = alpha;
            divot_line_2.name = 'chin divot line 2';
            lines.push({name: 'chin divot line 2', line: chin_divot_line, shape: divot_line_2, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
            shapes.push(divot_line_2);
        }
    }

    return shapes;
}});

//mouth
new Avatar('add_render_function', {style: 'lines', feature: 'mouth', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    //These can change expression alot
    var mouth_width = 1; //.6 - 1.3
    if (face_options.mouth_width == "Tiny") {
        mouth_width = .7;
    } else if (face_options.mouth_width == "Small") {
        mouth_width = .8;
    } else if (face_options.mouth_width == "Short") {
        mouth_width = .9;
    } else if (face_options.mouth_width == "Normal") {
        mouth_width = 1;
    } else if (face_options.mouth_width == "Big") {
        mouth_width = 1.05;
    } else if (face_options.mouth_width == "Wide") {
        mouth_width = 1.1;
    }

    var lip_bottom_height = 0.5; // 0 - 2
    if (face_options.lip_bottom_height == "Down") {
        lip_bottom_height = 0;
    } else if (face_options.lip_bottom_height == "Low") {
        lip_bottom_height = .25;
    } else if (face_options.lip_bottom_height == "Raised") {
        lip_bottom_height = 1;
    } else if (face_options.lip_bottom_height == "High") {
        lip_bottom_height = 1.3;
    }

    var lip_bottom_bottom = 1.5; // 1-5
    if (face_options.lip_bottom_bottom == "Down") {
        lip_bottom_bottom = 1;
    } else if (face_options.lip_bottom_bottom == "Low") {
        lip_bottom_bottom = 1.2;
    } else if (face_options.lip_bottom_bottom == "Raised") {
        lip_bottom_bottom = 2;
    } else if (face_options.lip_bottom_bottom == "High") {
        lip_bottom_bottom = 2.5;
    }

    var lip_top_height = 1.5; //.2 - 1.5
    if (face_options.lip_top_height == "Down") {
        lip_top_height = .5;
    } else if (face_options.lip_top_height == "Low") {
        lip_top_height = 1;
    } else if (face_options.lip_top_height == "Raised") {
        lip_top_height = 1.75;
    } else if (face_options.lip_top_height == "High") {
        lip_top_height = 2;
    }

    var lip_top_top = 1; //.2 - 2
    if (face_options.lip_top_top == "Down") {
        lip_top_top = .2;
    } else if (face_options.lip_top_top == "Low") {
        lip_top_top = .5;
    } else if (face_options.lip_top_top == "Raised") {
        lip_top_top = 1.3;
    } else if (face_options.lip_top_top == "High") {
        lip_top_top = 1.5;
    }

    var mouth_left_lift = 0;
    if (face_options.mouth_left_upturn == "Down") {
        mouth_left_lift = -2;
    } else if (face_options.mouth_left_upturn == "Low") {
        mouth_left_lift = -1;
    } else if (face_options.mouth_left_upturn == "Raised") {
        mouth_left_lift = 1;
    } else if (face_options.mouth_left_upturn == "High") {
        mouth_left_lift = 2;
    }
    var mouth_right_lift = 0;
    if (face_options.mouth_right_upturn == "Down") {
        mouth_right_lift = -2;
    } else if (face_options.mouth_right_upturn == "Low") {
        mouth_right_lift = -1;
    } else if (face_options.mouth_right_upturn == "Raised") {
        mouth_right_lift = 1;
    } else if (face_options.mouth_right_upturn == "High") {
        mouth_right_lift = 2;
    }

    lip_top_top += lip_top_height;

    if (face_options.face_shape == "Inverted Triangle") {
        mouth_width *= .7;
    }

    var lip_thickness = f.thick_unit * 2;
    var width = (f.mouth.right - f.mouth.left) / 2.6 * mouth_width;
    var height = (f.mouth.bottom - f.mouth.top);

    if (face_options.gender == 'Female') {
        lip_thickness *= 1.4;
        lip_bottom_bottom += 1.5;
        lip_bottom_height += 1;
        lip_top_top += 1;
    }

    //Mouth top and bottom line
    var mouth_top_line = [
        {x: -13, y: -2 - mouth_left_lift},
        {x: -10, y: -1 - (mouth_left_lift / 2)},
        {x: -5, y: -(lip_top_top * 2)},
        {x: -1, y: -lip_top_top},
        {x: 1, y: -lip_top_top},
        {x: 5, y: -(lip_top_top * 2)},
        {x: 10, y: -1 - (mouth_right_lift / 2) },
        {x: 13, y: -2 - mouth_right_lift},

        {x: 12, y: 0 - mouth_right_lift},
        {x: 10, y: 1 - (mouth_right_lift / 2) },
        {x: 4, y: lip_bottom_height + lip_bottom_bottom},
        {x: 1, y: lip_bottom_height + lip_bottom_bottom - 1},
        {x: -1, y: lip_bottom_height + lip_bottom_bottom - 1},
        {x: -4, y: lip_bottom_height + lip_bottom_bottom},
        {x: -10, y: 1 - (mouth_left_lift / 2)},
        {x: -12, y: 0 - mouth_left_lift}
    ];
    if (face_options.lip_shape == "Thin") {
        mouth_top_line = [
            {x: -13, y: -2 - (mouth_left_lift * .5)},
            {x: -5, y: -(lip_top_top)},
            {x: -1, y: -(lip_top_top * .8)},
            {x: 1, y: -(lip_top_top * .8)},
            {x: 5, y: -(lip_top_top)},
            {x: 13, y: -2 - (mouth_right_lift * .5)},

            {x: 12, y: -2.5 - (mouth_right_lift * .5)},
            {x: 4, y: (lip_bottom_height + lip_bottom_bottom) * .5},
            {x: 1, y: (lip_bottom_height + lip_bottom_bottom) * .7},
            {x: -1, y: (lip_bottom_height + lip_bottom_bottom) * .7},
            {x: -4, y: (lip_bottom_height + lip_bottom_bottom) * .5},
            {x: -12, y: -2.5 - (mouth_left_lift * .5)}
        ];
    } else if (face_options.lip_shape == "Thick") {
        mouth_top_line = [
            {x: -13, y: -2 - (mouth_left_lift * .7)},
            {x: -5, y: -(lip_top_top * 1.2)},
            {x: -1, y: -(lip_top_top * 1.1)},
            {x: 1, y: -(lip_top_top * 1.1)},
            {x: 5, y: -(lip_top_top * 1.2)},
            {x: 13, y: -2 - (mouth_right_lift * .7)},

            {x: 12, y: -2.5 - (mouth_right_lift * .5)},
            {x: 4, y: (lip_bottom_height + lip_bottom_bottom) * .9},
            {x: 1, y: (lip_bottom_height + lip_bottom_bottom) * 1.1},
            {x: -1, y: (lip_bottom_height + lip_bottom_bottom) * 1.1},
            {x: -4, y: (lip_bottom_height + lip_bottom_bottom) * .9},
            {x: -12, y: -2.5 - (mouth_left_lift * .5)}
        ];
    }

    var lip_top_color, lip_mid_color, lip_line_color;
    if (face_options.gender == 'Male') {
        var skin_color = net.brehaut.Color(face_options.skin_colors.skin);
        lip_top_color = net.brehaut.Color(face_options.lip_color).blend(skin_color, 1).toString();
        lip_mid_color = net.brehaut.Color(face_options.lip_color).darkenByRatio(0.3).toString();
        lip_line_color = 'blank';
    } else {
        lip_top_color = net.brehaut.Color(face_options.lip_color).darkenByRatio(0.1).toString();
        lip_mid_color = net.brehaut.Color(face_options.lip_color).darkenByRatio(0.3).toString();
        lip_line_color = face_options.skin_colors.deepshadow;
    }

    var l = a.createPathFromLocalCoordinates(mouth_top_line, {
        close_line: true, thickness: lip_thickness,
        line_color: lip_line_color, fill_method: 'linear',
        fill_colors: [lip_top_color, lip_mid_color, lip_top_color],
        fill_steps: [0, .5, 1], y_offset_start: -height / 2, y_offset_end: height / 2,
        x_offset_start: 0, x_offset_end: 0
    }, width, height);
    l.x = f.mouth.x;
    l.y = f.mouth.y;
    l.name = 'lips';
    lines.push({name: 'lips', line: mouth_top_line, shape: l, x: f.mouth.x, y: f.mouth.y, scale_x: width, scale_y: height});
    shapes.push(l);

    var tongue_line = a.transformShapeLine({type: 'midline of loop'}, face_options, mouth_top_line);
    var l2 = a.createPathFromLocalCoordinates(tongue_line, {close_line: false, thickness: 1, color: face_options.skin_colors.deepshadow}, width, height);
    l2.x = f.mouth.x;
    l2.y = f.mouth.y;
    l2.alpha = 0.5;
    l2.name = 'tongue';
    lines.push({name: 'tongue', line: tongue_line, shape: l2, x: f.mouth.x, y: f.mouth.y, scale_x: width, scale_y: height});
    shapes.push(l2);


    return shapes;
}});


//=====Circle Styles==========
new Avatar('add_render_function', {style: 'circles', feature: 'neck', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var face_options = avatar.face_options;
    var shapes = [];
    var neck = new createjs.Shape();
    var zone = f.neck;
    neck.graphics.beginStroke(face_options.skin_colors.highlights).beginFill(face_options.skin_colors.skin).drawRect(zone.left, zone.top, zone.right, zone.bottom);
    neck.x = zone.x;
    neck.y = zone.y;
    shapes.push(neck);
    return shapes;
}});

new Avatar('add_render_function', {style: 'circles', feature: 'ears', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var face_options = avatar.face_options;
    var shapes = [];

    var left_ear = new createjs.Shape();
    var zone = f.ears;
    left_ear.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill(face_options.skin_colors.cheek).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    left_ear.x = zone.left_x;
    left_ear.y = zone.y;
    shapes.push(left_ear);

    var right_ear = new createjs.Shape();
    zone = f.ears;
    right_ear.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill(face_options.skin_colors.cheek).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    right_ear.x = zone.right_x;
    right_ear.y = zone.y;
    shapes.push(right_ear);
    return shapes;
}});

new Avatar('add_render_function', {style: 'circles', feature: 'face', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var face_options = avatar.face_options;
    var shapes = [];

    var face = new createjs.Shape();
    var zone = f.face;
    face.graphics.beginStroke(face_options.skin_colors.highlights).beginFill(face_options.skin_colors.skin).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    face.x = zone.x;
    face.y = zone.y;
    shapes.push(face);
    return shapes;
}});

new Avatar('add_render_function', {style: 'circles', feature: 'eyes', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var face_options = avatar.face_options;
    var shapes = [];

    var left_eye = new createjs.Shape();
    var zone = f.eyes;
    left_eye.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill('white').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    left_eye.x = zone.left_x;
    left_eye.y = zone.y;
    shapes.push(left_eye);

    var left_iris = new createjs.Shape();
    zone = f.eyes.iris;
    left_iris.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill(face_options.eye_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    left_iris.x = zone.left_x;
    left_iris.y = zone.y;
    shapes.push(left_iris);

    var left_pupil = new createjs.Shape();
    zone = f.eyes.pupil;
    left_pupil.graphics.beginFill('black').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    left_pupil.x = zone.left_x;
    left_pupil.y = zone.y;
    shapes.push(left_pupil);

    var right_eye = new createjs.Shape();
    zone = f.eyes;
    right_eye.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill('white').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    right_eye.x = zone.right_x;
    right_eye.y = zone.y;
    shapes.push(right_eye);

    var right_iris = new createjs.Shape();
    zone = f.eyes.iris;
    right_iris.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill(face_options.eye_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    right_iris.x = zone.right_x;
    right_iris.y = zone.y;
    shapes.push(right_iris);

    var right_pupil = new createjs.Shape();
    zone = f.eyes.pupil;
    right_pupil.graphics.beginFill('black').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    right_pupil.x = zone.right_x;
    right_pupil.y = zone.y;
    shapes.push(right_pupil);

    return shapes;
}});

new Avatar('add_render_function', {style: 'circles', feature: 'nose', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var face_options = avatar.face_options;
    var shapes = [];
    var nose = new createjs.Shape();
    var zone = f.nose;
    nose.graphics.beginStroke(face_options.skin_colors.deepshadow).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    nose.x = zone.x;
    nose.y = zone.y;
    shapes.push(nose);
    return shapes;
}});

new Avatar('add_render_function', {style: 'circles', feature: 'mouth', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var face_options = avatar.face_options;
    var shapes = [];

    var mouth = new createjs.Shape();
    var zone = f.mouth;
    mouth.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill(face_options.lip_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    mouth.x = zone.x;
    mouth.y = zone.y;
    shapes.push(mouth);

    var mouth_line = new createjs.Shape();
    zone = f.mouth;
    mouth_line.graphics.setStrokeStyle(.5 * f.thick_unit).beginStroke('black').moveTo(zone.x + zone.left, zone.y).lineTo(zone.x + zone.right / 2, zone.y);
    shapes.push(mouth_line);

    return shapes;
}});;
function createHairPattern(options, zone, hair_line, outer_hair_line, a) {
    //Can take in numbers like '123123' or '212,1231,53' and make hair

    var type = options.type || 'droopy';
    var pattern = options.pattern || '1111121111';
    var point_pattern = options.point_pattern || '';
    var head_width = a.comparePoints(hair_line, 'width');
    var hair_left = a.comparePoints(hair_line, 'x', 'lowest');

    var head_height = zone.bottom + zone.top;

    var hair_pieces = pattern.split(",");
    var left_hair, mid_hair, right_hair;
    if (hair_pieces.length == 1) {
        left_hair = [];
        mid_hair = '' + parseInt(hair_pieces[0]);
        right_hair = [];
    } else if (hair_pieces.length == 3) {
        left_hair = '' + parseInt(hair_pieces[0]);
        mid_hair = '' + parseInt(hair_pieces[1]);
        right_hair = '' + parseInt(hair_pieces[2]);
    }

    if (mid_hair.length < 2) {
        mid_hair = "1" + mid_hair + "1";
    }
    var head_slice_width = head_width / (mid_hair.length - 1);
    var head_slice_height = head_height / 8;

    //TODO: Handle left and right
    var new_hair_line = [];
    _.each(mid_hair, function (length_number, i) {
        var x = hair_left + (i * head_slice_width);

        var height = parseInt(length_number) * head_slice_height;
        var hair_line_height = a.comparePoints(hair_line, 'crosses x', x);
        var y = hair_line_height + height;

        new_hair_line.push({x: x, y: y});
//            new_hair_line.push({
//                x: zone.x+zone.left+(i * head_slice_width),
//                y: zone.y+zone.top+height
//            });

    });

//        var spacing = comparePoints(hair_line, 'width') / hair_line.length;
//
//        var hair_spaced = hydratePointsAlongLine(new_hair_line, spacing, true);
//        _.each(new_hair_line, function(nhl, i){
//            nhl.y += hair_spaced[i].y;
//        });


    return hair_line.concat(new_hair_line.reverse());
}

//hair
new Avatar('add_render_function', {style: 'lines', feature: 'hair', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var hair_line_level_adjust = -f.thick_unit * 2;
    var outer_hair_x = 10;
    var outer_hair_y = 20;


    if (face_options.age < 20) {
        outer_hair_y *= (face_options.age / 20);
    }

    var head_line = a.transformLineToGlobalCoordinates(lines, 'face');
    var eye_line = a.transformLineToGlobalCoordinates(lines, 'left eye');

    head_line = a.hydratePointsAlongLine(head_line, f.thick_unit * 30);

    var zone = f.face;
    var hair_line = a.lineSegmentCompared(head_line, eye_line, 'above', hair_line_level_adjust);

    if (hair_line && hair_line.length) {
        var hair_dot_array = a.createPath(hair_line, {dot_array: true, thickness: f.thick_unit * 5, line_color: face_options.hair_color});
        lines.push({name: 'hair dot line', line: hair_line, shape: hair_dot_array, x: 0, y: 0, scale_x: 1, scale_y: 1});
//            shapes = shapes.concat(hair);


//        var inner_hair_line = a.extrudeHorizontalArc(hair_line, f.thick_unit * inner_hair_x, f.thick_unit * inner_hair_y);
//            var inner_hair_dots = a.createPath(inner_hair_line, {dot_array:true, thickness: f.thick_unit * 2, line_color: face_options.hair_color});
//            shapes = shapes.concat(inner_hair_dots);

        var outer_hair_line = a.extrudeHorizontalArc(hair_line, f.thick_unit * outer_hair_x, -f.thick_unit * outer_hair_y);
//            var outer_hair_dots = a.createPath(outer_hair_line, {dot_array:true, thickness: f.thick_unit * 2, line_color: face_options.hair_color});
//            shapes = shapes.concat(outer_hair_dots);

        var color = _.clone(face_options.hair_color);
        var fill_color = color;
        if (color == 'White' || color == '#000000') color = 'gray';
        color = maths.hexColorToRGBA(color, 1);
        fill_color = maths.hexColorToRGBA(fill_color, 1);

//        var full_hair_line = inner_hair_line.concat(outer_hair_line.reverse());
//        full_hair_line = a.transformShapeLine({type: 'smooth'}, face_options, full_hair_line);

//        var outer_hair = a.createPath(full_hair_line, {close_line: true, thickness: f.thick_unit * 2, color: color, fill_color: fill_color});
//        lines.push({name: 'full hair', line: full_hair_line, shape: outer_hair});
//        shapes = shapes.concat(outer_hair);

        var hair_builder = {style: face_options.hair_style, pattern: '111121111', point_pattern: '', pattern_name: face_options.hair_pattern};
        if (face_options.hair_pattern == "Mid Bump") {
            hair_builder.pattern = '111121111';
        } else if (face_options.hair_pattern == "Eye Droop") {
            hair_builder.pattern = '411114356224';
        } else if (face_options.hair_pattern == "Side Part") {
            hair_builder.pattern = '0,123212321,0';
        } else if (face_options.hair_pattern == "Bowl") {
            hair_builder.pattern = '0,2222222,0';
        } else if (face_options.hair_pattern == "Receding") {
            hair_builder.pattern = '0,1111111,0';
        } else if (face_options.hair_pattern == "Bowl with Peak") {
            hair_builder.pattern = '0,111131111,0';
        } else if (face_options.hair_pattern == "Bowl with Big Peak") {
            hair_builder.pattern = '0,111242111,0';
            hair_builder.point_pattern = ' ,    P    , ';
        } else if (face_options.hair_pattern == "Side Part2") {
            hair_builder.pattern = '0,4323234,0';
        } else if (face_options.hair_pattern == "Twin Peaks") {
            hair_builder.pattern = '0,11242124211,0';
        }

        if (face_options.hair_style == "Spiky") {
            //Replace each blank with a "P"
            var point_pattern = _.str.repeat(" ", hair_builder.pattern.length);
            _.each(hair_builder.point_pattern, function (style, i) {
                if (style != " ") point_pattern[i] = style;
            });
            _.each(hair_builder.pattern, function (style, i) {
                if (style == ",") point_pattern[i] = ',';
                if (style == " ") point_pattern[i] = 'P';
            })
        } else if (face_options.hair_style == "Bald" || face_options.hair_style == "None" || face_options.age < 2) {
            hair_builder = {};
        }


        if (hair_builder.style) {
            var added_hair_line = createHairPattern(hair_builder, zone, hair_line, outer_hair_line, a);
            var added_outer_hair = a.createPath(added_hair_line, {
                close_line: true, thickness: f.thick_unit * 2, line_color: color,
                fill_color: fill_color
            });
            lines.push({name: 'full hair second layer', line: added_hair_line, shape: added_outer_hair});
            shapes = shapes.concat(added_outer_hair);

            var stubble_fill_canvas = a.findShape(avatar.textures, 'stubble lines', null, 'canvas');
            var added_outer_hair_fill = a.createPath(added_hair_line, {
                close_line: true, line_color: 'blank', fill_canvas: stubble_fill_canvas
            });
            added_outer_hair_fill.alpha = 0.2;
            shapes = shapes.concat(added_outer_hair_fill);
        }


    }
    return shapes;
}});;
//beard
new Avatar('add_render_function', {style: 'lines', feature: 'beard', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var beard_style = _.clone(face_options.beard_style);
    if (face_options.gender == 'Female' || face_options.age < 18) beard_style = 'None';

    var stubble_style = face_options.stubble_style;
    if (face_options.gender == 'Female' || face_options.age < 15) stubble_style = 'None';

    if (beard_style == "None" && stubble_style == "None") return shapes;

    var stubble_alpha = 0.3;
    if (stubble_style == "Light") {
        stubble_alpha = 0.1;
    } else if (stubble_style == "Medium") {
        stubble_alpha = 0.4;
    } else if (stubble_style == "Heavy") {
        stubble_alpha = 0.7;
    }

    var inner_hair_x = 0;
    var inner_hair_y = 3;
    var outer_hair_x = .5;
    var outer_hair_y = .5;
    var beard_alpha = 0.95;

    if (beard_style == 'None') {
        //Skip
    } else if (beard_style == 'Full Chin') {
        inner_hair_y = 12;
        outer_hair_x = 1;
        outer_hair_y = 2;
        beard_alpha = .9;
    } else if (beard_style == 'Chin Warmer') {
        inner_hair_y = 10;
        outer_hair_x = .5;
        outer_hair_y = .5;
        beard_alpha = .8;
    } else if (beard_style == 'Soup Catcher') {
        inner_hair_y = 13;
        outer_hair_x = 1;
        outer_hair_y = 10;
        beard_alpha = .9;
    } else if (beard_style == 'Thin Chin Wrap') {
        inner_hair_y = 1;
        outer_hair_x = 0;
        outer_hair_y = .2;
        beard_alpha = .4;
    } else if (beard_style == 'Thin Low Chin Wrap') {
        inner_hair_x = 1;
        inner_hair_y = 1;
        outer_hair_x = 0;
        outer_hair_y = .2;
        beard_alpha = .3;
    }
    if (face_options.age < 20) {  //TODO: Make this a scaling function
        inner_hair_x *= .25;
        inner_hair_y *= .25;
        outer_hair_x *= .25;
        outer_hair_y *= .25;
    } else if (face_options.age < 23) {
        inner_hair_x *= .5;
        inner_hair_y *= .5;
        outer_hair_x *= .5;
        outer_hair_y *= .5;
    } else if (face_options.age < 26) {
        inner_hair_x *= .75;
        inner_hair_y *= .75;
        outer_hair_x *= .75;
        outer_hair_y *= .75;
    }

    var color = _.clone(face_options.beard_color || face_options.hair_color);
    if (color == 'Hair') color = face_options.hair_color;
    var fill_color = color;
    if (color == 'White' || color == '#000000') color = 'gray';
    color = maths.hexColorToRGBA(color, 1);
    fill_color = maths.hexColorToRGBA(fill_color, 1);


    var head_line = a.transformLineToGlobalCoordinates(lines, 'face');
    var eye_line = a.transformLineToGlobalCoordinates(lines, 'left eye');
    var nose_bottom_line = a.transformLineToGlobalCoordinates(lines, 'nose bottom line');

    var hair_line_level_adjust = 1;
    var beard_line = a.lineSegmentCompared(head_line, eye_line, 'below', hair_line_level_adjust * 10 * f.thick_unit);

//    var eye_line_bottom_y = a.comparePoints(eye_line, 'y','highest');
//    var beard_line_left = a.comparePoints(eye_line, 'x','lowest');
//    var beard_line_right = a.comparePoints(eye_line, 'x','highest');
//    var beard_line_bottom = a.comparePoints(eye_line, 'y','highest');
//
//    //TODO: Get to same component space
//    beard_line = a.constrainPolyLineToBox(beard_line, {
//        tl:{x:beard_line_left,y:eye_line_bottom_y},
//        br:{x:beard_line_right, y:beard_line_bottom}});

    var beard = a.createPath(beard_line, {thickness: f.thick_unit * 5, line_color: face_options.hair_color});
    lines.push({name: 'beard line', line: beard_line, shape: beard, x: 0, y: 0, scale_x: 1, scale_y: 1});
    //Note: this just added the beard as a reference line without showing it

    var nose_bottom_line_bottom_point = a.comparePoints(nose_bottom_line, "y", "highest");

    var stubble_fill_canvas = a.findShape(avatar.textures, 'stubble lines', null, 'canvas');
    if (beard_style == "None" && stubble_style != "None" && beard_line && beard_line.length && beard_line.length > 2) {
        var inner_stubble_line = a.extrudeHorizontalArc(beard_line, 0, -f.thick_unit * 100);

        var inner_stubble_line_top_point = a.comparePoints(inner_stubble_line, "y", "highest");
        if (inner_stubble_line_top_point > nose_bottom_line_bottom_point) {
            var lower_by = inner_stubble_line_top_point - nose_bottom_line_bottom_point - (f.thick_unit * 10);
            inner_stubble_line = a.transformShapeLine({type: 'shift', y_offset: -lower_by}, face_options, inner_stubble_line);
        }

        var full_stubble_line = beard_line.concat(inner_stubble_line.reverse());
        full_stubble_line = a.transformShapeLine({type: 'smooth'}, face_options, full_stubble_line);


        var full_stubble = a.createPath(full_stubble_line, {
            close_line: true, line_color: 'blank',
            fill_color: '#444'
        });
        full_stubble.alpha = stubble_alpha / 4;
        lines.push({name: 'full stubble', line: full_stubble_line, shape: full_stubble, alpha: beard_alpha});
        shapes = shapes.concat(full_stubble);

        var full_stubble_texture = a.createPath(full_stubble_line, {
            close_line: true, line_color: 'blank',
            fill_canvas: stubble_fill_canvas
        });
        full_stubble_texture.alpha = stubble_alpha;
        shapes = shapes.concat(full_stubble_texture);
    }

    if (beard_style != "None" && beard_line && beard_line.length && beard_line.length > 2) {

        var inner_hair_line = a.extrudeHorizontalArc(beard_line, -f.thick_unit * inner_hair_x * 10, -f.thick_unit * inner_hair_y * 10);
        var outer_hair_line = a.extrudeHorizontalArc(beard_line, -f.thick_unit * outer_hair_x * 10, f.thick_unit * outer_hair_y * 10);

        //TODO: Adjust differently by ear
        var inner_hair_line_top_point = a.comparePoints(inner_hair_line, "y", "highest");
        if (inner_hair_line_top_point < nose_bottom_line_bottom_point) {
            var lower_by = inner_hair_line_top_point - nose_bottom_line_bottom_point;
            inner_hair_line = a.transformShapeLine({type: 'shift', y_offset: -lower_by}, face_options, inner_hair_line);
        }

        var full_beard_line = outer_hair_line.concat(inner_hair_line.reverse());
        full_beard_line = a.transformShapeLine({type: 'smooth'}, face_options, full_beard_line);


        var full_beard = a.createPath(full_beard_line, {
            close_line: true, thickness: f.thick_unit * .5, line_color: color,
            fill_color: fill_color
        });
        full_beard.alpha = beard_alpha;
        lines.push({name: 'full beard', line: full_beard_line, shape: full_beard, x: 0, y: 0, scale_x: 1, scale_y: 1, alpha: beard_alpha});
        shapes = shapes.concat(full_beard);

        var full_beard_texture = a.createPath(full_beard_line, {
            close_line: true, line_color: 'blank',
            fill_canvas: stubble_fill_canvas
        });
        full_beard_texture.alpha = beard_alpha;
        shapes = shapes.concat(full_beard_texture);
    }
    return shapes;
}});


//mustache
new Avatar('add_render_function', {style: 'lines', feature: 'mustache', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var mustache_style = face_options.mustache_style;
    if (face_options.gender == 'Female' || face_options.age < 18) mustache_style = 'None';

    var mustache_width_mod = face_options.mustache_width;
    var mustache_height_mod = face_options.mustache_height;

    //TODO: Stretch to cover face
    mustache_width_mod = a.turnWordToNumber(mustache_width_mod, .8, 1.2, 'Small,Short,Medium,Long,Large');
    mustache_height_mod = a.turnWordToNumber(mustache_height_mod, .8, 1.2, 'Small,Short,Medium,Long,Large');

    var color = _.clone(face_options.beard_color || face_options.hair_color);
    if (color == 'Hair') color = face_options.hair_color;
    var fill_color = color;
    if (color == 'White' || color == '#000000') color = 'gray';
    color = maths.hexColorToRGBA(color, 1);
    fill_color = maths.hexColorToRGBA(fill_color, 1);

    if (mustache_style != "None") {

        //TODO: Link mustache points to lip anchors for mouth movement

        var nose_bottom_line = a.transformLineToGlobalCoordinates(lines, 'nose bottom line');
        var mouth_line = a.transformLineToGlobalCoordinates(lines, 'lips');
        var mouth_top_point = a.comparePoints(mouth_line, 'y', 'lowest', true);
        var nose_bottom_line_bottom_point = a.comparePoints(nose_bottom_line, "y", "highest", true);

        var mustache_line = [];
        var double_it = true;
        if (mustache_style == 'Propeller') {
            mustache_line = [
                {x: 0, y: 0},
                {x: -4, y: 1},
                {x: -10, y: 2},
                {x: -13, y: 1},
                {x: -15, y: 3},
                {x: -12, y: -1},
                {x: 0, y: -1}
            ]
        } else if (mustache_style == 'Handlebar') {
            mustache_line = [
                {x: 0, y: 0},
                {x: 3, y: -2},
                {x: 8, y: 4},
                {x: 12, y: 1},
                {x: 10, y: 3},
                {x: 8, y: 4},
                {x: 2, y: 2},
                {x: 0, y: 1}
            ]
        } else if (mustache_style == 'Pointy Handlebar') {
            mustache_line = [
                {x: 0, y: 0},
                {x: 3, y: -2},
                {x: 8, y: 2},
                {x: 12, y: 2},
                {x: 12, y: 2},
                {x: 9, y: 3},
                {x: 5, y: 4},
                {x: 2, y: 2},
                {x: 0, y: 1}
            ]
        } else if (mustache_style == 'Low Handlebar') {
            mustache_line = [
                {x: 0, y: 0},
                {x: 3, y: -2},
                {x: 8, y: 2},
                {x: 12, y: 0},
                {x: 9, y: 2},
                {x: 5, y: 3},
                {x: 2, y: 2},
                {x: 0, y: 1}
            ]
        } else if (mustache_style == 'Long Curled Handlebar') {
            mustache_line = [
                {x: 0, y: 0},
                {x: 3, y: -2},
                {x: 8, y: 2},
                {x: 12, y: 0},
                {x: 14, y: -2},
                {x: 12, y: -4},
                {x: 10, y: -2},
                {x: 10, y: -2},
                {x: 12, y: -4},
                {x: 14, y: -2},
                {x: 12, y: 0},
                {x: 9, y: 2},
                {x: 5, y: 3},
                {x: 2, y: 2},
                {x: 0, y: 1}
            ]
        } else if (mustache_style == 'Curled Handlebar') {
            mustache_line = [
                {x: 0, y: 0},
                {x: 3, y: -2},
                {x: 8, y: 2},
                {x: 11, y: 0},
                {x: 13, y: -2},
                {x: 11, y: -3},
                {x: 10, y: -1},
                {x: 10, y: -1},
                {x: 11, y: -3},
                {x: 13, y: -2},
                {x: 11, y: 0},
                {x: 9, y: 2},
                {x: 5, y: 3},
                {x: 2, y: 2},
                {x: 0, y: 1}
            ]
        } else if (mustache_style == 'Lower Dali') {
            mustache_line = [
                {x: 0, y: -1},
                {x: 10, y: 0},
                {x: 10, y: 0},
                {x: 3, y: 0},
                {x: 0, y: -.5}
            ]
        } else if (mustache_style == 'Butterfly') {
            mustache_line = [
                {x: 0, y: -1},
                {x: 2, y: -1.1},
                {x: 10, y: 1.5},
                {x: 1, y: 2},
                {x: 0, y: 0}
            ]
        } else if (mustache_style == 'Fu Manchu') {
            mustache_line = [
                {x: 0, y: .5},
                {x: 6, y: -1.1},
                {x: 10, y: 1.5},
                {x: 10.5, y: 3},
                {x: 11, y: 10},
                {x: 11, y: 20},
                {x: 9, y: 23},
                {x: 9.5, y: 8},
                {x: 9.2, y: 2},

                {x: 1, y: 3.5},
                {x: 0, y: 1.5}
            ]
        } else if (mustache_style == 'Dali') {
            mustache_line = [
                {x: 0, y: -1},
                {x: 2, y: -1.1},
                {x: 8, y: 1.5},
                {x: 15, y: -10},
                {x: 15, y: -10},
                {x: 7, y: 3},
                {x: 1, y: 2},
                {x: 0, y: 0}
            ]
        } else if (mustache_style == 'Sparrow') {
            mustache_line = [
                {x: 0, y: .5},
                {x: 2, y: -0.1},
                {x: 10, y: 5},
                {x: 10, y: 8},
                {x: 10, y: 10},
                {x: 10, y: 8},
                {x: 4, y: 4},
                {x: .5, y: 4},
                {x: 0, y: 1}
            ]
        } else if (mustache_style == 'Zappa') {
            mustache_line = [
                {x: 0, y: .2},
                {x: 6, y: 0},
                {x: 9, y: 2},
                {x: 10, y: 5},
                {x: 10, y: 8},
                {x: 10.5, y: 9},
                {x: 9, y: 8},
                {x: 7, y: 4},
                {x: 0, y: 4.5}
            ]
        } else if (mustache_style == 'Anchor') {
            mustache_line = [
                {x: 0, y: -1},
                {x: 2, y: -1},
                {x: 2, y: 3},
                {x: 12, y: 0},
                {x: 1, y: 3.5},
                {x: 0, y: 2}
            ]
        } else if (mustache_style == 'Copstash') {
            mustache_line = [
                {x: 0, y: 0},
                {x: 3, y: -.1},
                {x: 8, y: 2.5},
                {x: 6, y: 2.5},
                {x: 1, y: 3},
                {x: 0, y: 1}
            ]
        } else {
            double_it = false;
        }

        if (double_it) {
            var other_side_mustache = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, mustache_line);
            mustache_line = mustache_line.concat(other_side_mustache.reverse());
        }

        var alpha = .9;
        var x = nose_bottom_line_bottom_point.x;
        var y = ((mouth_top_point.y * 2) + (nose_bottom_line_bottom_point.y * 8)) / 10;
        var line_thickness = (f.thick_unit * 2);
        var width = f.thick_unit * 70 * mustache_width_mod;
        var height = f.thick_unit * 80 * mustache_height_mod;

        var mustache_outline = a.transformPathFromLocalCoordinates(mustache_line, width, height);
        var mustache_shape = a.createPath(mustache_outline, {
            close_line: true, thickness: line_thickness, color: color, fill_color: fill_color
        });
        mustache_shape.alpha = alpha;
        mustache_shape.x = x;
        mustache_shape.y = y;
        lines.push({name: 'mustache', line: mustache_outline, shape: mustache_shape, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
        shapes.push(mustache_shape);


        var hair_canvas = a.findShape(avatar.textures, 'stubble lines', null, 'canvas');
        var mustache_shape_texture = a.createPath(mustache_outline, {
            close_line: true, line_color: 'blank', fill_canvas: hair_canvas
        });
        mustache_shape_texture.alpha = 0.2;
        mustache_shape_texture.x = x;
        mustache_shape_texture.y = y;
        shapes.push(mustache_shape_texture);

    }


    return shapes;
}});
;
var ogreTemplate = new Avatar('copy_data_template', 'Human');

ogreTemplate.ear_shape_options.push('Pointed');

ogreTemplate.eye_color_options = ['Red', 'Pink', 'Purple', 'Yellow'];
ogreTemplate.eye_cloudiness = ['Pink', 'Blue', 'Misty'];

ogreTemplate.skin_colors_options = [
    {name: 'Fair', highlights: 'rgb(40,202,30)', skin: 'rgb(50,185,50)'},
    {name: 'Dark', highlights: 'rgb(80,80,80)', skin: 'rgb(80,185,70)'}
];

ogreTemplate.skin_shade_options = ['Preset'];

new Avatar('set_data_template', 'Ogre', ogreTemplate);
;
var naviTemplate = new Avatar('copy_data_template', 'Human');

naviTemplate.ear_shape_options.push('Pointed');

naviTemplate.eye_cloudiness = ['Pink'];

naviTemplate.skin_colors_options = [
    {skin: '#8888EE', cheek: '#898acc'},
    {skin: '#8888CC', cheek: '#898add'},
    {skin: '#8080DD', cheek: '#898aee'},
    {skin: '#9090DD', cheek: '#898add'}
];
naviTemplate.skin_shade_options = ['Preset'];
naviTemplate.beard_style_options = ['None'];
naviTemplate.stubble_style_options = ['None'];

naviTemplate.thickness_options = [-1, .5, 0, .5, 1];

naviTemplate.face_shape_options = "Oval,Rectangular,Diamond".split(",");

new Avatar('set_data_template', 'Navi', naviTemplate);
