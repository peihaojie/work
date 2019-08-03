<template>
  <div>
    <sub-title :subTitle="'退款申请'"></sub-title>
    <div class='body'>
      <div>
        <button class="mall-btn" :class="isactive == 'all'?'active':''" @click="onSubmit('all')">
          全部申请
          (<em class="grid-content bg-purplr">{{ all }}</em>)
        </button>
        <button class="mall-btn" :class="isactive == '2'?'active':''" @click="onSubmit('2')">
          待处理
          (<em class="grid-content bg-purplr">{{ all_wei }}</em>)
        </button>
        <button class="mall-btn" :class="isactive == '4'?'active':''" @click="onSubmit('4')">
          已处理
          (<em class="grid-content bg-purplr">{{ all_return }}</em>)
        </button>
        <button class="mall-btn" :class="isactive == '5'?'active':''" @click="onSubmit('5')">
          已拒绝
          (<em class="grid-content bg-purplr">{{ all_refuse }}</em>)
        </button>
      </div>
      <div class="filter-wrap">
        <div class="flex h-center between">
          <div>
            <img src="@/assets/order/search.png" alt="">
            <span class="font-14 gray">筛选查询</span>
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
          <span class="font-14 gray">输入搜索:</span>
          <el-input
            v-model="searchcode"
            placeholder="订单编号"
            clearable
            class="search-input"
            @keyup.enter.native="search"
            @clear="search"
          ></el-input>
          <span class="font-14 gray">用户账号:</span>
          <el-input
            v-model="receiver"
            placeholder="用户账号"
            clearable
            class="search-input"
            @keyup.enter.native="search"
            @clear="search"
          ></el-input>
          <span class="font-14 gray">提交时间:</span>
          <el-date-picker
            type="date"
            v-model="value1"
            placeholder="选择日期"
            class="search-input"
            @change="search"
          ></el-date-picker>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">订单列表</span>
      </div>
      <el-table
        :data="tableData3"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        @selection-change="tableSelection"
        class="mall-table"
        ref="table"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" :selectable="checkboxT" disabled="true"></el-table-column>
        <el-table-column label="服务单号" prop="code"></el-table-column>
        <el-table-column label="申请时间" prop="creatTime"></el-table-column>
        <el-table-column label="用户账号" prop="mobilePhone"></el-table-column>
        <el-table-column label="退款金额" prop="applicationReturnMoney"></el-table-column>
        <el-table-column label="联系人" prop="contact"></el-table-column>
        <el-table-column label="申请状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">退货待处理</span>
            <span v-else-if="scope.row.status == 2">待处理</span>
            <span v-else-if="scope.row.status == 3">拒绝退货</span>
            <span v-else-if="scope.row.status == 4">收到货确认退款</span>
            <span v-else-if="scope.row.status == 5">收到货拒绝退款</span>
            <span v-else>完成</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"></el-table-column>
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
  name: 'refund',
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      input: "",
      tableData3: [],
      total: 0,
      pageSize: 10,
      all: "",
      all_return: "",
      isactive: "all",
      all_wei: "",
      all_refuse: "",
      status: "",
      checkItemId: [],
      receiver: null,
      searchcode: null,
      optionsList: {
        delete: "删除"
      },
      value1: ""
    }
  },
  created(){
    this.onlond()
    this.getList(1, '')
  },
  methods:{
    getList(pageSize11, status) {
      this.loading = true;
      this.status = status;
      if (this.searchcode == "") {
        this.searchcode = null;
      }
      if (this.receiver == "") {
        this.receiver = null;
      }
      this.$http
        .post("/merchant_return_goods/query_for_page", {
          currentPage: pageSize11,
          pageSize: this.pageSize,
          status: status,
          phone: this.receiver,
          code: this.searchcode,
          creatTime: this.value1,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(
          res => {
            this.total = res.totalCount;
            this.tableData3 = res.list;
          },
          err => {
            this.$msgErr(err.msg);
          }
        )
        .finally(() => {
          this.loading = false;
        });
    },
    onlond(){
      this.$http
        .post('/merchant_return_goods/getCountByStatus', {
          status: "",
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(res => {
          this.all = res
          this.$http
            .post('/merchant_return_goods/getCountByStatus', {
              status: 2,
              merchantId: JSON.parse(localStorage.userInfo).merchantId
            })
            .then(res => {
              this.all_wei = res
              setTimeout(() => {
                 this.$http
                  .post('/merchant_return_goods/getCountByStatus', {
                    status: 4,
                    merchantId: JSON.parse(localStorage.userInfo).merchantId
                  })
                  .then(res => {
                    this.all_return = res
                    this.$http
                      .post('/merchant_return_goods/getCountByStatus', {
                        status: 5,
                        merchantId: JSON.parse(localStorage.userInfo).merchantId
                      })
                      .then(res => {
                        this.all_refuse = res
                      })
                  })
              }, 1000)
            })
        })
      
    },
    onSubmit(val){
      this.isactive = val
      if (val == 'all') {
        val = ''
      }
      this.getList(1,val)
    },
    search() {
      this.getList(1, this.status);
    },
    tableSelection(val){
      this.checkItemId = []
      if (val.length == this.tableData3.length) {
        this.$refs.pagination._data.checkAll = true
      } else {
        this.$refs.pagination._data.checkAll = false        
      }
      val.forEach(item => {
        checkItemId.push(item.id)
      });
    },
    checkboxT(row, index){
      if (row.status == 5) {
        return 1
      } else {
        return 0
      }
    },
    next(val) {
      this.getList(val);
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/css/common';
.mall-btn.active em {
  color: #fff;
}
em {
  font-style: normal;
  color: red;
  margin: 0 2px;
}
.filter-wrap {
  border: $border;
  margin-bottom: 24px;
  margin-top: 30px;
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
  .mall-btn {
    height: auto;
    font-size: 14px;
    padding: 0 18px;
  }
  .search {
    margin-left: 20px;
  }
}
</style>