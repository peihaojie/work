<template>
  <div>
    <sub-title :subTitle="'发货点信息管理'"></sub-title>
    <div class='body'>
      <div class="box-title flex between h-enter">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="$router.push('address/addAddress')">添加发货点</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        ref="table"
        v-loading="loading"
        class="mall-table"
        @selection-change="tableSelection"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="发货点名称" prop="returnPname"></el-table-column>
        <el-table-column label="发货人姓名" prop="returnName"></el-table-column>
        <el-table-column label="地址" prop="returnAddress"></el-table-column>
        <el-table-column label="联系电话" prop="returnPhone"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push({path:'address/addAddress',query:{id:scope.row.id}})">编辑</span>
            <span class="table-btn" @click="remove([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        ref="pagination"
        @handleChangeAll="handleChangeAll"
        :optionsList="optionsList"
        @confirmBatch="confirmBatch"
        @next="next"
        :total="total"
        :pageSize="pageSize"
      ></pagination>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
import mixin from '@/utils/mixin';
import pagination from '@/components/pagination';
export default {
  name: 'type',
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      checkItemId: [],
      optionsList: {
        delete: "删除"
      },
      ruleForm: {
        styleName: ""
      },
      rules: {
        styleName: [
          { required: true, message: "请输入类型名称", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      this.loading = true
      this.$http
        .post('/return_send/query_for_page', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
        })
        .then(res => {
          this.total = res.totalCount
          this.tableData = res.list
        })
        .finally(() => {
          this.loading = false
        })
    },
    tableSelection(val){
      this.checkItemId = []
      if (val.length == this.tableData.length) {
        this.$refs.pagination._data.checkAll = true
      } else {
        this.$refs.pagination._data.checkAll = false        
      }
      val.forEach(item => {
        checkItemId.push(item.id)
      });
    },
    remove(id){
      this.$confirm("确认删除吗?").then(() => {
        this.$http
          .post("return_send/delete ", {
            ids: id
          })
          .then(
            () => {
              this.getList();
              this.$msgSuc("删除成功")
            },
            err => {
              this.$msgErr(err.msg)
            }
          );
      });
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/css/common';
.box-title {
  padding-right: 20px;
}
</style>