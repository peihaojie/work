<template>
  <div>
    <sub-title :subTitle="'评价详情'" :isClose='true' @close='back'></sub-title>
    <div class="body">
      <div class="comment-user flex">
        <div class="comment-user-center">
          <img src="https://img.xinzhibang168.com/FmR88ILyONmakl5P1khxHlEt3qxc.jpg" alt="">
          <p class="text-center">{{tableData.userName}}</p>
        </div>
        <div class="flex-1 flex flex-col around">
          <p>商品：{{tableData.goodsName}}</p>
          <p>
            评价：
            <img
              class="imgsrc"
              src="@/assets/starOn.png"
              v-for="(star,index) in tableData.commentLevel"
              :key="index"
            >
            <img
              class="imgsrc"
              src="@/assets/starOff.png"
              v-for="(star,index) in tableData.commentLevel1"
              :key="index+100"
            >
          </p>
          <p>日期：{{tableData.createTime}}</p>
          <p>IP地址：{{tableData.commentIp}}</p>
        </div>
      </div>
      <div class="conter-right">
        <div class="content">
          {{tableData.commentContent}}
          <br>
          <span class="clear" v-for="(i,index) in picArray" :key="index">
            <img :src="i" alt="">
          </span>
        </div>
        <div class="review">
          <p class="font-16 gray bold">回复评价</p>
          <el-form
            class="form"
            ref="ruleForm"
            :model="ruleForm"
            label-width="100px"
            style="width:500px"
          >
            <el-form-item label="用户名：">
              <!-- readonly为只读，不可编辑 -->
              <el-input v-model="ruleForm.name" readonly></el-input>
            </el-form-item>
            <el-form-item label="回复内容：">
              <el-input
                type="textarea"
                class="textarea"
                v-model="ruleForm.commentContent"
                :rows="7"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="active" type="primary" @click="sure(ruleForm)">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle'
import mixin from '@/utils/mixin'
export default {
  name:'accountSetting',
  mixins:[mixin],
  components:{
    subTitle
  },
  data(){
    return {
      tableData: "",
      picArray: [],
      ruleForm: {
        name: JSON.parse(localStorage.userInfo).merchantName,
        commentContent: ""
      }
    }
  },
  mounted(){
    this.$http.post("/merchantGoodsComment/merchant_goods_type_list_page",{
      id:this.$route.query.id
    })
    .then(res => {
      for (let i = 0; i < res.list.length; i++) {
        res.list[i].commentLevel1 = 5 - res.list[i].commentLevel
      }
      this.tableData = res.list[0]
      if (this.tableData.imgUrl.length > 0) {
        this.picArray = this.tableData.imgUrl.split(',')
      }
    })
  },
  methods:{
    sure(){
      if (this.ruleForm.commentContent == '') {
        this.$msgSuc('请输入评论')
        return
      }
      this.$http.post("/merchantGoodsComment/merchant_comment_reply",{
        commentReplyContent: this.ruleForm.commentContent,
        id: this.tableData.id
      })
      .then(res => {
        this.$msgSuc('回复成功')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@import "~@/assets/css/common";
.comment-user{
  padding: 20px;
  border-bottom: $border;
  img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
    margin-top: 30px;
  }
  .imgsrc{
    width: 20px;
    height: 20px;
    margin: 0 0 -4px 0;
  }
  .flex{
    margin-left: 20px;
    p{
      color:$gray;
      font-size: 15px;
    }
  }
}
.around{
  p{
    margin-top: 10px;
  }
}
.content{
  padding: 20px;
  font-size: 15px;
  line-height: 28px;
  color:$gray;
  border-bottom: $border;
}
.comment-user {
  padding: 0 20px;
  border-bottom: 1px solid #dedede;
  display: inline-block;
  height: 100%;
  float: left;
  border-top: 1px solid #dedede;
  border-left: 1px solid #dedede;
}
.comment-user-center{
  text-align: center;
}
.conter-right{
  display: inline-block;
  width: 70%;
  border: 1px solid #dedede;
  height: 100%;
}
.body{
  height: 100%;
  padding:80px 0 0 0;
}
.content>div{
  height:100%;
}
.textarea{
  resize: none;
}
.review{
  padding:0 30px;
  margin-top: 30px;
  .form{
    margin-top: 30px;
  }
}
</style>