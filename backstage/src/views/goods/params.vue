<template>
  <div>
    <sub-title :subTitle="'参数列表'"></sub-title>
    <div class="body">
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="back">返回</el-button>
          <el-button @click="$router.push('/goods/type/addParams')">添加参数</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        ref="table"
        stripe
        @selection-change="tableSelection"
        class="mall-table"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" prop="id" width="80"></el-table-column>
        <el-table-column label="参数名称" prop="paramName"></el-table-column>
        <el-table-column label="商品类型" prop="styleName" width="120"></el-table-column>
        <el-table-column label="参数录入方式" width="120">
          <template slot-scope="scope">
            {{ scope.row.paramSelect | getPropSelect}}
          </template>
        </el-table-column>
        <el-table-column label="可选值列表" prop="paramList"></el-table-column>
        <el-table-column label="排序" prop="paramSort" width="120"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push('/goods/type/addParams?id=' + scope.row.id)">编辑</span><span class="table-btn" @click="remove([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        @confirmBatch="confirmBatch"
        @handleChangeAll="handleChangeAll"
        @next="next"
        :optionsList="optionsList"
        :total="total"
        :pageSize="pageSize"
        ref="pagination"
      ></pagination>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle'
import mixin from '@/utils/mixin'
import pagination from '@/components/pagination'
import filters from '@/utils/filters'
export default {
  name:'params',
  mixins:[mixin],
  filters:filters,
  components:{
    subTitle,
    pagination
  },
  data(){
    return {
      tableData:[],
      optionsList:{
        delete:'删除'
      },
      checkItemId:[]
    }
  },
  mounted(){
    this.getList('merchantGoodsParam/merchant_goods_property_list_page',{
      styleId:this.$route.params.id
    })
  },
  methods:{
    remove(id){
      this.$confirm('确认删除吗？').then(() => {
        this.$http.post("merchantGoodsParam/delete_batch", id)
        .then(
          () => {
            this.getList(
              "merchantGoodsParam/merchant_goods_property_list_page",
              { styleId: this.$route.params.id }
            )
            this.$msgSuc('删除成功')
          },
          err => {
            this.$msgErr(err.msg)
          }
        )
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@import "~@/assets/css/common";
.box-title{
  padding-right: 20px;
}
</style>