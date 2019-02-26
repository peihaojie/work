var box = document.getElementById('box');
var shang = document.getElementById('shang');
var img = shang.getElementsByTagName('img');
var pp = document.getElementsByTagName('p');
var xia = document.getElementById('xia');
var imgs = xia.getElementsByTagName('img');
var lef = document.getElementById('lef');
var rig = document.getElementById('rig');
var timer
var jum
var num = 0

// 鼠标移入显示img，因为img写在了out里而非shang内，
// 所以当鼠标移入图片内时会判断不在shang内，无法显示图片。
// 便添加了lef.onmouseover和rig.onmouseover。
function over(){
	lef.className = 'opacity';
	rig.className = 'opacity';
}
shang.onmouseover = over;
lef.onmouseover = over;
rig.onmouseover = over;
shang.onmouseout = function(){
	lef.className = '';
	rig.className = '';
}

function move(end){
	if (timer) {clearInterval(timer)};
	function moving(){
		var start = box.scrollLeft;
		if (end > start) {
			var long = Math.ceil((end - start) / 20);
			start += long;
			box.scrollLeft = start;
			if ((end - start) < 5) {
				box.scrollLeft = end;
				clearInterval(timer);
			};
		}else if (end < start) {
			var long = Math.floor((end - start) / 20);
			start += long;
			box.scrollLeft = start;
			if ((start - end) < 5) {
				box.scrollLeft = end;
				clearInterval(timer);
			};
		}
	}
	timer = setInterval(moving,7)
}
function tex(num){
	if (num == 0) {
		pp[0].innerHTML = '对酒当歌，人生几何？譬如朝露，去日苦多。';
	}
	if (num == 1) {
		pp[0].innerHTML = '慨当以慷，忧思难忘。何以解忧？惟有杜康。';
	}
	if (num == 2) {
		pp[0].innerHTML = '青青子衿，悠悠我心。但为君故，沉吟至今。';
	}
	if (num == 3) {
		pp[0].innerHTML = '呦呦鹿鸣，食野之苹。我有嘉宾，鼓瑟吹笙。';
	}
	if (num == 4) {
		pp[0].innerHTML = '明明如月，何时可掇？忧从中来，不可断绝。';
	}

}
function border(num){
	for (var i = 0; i < imgs.length; i++) {
		imgs[i].className = '';
	}
	imgs[num].className = 'quan';
}
// 将跳动，文字切换，border变化全都写在了里边。全部是根据num的变化来变化的。
function jump(){
	if (jum) {clearInterval(jum)};
	function a(){
		num++;
		if (num == 5) {num = 0}
		move(num * 400);
		tex(num);
		border(num);
	}
	jum = setInterval(a,2000)
}
jump();
// 向左向右点击事件
lef.onclick = function(){
	if (jum) {clearInterval(jum)};
	num = num - 1;
	if (num < 0) {num = 4}
	move(num * 400);
	tex(num);
	border(num);
	jump()
}
rig.onclick = function(){
	if (jum) {clearInterval(jum)};
	num = num + 1;
	if (num == 5) {num = 0};
	move(num * 400);
	tex(num);
	border(num);
	jump()
}
// 图片点击,使用闭包
for (var i = 0; i < imgs.length; i++) {
	imgs[i].onclick = function(aaa){
		return function(){
			if (jum) {clearInterval(jum)};
			num = aaa;
			move(num * 400);
			tex(num);
			border(num);
			jump()
		}
	}(i)
}