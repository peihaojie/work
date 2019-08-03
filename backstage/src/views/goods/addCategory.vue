<template>
  <div>
    <sub-title :subTitle="'添加分类'"></sub-title>
    <div class="body" v-loading="loading">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
        <el-form-item label="分类名称:" prop="typeName">
          <el-input v-model="ruleForm.typeName"></el-input>
        </el-form-item>
        <el-form-item label="上级分类:" prop="parentId">
          <el-select v-model="ruleForm.parentId" :disabled="isAddCategory" placeholder="请选择分类">
            <el-option v-for="(item,index) in categoryList" :key="index" :value="item.id" :label="item.typeName"></el-option>
          </el-select>
          <p class="form-tips" v-if="!isAddCategory">不选择分类默认为顶级分类</p>
        </el-form-item>
        <el-form-item label="数量单位:">
          <el-input v-model="ruleForm.goodsUnit"></el-input>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input type="number" v-model="ruleForm.goodsSory"></el-input>
        </el-form-item>
        <el-form-item label="是否显示:">
          <el-radio-group v-model="ruleForm.showStatus">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分类描述:">
          <el-input type="textarea" v-model="ruleForm.typeDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle'
import mixin from '@/utils/mixin'
export default {
  name:'addCategory',
  mixins:[mixin],
  components:{
    subTitle
  },
  data(){
    return {
      categoryList: [{ id: 0, typeName: "顶级分类" }],
      isAddCategory: false,
      loading: false,
      ruleForm: {
        typeName: "",
        parentId: 0,
        goodsUnit: "",
        goodsSort: "",
        showStatus: "",
        typeIcon: ""
      },
      rules: {
        typeName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ]
      }
    }
  },
  created(){
    this.$http.post("merchantGoodsType/query_goods_type_tree").then(res => {
      // 扩展运算符（...），用于把一个数组转化为用逗号分隔的参数序列
      this.categoryList = [...this.categoryList,...res]
      if (this.$route.query.id) {
        this.isAdd = false
        this.loading = true
        this.$http
          .post("merchantGoodsType/merchant_goods_type_by_id",{
            id:this.$route.query.id
          })
          .then(
            res => {
              this.$set(this.ruleForm,'typeName',res.typeName)
              this.$set(this.ruleForm,'parentId',res.parentId)
              this.$set(this.ruleForm,'goodsUnit',res.goodsUnit)
              this.$set(this.ruleForm,'goodsSort',res.goodsSort)
              this.$set(this.ruleForm,'showStatus',res.showStatus)
              this.$set(this.ruleForm,'typeIcon',res.typeIcon)
              console.log(this.ruleForm)
            },
            err => {
              this.$msgErr(err.msg)
            }
          )
          .finally(() => {
            this.loading = false
          })
      }
      if (this.$route.query.parentId) {
        // selevct的v-model是parentId，这里动态修改默认值
        this.$set(
          this.ruleForm,
          'parentId',
          Number(this.$route.query.parentId)
        )
        this.isAddCategory = true
      }
    })
  },
  methods:{
    submitForm(formName){
      this.$refs[formName].validate(valid =>{
        if (valid) {
          if (this.isAdd) {
            this.addEdit("merchantGoodsType/merchant_add_goods_type")
          } else {
            this.ruleForm.id = this.$route.query.id
            this.addEdit("merchantGoodsType/merchant_goods_type_update")
          }
        } else {
          return false
        }
      })
    },
    addEdit(url){
      this.$http.post(url,this.ruleForm).then(
        () => {
          this.$msgSuc('操作成功')
          setTimeout(() => {
            this.$router.push("/goods/category")
          }, 500);
        },
        err => {
          this.$msgErr(err.msg)
        }
      )
    }
  }
}
</script>

<style lang='scss' scoped>
@import "~@/assets/css/common";
.form{
  width: 600px;
  .form-tips{
    font-size: 12px;
    color: $gray;
  }
}
</style>