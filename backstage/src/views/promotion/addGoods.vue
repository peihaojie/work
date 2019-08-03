<template>
  <div>
    <sub-title :subTitle="'添加拼团商品'"></sub-title>
    <div class='body'>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        class="form"
        label-width="150px"
      >
        <el-form-item label="拼团商品:" prop="goodsId">
          <el-select
            v-model="ruleForm.goodsId"
            filterable
            clearable
            @change="handleGoods"
            :disabled="!isAdd"
            ref="searchSelect"
            remote
            :remote-method="searchGoods"
            placeholder="请输入商品名"
          >
            <el-option
              v-for="(item,index) in goodsList"
              :key="index"
              :label="item.goodsName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择商品规格:" prop="skuId" v-if="specList.length > 0">
          <div class="spec-item" v-for="(item,index) in specList" :key="index">
            <el-radio v-model="ruleForm.skuId" :label="item.id" border size="medium">
              <span class="spec-info" v-for="(val,index1) in item.nameValue" :key="index1">
                {{ `${val.name}:${val.value}` }}
              </span>
              <span class="spec-info">价格: {{item.goodsSalePrice}}</span>
              <span class="spec-info">库存: {{ item.goodsStock }}</span>
            </el-radio>
          </div>
        </el-form-item>
        <el-form-item label="拼团规格设置:" v-if="ruleForm.skuId">
          <table class="goods-table" border="1">
            <thead>
              <td>拼团人数</td>
              <td>拼团价格</td>
              <td>拼团时效</td>
              <td>成团个数</td>
              <td>操作</td>
            </thead>
            <tbody>
              <tr v-for="(item, index) in ruleForm.merchantGoodsGroup" :key="index">
                <td>
                 <el-select
                  placeholder="请选择人数"
                  v-model="item.groupUserNum"
                  size="small"
                 >
                  <el-option
                    v-for="(item,index) in [2, 4, 6]"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                 </el-select> 
                </td>
                <td>
                  <el-input
                  v-model="item.groupPrice"
                  placeholder="团价格不能相同"
                  size="small"
                  type="number"
                  min="0"
                  ></el-input>
                </td>
                <td>
                  <el-select
                    placeholder="请选择时间"
                    v-model="item.groupTime"
                    size="small"
                  >
                    <el-option label="12小时制" value="12"></el-option>
                    <el-option label="24小时制" value="24"></el-option>
                  </el-select>
                </td>
                <td>
                  <el-input
                  v-model="item.groupMaxNum"
                  placeholder="最多100个团"
                  size="small"
                  type="number"
                  min="0"
                  ></el-input>
                </td>
                <td>
                  <el-button
                    @click="deleteSpec(index)"
                    :disabled="ruleForm.merchantGoodsGroup.length < 2"
                    type="text"
                  >删除</el-button>
                </td>
              </tr>
            </tbody>
          </table>
          <el-button
            v-if="ruleForm.merchantGoodsGroup.length < 4 && isAdd"
            @click="addSpec"
            class="add-spec-btn"
          >添加规格（最多添加四个）</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm('ruleForm')" type="primary" :loading="submitLoading">提交</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
import mixin from '@/utils/mixin';
import pagination from '@/components/pagination';
export default {
  name: 'addGoods',
  mixins: [mixin],
  components: {
    subTitle
  },
  data() {
    return {
      goodsList: [],
      goodsId: "",
      specList: [],
      ruleForm: {
        goodsId: "",
        skuId: "",
        merchantGoodsGroup: [
          {
            groupUserNum: "",
            groupPrice: "",
            groupTime: "",
            groupMaxNum: ""
          }
        ]
      },
      rules: {
        goodsId: [
          { required: true, message: "请选择拼团商品", trigger: "change" }
        ],
        skuId: [{ required: true, message: "请选择商品规格" }],
        merchantGoodsGroup: [{ required: true }]
      },
      loading: false,
      submitLoading: false
    }
  },
  created(){
    if (this.$route.query.id) {
      this.isAdd = false
      this.loading = true
      this.$http
        .post('merchantGoodsGroup/goods_group_by_id', {
          id: this.$route.query.id
        })
        .then(res => {
          this.goodsId = res.merchantGoods.id
          this.$set(this.ruleForm, "goodsId", res.merchantGoods.goodsName)
          this.$set(this.ruleForm, "skuId", res.merchantGoodsTypeProperty.id)
          this.$set(this.ruleForm, "merchantGoodsGroup", [
            {
              groupUserNum: res.groupUserNum,
              groupPrice: res.groupPrice,
              groupTime: res.groupTime,
              groupMaxNum: res.groupMaxNum
            }
          ])
          this.specList = [
            {
              id: res.merchantGoodsTypeProperty.id,
              nameValue: res.merchantGoodsTypeProperty.nameValue,
              goodsSalePrice: res.merchantGoodsTypeProperty.goodsSalePrice,
              goodsStock: res.merchantGoodsTypeProperty.goodsStock
            }
          ]
        },
        err => {
          this.$msgErr(err.msg)
        })
        .finally(() => {
          this.loading = false
        })
    } else {
      this.isAdd = true
    }
  },
  methods:{
    searchGoods(val) {
      this.$http
        .post('merchantGoods/merchant_goods_list_page', {
          currentPage: 1,
          pageSize: 100,
          goodsName: val
        })
        .then(res => {
          this.goodsList = res.list
        })
    },
    handleGoods($event) {
      if ($event) {
        this.$http.post('merchantGoods/merchant_goods_by_id', {
          id: $event
        })
        .then(res => {
          this.specList = res.merchantGoodsTypePropertyList
        })
      }
    },
    deleteSpec(index) {
      if (this.ruleForm.merchantGoodsGroup.length > 1) {
        this.ruleForm.merchantGoodsGroup.splice(index, 1)
      }
    },
    addSpec() {
      this.ruleForm.merchantGoodsGroup.push({
        groupUserNum: "",
        groupPrice: "",
        groupTime: "",
        groupMaxNum: ""
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let isValid = true
          this.ruleForm.merchantGoodsGroup.forEach(item => {
            if (
              !item.groupUserNum ||
              !item.groupPrice ||
              !item.groupTime ||
              !item.groupMaxNum
            ) {
              this.$msgWar('请填写完整拼团规格列表')
              isValid = false
              return
            }
            if (item.groupMaxNum > 100 || item.groupMaxNum < 0) {
              this.$msgWar('成团个数在0到100之间')
              isValid = false
              return
            }
          })
          if (!isValid) {
            return
          }
          this.submitLoading = true
          if (this.isAdd) {
            this.addEdit("merchantGoodsGroup/goods_group_add")
          } else {
            this.ruleForm.goodsId = String(this.goodsId)
            this.ruleForm.id = this.$route.query.id
            // Object.assign()方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
            this.ruleForm = Object.assign(
              this.ruleForm,
              this.ruleForm.merchantGoodsGroup[0]
            )
            delete ruleForm.merchantGoodsGroup
            this.addEdit('merchantGoodsGroup/goods_group_update')
          }
        } else {
          return false
        }
      })
    },
    addEdit(url) {
      let ruleForm = Object.assign({}, this.ruleForm)
      this.$http
        .post(url, ruleForm)
        .then(() => {
          this.$msgSuc('提交成功')
          setTimeout(() => {
            this.$router.push('/promotion/list')
            this.submitLoading = false
          }, 500);
        },
        err => {
          this.submitLoading = false
          this.$msgErr(err.msg)
        })
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/css/common';
.spec-item {
  margin-bottom: 10px;
  .spec-info {
    margin-right: 10px;
  }
}
.goods-table {
  border-radius: 4px;
  border-right: $border;
  border-bottom: $border;
  thead {
    background-color: #eeeeee;
  }
  td {
    height: 50px;
    color: $gray;
    text-align: center;
    border-left: $border;
    border-top: $border;
    padding: 0 20px;
    /deep/ .el-input__inner {
      width: 150px;
    }
  }
}
.add-spec-btn {
  width: 833px;
  margin-top: 10px;
}
</style>