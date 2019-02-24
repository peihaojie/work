var out = document.getElementById('out');
var shang = document.getElementById('shang');
var ull = document.getElementById('ull');
var lis = ull.getElementsByTagName('li');
var xia = document.getElementById('xia');
var div = xia.getElementsByTagName('div');
var timer
var jumm
var num = 0


function move(end){
	if (timer) {clearInterval(timer)};
	function moving(){
		var start = shang.scrollLeft;
		var wid = Math.ceil((end - start)/20);
		start += wid;
		if ((end - start) < 5) {start = end};
		shang.scrollLeft =  start;
	}
	timer = setInterval(moving,7);
}

function jump(){
	if (jumm) {clearInterval(jumm)};
	function a(){
		num++;
		if (num == 4) {num = 0};
		move(num * 300);
		for (var i = 0; i < div.length; i++) {
			div[i].className = '';			
		}
		div[num].className = 'long';
	}
	jumm = setInterval(a,2000);
}

jump();