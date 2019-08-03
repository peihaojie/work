<template>
  <div>
    <sub-title :subTitle="'商品分类'"></sub-title>
    <div class="body">
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button v-if="second" @click="getList()">返回</el-button>
          <el-button @click="$router.push('category/addCategory')">添加分类</el-button>
        </div>
      </div>
      <el-table
        class="mall-table"
        :data="tableData"
        :cell-style="tdStyle"
        :header-cell-style="headerStyle"
        v-loading = "loading"
      >
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="分类名称" prop="typeName"></el-table-column>
        <el-table-column label="级别">
          <template slot-scope="scope">
            {{scope.row.parentId == '0'?'一级':'二级'}}
          </template>
        </el-table-column>
        <el-table-column label="商品数量" prop="goodsNum"></el-table-column>
        <el-table-column label="数量单位" prop="goodsUnit"></el-table-column>
        <el-table-column label="是否显示">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.showStatus"
              :active-value="0"
              :inactive-value="1"
              active-color="#5BC0BF"
              inactive-color="#dedede"
              @change="handleShow($event, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="goodsSort"></el-table-column>
        <el-table-column label="设置" width="260">
          <template slot-scope="scope">
            <span class="table-btn" @click="shiftGoods(scope.row.id)">转移商品</span>
            <span
              class="table-btn"
              @click="$router.push('/goods/category/addCategory?parentId=' + scope.row.id)"
              v-if="scope.row.parentId == 0"
            >新增下级</span>
            <span
              class="table-btn"
              @click="getList(scope.row.id)"
              v-if="scope.row.parentId == 0"
            >查看下级</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push('category/addCategory?id=' + scope.row.id)">编辑</span>
            <span class="table-btn" @click="remove(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :isBatch="false" @next="next" :total="total" :pageSize="pageSize"></pagination>
      <el-dialog title="转移商品" :visible.sync="dialogVisible" :append-to-body="true">
        <div class="flex">
          <div class="flex-1">
            <p>原商品分类：</p>
            <el-select v-model="originalId" disabled placeholder="请选择商品分类" class="search-input">
              <el-option :value="item.id" :label="item.typeName" v-for="(item,index) in addCategoryList" :key="index"></el-option>
            </el-select>
          </div>
          <div class="flex-1">
            <p>目标商品分类:</p>
            <el-select v-model="lastId" placeholder="请选择商品分类">
              <el-option :value="item.id" :label="item.typeName" v-for="(item,index) in addCategoryList" :key="index"></el-option>
            </el-select>
          </div>
        </div>
        <span class="dialog-footer" slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button @click="updateCategoryGoods">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle'
import pagination from '@/components/pagination'
import mixin from '@/utils/mixin'
export default {
  name:'category',
  mixins:[mixin],
  components:{
    subTitle,
    pagination
  },
  data(){
    return {
      tableData: [],
      dialogVisible: false,
      second: false,
      originalId: "",
      lastId: "",
      addCategoryList: []
    }
  },
  mounted(){
    this.getList()
    this.$http.post("merchantGoodsType/merchant_goods_type_list").then(res => {
      this.addCategoryList = res
    })
  },
  methods:{
    getList(id){
      var parentId
      if (id) {
        parentId = id
        this.childCategoryId = id
        this.second = true
      } else {
        parentId = 0
        this.second = false
      }
      this.loading = true
      this.currentPage = 1
      this.$http
        .post("merchantGoodsType/merchant_goods_type_list_page",{
          parentId: parentId,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          this.tableData = res.list
          this.total = res.totalCount
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleShow($event,data){
      let form = {
        id: data.id,
        typeName: data.typeName,
        parentId: data.parentId,
        goodsUnit: data.goodsUnit,
        goodsSort: data.goodsSort,
        showStatus: $event,
        typeIcon: data.typeIcon
      }
      this.$http
        .post("merchantGoodsType/merchant_goods_type_update", form)
        .then(
          () => {
            this.$msgSuc('操作成功')
          },
          err => {
            this.$msgErr(err.msg)
          }
        )
    },
    next(){
      if (this.second) {
        this.getList(this.childCategoryId)
      } else {
        this.getList()
      }
    },
    shiftGoods(id){
      this.dialogVisible = true
      this.originalId = id
    },
    updateCategoryGoods(){
      this.$http
        .post("merchantGoodsType/merchant_goods_type_transfer",{
          originalId: this.originalId,
          lastId: this.lastId
        })
        .then(
          () => {
            this.$msgSuc('操作成功')
            this.getList()
            this.dialogVisible = false
          },
          err => {
            this.$msgErr(err.msg)
          }
        )
    },
    remove(id){
      this.$confirm('确认删除吗？').then(() => {
        this.$http.post("merchantGoodsType/merchant_goods_type_delete",{id:id})
        .then(() => {
          this.$msgSuc('删除成功')
          this.getList()
        })
      })
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
}
.box-title {
  padding-right: 20px;
  .search-input {
    width: 150px;
    margin-left: 20px;
  }
  .mall-btn:last-child {
    margin-right: 0;
  }
}
.search-input {
  width: 200px;
  margin-top: 20px;
}
</style>