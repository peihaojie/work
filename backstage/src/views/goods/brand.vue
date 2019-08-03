<template>
  <div>
    <sub-title :subTitle="'商品品牌'"></sub-title>
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
            placeholder="品牌名称/关键字"
            class="search-input"
            clearable
            @key.enter.native="search"
            @blur="search"
          ></el-input>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="$router.push('/goods/brand/addBrand')">添加品牌</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        ref="table"
        @selection-change="tableSelection"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        class="mall-table"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="品牌名称" prop="name"></el-table-column>
        <el-table-column label="品牌首字母" prop="firstChar"></el-table-column>
        <el-table-column label="排序" prop="sorting"></el-table-column>
        <el-table-column label="是否显示">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShow"
              :active-value="1"
              :inactive-value="0"
              active-color="#5BC0BF"
              inactive-color="#ff4949"
              @change="handleShow($event, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="相关" prop="goodsTotal"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push({path:'/goods/brand/addBrand',query:{id:scope.row.id}})">编辑</span><span class="table-btn" @click="remove([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        @handleChangeAll="handleChangeAll"
        :optionsList="optionsList"
        ref="pagination"
        @confirmBatch="confirmBatch"
        @next="next"
        :total="total"
        :pageSize="pageSize"
      ></pagination>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle'
import pagination from '@/components/pagination'
import mixin from '@/utils/mixin'
export default {
  name:'brand',
  mixins:[mixin],
  components:{
    subTitle,
    pagination
  },
  data(){
    return {
      tableData:[],
      name:'',
      isShow:true,
      checkIetmId:[],
      optionsList:{
        delete:'删除',
        show:'显示品牌',
        hide:'隐藏品牌'
      }
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      this.$http
        .post('merchant_goods_brand/query_for_page', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          name: this.name
        })
        .then(res => {
          this.tableData = res.list
          this.total = res.totalCount
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleShow($event, data){
      let form = {
        id: data.id,
        name: data.name,
        logo: data.logo,
        areaLogo: data.areaLogo,
        story: data.story,
        isShow: $event,
        sorting: data.sorting,
        firstChar: data.firstChar
      }
      this.$http.post('merchant_goods_brand/update', form).then(
        () => {
          this.$msgSuc('操作成功')
        },
        err => {
          this.$msgErr(err.msg)
        }
      )
    },
    remove(id){
      this.$confirm('确认删除吗?').then(() => {
        this.$http.post('merchant_goods_brand/delete_batch', id).then(
          () => {
            this.getList()
            this.$msgSuc('删除成功')
          },
          err => {
            this.$magErr(err.msg)
          }
        )
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@import "~@/assets/css/common";
.filter-wrap{
  border: $border;
  margin-bottom: 24px;
  // a>b 选择父元素为a的所有b元素
  > div{
    padding: 0 22px;
    height: 56px;
    &:last-child{
      background-color: $bgColor;
    }
  }
  .search{
    margin-left: 20px;
    margin-right: 0;
  }
  .search-input{
    width: 200px;
    margin: 0 15px;
  }
}
.box-title{
  padding-right: 20px;
}
</style>