<template>
  <div>
    <sub-title :subTitle='"系统信息"'></sub-title>
    <div class="body">
      <table class="table-middle" border='1'>
        <tbody>
          <tr>
            <td>服务器操作系统:</td>
            <td>Linux(114.55.35.251)</td>
            <td>web服务器</td>
            <td>nginx/1.10.2</td>
          </tr>
          <tr>
            <td>PHP版本：</td>
            <td>5.6.30</td>
            <td>MySQL版本：</td>
            <td>否</td>
          </tr>
          <tr>
            <td>安全模式：</td>
            <td>否</td>
            <td>安全模式GID:</td>
            <td>否</td>
          </tr>
          <tr>
            <td>Socket支持:</td>
            <td>是</td>
            <td>时区设置：</td>
            <td>Asia/Shanghai</td>
          </tr>
          <tr>
            <td>GD版本：</td>
            <td>GD2（JPED GIF PNG)</td>
            <td>Zilb支持：</td>
            <td>是</td>
          </tr>
          <tr>
            <td>IP库版本：</td>
            <td>20071024</td>
            <td>文件上传的最大大小：</td>
            <td>40M</td>
          </tr>
          <tr>
            <td>程序版本：</td>
            <td>v2.2.2 RELEASE 20170629</td>
            <td>安装日期</td>
            <td>2017-05-02</td>
          </tr>
          <tr>
            <td>编码</td>
            <td>UTF-8</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
export default {
  name:'systemInfo',
  components:{
    subTitle
  }
}
</script>

<style lang='scss' scoped>
.table-middle{
  width:70%;
  margin:0 auto;
  margin-bottom: 30px;
  border-right: 1px solid #b4b4b4;
  border-bottom: 1px solid #b4b4b4;
  tr{
    height:50px;
    background-color: #fff;
  }
  td{
    padding:0 20px;
    border-left: 1px solid #b4b4b4;
    border-top: 1px solid #b4b4b4;
    color: #5a5a5a;
    // 找到所有当前元素的兄弟元素
    &:nth-child(2n-1){
      background-color: #f9fafc;
    }
  }
}
</style>