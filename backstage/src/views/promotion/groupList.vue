<template>
  <div>
    <sub-title :subTitle="'成团管理'"></sub-title>
    <div class='body'>
      <div class="filter-wrap">
        <div class="flex h-center between">
          <div>
            <span class="font-14 gray">
              <i class="el-icon-search"></i>
              筛选查询
            </span>
          </div>
          <div class="search-wrap">
            <span class="font-14 gray" v-show="!visibleSearch" @click="showSearch">
              <i class="el-icon-arrow-down"></i>
              打开筛选
            </span>
            <span class="font-14 gray" v-show="visibleSearch" @click="showSearch">
              <i class="el-icon-arrow-up"></i>
              收起筛选
            </span>
            <el-button class="search" @click="search">查询结果</el-button>
          </div>
        </div>
        <div class="flex h-center" v-show="visibleSearch">
          <span class="font-14 gray">商品名称:</span>
          <el-input
            placeholder="请输入商品名称"
            v-model="goodsName"
            class="search-input"
            clearable
            @keyup.enter.native="search"
            @clear="search"
          ></el-input>
          <span class="font-14 gray">订单编号:</span>
          <el-input
            placeholder="请输入订单编号"
            v-model="id"
            class="search-input"
            clearable
            @keyup.enter.native="search"
            @clear="search"
          ></el-input>
          <span class="font-14 gray">拼团状态:</span>
          <el-select
            v-model="assembleState"
            placeholder="请选择拼团状态"
            @change="search"
            class="search-input"
            clearable
          >
            <el-option
              v-for="(item,index) in promotionStatus"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        v-loading="loading"
        class="mall-table"
      >
        <el-table-column label="拼团编号" prop="id"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="拼团状态">
          <template slot-scope="scope">
            {{ scope.row.assembleState | getPromotionStatus}}
          </template>
        </el-table-column>
        <el-table-column label="团规格" prop="groupSpec"></el-table-column>
        <el-table-column label="团价/元">
          <template slot-scope="scope">
            {{`￥${scope.row.groupPrice}`}}
          </template>
        </el-table-column>
        <el-table-column label="已参团人数" prop="groupNum"></el-table-column>
        <el-table-column label="团长" prop="commanderName"></el-table-column>
        <el-table-column label="邀请次数" prop="invitationTimes"></el-table-column>
        <el-table-column label="开团时间" prop="createTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push({ name: 'groupOrder', query: { id:scope.row.id } })">查看订单</span>
            <span class="table-btn" @click="cancelPromotion(scope.row.id)" v-if="scope.row.assembleState == 4">取消拼团</span>
            <span class="table-btn" @click="showLog(scope.row.id)">日记</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :isBatch="false"
        @next="next"
        :total="total"
        :pageSize="pageSize"
        ref="pagination"
      ></pagination>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        :append-to-body="true"
      >
        <el-table
          :data="dialogData"
          class="promotion-table"
          style="width: 100%"
        >
          <el-table-column label="操作时间" prop="createTime"></el-table-column>
          <el-table-column label="操作内容" prop="logContent"></el-table-column>
          <el-table-column label="操作者" prop="operator"></el-table-column>
        </el-table>
        <div class="dialog-pagination-wrap">
          <el-pagination
            @current-change="dialoghandleCurrentChange"
            :current-page.sync="dialogCurrentPage"
            :total="dialogTotal"
            :page-size="dialogPageSize"
            background
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
import mixin from '@/utils/mixin';
import pagination from '@/components/pagination';
import filters from '@/utils/filters'
export default {
  name: 'groupList',
  filters:filters,
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      dialogVisible: false,
      dialogCurrentPage: 1,
      dialogPageSize: 10,
      dialogTotal: 0,
      goodsName: "",
      id: "",
      orderId: "",
      assembleState: "",
      tableData: [],
      dialogData: [],
      promotionOrderStatus: filters.promotionOrderStatus,
      promotionStatus: filters.promotionStatus
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      this.loading = true
      this.$http
        .post('group_manage/list', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          goodsName: this.goodsName || null,
          id: this.id || null,
          assembleState: this.assembleState || null
        })
        .then(res => {
          this.tableData = res.list
          this.total = res.totalCount
        })
        .finally(() => {
          this.loading = false
        })
    },
    cancelPromotion(id) {
      this.$confirm('确认取消拼团吗?取消后该团下面所有订单将会全部取消').then(() => {
        this.$http.post('group_manage/list', {id:id}).then(
          res => {
            this.getList()
            this.$msgSuc('操作成功')
          },
          err => {
            this.$msgErr(err.msg)
          }
        )
      })
    },
    showLog(id) {
      this.orderId = id
      this.dialogVisible = true
      this.$http
        .post('group_manage_log/list', {
          id: this.orderId,
          currentPage: this.dialogCurrentPage,
          pageSize: this.dialogPageSize
        })
        .then(res => {
          this.dialogData = res.list
          this.dialogTotal = res.totalCount
        })
    },
    dialoghandleCurrentChange(val) {
      this.dialogCurrentPage = val
      this.showLog(this.orderId)
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/css/common';
.filter-wrap {
  border: $border;
  margin-bottom: 24px;
  > div {
    padding: 0 22px;
    height: 56px;
    &:last-child {
      background-color: $bgColor;
    }
  }
  .search {
    margin-left: 20px;
    margin-right: 0;
  }
}
.search-input {
  width: 200px;
  margin: 0 15px;
}
.dialog-pagination-wrap {
  margin-top: 20px;
  text-align: right;
}
</style>