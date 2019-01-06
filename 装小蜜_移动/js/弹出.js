var imgg = document.getElementById('and');
var blaa = document.getElementById('blaa');
var ull = document.getElementsByClassName('ull');

function outt(){
	blaa.style.display = 'block';
	ull[0].style.display = 'block';
}
function inn(){
	blaa.style.display = '';
	ull[0].style.display = '';
}
imgg.onclick = function(){
	if (blaa.style.display == '')
	{
		outt();
	}else{
		inn();
	}
}