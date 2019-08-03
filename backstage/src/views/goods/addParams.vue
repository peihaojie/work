<template>
  <div>
    <sub-title :subTitle="'添加参数'"></sub-title>
    <div class="body">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="form"
      >
        <el-form-item label="参数名称:" prop="paramName">
          <el-input v-model="ruleForm.paramName"></el-input>
        </el-form-item>
        <el-form-item label="商品类型:" prop="styleId">
          <el-select v-model="ruleForm.styleId" placeholder="请选择类型" class="search-input">
            <el-option v-for="(item,index) in typeList" :key="index" :value="item.id" :label="item.styleName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数是否可选:" prop="paramSelect">
          <el-radio v-model="ruleForm.paramSelect" :label="0" disabled="">唯一属性</el-radio>
          <el-radio v-model="ruleForm.paramSelect" :label="1" disabled="">单选属性</el-radio>
          <el-radio v-model="ruleForm.paramSelect" :label="2" disabled="">复选属性</el-radio>
          <p class="form-tips">选择"单选/复选属性"时，可以对商品该属性设置多个值，同时还能对不同属性值指定不同的价格加价，用户购买商品时需要选定具体的属性值。选择"唯一属性"时，商品的该属性值只能设置一个值，用户只能查看该值。</p>
        </el-form-item>
        <el-form-item label="属性值:" prop="paramList">
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            closable
            @close="handleClose(tag)"
          >{{ tag }}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @key.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button
            v-else
            @click="showInput"
            class="button-new-tag"
            size="small"
          >添加属性值</el-button>
        </el-form-item>
        <el-form-item label="属性排序:" prop="paramSort">
          <el-input v-model="ruleForm.paramSort" type="number"></el-input>
          <p class="form-tips">排序级别最高的属性可单独上传属性图片</p>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm('ruleForm')" type="primary">提交</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle'
import mixin from '@/utils/mixin'
import { setTimeout } from 'timers';
export default {
  name:'addParams',
  mixins:[mixin],
  components:{
    subTitle
  },
  data(){
    let validParams = (item, index, callback) => {
      if (this.dynamicTags.length == 0) {
        callback(new Error('请添加属性值'))
      } else if (
        this.ruleForm.paramSelect == 0 && this.dynamicTags.length > 1
      ) {
        callback(new Error('唯一属性只能添加一个属性值'))
      } else {
        callback()
      }
    }
    return {
      inputValue:'',
      inputVisible:false,
      dynamicTags:[],
      typeList:[],
      ruleForm:{
        paramName:'',
        styleId:'',
        paramSelect:1,
        paramList:'',
        paramSort:''
      },
      rules:{
        paramName: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ],
        styleId: [
          { required: true, message: "请选择商品类型", trigger: "change" }
        ],
        paramList: [
          { validator: validParams, required: true, trigger: "change" }
        ]
      }
    }
  },
  mounted(){
    this.$http.post('merchantGoodsStyle/merchant_goods_type_list').then(res => {
      this.typeList = res
      if (this.$route.query.id) {
        this.isAdd = false
        this.$http
          .post('merchantGoodsParam/merchant_goods_type_by_id',{id:this.$route.query.id})
          .then(res => {
            this.$set(this.ruleForm, 'paramName', res.paramName)
            this.$set(this.ruleForm, 'styleId', res.styleId)
            this.$set(this.ruleForm, 'paramSelect', res.paramSelect)
            this.$set(this.ruleForm, 'paramSort', res.paramSort)
            if (res.paramList.length > 0) {
              this.dynamicTags = res.paramList.split(',')
            }
          })
      }
    })
  },
  methods:{
    handleClose(tag){
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    handleInputConfirm(){
      let inputValue = this.inputValue
      if (inputValue) {
        if (this.dynamicTags.indexOf(inputValue) < 0) {
          this.dynamicTags.push(inputValue)
        }
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    showInput(){
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    submitForm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$set(this.ruleForm, 'paramList', this.dynamicTags.join(','))
          if (this.isAdd) {
            this.addEdit('merchantGoodsParam/merchant_goods_type_add',this.ruleForm)
          } else {
            this.ruleForm.id = this.$route.query.id
            this.addEdit('merchantGoodsParam/merchant_goods_type_update',this.ruleForm)
          }
        } else {
          return false
        }
      })
    },
    afterAddEdit(){
      setTimeout(() => {
        this.back()
      }, 500)
    }
  }
}
</script>

<style lang='scss' scoped>
@import "~@/assets/css/common";
.form{
  width:700px;
}
.form-tips{
  font-size: 12px;
  color: $gray;
  line-height: 16px;
  margin-top: 5px;
}
.el-tag{
  color: #fff;
  background-color: #7ccdcc;
  border-color: #7ccdcc;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>