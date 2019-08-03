<template>
  <div>
    <sub-title :subTitle="'商品评价'"></sub-title>
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
            class="search-input"
            v-model="goodsName"
            placeholder="关键字/商品名称"
            clearable
            @clear="search"
            @keyup.enter.native="search"
          ></el-input>
          <span class="font-14 gray">用户昵称：</span>
          <el-input
            class="search-input"
            placeholder="输入用户昵称"
            v-model="userName"
            @clear="search"
            @keyup.enter.native="search"
            clearable
          ></el-input>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
      </div>
      <el-table
        class="mall-table"
        :data="tableData"
        v-loading="loading"
        ref="table"
        stripe
        :cell-style="tdStyle"
        :header-cell-style="headerStyle"
        @selection-change="tableSelection"
      >
        <el-table-column type="selection" width="100"></el-table-column>
        <el-table-column label="编号" width="100" prop="id"></el-table-column>
        <el-table-column label="用户昵称" prop="userName"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="评价" width="140">
          <template slot-scope="scope">
            <img
              v-for="(item,index) in scope.row.commentLevel"
              :key="index"
              src="@/assets/starOn.png"
              class="icon-star"
            >
            <img
              v-for="(item,index) in scope.row.commentLevel1"
              :key="index+100"
              src="@/assets/starOff.png"
              class="icon-star"
            >
          </template>
        </el-table-column>
        <el-table-column label="IP地址" width="140" prop="commentIp"></el-table-column>
        <el-table-column label="评论时间" width="180" prop="createTime"></el-table-column>
        <el-table-column label="是否显示" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#5BC0BF"
              inactive-color="#ff4949"
              :active-value="0"
              :inactive-value="2"
              @change="handleStatus($event,scope.row.id)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="table-btn"
              @click="$router.push('/goods/comment/detail?id=' + scope.row.id)"
            >查看</span>
            <span class="table-btn" @click="remove([scope.row.id])">删除</span>
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
import subTitle from "@/components/subTitle";
import pagination from "@/components/pagination";
import mixin from "@/utils/mixin";
export default {
  name: "comment",
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      tableData: [],
      total: 1,
      checkItemId: [],
      optionsList: {
        delete: "删除"
      },
      goodsName: "",
      userName: ""
    };
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      this.loading = true
      this.$http
        .post("/merchantGoodsComment/merchant_goods_type_list_page", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          goodsName: this.goodsName,
          userName: this.userName
        })
        .then(res => {
          this.total = res.totalCount
          for (let i = 0; i < res.list.length; i++) {
            res.list[i].commentLevel1 = 5 - res.list[i].commentLevel
          }
          this.tableData = res.list
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleStatus($event,id){
      this.$http
        .post("/merchantGoodsComment/delete_not_show",{
          id:id,
          status:$event
        })
        .then(
          res => {
            this.$msgSuc('操作成功')
          },
          err => {
            this.$msgErr(err.msg)
          }
        )
    },
    remove(id){
      this.$confirm("确认删除吗?").then(() => {
        this.$http.post("/merchantGoodsComment/delete_batch", id).then(res => {
          this.$msgSuc("删除成功")
          this.getList()
        })
      })
    }
  }
};
</script>

<style lang='scss' scoped>
@import "~@/assets/css/common";
.filter-wrap{
  border:$border;
  margin-bottom: 24px;
  >div{
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
.icon-star{
  display: inline!important;
}
</style>