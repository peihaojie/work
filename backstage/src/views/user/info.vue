<template>
  <div>
    <sub-title :subTitle="'用户信息'" :isBack="true"></sub-title>
    <div class='body' v-loading="loading">
      <div class="flex info">
        <div class="flex h-center">
          <img :src="getGoodImg(data.user.remark2)" alt="头像" class="avatar">
        </div>
        <div class="flex-1">
          <div class="flex">
            <div>用户ID</div>
            <div>{{ data.user.id }}</div>
          </div>
          <div class="flex">
            <div>昵称</div>
            <div>{{ data.user.realName }}</div>
          </div>
          <div class="flex">
            <div>性别</div>
            <div>{{ data.user.sex | getSex }}</div>
          </div>
          <div class="flex">
            <div>生日</div>
            <div>{{ data.user.birthday }}</div>
          </div>
          <div class="flex">
            <div>城市</div>
            <div>{{ data.user.remark5 }}</div>
          </div>
        </div>
        <div class="flex-1">
          <div class="flex">
            <div>职业</div>
            <div>无</div>
          </div>
          <div class="flex">
            <div>个性签名</div>
            <div>无</div>
          </div>
          <div class="flex">
            <div>喜欢的分类</div>
            <div>无</div>
          </div>
          <div class="flex">
            <div>注册时间</div>
            <div>{{ data.user.createTime }}</div>
          </div>
          <div class="flex">
            <div>用户来源</div>
            <div>小程序</div>
          </div>
        </div>
      </div>
      <div class="statistics flex">
        <p class="title">统计信息</p>
        <div>
          <div>消费金额</div>
          <div>{{ data.consumption || 0 }}</div>
        </div>
        <div>
          <div>订单数量</div>
          <div>{{ data.order_count }}</div>
        </div>
        <div>
          <div>收藏商品</div>
          <div>{{ data.collection }}</div>
        </div>
        <div>
          <div>商品评价</div>
          <div>{{ data.evaluation }}</div>
        </div>
        <div>
          <div>退货记录</div>
          <div>{{ data.return_record }}</div>
        </div>
        <div>
          <div>登录次数</div>
          <div>{{ data.login_count }}</div>
        </div>
      </div>
      <p class="address-title">收货地址</p>
      <el-table
        :data="data.addressList"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        class="mall-table"
      >
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="手机号" prop="phone" width="140"></el-table-column>
        <el-table-column label="详细地址" prop="address"></el-table-column>
        <el-table-column label="邮政编码" prop="postalCode" width="140"></el-table-column>
        <el-table-column label="默认地址" width="140">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.defaultState"
              disabled
              active-color="#5BC0BF"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="2"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <p class="address-title" style="margin-top: 30px;">订单记录</p>
      <el-table
        :data="list"
        :cell-style="tdStyle"
        :header-cell-style="headerStyle"
        class="mall-table"
      >
        <el-table-column label="订单编号" prop="code"></el-table-column>
        <el-table-column label="提交时间" prop="creatTime"></el-table-column>
        <el-table-column label="用户账号" prop="mobilePhone"></el-table-column>
        <el-table-column label="订单金额" prop="totalMoeny"></el-table-column>
        <el-table-column label="支付方式">
          <template>
            微信支付
          </template>
        </el-table-column>
        <el-table-column label="订单来源">
          <template>
            小程序
          </template>
        </el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            {{ scope.row.status | getOrderStatus }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="table-btn"
              @click="$router.push({path:'/order/list/orderDetail',query:{id: scope.row.id}})"
            >查看订单</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination @next="next" :isBatch="false" :total="total" :pageSize="pageSize"></pagination>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
import mixin from '@/utils/mixin';
import pagination from '@/components/pagination';
import filters from "@/utils/filters";
export default {
  name: 'info',
  mixins: [mixin],
  filters: filters,
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      list:[],
      data:{
        user:{}
      }
    }
  },
  mounted(){
    this.getDetail()
    this.getList()
  },
  methods:{
    getDetail(){
      this.$http.post('user_detail/query/' + this.$route.params.id)
      .then(res => {
        this.data = res
      },
      err => {
        this.$msgErr(err.msg)
      })
    },
    getList(){
      this.loading = true
      this.$http
        .post('merchant_order/query_for_page', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          merchantId: JSON.parse(localStorage.getItem("userInfo")).merchantId,
          userId: this.$route.params.id
        })
        .then(res => {
          this.list = res.list
          this.total = res.totalCount
        },
        err => {
          this.$msgErr(err.msg)
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
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 50px;
}
.info {
  border: $border;
  > div {
    border-right: $border;
    &:last-child {
      border-right: none;
    }
    > div {
      line-height: 36px;
      border-bottom: $border;
      font-size: 14px;
      &:last-child {
        border-bottom: none;
      }
      > div {
        padding: 0 10px;
        &:first-child {
          border-right: $border;
          width: 30%;
          color: $gray;
          background: #f6f6f6;
        }
      }
    }
  }
}
.statistics {
  border: $border;
  margin: 30px 0;
  .title {
    width: 100%;
    line-height: 40px;
    padding-left: 20px;
    background: #efefef;
    font-weight: bold;
    box-sizing: border-box;
  }
  > div {
    flex: 1;
    border-right: $border;
    border-top: $border;
    &:last-child {
      border-right: none;
    }
    > div {
      line-height: 49px;
      border-top: $border;
      text-align: center;
      font-size: 15px;
      &:first-child {
        border-top: none;
        background: #f6f6f6;
        color: $gray;
        font-weight: 700;
      }
    }
  }
}
.address-title {
  width: 100%;
  border: $border;
  line-height: 40px;
  padding-left: 20px;
  background: #efefef;
  font-weight: bold;
  box-sizing: border-box;
  border-bottom: none;
}
</style>