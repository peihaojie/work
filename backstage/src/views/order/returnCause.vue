<template>
  <div>
    <sub-title :subTitle="'退货原因'"></sub-title>
    <div class='body'>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button class="search" @click="update('')">添加原因</el-button>
        </div>
      </div>
      <el-table
      :data="tableData3"
      :header-cell-style="headerStyle"
      :cell-style="tdStyle"
      v-loading="loading"
      ref="table"
      class="mall-table"
      @selection-change="tableSelection"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="原因类型" prop="reasonType"></el-table-column>
        <el-table-column label="排序" prop="sorts"></el-table-column>
        <el-table-column label="是否启用" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch
              @change="handleStatus($event, scope.row.id)"
              v-model="scope.row.isUse"
              :active-value="1"
              :inactive-value="0"
              active-color="#5BC0BF"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="creatTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="编辑" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="table-btn" @click="update(scope.row.id)">编辑</span>
            <span class="table-btn" @click="remove([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        @handleChangeAll="handleChangeAll"
        :optionsList="optionsList"
        ref="pagination"
        @confirmBatch="confirmBatch"
        @next="next"
        :total="total"
        :pageSize="pageSize"
      ></pagination>
      <el-dialog title="退货原因" :visible.sync="dialogVisible" :append-to-body="true">
        <el-form>
          <el-form-item label="原因类型">
            <el-input v-model="reason"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="sorts" type="number" @keyup.native="number"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-switch
              v-model="isUse"
              :active-value="1"
              :inactive-value="0"
              active-color="#5BC0BF"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
        </el-form>
        <span class="dialog-footer" slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="add">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
import mixin from '@/utils/mixin';
import pagination from '@/components/pagination';
export default {
  name: 'returnCause',
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      input: "",
      tableData3: [],
      total: 1,
      checkAll: true,
      dialogVisible: false,
      isUse: 1,
      checkItemId: [],
      pagesize2: 1,
      id: "",
      sorts: "",
      reason: "",
      optionsList: {
        delete: "删除"
      }
    }
  },
  created(){
    this.getList(1)
  },
  methods:{
    getList(pageSize11){
      this.loading = true
      this.pagesize2 = pageSize11
      this.$http
        .post('/return_reason/query_for_pageB', {
          currentPage: pageSize11,
          pageSize: this.pageSize,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(res => {
          this.total = res.totalCount
          this.tableData3 = res.list
        },
        err => {
          this.$msgErr(err.msg)
        })
        .finally(() => {
          this.loading = false
        })
    },
    update(val){
      this.id = val
      if (val == '') {
        this.sorts = ''
        this.reason = ''
        this.isUse = ''
      } else {
        this.$http
          .post('/return_reason/selectOne', {
            id: val,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
          })
          .then(res => {
            this.sorts = res.sorts
            this.reason = res.reasonType
            this.isUse = res.isUse
          },
          err => {
            this.$msgErr(err.msg)
          })
      }
      this.dialogVisible = true
    },
    number(){
      this.sorts = this.sorts.replace(/[^\.\d]/g, "")
      this.sorts = this.sorts.replace(".", "")
    },
    add(){
      if (this.reason == "") {
        this.$msgErr("请输入退货原因")
        return false
      }
      if (this.sorts == "") {
        this.$msgErr("请输入排序")
        return false
      }
      if (this.id == "") {
        this.$http
          .post("/return_reason/add", {
            reasonType: this.reason,
            sorts: this.sorts,
            isUse: this.isUse,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
          })
          .then(
            res => {
              this.$msgSuc("添加成功")
              this.dialogVisible = false
              this.getList(this.pageSize2)
            },
            err => {
              this.$msgErr(err.msg)
            }
          );
      } else {
        this.$http
          .post("/return_reason/add", {
            reasonType: this.reason,
            sorts: this.sorts,
            id: this.id,
            isUse: this.isUse,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
          })
          .then(
            res => {
              this.$msgSuc("修改成功")
              this.getList(this.pageSize2)
              this.dialogVisible = false
            },
            err => {
              this.$msgErr(err.msg)
            }
          );
      }
    },
    tableSelection(val) {
      this.checkItemId = []
      if (val.length == this.tableData3.length) {
        this.$refs.pagination._data.checkAll = true
      } else {
        this.$refs.pagination._data.checkAll = false
      }
      val.forEach(item => {
        this.checkItemId.push(item.id)
      });
    },
    handleStatus($event, id){
      this.$http
        .post('/return_reason/add', {
          id: id,
          isUse: $event,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(res => {
          this.$msgSuc("操作成功")
        },
        err => {
          this.$msgErr(err.msg)
        })
    },
    remove(id) {
      this.$confirm("确认删除吗?").then(() => {
        this.$http.post("/return_reason/delete", { ids: id }).then(
          () => {
            this.$msgSuc("删除成功");
            this.getList(1);
          },
          err => {
            this.$msgErr(err.msg);
          }
        );
      });
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/css/common';
.search {
  margin-right: 20px;
}
</style>