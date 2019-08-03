<template>
  <div>
    <sub-title :subTitle="'商品入库'"></sub-title>
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
            <el-button class="search" @click="search">查询结果</el-button>
          </div>
        </div>
        <div class="flex h-center" v-show="visibleSearch">
          <span class="font-14 gray">输入搜索:</span>
          <el-input
            v-model="name"
            placeholder="商品名称/商品货号"
            class="search-input"
            @keyup.enter.native="search"
            clearable
            @clear="search"
          ></el-input>
          <span class="font-14 gray">操作类型:</span>
          <el-select
            v-model="operateType"
            class="search-input"
            placeholder="请选择操作类型"
            @change="search"
            clearable
          >
            <el-option
              v-for="(item,index) in stockTypeList"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <span class="font-14 gray">操作时间：</span>
          <el-date-picker
            v-model="datePicker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleDate"
          ></el-date-picker>
        </div>
      </div>
      <div class="box-title flex h-center between">
        <span class="font-20">数据列表</span>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        class="mall-table"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        ref="table"
      >
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <img :src="getGoodImg(scope.row.goodsImg)" alt="">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="属性" prop="property"></el-table-column>
        <el-table-column label="订单号" prop="orderCode"></el-table-column>
        <el-table-column label="库存">
          <template slot-scope="scope">
            {{`数量:${ scope.row.changeNumber }
            剩余:${ scope.row.changeAfter }`}}
          </template>
        </el-table-column>
        <el-table-column label="操作类型" prop="typeName"></el-table-column>
        <el-table-column label="操作信息" prop="createTime"></el-table-column>
      </el-table>
      <pagination :isBatch="false" @next="next" :total="total" :pageSize="pageSize"></pagination>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
import mixin from '@/utils/mixin';
import pagination from '@/components/pagination';
export default {
  name: 'stockIn',
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      name: "",
      beginTime: "",
      endTime: "",
      operateType: "",
      tableData: [],
      datePicker: []
    }
  },
  mounted(){
    this.getStockType(1)
    this.getList()
  },
  methods:{
    getList(){
      this.loading = true
      this.$http
        .post('merchant_goods_log/query_for_page', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          search: this.name,
          operateType: this.operateType,
          beginTime: this.beginTime,
          endTime: this.endTime,
          type: 1
        })
        .then(res => {
          this.tableData = res.list
          this.total = res.totalCount
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
  .search-input {
    width: 200px;
    margin: 0 15px;
  }
}
</style>