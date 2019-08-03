<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
  font-family: "微软雅黑 Light";
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
table {
  // 设置表格的边框是否被合并为一个单一的边框
  border-collapse: collapse;
  // 设置相邻单元格的边框间的距离
  border-spacing: 0;
}
button,
input {
  // 绘制于元素周围的一条线，位于边框边缘的外围
  outline: none;
}
a {
  color: #000;
  // 规定添加到文本的修饰。
  text-decoration: none;
}
a:hover {
  color: #000;
  text-decoration: none;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.flex {
  display: flex;
  // 一行不够显示的时候，转到下一行显示
  flex-wrap: wrap;
}
.flex-col {
  // 排列方式:纵向排列
  flex-direction: column;
}
.flex.h-center {
  // 定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式。
  // 居中
  align-items: center;
}
.flex.center {
  // 设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式。
  // 项目位于容器的中心。
  justify-content: center;
}
.flex.around {
  // 设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式。
  // 项目位于各行之前、之间、之后都留有空白的容器内。
  justify-content: space-around;
}
.flex.between {
  // 设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式。
  // 项目位于各行之间留有空白的容器内。
  justify-content: space-between;
}
.flex-1 {
  // 所有弹性盒模型对象的子元素都有相同的长度，且忽略它们内部的内容
  flex: 1;
}
.flex .end {
  // 靠右对齐
  align-items: flex-end;
}
.clearFix {
  zoom: 1;
}
.clearFix:after {
  display: block;
  content: "";
  height: 0;
  clear: both;
  visibility: hidden;
  overflow: hidden;
}
.font-14 {
  font-size: 14px;
}
.font-15 {
  font-size: 15px;
}
.font-18 {
  font-size: 18px;
}
.font-20 {
  font-size: 20px;
}
.font-22 {
  font-size: 22px;
}
.font-24 {
  font-size: 24px;
}
// 所有元素的ClassName包含'font-'的className为red的元素
[class*="font-"].red {
  color: #d23029;
}
[class*="font-"].gray {
  color: #5a5a5a;
}
[class*="font-"].green {
  color: #5bc0bf;
}
[class*="font-"].bold {
  font-weight: bold;
}
.body {
  padding: 80px 30px 30px;
}
.text-center {
  text-align: center;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #5bc0bf !important;
}
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .btn-next,
.el-pagination.is-background .el-pager li {
  background-color: #fff !important;
}
.el-table__empty-block {
  border-left: 1px solid #b4b4b4;
  border-top: 1px solid #b4b4b4;
}
.el-table__empty-block {
  line-height: 60px;
}
.el-upload {
  text-align: left !important;
}
.el-tag .el-icon-close {
  color: #fff !important;
}
</style>
