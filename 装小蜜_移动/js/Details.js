var bac = document.getElementById('back');
bac.onclick = function(){history.go(-1)};

var can = document.getElementById('can');
var pen = can.getContext('2d');
var img = new Image();
img.src = '../images/工地直播详情/bj.png';
if (img.complete) {
	console.log('img加载完成');
	bg();
}else{
	console.log('图片未加载');
	img.onload = bg;
}
function bg(){
	pen.strokeStyle = pen.createPattern(img,'no-repeat');
	pen.lineWidth = 20;
	pen.arc(110,110,100,0,2*Math.PI)
	pen.stroke();
}
pen.beginPath();
pen.font = '40px Arial';
pen.fillStyle = '#1cab73';
pen.fillText('完成度',50,100);
pen.stroke();
pen.beginPath();
pen.font = '40px Arial';
pen.fillStyle = '#1cab73';
pen.fillText('80%',75,150);
pen.stroke();