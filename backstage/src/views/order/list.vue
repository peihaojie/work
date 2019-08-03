<template>
  <div>
    <sub-title :subTitle="'订单列表'"></sub-title>
    <div class='body'>
      <div>
        <button class="mall-btn" :class="isactive == 'all'?'active':''" @click="onSubmit('all')">
          全部订单
          ( <em class="grid-content bg-purple">{{ orderData.allOrder }}</em> )
        </button>
        <button class="mall-btn" :class="isactive == 1?'active':''" @click="onSubmit(1)">
          待付款
          ( <em class="grid-content bg-purple">{{ orderData.dfk }}</em> )
        </button>
        <button class="mall-btn" :class="isactive == 2?'active':''" @click="onSubmit(2)">
          待发货
          ( <em class="grid-content bg-purple">{{ orderData.dfh }}</em> )
        </button>
        <button class="mall-btn" :class="isactive == 3?'active':''" @click="onSubmit(3)">
          已发货
          ( <em class="grid-content bg-purple">{{ orderData.dsh }}</em> )
        </button>
        <button class="mall-btn" :class="isactive == 5?'active':''" @click="onSubmit(5)">
          已完成
          ( <em class="grid-content bg-purple">{{ orderData.ywc }}</em> )
        </button>
        <button class="mall-btn" :class="isactive == 0?'active':''" @click="onSubmit(0)">
          已关闭
          ( <em class="grid-content bg-purple">{{ orderData.ygb }}</em> )
        </button>
      </div>
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
              <i class="el-icon-arrow-down"></i>
              收起筛选
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
            placeholder="请输入订单编号"
            class="search-input"
          ></el-input>
          <span class="font-14 gray">用户账号:</span>
          <el-input
            v-model="receiver"
            @keyup.enter.native="search"
            @blur="search"
            clearable
            placeholder="请输入用户账号"
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
        ref="table"
        class="mall-table"
        v-loading="loading"
        @selection-change="tableSelection"
      >
        <el-table-column type="selection" :selecttable="disableSelect" width="55"></el-table-column>
        <el-table-column label="订单编号" prop="code"></el-table-column>
        <el-table-column label="提交时间" prop="creatTime"></el-table-column>
        <el-table-column label="用户账号" prop="mobilePhone"></el-table-column>
        <el-table-column label="订单金额" prop="totalMoeny"></el-table-column>
        <el-table-column label="支付方式">
          <template>
            微信小程序支付
          </template>
        </el-table-column>
        <el-table-column label="订单来源">
          <template>
            微信小程序
          </template>
        </el-table-column>
        <el-table-column label="订单状态" prop="statuse"></el-table-column>
        <el-table-column label="订单操作">
          <template slot-scope="scope">
            <span
              class="table-btn"
              @click="$router.push({path:'/order/list/orderDetail',query:{id:scope.row.id, mobilePhone:scope.row.mobilePhone}})"
            >查看订单</span>
            <span class="table-btn" v-if="scope.row.status == 2" @click="deliver(scope.row.id)">订单发货</span>
            <span
              class="table-btn"
              v-else-if="scope.row.status == 4 || scope.row.status == 5"
              @click="delivered(scope.row.id)"
            >订单追踪</span>
            <span
              class="table-btn"
              v-else-if="scope.row.status == 0"
              @click="delete1(scope.row.id)"
            >删除订单</span>
            <span class="table-btn" v-if="scope.row.status == 1" @click="close(scope.row.id)">关闭订单</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        @batchChange="batchChange"
        @confirmBatch="confirmBatch"
        @handleChangeAll="handleChangeAll"
        ref="pagination"
        @next="next"
        :optionsList="optionsList"
        :total="total"
        :isClear="true"
        :pageSize="pageSize"
      ></pagination>
      <el-dialog title="订单发货" :visible.sync="dialogVisible" :append-to-body="true">
        <el-form>
          <el-form-item label="快递公司">
            <el-input v-model="sendCompany"></el-input>
          </el-form-item>
          <el-form-item label="快递单号">
            <el-input v-model="sendCode"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button class="mall-btn" @click="dialogVisible = false">取 消</el-button>
          <el-button class="mall-btn active" @click="add()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="快递追踪" :visible.sync="dialogVisibled" :append-to-body="true">
        <el-form>
          <el-form-item label="快递公司">
            <el-span v-model="sendCompany">{{company}}</el-span>
          </el-form-item>
          <el-form-item label="快递单号">
            <el-span v-model="sendCode">{{code}}</el-span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button class="mall-btn" @click="dialogVisibled = false">确定</el-button>
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
  name: 'accountSetting',
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      optionsList: {
        close: "关闭订单",
        delete: "删除订单"
      },
      checkItemId: [],
      orderData: {},
      input: "",
      tableData: [],
      sendCode: "",
      sendCompany: "",
      total: 1,
      code: "",
      searchcode: null,
      isactive: "all",
      company: "",
      valpage: 1,
      all: 0,
      id: "",
      all_Unpaid: 0,
      all_Consignment: 0,
      dialogVisible: false,
      dialogVisibled: false,
      all_shipped: 0,
      all_complate: 0,
      status: "",
      all_close: 0,
      receiver: null,
      value1: "",
      batchVal: ""
    }
  },
  created:function(){
    this.getList(1, this.status)
  },
  methods:{
    getList(pageSize11, status){
      this.$http
        .post('merchant_order/getOrderAllCount', {
          merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
        })
        .then(res => {
          this.orderData = res
        })
      this.loading = true
      if (this.sendCode == '') {
        this.sendCode = null
      }
      if (this.receiver == '') {
        this.receiver = null
      }
      this.$http
        .post('/merchant_order/query_for_page', {
          currentPage: pageSize11,
          pageSize: this.pageSize,
          phone: this.receiver,
          code: this.searchcode,
          status: this.status,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(res => {
          for (let i = 0; i < res.list.length; i++) {
            switch (
              res.list[i].status //0关闭1待付款2待发货3已发货 4已收货5已评价 6已完成 20删除
            ) {
              case 0:
                res.list[i].statuse = '已关闭'
                break
              case 1:
                res.list[i].statuse = "待付款";
                break;
              case 2:
                res.list[i].statuse = "待发货";
                break;
              case 3:
                res.list[i].statuse = "待收货";
                break;
              case 4:
                res.list[i].statuse = "待评价";
                break;
              case 5:
                res.list[i].statuse = "已完成";
                break;
              case 20:
                res.list[i].statuse = "已删除";
                break;
            }
          }
          this.total = res.totalCount
          this.tableData = res.list
        },
        err => {}
      )
      .finally(() => {
        this.loading = false
      })
    },
    onSubmit(val){
      this.isactive = val
      if (val == 'all') {
        val = ''
      }
      this.status = val
      this.getList(1, this.status)
    },
    search(){
      this.getList(1,this.status)
    },
    disableSelect(row) {
      if (this.batchVal == "delete") {
        if (row.status == 0) {
          return true
        }
      } else if (this.batchVal == "close") {
        if (row.status == 1) {
          return true
        }
      }
      return false
    },
    deliver(val) {
      //发货
      this.dialogVisible = true;
      this.id = val;
    },
    delivered(val) {
      //快递追踪
      this.$http
        .post("/merchant_order/query_By_Id", {
          id: val,
          merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
        })
        .then(res => {
          this.company = res.sendCompany;
          this.code = res.sendCode;
          this.dialogVisibled = true;
        });
    },
    delete1(val) {
      this.$confirm("确定关闭订单嘛", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(result => {
        this.$http
          .post("/merchant_order/update", {
            id: id,
            status: 20,
            merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
          })
          .then(res => {
            this.getList(this.valpage);
            this.$msgSuc("删除成功");
          });
      });
    },
    close(id) {
      this.$confirm("确定关闭订单嘛", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(result => {
        this.$http
          .post("/merchant_order/update", {
            id: id,
            status: 0,
            merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
          })
          .then(res => {
            this.getList(this.valpage);
            this.$msgSuc("关闭成功");
          });
      });
    },
    batchChange(val) {
      if (val == "delete") {
        this.status = 0;
        this.onSubmit(this.status);
      } else if (val == "close") {
        this.status = 1;
        this.onSubmit(this.status);
      } else {
        this.status = "all";
        this.onSubmit(this.status);
      }
      this.batchVal = val;
    },
    add() {
      if (this.sendCompany == "") {
        this.$msgErr("请输入快递公司");
        return false;
      }
      if (this.sendCode == "") {
        this.$msgErr("请输入快递单号");
        return false;
      }
      this.$http
        .post("/merchant_order/update", {
          id: this.id,
          status: 3,
          sendCompany: this.sendCompany,
          sendCode: this.sendCode,
          merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
        })
        .then(res => {
          this.getList(this.valpage);
          this.sendCompany = "";
          this.sendCode = "";
          this.dialogVisible = false;
          this.$msgSuc("发货成功");
        });
    },
    next(val) {
      this.valpage = val;
      this.getList(val, this.status);
    },
    close(id) {
      this.$confirm("确定关闭订单嘛", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(result => {
        this.$http
          .post("/merchant_order/update", {
            id: id,
            status: 0,
            merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
          })
          .then(res => {
            this.getList(this.valpage);
            this.$msgSuc("关闭成功");
          });
      });
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
}
.mall-btn {
  height: auto;
  font-size: 14px;
  padding: 0 18px;
}
.search {
  margin-left: 20px;
  margin-right: 0;
}
</style>