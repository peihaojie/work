<template>
  <div>
    <sub-title :subTitle="'商品图片库'"></sub-title>
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
          <span class="font-14 gray">输入搜索:</span>
          <el-input
            v-model="name"
            placeholder="相册名称关键字"
            @keyup.enter.native="search"
            @blur="search"
            clearable
            class="search-input"
          ></el-input>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="$router.push('/goods/image/addImage')">添加相册</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        ref="table"
        class="mall-table"
        :cell-style="tdStyle"
        :header-cell-style="headerStyle"
        @selection-change="tableSelection"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="相册名称" prop="name"></el-table-column>
        <el-table-column label="封面">
          <template slot-scope="scope">
            <img :src="getGoodImg(scope.row.cover)" alt="">
          </template>
        </el-table-column>
        <el-table-column label="图片数量" prop="imgTotal"></el-table-column>
        <el-table-column label="排序" prop="sorting"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push('/goods/image/' + scope.row.id)">查看</span>
            <span class="table-btn" @click="$router.push({path:'/goods/image/addImage',query:{id:scope.row.id}})">编辑</span>
            <span class="table-btn" @click="remove([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle'
import mixin from '@/utils/mixin'
import pagination from '@/components/pagination'
export default {
  name:'list',
  mixins:[mixin],
  components:{
    subTitle,
    pagination
  },
  data(){
    return {
      name:'',
      tableData:[],
      optionsList:{
        delete:'删除'
      },
      checkItemId:[]
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      this.$http
        .post('merchant_goods_galleries/query_for_page', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          name: this.name
        })
        .then(res => {
          this.tableData = res.list
          this.total = res.totalCount
        })
    },
    remove(id){
      this.$confirm('确定删除吗？').then(
        () => {
          this.$http.post('merchant_goods_galleries/delete_batch', id).then(
          () => {
            this.getList()
            this.$msgSuc('删除成功')
          },
          err => {
            this.$msgErr('err.msg')
          }
        )
        }
      )
    }
  }
}
</script>

<style lang='scss' scoped>
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
.box-title {
  padding-right: 20px;
}
</style>