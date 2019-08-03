<template>
  <div>
    <sub-title :subTitle="'商品列表'"></sub-title>
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
            <span class="font-14 gray" v-show="!visibleSearch" @click="showSearch">
              <i class="el-icon-arrow-down"></i>
              打开筛选
            </span>
            <span class="font-14 gray" v-show="visibleSearch" @click="showSearch">
              <i class="el-icon-arrow-up"></i>
              收起筛选
            </span>
            <el-button class="search" @click="search">查询结果</el-button>
          </div>
        </div>
        <div class="flex h-center" v-show="visibleSearch">
          <span class="font-14 gray">输入搜索：</span>
          <!-- clearable可一键清空输入
          placeholder为提示词
          clear在点击由clearable属性生成的清空按钮时触发
          keyup.enter点击回车键，native为封装组件需要 -->
          <el-input
            v-model="goodsName"
            @clear="search"
            @keyup.enter.native="search"
            placeholder="商品名称/商品货号"
            clearable
            class="search-input"
          ></el-input>
          <span class="font-14 gray">选择分类：</span>
          <!-- change选中值发生变化时触发 -->
          <el-select
            v-model="typeId"
            @change="search"
            placeholder="请选择商品分类"
            clearable
            class="search-input"
          >
            <!-- label为显示项 -->
            <el-option :label="item.typeName" :value="item.id" v-for="(item,value) in categoryList" :key="value"></el-option>
          </el-select>
          <span class="font-14 gray">选择品牌：</span>
          <el-select
            v-model="brandId"
            @change="search"
            placeholder="请选择商品品牌"
            clearable
            class="search-input"
          >
            <el-option :label="item.name" :value="item.id" v-for="(item,value) in brandList" :key="value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button @click="$router.push('/goods/add')">添加商品</el-button>
        </div>
      </div>
      <!-- v-loading加载时显示加载动画
      :data绑定显示的数据
      ref为全选绑定函数做准备
      selection-change单选框变换调用
      header-cell-style表头style
      cell-style表格样式
      stripe 单双行区别显示 -->
      <el-table
        class="mall-table"
        v-loading="loading"
        :data="tableData"
        ref="table"
        stripe
        @selection-change="tableSelection"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
      >
        <el-table-column type="selection" width="55" prop="id"></el-table-column>
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="商品图片">
          <!-- <template slot-scope="scope">自定义显示内容 -->
          <!-- 通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据 -->
          <template slot-scope="scope">
            <img :src="getGoodImg(scope.row.goodsImg)" alt="">
          </template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <p>{{ scope.row.goodsName }}</p>
            <p>{{ scope.row.brandName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格">
          <template slot-scope="scope">
            <p>价格：¥{{ scope.row.goodsPrice }}</p>
          </template>
        </el-table-column>
        <el-table-column label="SKU库存">
          <template slot-scope="scope">
            <img src="@/assets/icon-edit.png" alt="" @click="editStock(scope.row.id)">
          </template>
        </el-table-column>
        <el-table-column label="销量" prop="buyNum"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{ scope.row.status == 0 ? '未上架' : '已上架' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="table-btn"
              @click="outGoods(scope.row.id,scope.row.status)"
            >
              {{ scope.row.status == 0 ? '上架' : '下架'}}
            </span>
            <span class="table-btn" @click="$router.push('/goods/add?id=' + scope.row.id)">编辑</span>
            <span class="table-btn" @click="remove([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗插件
      :visible.sync为true的时候显示
      :append-to-body弹窗是否插入至 body 元素上，默认false -->
      <el-dialog title="编辑货品信息"
      :visible.sync="dialogVisible" :append-to-body="true">
        <div v-loading='dialogLoading'>
          <div class="flex h-center">
            <span>商品货号：{{ goodsNo }}</span>
          </div>
          <table class="mall-table dialog table">
            <thead>
              <td width="80" v-for="item in stockHeader" :key="item">{{ item }}</td>
              <td>销售价格</td>
              <td>商品库存</td>
              <td>库存预警值</td>
            </thead>
            <tbody>
              <tr v-for="item in stockList" :key="item">
                <td v-for="prop in item.nameValue" :key="prop">{{ prop.value }}</td>
                <td>
                  <el-input v-model="item.goodsSalePrice" type="number"></el-input>
                </td>
                <td>
                  <el-input v-model="item.goodsStock" type="number"></el-input>
                </td>
                <td>
                  <el-input v-model="item.stockWarning" type="number"></el-input>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <span class="dialog-footer" slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <!-- primary是ElementUi里的主要按钮 -->
          <el-button @click="updateStock" type="primary">确定</el-button>
        </span>
      </el-dialog>
      <!-- confirmBatch确认按钮，handleChangeAll全选，next下一页 -->
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
import subTitle from "@/components/subTitle";
import pagination from "@/components/pagination";
import mixin from "@/utils/mixin";
export default {
  name: "list",
  mixins:[mixin],
  components: {
    subTitle,
    pagination
  },
  data(){
    return {
      goodsName:'',
      checkAll:false,
      tableData:[],
      dialogVisible:false,
      optionsList:{
        delete:'删除'
      },
      checkItemId:[],
      typeId:'',
      categoryList:[],
      brandList:[],
      brandId:'',
      dialogLoading:false,
      goodsId:'',
      goodsNo:'',
      stockHeader:[],
      stockList:[],
    }
  },
  mounted(){
    this.$http.post("merchantGoodsType/query_goods_type_tree").then(res => {
      this.categoryList = res
    });
    this.$http.post("merchant_goods_brand/query_list").then(res => {
      this.brandList = res
    });
    this.getList()
  },
  methods:{
    getList(){
      this.loading = true
      this.$http
      .post("merchantGoods/merchant_goods_list_page",{
        currentPage:this.currentPage,
        pageSize:this.pageSize,
        goodsName:this.goodsName,
        typeId:this.typeId,
        brandId:this.brandId
      })
      .then(
        res => {
          this.total = res.totalCount;
          this.tableData = res.list
        },
        err => {
          this.$msgErr(err.msg)
        }
      )
      // finally 无论之前的方法执行的结果如何，都会执行
      .finally(() => {
        this.loading = false
      })
    },
    outGoods(id,status){
      if (status == 0) {
        this.$http
          .post("merchantGoods/merchant_goods_put",{
            id:id
          })
          .then(
            () => {
              this.$msgSuc('上架成功')
              this.getList()
            },
            err => {
              this.$$msgErr(err.msg)
            }
          )
      } else {
        this.$http
          .post("merchantGoods/merchant_goods_pull", {
            id:id
          })
          .then(
            () => {
              this.$msgSuc('上架成功')
              this.getList()
            },
            err => {
              this.$$msgErr(err.msg)
            }
          )
      }
    },
    remove(id){
      this.$confirm('确认删除吗？').then(() => {
        this.$http.post("merchantGoods/delete_batch", id).then(
          () => {
            this.getList()
            this.$msgSuc('删除成功！')
          },
          err => {
            this.$msgErr(err.msg)
          }
        )
      })
    },
    editStock(id){
      this.stockHeader = []
      this.dialogVisible = true
      this.dialogLoading = true
      this.$http
        .post("merchantGoods/merchant_goods_by_id", {
          id:id
        })
        .then(res => {
          this.dialogLoading = false
          this.goodsNo = res.goodsNo
          this.goodsId = id
          this.stockList = res.merchantGoodsTypePropertyList
          // map方法创建一个新数组，其结果是在调用数组中的每个元素上调用提供的函数
          res.map.map(item => {
            this.stockHeader.push(item.name)
          })
        })
    },
    updateStock(){
      for (let i = 0; i < this.stockList.length; i++) {
        if (
          !this.stockList[i].goodsSalePrice || 
          !this.stockList[i].goodsStock || 
          !this.stockList[i].stockWarning
        ) {
          this.$msgWar('请完整填写信息')
          return
        }
        this.$http
          .post("merchantGoods/merchant_goods_update_sku",{
            merchantGoodsTypePropertyList: this.stockList,
          id: this.goodsId
          })
          .then(
            () => {
              this.$msgSuc('操作成功')
              this.dialogVisible = false
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
}
.search-input {
  width: 200px;
  margin: 0 15px;
}
.box-title {
  padding-right: 20px;
  // .search-input {
  //   width: 150px;
  //   margin-left: 20px;
  // }
  // .mall-btn {
  //   margin-right: 0;
  // }
}
</style>