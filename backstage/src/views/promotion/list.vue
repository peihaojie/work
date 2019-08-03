<template>
  <div>
    <sub-title :subTitle="'拼团商品列表'"></sub-title>
    <div class='body'>
      <div class="filter-wrap">
        <div class="flex between h-center">
          <div>
            <span class="font-14 gray">
              <i class="el-icon-search"></i>
              筛选查询
            </span>
          </div>
          <div class="search-wrap">
            <span class="font-14 gray" @click="showSearch" v-show="!visibleSearch">
              <i class="el-icon-arrow-down"></i>
              打开筛选
            </span>
            <span class="font-14 gray" @click="showSearch" v-show="visibleSearch">
              <i class="el-icon-arrow-up"></i>
              收起筛选
            </span>
            <el-button class="search" @click="search">查询结果</el-button>
          </div>
        </div>
        <div class="flex h-center" v-show="visibleSearch">
          <span class="font-14 gray">商品名称:</span>
          <el-input
            v-model="goodsName"
            clearable
            @clear="search"
            @keyup.enter.native="search"
            class="search-input"
            placeholder="请输入商品名称"
          ></el-input>
          <span class="font-14 gray">商品状态:</span>
          <el-select
            v-model="status"
            placeholder="请选择商品状态"
            clearable
            @change="search"
            class="search-input"
          >
            <el-option label="上架" value="0"></el-option>
            <el-option label="下架" value="1"></el-option>
          </el-select>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="$router.push('/promotion/addGoods')">添加拼团商品</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        class="mall-table"
      >
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="团个数" prop="groupMaxNum"></el-table-column>
        <el-table-column label="团规格">
          <template slot-scope="scope">
            {{ `${scope.row.groupUserNum}人-${scope.row.groupPrice}元` }}
          </template>
        </el-table-column>
        <el-table-column label="原价/元" prop="merchantGoodsTypeProperty.goodsSalePrice"></el-table-column>
        <el-table-column label="已开团" prop="openGroup"></el-table-column>
        <el-table-column label="已成团" prop="endGroup"></el-table-column>
        <el-table-column label="参团人数" prop="groupUserNum"></el-table-column>
        <el-table-column label="是否上架">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#5BC0BF"
              inactive-color="#dedede"
              :active-value="0"
              :inactive-value="1"
              @change="handleShow($event, scope.row.id)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="上架时间" prop="createTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push({path:'/promotion/addGoods', query: { id: scope.row.id } })">编辑</span>
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
          <el-table-column label="操作内容" prop="content"></el-table-column>
          <el-table-column label="操作者" prop="merchantName"></el-table-column>
        </el-table>
        <div class="dialog-pagination-wrap">
          <!-- current-page当前页，current-change当前页发生变化，total总条目数，page-size单页显示数，background页码背景色，layout顺序 -->
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
export default {
  name: 'list',
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      goodsName: "",
      status: "",
      tableData: [],
      dialogData: [],
      dialogVisible: false,
      dialogCurrentPage: 1,
      dialogPageSize: 10,
      dialogTotal: 0
    }
  },
  mounted(){
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$http
        .post('merchantGoodsGroup/goods_group_list_page', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          goodsName: this.goodsName,
          status: this.status
        })
        .then(res => {
          this.total = res.totalCount
          this.tableData = res.list
        },
        err => {
          this.$msgErr(err.msg)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleShow($event, id) {
      this.$http
        .post('merchantGoodsGroup/group_oprate', {
          id: id,
          status: $event
        })
        .then(() => {
            this.$msgSuc("操作成功")
            this.getList()
          },
          err => {
            this.$msgErr(err.msg)
          })
    },
    showLog(id) {
      this.dialogVisible = true
      this.groupId = id
      this.$http
        .post('merchantGoodsGroup/query_log_pages', {
          currentPage: this.dialogCurrentPage,
          pageSize: this.dialogPageSize,
          groupId: id
        })
        .then(res => {
          this.dialogData = res.list
          this.dialogTotal = res.totalCount
        },
        err => {
          this.$msgErr(err.msg)
        })
    },
    dialoghandleCurrentChange(val) {
      this.dialogCurrentPage = val;
      this.showLog(this.groupId);
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
.box-title {
  padding-right: 20px;
}
.dialog-pagination-wrap {
  margin-top: 20px;
  text-align: right;
}
</style>