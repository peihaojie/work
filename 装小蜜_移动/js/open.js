var bac = document.getElementById('back');
bac.onclick = function(){history.go(-1)};
//完成度
var can = document.getElementById('can');
var pen = can.getContext('2d');
var img = new Image();
img.src = '../images/工地直播详情展开页/bj.png';
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
	pen.arc(107,107,98,0,2*Math.PI)
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

//隐蔽工程
var can2 = document.getElementById('can2');
var pens = can2.getContext('2d');
pens.strokeStyle = '#ff7a46';
pens.lineWidth = 5
pens.arc(107,107,98,0,2*Math.PI);
pens.stroke();
pens.beginPath();
pens.arc(107,107,80,0,2*Math.PI);
pens.fillStyle = '#ff7a46';
pens.fill();
pens.beginPath();
pens.font = '35px Arial';
pens.fillStyle = '#fff';
pens.fillText('隐蔽工程',40,115)
pens.stroke();