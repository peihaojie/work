var num = document.getElementsByClassName('num');
var numspan = num[0].getElementsByTagName('span');
var jixuan = document.getElementById('jixuan');
var touzhu = document.getElementById('touzhu');
var suiji1 = [];
var jieguo = document.getElementsByClassName('jieguo');
var kaijiang = document.getElementById('kaijiang');
var quxiao = document.getElementById('quxiao');
var suiji2 = [];
var cen3 = document.getElementsByClassName('cen3');
var wenzi = document.getElementById('wenzi');

//通过闭包来给每个span修改点击className,注意return了一个匿名函数并且传参
for (var i = 0; i < numspan.length; i++) {
	numspan[i].onclick = function(aaa){
		return function(){
			//点击取消选中className
			if (numspan[aaa].className == 'opa') {
				numspan[aaa].className = ''
			}else{
				numspan[aaa].className = 'opa';
				//获取改变了className的元素数量，判断是否多选
				if (num[0].getElementsByClassName('opa')) {
					var numspanclass = num[0].getElementsByClassName('opa');
				if (numspanclass.length > 7) {
					alert('选号最多为7位');
					numspan[aaa].className = '';
				}
				}
			}
		}
	}(i)
}
jixuan.onclick = function(){
	//清除所有选中的span
	for (var i = 0; i < numspan.length; i++) {
		numspan[i].className = '';
	}
	//循环7次，获取七个随机数，并且向下取整
	//这里不需要+1，因为之后给span修改className是从0开始的
	//将数组清零，保证每次获取七个随机数
	suiji1 = [];
	for (var i = 0; i < 7; i++) {
		var num = Math.floor(Math.random() * 31);
		//每次随机的数值查重，若重复则在随机一次
		//这里令j = -1是强制循环重新开始，以保证随机数不会与其他数重复
		for (var j = 0; j < suiji1.length; j++) {
			if (num == suiji1[j]) {
				num = Math.floor(Math.random() * 31);
				j = -1;
			}
		}
		suiji1.push(num);
		console.log(suiji1)
	}
	//将数组中的每个数值对应span改变css
	for (var i = 0; i < suiji1.length; i++) {
		numspan[suiji1[i]].className = 'opa'
	}
}
touzhu.onclick = function(){
	var span = jieguo[0].getElementsByTagName('span');
	//for循环，将数组中的数值写在span内
	for (var i = 0; i < suiji1.length; i++) {
		span[i].innerHTML = suiji1[i] + 1;
	}
}
kaijiang.onclick = function(){
	//将数组清零，保证每次获取七个随机数
	//for循环七次得到七个随机数并且去重
	suiji2 = [];
	for (var i = 0; i < 7; i++) {
		var num = Math.floor(Math.random() * 31 + 1);
		for (var j = 0; j < suiji2.length; j++) {
			if (num == suiji2[j]) {
				num = Math.floor(Math.random() * 31 + 1);
				j = -1;
			}
		}
		suiji2.push(num);
	}
	//将数组中的数值循环写在span内
	for (var i = 0; i < suiji2.length; i++) {
		cen3[0].getElementsByTagName('span')[i].innerHTML = suiji2[i];
	}
	// 将机选的数组数值加一，与实际显示的相对应
	for (var i = 0; i < suiji1.length; i++) {
		suiji1[i] += 1
	}
	//将随机号码和中奖号码比对
	numm = suiji1.filter(function(aaa){
		return suiji2.indexOf(aaa) > -1
	});
	console.log(numm);
	if (numm.length < 2) {
		wenzi.innerHTML = '很遗憾，没有中奖！<br>奖金等级：无；奖金额度：0元<br>总奖金：0元'
	}else if ( 2 <= numm.length < 4) {
		wenzi.innerHTML = '恭喜您，中奖了！~<br>奖金等级：三等奖；奖金额度：10元<br>总奖金：10000元'
	}else if ( 4 <= numm.length < 6) {
		wenzi.innerHTML = '恭喜您，中奖了！~<br>奖金等级：二等奖；奖金额度：100元<br>总奖金：90000元'
	}else if ( 6 <= numm.length < 7) {
		wenzi.innerHTML = '恭喜您，中奖了！~<br>奖金等级：一等奖；奖金额度：1000元<br>总奖金：900000元'
	}
}
quxiao.onclick = function(){
	for (var i = 0; i < numspan.length; i++) {
		numspan[i].className = '';
	}
	var span = jieguo[0].getElementsByTagName('span');
	for (var i = 0; i < suiji1.length; i++) {
		span[i].innerHTML = '';
	}
	for (var i = 0; i < suiji2.length; i++) {
		cen3[0].getElementsByTagName('span')[i].innerHTML = '';
	}
	suiji1 = [];
	suiji2 = [];
}