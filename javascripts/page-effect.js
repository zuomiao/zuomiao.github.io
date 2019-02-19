/**
*@atuhor http://www.xdnote.com/
*使用方法一：直接嵌入
* <script type="text/javascript" src="http://www.xdnote.com/javascripts/page-effect.js" ></script>
*使用方法二：将以下脚本拖到书签，点
javascript: void((function() {if(typeof pageEffect!='undefined'){pageEffect.stop;return};var element = document.createElement('script');element.charset = 'utf-8';element.setAttribute('src', 'http://test.xdnote.com/javascripts/page-effect.js');document.body.appendChild(element);})())
*/
var pageEffect = (function(document,window,undefined){
	'use strict';
	var draw = null,							//canvas 2d 对象
		width = document.body.offsetWidth,		//屏幕宽度	
		height = document.body.offsetHeight,	//屏幕高度
		stopevent = null;						//动画事件（停止）
	var the1data=[								//特效需要的数据
			{rgb : '0,0,128,' , offset : [ 0.5*width, 150, 30, 40], start:0.2, stop:0.5, step:0.01},
			{rgb : '0,128,128,' , offset : [ 0.3*width, 200, 50, 50], start:0.1, stop:0.4, step:0.008},
			{rgb : '128,0,128,' , offset : [ 0.4*width, 50, 40, 60], start:0.3, stop:0.8, step:0.007},
			{rgb : '0,0,255,' , offset : [ 0.6*width, 85, 80, 50], start:0.4, stop:0.6, step:0.006},
			{rgb : '0,255,128,' , offset : [ 0.7*width, 300, 60, 40], start:0.1, stop:0.8, step:0.005},
			{rgb : '0,0,128,' , offset : [ 0.2*width, 250, 50, 30], start:0.2, stop:0.6, step:0.009},
			{rgb : '255,0,128,' , offset : [ 0.24*width, 120, 60, 60], start:0.3, stop:0.4, step:0.008},
			{rgb : '128,0,0,' , offset : [ 0.35*width, 180, 30, 30], start:0.2, stop:0.3, step:0.007},
			{rgb : '0,128,0,' , offset : [ 0.45*width, 230, 40, 40], start:0.1, stop:0.1, step:0.006},
			{rgb : '128,128,0,' , offset : [ 0.55*width, 400, 50, 50], start:0.4, stop:0.9, step:0.004},
			{rgb : '255,128,0,' , offset : [ 0.65*width, 330, 60, 60], start:0.3, stop:0.8, step:0.001},
			{rgb : '128,0,255,' , offset : [ 0.75*width, 380, 70, 50], start:0.2, stop:0.7, step:0.005},
			{rgb : '125,128,255,' , offset : [ 0.62*width, 94, 50, 70], start:0.1, stop:0.6, step:0.002},
			{rgb : '128,0,128,' , offset : [ 0.48*width, 324, 60, 60], start:0.2, stop:0.5, step:0.001}
		];

	/**
	* 初始化页面，将canva插入BODY
	*/
	function init(){
		var css = 'position:absolute;left:0;top:0;z-index:9999;pointer-events:none;'
		var canva = document.createElement("canvas");
		canva.width = width;  
		canva.height = height;  
		canva.style.cssText = css;
		document.body.appendChild(canva),
		draw = canva.getContext("2d");
		drawCanvas();
		animation(Date.now());
	}
	/**
	* 绘制页面
	*/
	function drawCanvas(){
		draw.clearRect(0,0,width,height);
		for(var i = 0, j = the1data.length; i < j; i++){
			var data = the1data[i];
			if((typeof data.current) == 'undefined'){
				data.current = data.start;
			}
			data.current += data.step;
			if(data.current > data.stop ){
				data.step = data.step > 0 ? (0-data.step): data.step;
			}else if(data.current < data.start){
				data.step = data.step < 0 ? (0-data.step): data.step;
			}
			draw.beginPath();
			draw.fillStyle = 'rgba(' + data.rgb + data.current+')';
			draw.fillRect(data.offset[0],data.offset[1],data.offset[2],data.offset[3]);
			draw.stroke();
		}
		draw.closePath();
        draw.fill(); 
	}
	/**
	* 动画特效
	*/
	function animation(){
		drawCanvas();
		stopevent=window.requestAnimationFrame(animation);
	}
	function stopanimation(){
		window.cancelAnimationFrame(stopevent);
	}
	init();
	return {stop:stopanimation};
})(document,window);
