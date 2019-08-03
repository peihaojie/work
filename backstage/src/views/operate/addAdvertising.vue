<template>
  <div>
    <sub-title :subTitle="'添加广告'"></sub-title>
    <div class='body' v-loading="loading">
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="150px"
        ref="ruleForm"
        class="form"
      >
        <el-form-item label="广告名称:" prop="adName">
          <el-input v-model="ruleForm.adName"></el-input>
        </el-form-item>
        <el-form-item label="广告位置:" prop="adPosition">
          <el-select
            v-model="ruleForm.adPosition"
            placeholder="请选择广告位置"
          >
            <el-option
              v-for="(item, index) in adPositionList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上线/下线:" prop="online">
          <el-radio-group v-model="ruleForm.online">
            <el-radio :label="'1'">上线</el-radio>
            <el-radio :label="'0'">下线</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="广告图片:" prop="adPicture">
          <img :src="ruleForm.adPicture" alt="" class="form-img" v-if="ruleForm.adPicture">
          <div class="upload-btn-wrap">
            <label for="upload">
              <el-button type="primary" size="small">上传图片</el-button>
            </label>
            <input
              type="file"
              class="upload-input"
              id="upload"
              accept="image/jpeg,image/png"
              @change="uploadadPicture"
            >
            <p class="form-tips">只能上传jpg/png格式文件，文件不能超过50kb</p>
          </div>
        </el-form-item>
        <el-form-item label="广告指定商品:" prop="adLink">
          <el-select
            v-model="ruleForm.adLink"
            filterable
            remote
            :remote-method="searchGoods"
            @change="handleGoods"
            placeholder="请输入商品名"
            clearable
          >
            <el-option
              v-for="(item, index) in goodsList"
              :key="index"
              :label="item.goodsName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告备注:" prop="remark">
          <el-input type="textarea" v-model="ruleForm.remark"></el-input>
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
import filters from '@/utils/filters'
import { setTimeout } from 'timers';
export default {
  name: 'addAdvertising',
  mixins: [mixin],
  filters: filters,
  components: {
    subTitle
  },
  data() {
    let validPic = (item, value, callback) => {
      if (!this.ruleForm.adPicture) {
        callback(new Error('请上传广告图片'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      adPositionList: filters.adPositionList,
      adLink: "",
      goodsList: [],
      ruleForm: {
        adName: "",
        adPosition: "",
        adPicture: "",
        adLink: "",
        online: "1",
        remark: ""
      },
      rules: {
        adName: [
          { required: true, message: "请输入广告名称", trigger: "blur" },
          { max: 30, message: "长度必须小于30个字符", trigger: "blur" }
        ],
        adPosition: [
          { required: true, message: "请选择广告位置", trigger: "change" }
        ],
        online: [
          { required: true, message: "请选择广告是否上线", trigger: "change" }
        ],
        adPicture: [{ validator: validPic, required: true, trigger: "change" }],
        adLink: [
          { required: true, message: "请选择广告商品", trigger: "change" }
        ]
      }
    }
  },
  created(){
    if (this.$route.query.id) {
      this.loading = true
      this.$http
        .post('merchant_ad/get_single_merchant_ad', {
          id: this.$route.query.id
        })
        .then(res => {
          this.isAdd = false
          this.$set(this.ruleForm, "adName", res.adName)
          this.$set(this.ruleForm, "adPosition", String(res.adPosition))
          this.$set(this.ruleForm, "adPicture", res.adPicture)
          this.$set(this.ruleForm, "online", res.online)
          this.$set(this.ruleForm, "remark", res.remark)
          this.adLink = res.adLink
          this.$http
            .post("merchantGoods/merchant_goods_by_id", {
              id: res.adLink
            })
            .then(res => {
              this.$set(this.ruleForm, "adLink", res.goodsName)
              this.loading = false
            })
        },
        err => {
          this.$msgErr(err,msg)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  methods: {
    handleGoods($event) {
      if ($event) {
        this.adLink = $event.toString()
      }
    },
    searchGoods(val) {
      this.$http
        .post('merchantGoods/merchant_goods_list_page', {
          currentPage: 1,
          pageSize: 100,
          goodsName: val
        })
        .then(res => {
          this.goodsList = res.list
        })
    },
    uploadadPicture(file) {
      this.uploadFile(file).then(res => {
        this.$set(this.rulrForm, 'adPicture', res.imgUrl)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.addEdit('merchant_ad/add_merchant_ad')
          } else {
            this.$set(this.ruleForm, 'id', this.$route.query.id)
            this.$set(this.ruleForm, 'adLink', this.adLink)
            this.addEdit("merchant_ad/change_merchant_ad")
          }
        } else {
          return false
        }
      })
    },
    addEdit(url) {
      let ruleForm = Object.assign({}, this.ruleForm)
      this.$http.post(url, ruleForm).then(() => {
        this.$msgEsc('提交成功')
        setTimeout(() => {
          this.$router.push("/operate/advertising")
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