<template>
  <div>
    <sub-title :subTitle="'商品分类'"></sub-title>
    <div class='body'>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="back">返回</el-button>
          <el-button @click="dialogVisible = true">上传图片</el-button>
        </div>
      </div>
      <div class="img-list" v-loading="loading">
        <el-checkbox-group
          class="flex"
          v-if="list.length > 0"
          v-model="checkItemId"
          @change="handleCheckItem"
        >
          <div class="img-item" v-for="(item,index) in list" :key="index">
            <el-checkbox :label="item.id">
              <img :src="item.imgUrl" alt>
            </el-checkbox>
            <span class="table-btn" @click="shiftItem([item.id])">转移相册</span><span class="table-btn" @click="remove([item.id])">删除图片</span>
          </div>
        </el-checkbox-group>
        <div class="empty-text" v-else>暂无图片</div>
      </div>
      <pagination
        @confirmBatch="confirmBatch"
        :optionsList="optionsList"
        @handleChangeAll="handleChangeAll"
        class="pagination"
        ref="pagination"
        @next="next"
        :total="total"
        :pageSize="pageSize"
      ></pagination>
      <el-dialog title="转移相册" :visible.sync="dialogVisible1" :append-to-body="true">
        <el-form
          :model="ruleForm1"
          :rules="rules1"
          ref="ruleForm1"
          label-width="100px"
          class="form"
        >
          <el-form-item label="选择相册" prop="changeToGalleries">
            <el-select v-model="ruleForm1.changeToGalleries" placeholder="请选择相册">
              <el-option
                v-for="(item,index) in albumList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span class="dialog-footer" slot="footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="submitForm1()">确定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="上传图片" :visible.sync="dialogVisible" :append-to-body="true">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="form"
          v-loading="formLoading"
          element-loading-text="正在拼命加载中..."
        >
          <el-form-item label="选择相册:" prop="goodsGalleriesId">
            <el-select v-model="ruleForm.goodsGalleriesId" placeholder="请选择广告位置">
              <el-option
                v-for="(item,index) in albumList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择图片:" prop="imgUrl">
            <div class="upload-img-list">
              <div v-for="(item,index) in ruleForm.imgUrl" :key="index">
                <img :src="item" alt="">
                <i class="el-icon-circle-close-outline" @click="deleteImg(index)"></i>
              </div>
            </div>
            <div class="upload-btn-wrap">
              <label for="upload">
                <el-button type="primary" size="small">上传图片</el-button>
              </label>
              <input
                type="file"
                id="upload"
                class="upload-input"
                accept="image/jpeg,image/png"
                @change="uploadImgUrl"
              >
              <p class="form-tips">可批量选择多张图片上传 (最多上传5张)</p>
            </div>
          </el-form-item>
        </el-form>
        <span class="dialog-footer" slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
import pagination from "@/components/pagination";
import mixin from '@/utils/mixin'
import { Promise } from 'q';
export default {
  name: 'imageList',
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    let validImgUrl = (item, value, callback) => {
      if (!this.ruleForm.imgUrl.length > 0) {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    }
    return {
      list:[],
      albumList:[],
      dialogVisible:false,
      dialogVisible1:false,
      checkAll:false,
      checkItemId:[],
      pageSize:20,
      ruleForm:{
        goodsGalleriesId:'',
        imgUrl:[]
      },
      ruleForm1:{
        ids:[],
        subGalleries:'',
        changeToGalleries:''
      },
      rules:{
        goodsGalleriesId:[
          { required: true, message: '请选择相册', trigger: 'change'}
        ],
        imgUrl:[
          { validator: validImgUrl, required: true, trigger: 'change'}
        ]
      },
      rules1:{
        changeToGalleries:[
          { required: true, message: '请选择相册', trigger: 'change'}
        ]
      },
      formLoading: false,
      optionsList:{
        delete: '删除',
        shift: '转移'
      }
    }
  },
  mounted(){
    this.id = this.$route.params.id
    this.ruleForm1.subGalleries = this.$route.params.id
    this.getList()
    this.getAlbumList()
  },
  methods:{
    getList(){
      this.$http
        .post('merchant_goods_galleries_detail/query_for_page', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          galleriesId: this.id
        })
      .then(res => {
        this.list = res.list
        this.total = res.totalCount
      })
      .finally(() => {
        this.loading = false
      })
    },
    getAlbumList(){
      this.$http.post('merchant_goods_galleries/query').then(res => {
        this.albumList = res.list
      })
    },
    handleCheckItem(val){
      if (val.length == this.list.length) {
        this.$refs.pagination._data.checkAll = true
      } else {
        this.$refs.pagination._data.checkAll = false
      }
    },
    handleChangeAll(val){
      this.checkItemId = []
      if (val) {
        this.list.map(item => {
          this.checkItemId.push(item.id)
        })
      }
    },
    remove(id){
      this.$confirm('确认删除吗？').then(() => {
        this.$http.post('merchant_goods_galleries_detail/delete_batch', id).then(() => {
          this.getList()
          this.$msgSuc('删除成功')
        },
        err => {
          this.$msgErr(err.msg)
        })
      })
    },
    shiftItem(val){
      this.ruleForm1.ids = val
      this.dialogVisible1 = true
    },
    submitForm1(){
      this.$refs['ruleForm1'].validate(valid => {
        if (valid) {
          this.$http.post('merchant_goods_galleries_detail/change_galleries_batch',this.ruleForm1)
          .then(() => {
            this.$msgSuc('转移成功')
            this.getList()
            this.dialogVisible1 = false
          },
          err => {
            this.$msgErr(err.msg)
          })
        } else {
          return false
        }
      })
    },
    deleteImg(index){
      this.ruleForm.imgUrl.splice(index,1)
    },
    uploadImgUrl(file){
      let files = file.target.files
      if (files.length + this.ruleForm.imgUrl.length > 5) {
        this.$msgWar('最多上传5张图片')
        return
      }
      let imgUrl = this.ruleForm.imgUrl
      let promiseList = []
      this.formLoading = true
      for (let i = 0; i < files.length; i++) {
        if (files[i] == []) {
          continue
        }
        promiseList.push(this.uploadFiles(files[i]))
      }
      Promise.all(promiseList).then(
        res => {
          res.map(item => {
            imgUrl.push(item.imgUrl)
          })
          this.$set(this.ruleForm, 'imgUrl', imgUrl)
        },
        () => {
          this.$msgErr('上传失败')
        }
      )
      .finally(() => {
        this.formLoading = false
      })
    },
    submitForm(){
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$http.post('merchant_goods_galleries_detail/add_batch',this.ruleForm)
          .then(
            () => {
              this.$msgSuc('提交成功')
              this.getList()
              this.dialogVisible = false
            },
            err=> {
              this.$msgErr(err.msg)
            }
          )
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/css/common';
.box-title{
  padding-right: 20px;
}
.pagination {
  border: $border;
}
.img-list {
  border-left: $border;
  border-right: $border;
  padding: 20px;
  .img-item {
    width: 152px;
    height: 130px;
    margin-right: 20px;
    box-sizing: border-box;
    padding-top: 110px;
    .el-checkbox {
      margin-right: 5px;
    }
    img {
      width: 100px;
      height: 100px;
      border-right: 4px;
      display: block;
      position: absolute;
      top: -110px;
      left: 26px;
    }
  }
}
.form-tips {
  font-size: 12px;
  color: $gray;
  line-height: 16px;
  margin-top: 5px;
}
.upload-img-list {
  display: flex;
  flex-wrap: wrap;
  > div {
    position: relative;
    margin-right: 10px;
    margin-bottom: 10px;
    img {
      display: block;
      width: auto;
      height: 100px;
    }
    i {
      color: red;
      position: absolute;
      right: -8px;
      top: -8px;
      font-size: 20px;
      background-color: #fff;
      border-radius: 50%;
    }
  }
}
</style>