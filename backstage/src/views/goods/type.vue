<template>
  <div>
    <sub-title :subTitle="'商品类型'"></sub-title>
    <div class="body">
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="dialogVisible = true; isAdd = true"> 添加类型</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        :cell-style="tdStyle"
        :header-cell-style="headerStyle"
        class="mall-table"
      >
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="类型名称" prop="styleName"></el-table-column>
        <el-table-column label="属性数量" prop="propertyNum"></el-table-column>
        <el-table-column label="参数数量" prop="paramNum"></el-table-column>
        <el-table-column label="设置">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push('/goods/type/prop/' + scope.row.id)">属性列表</span>
            <span class="table-btn" @click="$router.push('/goods/type/params/' + scope.row.id)">参数列表</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="edit(scope.row)">编辑</span>
            <span class="table-btn" @click="remove(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :isBatch="false" @next="next" :total="total" :pageSize="pageSize"></pagination>
      <el-dialog title="添加类型" :visible.sync="dialogVisible" :append-to-body="true">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="form"
        >
          <el-form-item label="类型名称" prop="styleName">
            <el-input v-model="ruleForm.styleName"></el-input>
          </el-form-item>
        </el-form>
        <span class="dialog-footer" slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button @click="submitForm('ruleForm')" type="primary">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle'
import mixin from '@/utils/mixin'
import pagination from '@/components/pagination'
import { request } from 'http';
export default {
  name:'type',
  mixins:[mixin],
  components:{
    subTitle,
    pagination
  },
  data(){
    return {
      tableData:[],
      dialogVisible: false,
      ruleForm:{
        styleName:''
      },
      rules:{
        styleName:[
          { required: true, message: '请输入类型名称', trigger:'blur'},
          { max:20, message:'长度必须小于20个字符', trigger:'blur'}
        ]
      }
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      this.loading = true
      this.$http.post("merchantGoodsStyle/merchant_goods_style_list_page",{
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })
      .then(res => {
        this.total = res.totalCount
        this.tableData = res.list
      })
      .finally(() => {
        this.loading = false
      })
    },
    edit(data){
      this.isAdd = false
      this.dialogVisible = true
      this.ruleForm.id = data.id
      this.ruleForm.styleName = data.styleName
    },
    remove(id){
      this.$confirm('确认删除吗？').then(() => {
        this.$http.post("merchantGoodsStyle/merchant_goods_type_delete", {
          id:id
        })
        .then(
          () => {
            this.getList()
            this.$msgSuc('删除成功')
          },
          err => {
            this.$msgErr(err.msg)
          }
        )
      })
    },
    submitForm(ruleForm){
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.addEdit("merchantGoodsStyle/merchant_goods_type_add")
          } else {
            this.addEdit("merchantGoodsStyle/merchant_goods_type_update") 
          }
        }
      })
    },
    addEdit(url){
      this.$http.post(url, this.ruleForm).then(
        () => {
          this.$msgSuc('操作成功')
          this.getList()
          this.dialogVisible = false
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
.box-title{
  padding-right: 20px;
}
</style>