<template>
  <div>
    <sub-title :subTitle="'订单管理'"></sub-title>
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
            <span class="font-14 gray" @click="showSearch" v-show="!visibleSearch">
              <i class="el-icon-arrow-down"></i>
              打开筛选
            </span>
            <span class="font-14 gray" @click="showSearch" v-show="visibleSearch">
              <i class="el-icon-arrow-up"></i>
              收起筛选
            </span>
            <el-button class="search" v-if="groupManageId" @click="back">返回</el-button>
            <el-button class="search" @click="search">查询结果</el-button>
          </div>
        </div>
        <div class="flex h-center" v-show="visibleSearch">
          <span class="font-14 gray">商品名称:</span>
          <el-input
            v-model="goodName"
            placeholder="请输入商品名称"
            @keyup.enter.native="search"
            @clear="search"
            clearable
            class="search-input"
          ></el-input>
          <span class="font-14 gray">订单编号:</span>
          <el-input
            v-model="code"
            placeholder="请输入订单编号"
            @keyup.enter.native="search"
            @clear="search"
            clearable
            class="search-input"
          ></el-input>
          <span class="font-14 gray">订单状态:</span>
          <el-select
            v-model="status"
            placeholder="请选择订单状态"
            clearable
            @change="search"
            class="search-input"
          >
            <el-option
              v-for="(item,index) in promotionOrderStatus"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
          <span class="font-14 gray">拼团状态:</span>
          <el-select
            v-model="groupStatus"
            placeholder="请选择拼团状态"
            clearable
            @change="search"
            class="search-input"
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
        <el-table-column label="订单编号" prop="code"></el-table-column>
        <el-table-column label="拼团编号" prop="groupManageId"></el-table-column>
        <el-table-column label="商品名称" prop="details[0].goodsName"></el-table-column>
        <el-table-column label="拼团状态">
          <template slot-scope="scope">
            {{ scope.row.groupStatus | getPromotionStatus }}
          </template>
        </el-table-column>
        <el-table-column label="订单金额" prop="totalMoeny"></el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            {{ scope.row.status | getPromotionOrderStatus }}
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="mobilePhone"></el-table-column>
        <el-table-column label="收货人" prop="receiver"></el-table-column>
        <el-table-column label="收货人手机" prop="phone"></el-table-column>
        <el-table-column label="收货地址" prop="address"></el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            微信支付
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="creatTime"></el-table-column>
        <el-table-column label="已取消退款状态">
          <template slot-scope="scope">
            {{ scope.row.returnStatus == 0 ? '未退款' : '已退款' }}
          </template>
        </el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
      <pagination
        :isBatch="false"
        @next="next"
        :total="total"
        :pageSize="pageSize"
        ref="pagination"
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
  name: 'groupOrder',
  mixins: [mixin],
  filters:filters,
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      dialogVisible: false,
      goodName: "",
      code: "",
      groupStatus: "",
      status: "",
      groupManageId: "",
      tableData: [],
      promotionOrderStatus: filters.promotionOrderStatus,
      promotionStatus: filters.promotionStatus
    }
  },
  mounted(){
    if (this.$route.query.id) {
      this.groupManageId = this.$route.query.id
    }
    this.getList()
  },
  methods:{
    getList(){
      this.loading = true
      this.$http
        .post('merchant_order/groupOrderList', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          goodName: this.goodName || null,
          code: this.code || null,
          groupStatus: this.groupStatus || null,
          status: this.status || null,
          groupManageId: this.groupManageId || null,
          merchantId: JSON.parse(localStorage.getItem("userInfo")).merchantId
        })
        .then(res => {
          this.tableData = res.list
        })
        .finally(() => {
          this.loading = false
        })
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
  width: 150px;
  margin: 0 15px;
}
</style>