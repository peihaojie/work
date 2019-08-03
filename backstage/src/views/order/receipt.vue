<template>
  <div>
    <sub-title :subTitle="'确认收货'"></sub-title>
    <div class='body'>
      <div class="filter-wrap">
        <div class="flex h-center between">
          <div>
            <img src="@/assets/order/search.png" alt="">
            <span class="font-14 gray">筛选查询</span>
          </div>
          <div class="search-wrap">
            <span class="font-14 gray" v-show="!visibleSearch" @click="showSearch">
              <i class="el-icon-arrow-down"></i>
              打开筛选
            </span>
            <span class="font-14 gray" v-show="visibleSearch" @click="showSearch">
              <i class="el-icon-arrow-up"></i>
              打开筛选
            </span>
            <el-button class="search" @click="search">查询结果</el-button>
          </div>
        </div>
        <div class="flex h-center" v-show="visibleSearch">
          <span class="font-14 gray">输入搜索:</span>
          <el-input
            v-model="searchcode"
            @keyup.enter.native="search"
            @blur="search"
            clearable
            placeholder="订单编号"
            class="search-input"
          ></el-input>
          <span class="font-14 gray">用户账号:</span>
          <el-input
            v-model="receiver"
            @keyup.enter.native="search"
            @blur="search"
            clearable
            placeholder="用户账号"
            class="search-input"
          ></el-input>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">订单列表</span>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        v-loading="loading"
        class="mall-table"
      >
        <el-table-column label="订单编号" prop="code"></el-table-column>
        <el-table-column label="提交时间" prop="creatTime"></el-table-column>
        <el-table-column label="用户账号" prop="mobilePhone"></el-table-column>
        <el-table-column label="订单金额" prop="totalMoeny"></el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">微信小程序支付</template>
        </el-table-column>
        <el-table-column label="订单来源">
          <template slot-scope="scope">微信小程序</template>
        </el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">待收货</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push({path:'/order/list/orderDetail',query:{id:scope.row.id}})">查看订单</span>
            <span class="table-btn" @click="update(scope.row.id)">确定收货</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        ref="pagination"
        @next="next"
        :isBatch="false"
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
  name: 'accountSetting',
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      receiver: null,
      searchcode: null,
      tableData: [],
      loading: false
    }
  },
  created:function(){
    this.getList(1)
  },
  methods:{
    getList(pageSize11){
      this.loading = true
      if (this.searchcode == "") {
        this.searchcode = null;
      }
      if (this.receiver == "") {
        this.receiver = null;
      }
      this.$http.post('/merchant_order/query_for_page', {
        currentPage: pageSize11,
        pageSize: this.pageSize,
        status: 3,
        phone: this.receiver,
        code: this.searchcode,
        merchantId: JSON.parse(localStorage.userInfo).merchantId
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
    search(){
      this.getList(1)
    },
    update(id) {
      this.$confirm("确定收货嘛", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(result => {
        this.$http
          .post("/merchant_order/update", {
            id: id,
            status: 4,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
          })
          .then(res => {
            this.getList(this.valpage);
            this.$msgSuc("收货成功");
          });
      });
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/css/common';
.filter-wrap{
  border: $border;
  margin-bottom: 24px;
  img {
    width: 20px;
    margin-bottom: -6px;
  }
  > div {
    padding: 0 22px;
    height: 56px;
    &:last-child {
      background-color: $bgColor;
    }
  }
  .search-input {
    width: 200px;
    margin: 0 15px;
  }
  .search {
  margin-left: 20px;
}
}
</style>