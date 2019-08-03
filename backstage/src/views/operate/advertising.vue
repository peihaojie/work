<template>
  <div>
    <sub-title :subTitle="'商品类型'"></sub-title>
    <div class='body'>
      <div class="box-title flex h-center between">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="$router.push('/operate/addAdvertising')">添加广告</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        @selection-change="tableSelection"
        ref="table"
        class="mall-table"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="广告名称" prop="adName"></el-table-column>
        <el-table-column label="广告位置">
          <template slot-scope="scope">
            {{ scope.row.adPosition | getAdPosition }}
          </template>
        </el-table-column>
        <el-table-column label="广告图片">
          <template slot-scope="scope">
            <img :src="scope.row.adPicture" alt="" class="table-img">
          </template>
        </el-table-column>
        <el-table-column label="上线/下线">
          <template slot-scope="scope">
            {{ scope.row.online == '1' ? '上线':'下线' }}
          </template>
        </el-table-column>
        <el-table-column label="点击次数" prop="clickNumber"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="table-btn"
              @click="$router.push({path:'/operate/addAdvertising',query:{id: scope.row.id}})"
            >编辑</span>
            <span
              class="table-btn"
              @click="updateTop(scope.row.id, scope.row.topState)"
            >{{ scope.row.topState == '1' ? '取消置顶' : '置顶' }}</span>
            <span class="table-btn" @click="remove(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        ref="pagination"
        @next="next"
        @confirmBatch="confirmBatch"
        :optionsList="optionsList"
        @handleChangeAll="handleChangeAll"
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
import filters from '@/utils/filters'
export default {
  name: 'advertising',
  mixins: [mixin],
  filters: filters,
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      tableData: [],
      total: 0,
      optionsList: {
        delete: '删除'
      },
      checkItemId: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.$http
        .post('merchant_ad/get_merchant_ad_list', {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          this.total = res.totalCount
          this.tableData = res.list
        })
    },
    tableSelection(val) {
      let checkItemId = []
      if (val.length == this.tableData.length) {
        this.$refs.pagination._data.checkAll = true
      } else {
        this.$refs.pagination._data.checkAll = false
      }
      val.forEach(item => {
        checkItemId.push(item.id)
      });
      this.checkItemId = checkItemId.join(',')
    },
    updateTop(id, topState) {
      this.$http
        .post('merchant_ad/change_merchant_ad', {
          id: id,
          topState: topState == '1' ? '0' : '1'
        })
        .then(() => {
          this.$msgSuc('操作成功')
          this.getList()
        },
        err => {
          this.$msgErr(err.msg)
        })
    },
    remove(id) {
      this.$confirm('确认删除吗？').then(() => {
        this.$http.post('merchant_ad/delete_merchant_ad', {
          remark: id
        })
        .then(() => {
          this.getList()
          this.$msgSuc('删除成功')
        },
        err => {
          this.$msgErr(err.msg)
        })
      })
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