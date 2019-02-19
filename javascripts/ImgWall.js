(function( fn ) {
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = fn();
	} else {
		fn(true);
	}
})(function(gobal){
	//单例imgWall 指针， 触屏对象，以及浏览器版本
	var _self = null,TOUTH=null,bsv=(function () {
	  		var tmpStyle = document.createElement("div").style;
	  		var lists = ['t','webkitT', 'MozT', 'msT', 'OT'];
	  		var v = '';
		  	for (var i = 0, iLen = lists.length; i < iLen; i++) {
		  		v = lists[i] + 'ransform';
		  		if (v in tmpStyle) {
		  			return lists[i];
		  		}
		  	}
		  	return '';
	  	}());
	//配置及数据存放
	var CONFIG = {
		CONTAINER_ID : '',			//	容器ID
		MIN_CROSS:50,				//	图片最小移动距离
		SCALE:true,					//	开启放大缩小
		ROTATE:true,				//	开启旋转
		SCALE_MIN:0.5,				//	最小可缩小的级别
		SCALE_MAX:3,				//	最大可放大的级别
		AUTO_OPEN : true,			//	自动启动,如果设为false，只会new一个imgwall,手动调用一下imgwall.open方法即可打开
		TRAN_TIME:1,				//	切换过渡时间（秒）
		DATAS:[]					//	图片数组
	};
	//计算样式的数据
	var STYLE = {
		WIN_WIDTH:0,				//	浏览器宽度
		WIN_HEIGHT:0,				//	浏览器高度
		TRANSFORM:bsv==''?'transform':bsv+'ransform',		//	浏览器特效的样式
		TRANSITION:bsv==''?'transition':bsv+'ransition'		//	浏览器过渡的样式
	};
	//页面元素
	var ELEMENTS = {
		ROOT:null,					//	图片墙-容器根节点
		HEAD:null,					//	头部工具条
		WALL:null,					//	图片墙-列表根节点
		IMG:null,					//	图片墙上当前的图片
		FOOT:null					//	尾部工具条
	};
	//事件
	var EVENTS = {
		OPEN_EVENT:null,			//	打开时的事件
		CLOSE_EVENT:null,			//	关闭时的事件
		SWITCH_EVENT:null			//	切换图片时的事件
	};
	//状态存储
	var STATE = {
		BAR_SHOW:true,				//	状态栏是否正在显示
		ZOOM_LAST:1,				//	最后一次的SCALE的大小
		ROTATE_LAST:0,				//	最后一次旋转的大小
		X_LAST:0,					//	最后一次平移的X轴
		Y_LAST:0,					//	最后一次平移的Y轴
		X_TMP:0,					//	X轴偏移	
		Y_TMP:0,					//	Y轴偏移
		CURRENT_INDEX:0				//	当前浏览图片的位置
	};
	//解析配置
	function _initDefault(config){
		CONFIG.CONTAINER_ID = typeof config.id!='undefined'?config.id:'';
		CONFIG.AUTO_OPEN = typeof config.auto_open!='undefined' ? config.auto_open:CONFIG.AUTO_OPEN;
		CONFIG.SCALE = typeof config.scale!='undefined' ? config.scale:CONFIG.SCALE;
		CONFIG.ROTATE = typeof config.rotate!='undefined' ? config.rotate:CONFIG.ROTATE;
		CONFIG.DATAS = typeof config.data!='undefined' ? config.data:CONFIG.DATAS;
		_self.onOpen(config.evt_Open);
		_self.onClose(config.evt_Close);
		_self.onSwitch(config.evt_Switch);
		STYLE.ORGIN_HEIGHT = document.documentElement.style.height;
		if(STYLE.ORGIN_HEIGHT==''){
			//HTML5的高度BUG
			document.documentElement.style.height='100%';
		}
		STYLE.ORGIN_OVERFLOW = document.documentElement.style.overflow;
		document.documentElement.style.overflow = 'hidden';
		STYLE.ORGIN_OFFSET = [document.documentElement.scrollLeft,document.documentElement.scrollTop];
		STYLE.WIN_HEIGHT=document.documentElement.offsetHeight;
		STYLE.WIN_WIDTH = document.documentElement.offsetWidth;
		ELEMENTS.ROOT = document.getElementById(config.id);
		document.documentElement.style.overflow = STYLE.ORGIN_OVERFLOW;
	};
	//	DOM元素构造
	function _buildHTML(){
		var hid = CONFIG.CONTAINER_ID+'_header', wid = CONFIG.CONTAINER_ID+'_wall', fid = CONFIG.CONTAINER_ID+'_footer';
		if(ELEMENTS.ROOT==null){
			ELEMENTS.ROOT=document.createElement('article');
			document.body.appendChild(ELEMENTS.ROOT);
		}
		var headerHTML = '<section class="iw_header" id="'+hid+'"><span class="iw_close" id="iw_close">&lt; 返回</span><span class="iw_title" id="iw_title"></span></section>';
		var wallHTML = '<section class="iw_wall"><div id="'+wid+'" class="iw_wall_ct"></div></section>';
		var footHTML = '<section class="iw_footer" id="'+fid+'"></section>';
		ELEMENTS.ROOT.innerHTML = headerHTML+wallHTML+footHTML;
		ELEMENTS.HEAD = document.getElementById(hid);
		ELEMENTS.WALL = document.getElementById(wid);
		ELEMENTS.FOOT = document.getElementById(fid);
		ELEMENTS.ROOT.className+=' iw_container';
		ELEMENTS.ROOT.style.height = STYLE.WIN_HEIGHT+'px';
		ELEMENTS.ROOT.style.width = STYLE.WIN_WIDTH+'px';
		ELEMENTS.WALL.style.width = STYLE.WIN_WIDTH*CONFIG.DATAS.length+'px';
	    document.getElementById('iw_close').addEventListener('click',function(){
	    	_self.close();
	    });
		var wallImgs = '';
		for(var i=0,j=CONFIG.DATAS.length;i<j;i++){
			var img = CONFIG.DATAS[i];
			wallImgs += '<div class="iw_img" style="width:'+STYLE.WIN_WIDTH+'px;"><div id="iw_img_' + i + '"><div style="background-image:url(' + img.imgUrl +');"></div></div> </div>';
		}
		ELEMENTS.WALL.innerHTML = wallImgs;
		ELEMENTS.IMG = document.getElementById('iw_img_0');
	}
	function _initEvent(){
		TOUTH = Hammer(ELEMENTS.ROOT);
//		var stopEvt = Hammer(ELEMENTS.FOOT);
//	    stopEvt.on('tap', function(){
//	    	return false;
//	    });
		//点击屏幕
		var tapHandder = function(evt){
			if(target==ELEMENTS.HEAD||target==ELEMENTS.FOOT||ELEMENTS.HEAD.hasChildNodes(target)||ELEMENTS.FOOT.hasChildNodes(target)){
				return false;
			}
			if(STATE.BAR_SHOW){
				ELEMENTS.HEAD.style.display='none';
				ELEMENTS.FOOT.style.display='none';
				STATE.BAR_SHOW=false;
			}else{
				ELEMENTS.HEAD.style.display='block';
				ELEMENTS.FOOT.style.display='block';
				STATE.BAR_SHOW=true;
			}
		}
		var panMoveHandder = function(evt){
			if(STATE.ZOOM_LAST > 1){
				STATE.X_TMP = STATE.X_LAST+ evt.deltaX;
				STATE.Y_TMP = STATE.Y_LAST+ evt.deltaY;
				_self.transition();
			}else{
				_self.slightMove( 0 - evt.deltaX);
			}
		}
		//移动
		var panendHandder = function(evt){
			if(STATE.ZOOM_LAST > 1){
				STATE.X_LAST = STATE.X_TMP;
				STATE.Y_LAST = STATE.Y_TMP;
			}else{
				var index = STATE.CURRENT_INDEX;
				if(Math.abs(evt.deltaX)<CONFIG.MIN_CROSS){
					
				}else if(evt.deltaX > 0){
		    		index = STATE.CURRENT_INDEX-1;
		    	}else{
		    		index = STATE.CURRENT_INDEX+1;
		    	}
		    	_self.toIndex(index);				
			}
		}
	    TOUTH.on('tap', tapHandder);
	    TOUTH.on('panmove', panMoveHandder);
	    TOUTH.on('panend', panendHandder);
		
		//放大缩小
		var pinchHandder = function(evt){
			STATE.ZOOM_LAST*=Math.sqrt(Math.sqrt(Math.sqrt(evt.scale)));
			STATE.ZOOM_LAST=STATE.ZOOM_LAST>CONFIG.SCALE_MIN?STATE.ZOOM_LAST:CONFIG.SCALE_MIN;
			STATE.ZOOM_LAST = STATE.ZOOM_LAST>CONFIG.SCALE_MAX?CONFIG.SCALE_MAX:STATE.ZOOM_LAST;
			STATE.ROTATE_LAST=CONFIG.ROTATE?evt.rotation:0;
//			alert(STATE.ROTATE_LAST);
			_self.transition();
		}
		var pinchendHandder = function(evt){
			if(STATE.ZOOM_LAST<=1){
				STATE.ZOOM_LAST = 1
				STATE.ROTATE_LAST=0;
				STATE.X_LAST = STATE.X_TMP = 0;
				STATE.Y_LAST = STATE.Y_TMP = 0;
				_self.restore();
			}
		}
		if(CONFIG.SCALE){
			var pinch = new Hammer.Pinch();
			if(CONFIG.ROTATE){
				var rotate = new Hammer.Rotate();
				pinch.recognizeWith(rotate);
				TOUTH.add([pinch,rotate]);
			}else{			
				TOUTH.add([pinch]);
			}
		    TOUTH.on('pinchmove', pinchHandder);
		    TOUTH.on('pinchend', pinchendHandder);
		}
	}
	//启动
	function _stepup(){
		_buildHTML();
		_initEvent();
		if(CONFIG.AUTO_OPEN){
			_self.open();
		}
	};
	var ImgWall = function(config){
		_self=this;
		//有些手机浏览器有BUG（加载时获得的宽高不正确），给点延时，防止获取错误
		window.setTimeout(function(){
			_initDefault(config);
			_stepup();
		},5)
	}
	ImgWall.prototype = {
		//设置过渡时间
		setTranTime:function(ele, second){
			ele.style[STYLE.TRANSITION] = 'all ' + second + 's';
		},
		//多图模式下轻移
		slightMove:function(offset){
			this.setTranTime(ELEMENTS.WALL,0);
			ELEMENTS.WALL.style[STYLE.TRANSFORM] = 'translate('+(0-(STYLE.WIN_WIDTH*STATE.CURRENT_INDEX + offset))+'px)';
		},
		//切换图片
		toIndex:function(index){
			this.setTranTime(ELEMENTS.WALL,CONFIG.TRAN_TIME);
		    index = index<0?0:index;
		    index = index>=CONFIG.DATAS.length? CONFIG.DATAS.length-1:index;
			STATE.CURRENT_INDEX = index;
			ELEMENTS.IMG = document.getElementById('iw_img_'+STATE.CURRENT_INDEX);
			ELEMENTS.WALL.style[STYLE.TRANSFORM] = 'translate('+(0-STYLE.WIN_WIDTH*STATE.CURRENT_INDEX)+'px)';
			var sty = ELEMENTS.IMG.style[STYLE.TRANSFORM];
			STATE.ZOOM_LAST = /scale\(([\.\d]+)\)/.exec(sty)?RegExp.$1:0;
			STATE.ROTATE_LAST = /rotate\(([\.\d]+)deg\)/.exec(sty)?RegExp.$1:0;
			STATE.X_LAST = STATE.X_TMP =  parseInt(/translateX\((\d+)px\)/.exec(sty)?RegExp.$1:0);
			STATE.Y_LAST = STATE.Y_TMP =  parseInt(/translateY\((\d+)px\)/.exec(sty)?RegExp.$1:0);
			this.change();
		},
		//单图模式：放大、缩小、旋转、轻移
		transition:function(){
			this.setTranTime(ELEMENTS.IMG,0);
			this.setTranTime(ELEMENTS.IMG.firstChild,0);
			ELEMENTS.IMG.style[STYLE.TRANSFORM] ='scale(' + STATE.ZOOM_LAST + ') translateX('+ STATE.X_TMP + 'px) translateY(' + STATE.Y_TMP + 'px)';
			ELEMENTS.IMG.firstChild.style[STYLE.TRANSFORM] ='rotate('+ STATE.ROTATE_LAST +'deg) ';
		},
		//单图模式：还原
		restore:function(){
			this.setTranTime(ELEMENTS.IMG,CONFIG.TRAN_TIME);
			this.setTranTime(ELEMENTS.IMG.firstChild,CONFIG.TRAN_TIME);
			ELEMENTS.IMG.style[STYLE.TRANSFORM] ='scale(' + STATE.ZOOM_LAST + ') translateX('+ STATE.X_TMP + 'px) translateY(' + STATE.Y_TMP + 'px)';
			ELEMENTS.IMG.firstChild.style[STYLE.TRANSFORM] ='rotate('+ STATE.ROTATE_LAST +'deg) ';
			
		},
		change:function(){
			var title = CONFIG.DATAS[STATE.CURRENT_INDEX]['imgTitle']||'';
			document.getElementById('iw_title').innerHTML = title;
			if(EVENTS.SWITCH_EVENT){
				EVENTS.SWITCH_EVENT.call(this,CONFIG.DATAS[STATE.CURRENT_INDEX]);
			}
		},
		//打开
		open:function(){
			window.scroll(0,0);
			document.documentElement.style.height = STYLE.WIN_HEIGHT;
			document.documentElement.style.overflow = 'hidden';
			ELEMENTS.ROOT.style.display = 'block';
			if(EVENTS.OPEN_EVENT){
				window.setTimeout(EVENTS.OPEN_EVENT,3);			
				this.change();
			}
		},
		//关闭
		close:function(){
			document.documentElement.style.height = STYLE.ORGIN_HEIGHT;
			document.documentElement.style.overflow = STYLE.ORGIN_OVERFLOW;
			window.scroll(STYLE.ORGIN_OFFSET[0] ,STYLE.ORGIN_OFFSET[1]);
			ELEMENTS.ROOT.style.display = 'none';
			if(EVENTS.CLOSE_EVENT){
				EVENTS.CLOSE_EVENT.call(this);
			}			
		},
		onOpen:function(fn){
			if(typeof fn == 'function'){
				EVENTS.OPEN_EVENT = fn;
			}
		},
		onClose:function(fn){
			if(typeof fn == 'function'){
				EVENTS.CLOSE_EVENT = fn;
			}
		},
		onSwitch:function(fn){
			if(typeof fn == 'function'){
				EVENTS.SWITCH_EVENT = fn;
			}
		},
		//在foot部位添加操作，由于有BUG，继续使用window.setTimeout
		addAction:function(tip, fn){
			//有BUG，没办法保证全即时
			window.setTimeout(function(){
				var act = document.createElement('div');
				act.innerHTML = tip;
				if(ELEMENTS.FOOT.children.length == 0){
					act.className = 'iw_frist';
				}
				act.addEventListener('click',function(evt){
					fn.call(this,evt,CONFIG.DATAS[STATE.CURRENT_INDEX]);
				});
				ELEMENTS.FOOT.appendChild(act);
			},6);
		}
	}
	if(gobal)window.ImgWall = ImgWall;
	return ImgWall;
});

