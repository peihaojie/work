<template>
  <div>
    <sub-title :subTitle="'添加类目'"></sub-title>
    <div class='body' v-loading="loading">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="form"
        label-width="150px"
      >
        <el-form-item label="类目名称:" prop="navName">
          <el-input v-model="ruleForm.navName"></el-input>
        </el-form-item>
        <el-form-item label="上级类目:" prop="parentId">
          <el-select v-model="ruleForm.parentId" placeholder="请选择分类">
            <el-option
              v-for="(item,index) in headerList"
              :key="index"
              :label="item.navName"
              :value="item.id"
            ></el-option>
          </el-select>
          <p class="form-tips" v-if="!isChild">不选择分类默认为顶级分类</p>
        </el-form-item>
        <el-form-item label="排序:" prop="navSort">
          <el-input v-model="ruleForm.navSort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="是否显示:" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="0">显示</el-radio>
            <el-radio label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类目图标:" prop="navIcon" v-if="!isChild">
          <img :src="ruleForm.navIcon" alt v-if="ruleForm.navIcon" class="form-img">
          <div class="upload-btn-wrap">
            <label for="upload">
              <el-button size="small" type="primary">上传图片</el-button>
            </label>
            <input
              type="file"
              id="upload"
              class="upload-input"
              accept="image/jpeg,image/png"
              @change="uploadNavIcon"
            >
            <p class="form-tips">建议图标尺寸为18*18比例，图片只能为jpg、png格式</p>
          </div>
        </el-form-item>
        <el-form-item label="类目描述:" prop="navDesc">
          <el-input v-model="ruleForm.navDesc" type="textarea" rows="5"></el-input>
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
import subTitle from '@/components/subTitle';
import mixin from '@/utils/mixin';
export default {
  name: 'addHeader',
  mixins: [mixin],
  components: {
    subTitle
  },
  data() {
    let navIconValid = (item, value, callback)=> {
      if (!this.ruleForm.navIcon && !this.isChild) {
        callback(new Error('请上传类目图标'))
      } else {
        callback()
      }
    }
    return {
      headerList: [{ id: 0, navName: "顶级类目" }],
      isChild: false,
      ruleForm: {
        navName: "",
        parentId: 0,
        navSort: "",
        status: "0",
        navIcon: "",
        navDesc: ""
      },
      rules:{
        navName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ],
        navIcon: [{ validator: navIconValid, trigger: "change" }]
      },
      loading: false
    }
  },
  created(){
    this.$http
      .post('merchantNavigation/query_navigation_type_tree')
      .then(res => {
        this.headerList = [...this.headerList,...res]
        if (this.$route.query.parentId) {
          this.$set(this.ruleForm, 'parentId', Number(this.$route.query.parentId))
          this.isChild = true
        }
      })
  },
  methods: {
    uploadNavIcon(file) {
      this.uploadFile(file).then(res => {
        this.$set(this.ruleForm, 'navIcon', res.imgUrl)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addEdit('merchantNavigation/merchant_navigation_add')
        } else {
          return false
        }
      })
    },
    addEdit(url) {
      this.$http
        .post(url, this.ruleForm)
        .then(() => {
          this.$msgSuc('操作成功')
          setTimeout(() => {
            this.$router.push('/promotion/header')
          }, 500);
        },
        err => {
          this.$msgErr(err.msg)
        })
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/css/common';
.form {
  width: 600px;
}
.form-tips {
  font-size: 12px;
  color: $gray;
  line-height: 16px;
  margin-top: 5px;
}
</style>