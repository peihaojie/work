var one = document.getElementById('one');
var two = document.getElementById('two');
var three = document.getElementById('three');
var four = document.getElementById('four');
var out = document.getElementById('out');
var div = out.getElementsByTagName('div');
var but = document.getElementById('but');
var pp = but.getElementsByTagName('p');

one.onclick = function(){
	for (var i = 0; i < div.length; i++) {
		div[i].className = '';
	}
	one.className = 'one';
	out.style.cssText = 'background: url(\'1.jpg\');background-size: 500px 500px;';
	pp[0].innerHTML = '我是考拉啊~不认识我了嘛？';
}

two.onclick = function(){
	for (var i = 0; i < div.length; i++) {
		div[i].className = '';
	}
	two.className = 'two';
	out.style.cssText = 'background: url(\'2.jpg\');background-size: 500px 500px;';
	pp[0].innerHTML = '我在澳大利亚啊，号称国宝呢~';
}

three.onclick = function(){
	for (var i = 0; i < div.length; i++) {
		div[i].className = '';
	}
	three.className = 'three';
	out.style.cssText = 'background: url(\'3.jpg\');background-size: 500px 500px;';
	pp[0].innerHTML = '不告诉你~这是秘密';
}

four.onclick = function(){
	for (var i = 0; i < div.length; i++) {
		div[i].className = '';
	}
	four.className = 'four';
	out.style.cssText = 'background: url(\'4.jpg\');background-size: 500px 500px;';
	pp[0].innerHTML = '我今年X碎...';
}