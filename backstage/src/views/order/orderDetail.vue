<template>
  <div>
    <sub-title :subTitle="'订单详情'" :isBack="true"></sub-title>
    <div class='body'>
      <el-steps
        :active="datalist.status"
        align-center
        style="margin-bottom: 30px;"
        finish-status="success"
      >
        <el-step title="提交订单" :description="datalist.creatTime"></el-step>
        <el-step title="支付订单" :description="datalist.finishTime"></el-step>
        <el-step title="平台发货" :description="datalist.sendEndTime"></el-step>
        <el-step title="确认收货" :description="datalist.creatTime"></el-step>
        <el-step title="完成评价" :description="datalist.finishEndTime"></el-step>
      </el-steps>
      <div class="order-info clearFix">
        <p class="fl">
          <i class="el-icon-warning font-15 red"></i>
          <span class="font-15 red">当前订单状态: {{ datalist.status | getOrderStatus }}</span>
        </p>
        <div class="fr">
          <button
            class="mall-btn"
            @click="dialogVisible = true; dialogStatus = 1; title = '修改收货人信息';"
          >修改收货人信息</button>
          <button
            class="mall-btn"
            v-if="datalist.status == 1"
            @click="close"
          >关闭订单</button>
          <button
            class="mall-btn"
            @click="dialogVisible = true; dialogStatus = 2; title = '备注订单';"
          >备注订单</button>
        </div>
      </div>
      <div class="table flex">
        <p class="title">基本信息</p>
        <div>
          <div>订单id</div>
          <div>{{ datalist.id }}</div>
        </div>
        <div>
          <div>订单编号</div>
          <div>{{ datalist.code }}</div>
        </div>
        <div>
          <div>用户账号</div>
          <div>{{ mobilePhone }}</div>
        </div>
        <div>
          <div>支付方式</div>
          <div>微信小程序支付</div>
        </div>
        <div>
          <div>订单来源</div>
          <div>小程序</div>
        </div>
        <div>
          <div>订单类型</div>
          <div>{{ datalist.type == 1 ? '普通类型' : '限时秒杀' }}</div>
        </div>
        <div>
          <div>配送方式</div>
          <div>{{ datalist.sendCompany }}</div>
        </div>
        <div>
          <div>物流单号</div>
          <div>{{ datalist.sendCode }}</div>
        </div>
        <div>
          <div>自动收货时间</div>
          <div>{{ datalist.finishEndTime }}</div>
        </div>
      </div>
      <div class="table flex">
        <p class="title">收货人信息</p>
        <div>
          <div>收货人</div>
          <div>{{ datalist.receiver }}</div>
        </div>
        <div>
          <div>手机号码</div>
          <div>{{ datalist.phone }}</div>
        </div>
        <div>
          <div>邮政编码</div>
          <div></div>
        </div>
        <div>
          <div>收货地址</div>
          <div>{{ datalist.address }}</div>
        </div>
      </div>
      <p class="el-title">商品信息</p>
      <el-table
        :data="datalist.details"
        class="mall-table"
        :cell-style="tdStyle"
        :header-cell-style="headerStyle"
      >
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <img :src="getGoodImg(scope.row.goodsPic)" alt="">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="价格" prop="goodsPrice"></el-table-column>
        <el-table-column label="属性" prop="goodsDesc"></el-table-column>
        <el-table-column label="数量" prop="buyNum"></el-table-column>
        <el-table-column label="品牌" prop="goodsBrand"></el-table-column>
        <el-table-column label="小计" prop="totalMoney"></el-table-column>
      </el-table>
      <div class="table flex">
        <p class="title">费用信息</p>
        <div>
          <div>商品合计</div>
          <div>{{ datalist.totalMoeny }}</div>
        </div>
        <div>
          <div>运费</div>
          <div>包邮</div>
        </div>
        <div>
          <div>订单总金额</div>
          <div>{{ datalist.totalMoeny }}</div>
        </div>
        <div>
          <div>应付款金额</div>
          <div>{{ datalist.totalMoeny }}</div>
        </div>
      </div>
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        width="30%"
      >
        <el-form
          :model="ruleForm"
          :rules="rules1"
          ref="ruleForm"
          label-width="100px"
          class="form"
        >
          <div v-if="dialogStatus == 1">
            <el-form-item label="收货人姓名:" prop="receiver">
              <el-input v-model="ruleForm.receiver"></el-input>
            </el-form-item>
            <el-form-item label="手机号码:" prop="phone">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="详细地址:" prop="address">
              <el-input v-model="ruleForm.address"></el-input>
            </el-form-item>
          </div>
          <div v-if="dialogStatus == 2">
            <el-form-item label="操作备注:">
              <el-input type="textarea" v-model="mechantRemark" :rows="5"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <span class="dialog-footer" slot="footer">
          <el-button class="mall-btn" @click="dialogVisible = false">取消</el-button>
          <el-button class="mall-btn" @click="submitForm('ruleForm')">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
import mixin from '@/utils/mixin';
import filters from "@/utils/filters";
export default {
  name: 'list',
  mixins: [mixin],
  filters:filters,
  components: {
    subTitle
  },
  data() {
    return {
      datalist: {},
      title: "修改收货人信息",
      mechantRemark: "",
      dialogVisible: false,
      dialogStatus: 1,
      mobilePhone: "",
      ruleForm: {},
      rules1: {
        receiver: [
          { required: true, message: "请输入收货人姓名", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { max: 11, message: "请输入正确的手机号", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      rules2: {
        mechantRemark: [
          { required: true, message: "请输入订单备注", trigger: "blur" }
        ]
      }
    }
  },
  created:function(){
    if (this.$route.query.id) {
      this.getOrderInfo()
      this.mobilePhone = this.$route.query.mobilePhone
    }
  },
  methods:{
    getOrderInfo(){
      this.$http
        .post('merchant_order/query_By_Id', {
          id: this.$route.query.id,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        })
        .then(res => {
          this.datalist = res
          this.$set(this.ruleForm, 'receiver', res.receiver)
          this.$set(this.ruleForm, 'phone', res.phone)
          this.$set(this.ruleForm, 'address', res.address)
          this.$set(this.ruleForm, 'id', res.id)
        },
        err => {
          this.$msgErr(err.msg)
        })
    },
    close() {
      this.$confirm("确定关闭订单嘛", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$http
          .post("/merchant_order/update", {
            id: this.$route.query.id,
            status: 0
          })
          .then(() => {
            this.getOrderInfo();
            this.$msgSuc("关闭成功");
          });
      });
    },
    submitForm(formName){
      if (this.dialogStatus == 1) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$http
              .post('merchant_order/updateOrder', this.ruleForm)
              .then(() => {
                this.getOrderInfo()
                this.$msgSuc('操作成功')
                this.dialogStatus = false
              })
          } else {
            return false
          }
        })
      } else {
        this.$http.post('merchant_order/updateOrder', {
          id: this.ruleForm.id,
          mechantRemark: this.mechantRemark
        }).then(
          () => {
            this.getOrderInfo()
            this.$msgSuc('操作成功')
            this.dialogStatus = false
          },
          err => {
            this.$msgErr(err.msg)
          }
        )
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/css/common';
.body-detail {
  border: none;
  margin-bottom: 0;
  border-right: 1px solid #dedede;
}
.el-title {
  width: 100%;
  border: $border;
  border-bottom: none;
  line-height: 40px;
  font-weight: bold;
  padding-left: 20px;
  box-sizing: border-box;
  background-color: #efefef;
}
.table {
  margin: 30px 0;
  border: $border;
  .title {
    width: 100%;
    border-bottom: $border;
    line-height: 40px;
    font-weight: bold;
    padding-left: 20px;
    box-sizing: border-box;
    background-color: #efefef;
  }
  > div {
    flex: 1;
    border-right: $border;
    &:last-child {
      border-right: none;
    }
    > div {
      line-height: 49px;
      font-size: 15px;
      text-align: center;
      &:first-child {
        line-height: 49px;
        color: $gray;
        font-weight: 700;
        background-color: #f6f6f6;
        border-bottom: $border;
      }
    }
  }
}
.form-wrap {
  margin-top: 50px;
  > div {
    width: 100%;
  }
}
.order-info {
  background-color: #efefef;
  padding: 20px;
  border: $border;
  p {
    line-height: 38px;
    span {
      margin-left: 10px;
    }
  }
}
</style>