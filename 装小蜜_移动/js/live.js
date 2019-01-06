//返回上一页
var bac = document.getElementById('back');
bac.onclick = function(){history.go(-1)};
//获取黑色背景
var bla = document.getElementsByClassName('bla');
//获取导航栏
var down0 = document.getElementsByClassName('down0');
//获取导航栏三个下拉div
var down0Li = down0[0].getElementsByTagName('li');
//获取三个下拉菜单
var down1 = document.getElementsByClassName('down1');
var down2 = document.getElementsByClassName('down2');
var down3 = document.getElementsByClassName('down3');
//获取施工阶段的选项
var down1Li = down1[0].getElementsByTagName('li');
//施工阶段点击打开
down0Li[0].onclick = function(){
	bla[0].style.display = 'block';
	down2[0].style.display = '';
	down0Li[1].setAttribute('class','');
	down3[0].style.display = '';
	down0Li[2].setAttribute('class','');
	down1[0].style.display = 'block';
	down0Li[0].setAttribute('class','ora');
}
//施工阶段选项点击后变化
down1Li[0].onclick = function(){
	down1Li[0].setAttribute('class','ora');
	down1Li[1].setAttribute('class','');
	down1Li[2].setAttribute('class','');
	bla[0].style.display = '';
	down1[0].style.display = '';
}
down1Li[1].onclick = function(){
	down1Li[1].setAttribute('class','ora');
	down1Li[0].setAttribute('class','');
	down1Li[2].setAttribute('class','');
	bla[0].style.display = '';
	down1[0].style.display = '';
}
down1Li[2].onclick = function(){
	down1Li[2].setAttribute('class','ora');
	down1Li[1].setAttribute('class','');
	down1Li[0].setAttribute('class','');
	bla[0].style.display = '';
	down1[0].style.display = '';
}
//获取排列方式的选项
var down2Li = down2[0].getElementsByTagName('li');
//排列方式点击打开
down0Li[1].onclick = function(){
	bla[0].style.display = 'block';
	down1[0].style.display = '';
	down0Li[0].setAttribute('class','');
	down3[0].style.display = '';
	down0Li[2].setAttribute('class','');
	down2[0].style.display = 'block';
	down0Li[1].setAttribute('class','ora');
}
//排列方式选项点击后变化
down2Li[0].onclick = function(){
	down2Li[0].setAttribute('class','ora');
	down2Li[1].setAttribute('class','');
	down2Li[2].setAttribute('class','');
	bla[0].style.display = '';
	down2[0].style.display = '';
}
down2Li[1].onclick = function(){
	down2Li[1].setAttribute('class','ora');
	down2Li[0].setAttribute('class','');
	down2Li[2].setAttribute('class','');
	bla[0].style.display = '';
	down2[0].style.display = '';
}
down2Li[2].onclick = function(){
	down2Li[2].setAttribute('class','ora');
	down2Li[1].setAttribute('class','');
	down2Li[0].setAttribute('class','');
	bla[0].style.display = '';
	down2[0].style.display = '';
}
//获取筛选工地的table和确定div
var tab1 = document.getElementsByClassName('tab1');
var tab1Td = tab1[0].getElementsByTagName('td')
var tab2 = document.getElementsByClassName('tab2');
var tab2Td = tab2[0].getElementsByTagName('td')
var det = document.getElementsByClassName('det');
//筛选工地点击打开
down0Li[2].onclick = function(){
	bla[0].style.display = 'block';
	down1[0].style.display = '';
	down0Li[0].setAttribute('class','');
	down2[0].style.display = '';
	down0Li[1].setAttribute('class','');
	down3[0].style.display = 'block';
	down0Li[2].setAttribute('class','ora');
}
//确定关闭弹窗
det[0].onclick = function(){
	bla[0].style.display = '';
	down3[0].style.display = '';
}
//选中改变颜色和背景
tab1[0].onclick = function(event){
	var bgc = tab1[0].getElementsByClassName('in');
	bgc[0].setAttribute('class','');
	event.target.setAttribute('class','in')
}
tab2[0].onclick = function(event){
	var bgc = tab2[0].getElementsByClassName('in');
	bgc[0].setAttribute('class','');
	event.target.setAttribute('class','in')
}