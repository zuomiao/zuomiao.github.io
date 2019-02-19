var QRContainer = function(){
	this.init();
}
QRContainer.prototype = {
	width:300,height:200,index:0,max:0,
	hrefs:[],
	init:function(){
		if(window._qrv){
			document.getElementById('_qrcode_container').style.display='block';
		}else{
			this.gethrefs();
			if(this.max==0){
				alert('没有打到链接')
			}else{
				this.build();
				this.prev();
			}
		}
	},
	gethrefs:function(){
		var links = document.getElementsByTagName('a');
		for(var i=0,j=links.length;i<j;i++){
			var link = links[i];
			if(/\.apk/i.test(link.href)){
				var imgsrc = 'http://qr.liantu.com/api.php?text='+link.href;
				this.hrefs.push(imgsrc);
			}
		}
		this.max = this.hrefs.length;
	},
	build:function(){
		var winWidth = document.documentElement.clientWidth;
		var winHeight = document.documentElement.clientHeight;
		var links = document.getElementsByTagName('a');
		var marginLeft = (winWidth - this.width)/2;
		var marginTop = (this.height)/2;
		var container = document.createElement('div');
		container.setAttribute('id','_qrcode_container')
		container.setAttribute('style','border-radius:5px;border:1px solid #AAAAAA;width: '+ this.width + 'px;height:'+ this.height + 'px;display: block; position: absolute;top: 0;margin-left:' + marginLeft + 'px;margin-top:'+marginTop+'px; background-color:#eeeeee;');
		var context='<div id="_qrprev" style="margin-top:50px;width:50px;height:100px;cursor:pointer;float:left;display:block;line-height:100px;font-weight:bold;font-size:36px;text-align:center;" onclick="_qrv.prev()">&lt;</div>';
		context+='<div style="width:200px;height:200px;float:left;display:block;">';
		context+='<img id="_qrimg" style="width:200px;height:200px;" src="'+this.hrefs[0]+'" />';
		context+='</div>';
		context+='<div style="width:50px;height:200px;cursor:pointer;float:left;display:block;">';
		context+='<div onclick="_qrv.close()" style="width:50px;height:50px;font-size:36px;line-height:50px;text-align:center;">X</div>'
		context+='<div id="_qrnext" onclick="_qrv.next()" style="width:50px;height:100px;cursor:pointer;display:block;line-height:100px;font-size:36px;text-align:center;">&gt;</div>'
		context+='</div>';
		container.innerHTML=context;
		document.body.appendChild(container);
	},
	prev:function(){
		if(this.index>0){
			this.index=this.index-1;
		}
		this.upstate();
	},
	next:function(){
		if((this.index+1)<this.max){
			this.index=this.index+1;
		}
		this.upstate();
	},
	upstate:function(i){
		if((this.max-this.index)==this.max){
			document.getElementById('_qrprev').style.visibility='hidden';
		}else{
			document.getElementById('_qrprev').style.visibility='visible';
		}
		if( (this.max-this.index)==1){
			document.getElementById('_qrnext').style.visibility='hidden';
		}else{
			document.getElementById('_qrnext').style.visibility='visible';
		}
		document.getElementById('_qrimg').src = this.hrefs[this.index];
	},
	close:function(){
		document.getElementById('_qrcode_container').style.display='none';
		
	}
}
window._qrv = new QRContainer();