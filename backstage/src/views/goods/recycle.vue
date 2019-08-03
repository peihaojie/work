<template>
  <div>
    <sub-title :subTitle="'商品回收站'" ></sub-title>
    <div class="body">
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
          <span class="font-14 gray">输入搜索：</span>
          <el-input
            v-model="goodsName"
            placeholder="商品名称/商品货号"
            class="search-input"
            clearable
            @keyup.enter.native="search"
            @clear="search"
          ></el-input>
          <span class="font-14 gray">选择分类：</span>
          <el-select
            v-model="typeId"
            @change="search"
            placeholder="请选择商品分类"
            clearable
            class="search-input"
          >
            <el-option :label="item.name" :value="item.id" v-for="(item,index) in categoryList" :key="index"></el-option>
          </el-select>
          <span class="font-14 gray">选择品牌：</span>
          <el-select
            v-model="brandId"
            @change="search"
            placeholder="请选择商品品牌"
            class="search-input"
            clearable
          >
            <el-option :label="item.name" :value="item.id" v-for="(item,index) in brandList" :key="index"></el-option>
          </el-select>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
      </div>
      <el-table
        :data="tableData"
        class="mall-table"
        v-loading="loading"
        ref="table"
        stripe
        :cell-style="tdStyle"
        :header-cell-style="headerStyle"
        @selection-change="tableSelection"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" width="100" prop="id"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <img :src="getGoodImg(scope.row.goodsImg)" alt="">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="商品分类" prop="typeName"></el-table-column>
        <el-table-column label="价格" prop="goodsPrice"></el-table-column>
        <el-table-column label="货号" prop="goodsNo"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="update(scope.row.id)">还原</span>
            <span class="table-btn" @click="remove([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        ref="pagination"
        :total="total"
        :pageSize="pageSize"
        @handleChangeAll="handleChangeAll"
        :optionsList="optionsList"
        @next="next"
        @confirmBatch="confirmBatch"
      ></pagination>
    </div>
  </div>
</template>

<script>
import subTitle from "@/components/subTitle"
import pagination from "@/components/pagination"
import mixin from "@/utils/mixin"

export default {
  name:"recycle",
  mixins:[mixin],
  components:{
    subTitle,
    pagination
  },
  data() {
    return {
      input: "",
      total: 0,
      pagesize1: 1,
      tableData: [],
      checkItemId: [],
      optionsList: {
        delete: "删除",
        restore: "还原"
      },
      typeId: "",
      categoryList: [],
      goodsName: "",
      brandList: [],
      brandId: ""
    };
  },
  mounted(){
    this.$http.post("merchantGoodsType/query_goods_type_tree")
    .then(res => {
      this.categoryList = res
    })
    this.$http.post("merchant_goods_brand/query_list").then(res => {
      this.brandList = res
    })
    this.getList()
  },
  methods:{
    getList() {
      this.loading = true;
      this.$http
        .post("/merchantGoods/merchant_goods_recycling", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          goodsName: this.goodsName,
          typeId: this.typeId,
          brandId: this.brandId
        })
        .then(res => {
          this.total = res.totalCount;
          this.tableData = res.list;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    remove(id){
      // confirm() 方法用于显示一个带有指定消息和 OK 及取消按钮的对话框
      this.$confirm('确认删除吗？').then(() => {
        this.$http.post("/merchantGoods/delete_batch_recycling", id).then(() => {
          this.getList()
          this.$msgSuc('删除成功')
        }),
        err => {
          this.$msgErr(err.msg)
        }
      })
    },
    update(id){
      this.$confirm('确认还原吗？').then(() => {
        this.$http.post("/merchantGoods/merchant_goods_recycling_reduction",{
          id:id
        })
        .then(() => {
          this.getList()
          this.$msgSuc('还原成功')
        })
      },
      err => {
        this.$msgErr(err.msg)
      })
    },
    restore(id){
      this.$confirm('确认还原吗？').then(() => {
        this.$http.post('("merchantGoods/merchant_goods_batch_reduction", id')
        .then(() => {
          this.getList()
          this.$msgSuc('还原成功')
        })
      },
      err => {
        this.$msgErr(err.msg)
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/css/common";
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