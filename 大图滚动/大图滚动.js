	var pic = document.getElementById('pic');
	var img = document.getElementsByTagName('img');
	var lef = document.getElementById('lef');
	var rig = document.getElementById('rig');
	var ull = document.getElementById('ull');
	var lis = ull.getElementsByTagName('li');
	var pos = document.getElementsByClassName('pos');
	var long = 5;
	var go = null;
	var cto = null;
	// 设置计时调用，两秒后开始循环调用
	cto = setTimeout(function(){go = setInterval(run,17);},2000)
	// 设置滚动距离，无缝滚动，每张图停顿2秒。cto = null之后在赋值以防止计时器叠加。
	function run(){
		pic.scrollLeft += long;
		console.log(pic.scrollLeft)
		if (pic.scrollLeft >= 19000) {
			pic.scrollLeft = 0
		}
		if (pic.scrollLeft % 500 == 0) {
			clearInterval(go);
			cto = null;
			cto = setTimeout(function(){go = setInterval(run,17);},2000);};
			clas();
		}
	// 鼠标移入显示按钮
	pic.onmouseover = function(){
		lef.className = 'opa';
		rig.className = 'opa';
	}
	// 鼠标移出隐藏按钮
	pic.onmouseout = function(){
		lef.className = '';
		rig.className = '';
	}
	// lef的按钮被点击
	lef.onclick =  function(){
		clearTimeout(cto);
		clearInterval(go);
		var num = pic.scrollLeft % 500;
		pic.scrollLeft = pic.scrollLeft - num - 500;
		cto = null;
		go = null;
		cto = setTimeout(function(){go = setInterval(run,17);},2000);
		clas();
	}
	// rig的按钮被点击
	rig.onclick =  function(){
		clearTimeout(cto);
		clearInterval(go);
		var num = 500 - (pic.scrollLeft % 500);
		pic.scrollLeft = pic.scrollLeft + num;
		cto = null;
		go = null;
		cto = setTimeout(function(){go = setInterval(run,17);},2000);
		clas();
	}

	// 鼠标移入移出停止滚动
	for (var i = 0; i < img.length; i++) {
		img[i].onmouseover = function(){
			if (pic.scrollLeft % 500 == 0) {
				clearTimeout(cto);
				clearInterval(go);
			}
		}
	}
	for (var i = 0; i < img.length; i++) {
		img[i].onmouseout = function(){
			cto = null;
			go = null;
			cto = setTimeout(function(){go = setInterval(run,17);},2000);}
	}

	// 根据图片数量生成对应的小圆点
	var dian = document.createElement('ol');
	pos[0].appendChild(dian);
	for (var i = 0; i < lis.length; i++) {
		var dians = document.createElement('li');
		dian.appendChild(dians)
	}

	// 根据图片旋转，改变小圆点class     if的检测放在了每次运行run函数里面
	var oll = document.getElementsByTagName('ol');
	var olli = oll[0].getElementsByTagName('li');
	function clas(){
		if (pic.scrollLeft % 500 == 0) {
			for (var i = 0; i < olli.length; i++) {
				olli[i].className = '';
				var num = pic.scrollLeft / 500
				olli[num].className = 'bgc';
			}
		}
	}
	clas();


	// 点击小圆点，跳转图片
	for (var j = 0; j < olli.length; j++) {
		olli[j].onclick = function(){
			for (var i = 0; i < olli.length; i++) {
				olli[i].className = '';
				if (olli[i] == this) {
					olli[i].className = 'bgc';
					pic.scrollLeft = i * 500
				}
			}
		}
	}