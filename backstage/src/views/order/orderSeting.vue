<template>
  <div>
    <sub-title :subTitle="'订单设置'"></sub-title>
    <div class='body'>
      <el-form
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm"
        ref="ruleForm"
        label-width="150px"
      >
        <el-form-item label="正常订单超过" prop="normalEndpayTime">
          <el-input v-model="ruleForm.normalEndpayTime" placeholder="请输入时间"></el-input>
          <span>分</span>
          <em>未付款，订单自动关闭</em>
        </el-form-item>
        <el-form-item label="发货超过" prop="sendEndTime">
          <el-input v-model="ruleForm.sendEndTime" placeholder="请输入时间"></el-input>
          <span>天</span>
          <em>未收货，订单自动完成</em>
        </el-form-item>
        <el-form-item label="最终评论时间" prop="commentEndTime">
          <el-input v-model="ruleForm.commentEndTime" placeholder="请输入时间"></el-input>
          <span>天</span>
          <em>好评并完成</em>
        </el-form-item>
        <el-form-item label="完成收货后" prop="finalEndTime">
          <el-input v-model="ruleForm.finalEndTime" placeholder="请输入时间"></el-input>
          <span>天</span>
          <em>不能申请售后</em>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
export default {
  name: 'accountSetting',
  components: {
    subTitle
  },
  data() {
    return {
      id: null,
      ruleForm: {
        normalEndpayTime: "",
        sendEndTime: "",
        commentEndTime: "",
        finalEndTime: ""
      },
      rules: {
        normalEndpayTime: [
          { required: true, message: "请输入时间", trigger: "blur" }
        ],
        sendEndTime: [
          { required: true, message: "请输入时间", trigger: "blur" }
        ],
        commentEndTime: [
          { required: true, message: "请输入时间", trigger: "blur" }
        ],
        finalEndTime: [
          { required: true, message: "请输入时间", trigger: "blur" }
        ]
      }
    };
  },
  created: function(){
    this.$http
      .post('/merchant_order_set/queryOrderSet', {
        merchantId: JSON.parse(localStorage.userInfo).merchantId
      })
      .then(res => {
        this.$set(this.ruleForm, 'normalEndpayTime', res.normalEndpayTime)
        this.$set(this.ruleForm, 'sendEndTime', res.sendEndTime)
        this.$set(this.ruleForm, 'commentEndTime', res.commentEndTime)
        this.$set(this.ruleForm, 'finalEndTime', res.finalEndTime)
        this.id = res.id
      })
  },
  methods:{
    submitForm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post('/merchant_order_set/add_or_update', {
              normalEndpayTime: this.ruleForm.normalEndpayTime,
              sendEndTime: this.ruleForm.sendEndTime,
              commentEndTime: this.ruleForm.commentEndTime,
              finalEndTime: this.ruleForm.finalEndTime,
              id: this.id,
              merchantId: JSON.parse(localStorage.userInfo).merchantId
            })
            .then(() => {
              this.$msgSuc('提交成功')
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.body {
  text-align: center;
  .el-form-item__label {
    float: none;
    clear: both;
  }
  .el-form-item {
    width: 600px;
    margin: 18px auto;
  }
  button {
    background: #5bc0bf;
    color: #fff;
  }
  .el-input__inner {
    border-radius: none;
  }
  .demo-ruleForm {
    em {
      font-style: normal;
      display: inline-block;
      width: 190px;
      color: #606266;
      text-align: left;
      margin-left: 10px;
    }
    span {
      display: inline-block;
      width: 40px;
      height: 40px;
      background: #efefef;
      border: 1px solid #dcdfe6;
      border-left: none;
    }
  }
  .el-form-item__content {
    display: inline-block;
    .el-input {
      width: 200px;
      display: inline-block;
      input {
        width: 100%;
      }
    }
  }
}
</style>