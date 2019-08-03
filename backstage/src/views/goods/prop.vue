<template>
  <div>
    <sub-title :subTitle="'属性列表'"></sub-title>
    <div class="body">
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="back">返回</el-button>
          <el-button @click="$router.push('/goods/type/addProp')">添加属性</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        ref="table"
        class="mall-table"
        v-loading="loading"
        @selection-change="tableSelection"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" width="80" prop="id"></el-table-column>
        <el-table-column label="属性名称" prop="propertyName"></el-table-column>
        <el-table-column label="商品类型" prop="styleName" width="120"></el-table-column>
        <el-table-column label="属性是否可选" width="120">
          <template slot-scope="scope">{{ scope.row.propertySelect | getPropSelect }}</template>
        </el-table-column>
        <el-table-column label="可选值列表" prop="propertyList"></el-table-column>
        <el-table-column label="排序" prop="propertyOrder" width="120"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="remove([scope.row.id])">删除</span>
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
  name:'prop',
  mixins:[mixin],
  // 过滤器,可被用于一些常见的文本格式化
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
    this.getList("merchantGoodsProperty/merchant_goods_property_list_page",{
      styleId:this.$route.params.id
    })
  },
  methods:{
    remove(id){
      this.$confirm('确认删除吗？').then(() => {
        this.$http.post("merchantGoodsProperty/delete_batch",id)
        .then(
          () => {
            this.getList('merchantGoodsProperty/merchant_goods_property_list_page',{styleId:this.$route.params.id})
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