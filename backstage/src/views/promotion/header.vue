<template>
  <div>
    <sub-title :subTitle="'类目列表'"></sub-title>
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
            <el-button class="search" @click="
            search">查询结果</el-button>
          </div>
        </div>
        <div class="flex h-center" v-show="visibleSearch">
          <span class="font-14 gray">类目名称:</span>
          <el-input
            v-model="navName"
            placeholder="请输入类目名称"
            clearable
            @keyup.enter.native="search"
            @clear="search"
            class="search-input"
          ></el-input>
          <span class="font-14 gray">类目状态:</span>
          <el-select
            v-model="status"
            placeholder="请选择类目状态"
            clearable
            @change="search"
            class="search-input"
          >
            <el-option
              v-for="(item,index) in recommendStatus"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
        <div class="flex h-center">
          <el-button v-if="second" @click="switchQuery(false)">返回</el-button>
          <el-button @click="$router.push('addHeader')">添加类目</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        @selection-change="tableSelection"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        class="mall-table"
        ref="table"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" prop="id"></el-table-column>
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="类目名称" prop="navName"></el-table-column>
        <el-table-column label="图标" v-if="!second" :key="952">
          <template slot-scope="scope">
            <img :src="getGoodImg(scope.row.navIcon)" alt>
          </template>
        </el-table-column>
        <el-table-column label="级别">
          <template slot-scope="scope">
            {{ scope.row.parentId == '0'?'一级':'二级' }}
          </template>
        </el-table-column>
        <el-table-column label="是否推荐">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#5BC0BF"
              inactive-color="#dedede"
              :active-value="0"
              :inactive-value="2"
              @change="handleShow($event, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.navSort"
              @blur="handleNavSort($event, scope.row)"
              class="text-center"
              size="small"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.status == 2 ? '未推荐' : '推荐中' }}
          </template>
        </el-table-column>
        <el-table-column label="设置" width="200" v-if="!second" :key="9527">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push({path:'/promotion/addHeader', query: {parentId: scope.row.id}})">新增下级</span>
            <span class="table-btn" @click="switchQuery(true, scope.row.id)">查看下级</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="setTop(scope.row.id, scope.row.navTop)">{{ scope.row.navTop == 0 ? '置顶' : '取消置顶'}}</span>
            <span class="table-btn" @click="remove([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :isClear="true"
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
import subTitle from '@/components/subTitle';
import mixin from '@/utils/mixin';
import filters from '@/utils/filters';
import pagination from '@/components/pagination';
export default {
  name: 'headerList',
  mixins: [mixin],
  filters: filters,
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      navName: "",
      status: "",
      tableData: [],
      headerId: 0,
      second: false,
      recommendStatus: filters.recommendStatus,
      optionsList: {
        hide: "取消推荐",
        show: "设为推荐",
        delete: "删除"
      }
    }
  },
  created(){
    this.getList()
  },
  methods:{
    getList(){
      this.loading = true
      this.$http
        .post('merchantNavigation/merchant_navigation_list_page', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          parentId: this.headerId,
          navName: this.navName,
          status: this.status
        })
        .then(res => {
          this.tableData = res.list
          this.total = res.totalCount
        })
        .finally(() => {
          this.loading = false
        })
    },
    switchQuery(status, id) {
      this.currentPage = 1
      if (status) {
        this.second = true
        this.headerId = id
      } else {
        this.second = false
        this.headerId = 0
      }
      this.getList()
    },
    handleShow($event, data) {
      let ruleForm = {
        id: data.id,
        navName: data.navName,
        parentId: data.parentId,
        navSort: data.navSort,
        status: $event,
        navIcon: data.navIcon,
        navDesc: data.navDesc
      }
      this.$http
        .post("merchantNavigation/merchant_navigation_add", ruleForm)
        .then(
          () => {
            this.$msgSuc("操作成功")
          },
          err => {
            this.$msgErr(err.msg)
          }
        );
    },
    handleNavSort($event, data) {
      // $event.target事件起源目标
      if ($event.target.value < 0 || $event.target.value > 999) {
        this.$msgWar("排序在0 - 999之间")
        return
      }
      let ruleForm = {
        id: data.id,
        navName: data.navName,
        parentId: data.parentId,
        navSort: $event.target.value,
        status: data.status,
        navIcon: data.navIcon,
        navDesc: data.navDesc
      };
      this.$http
        .post("merchantNavigation/merchant_navigation_add", ruleForm)
        .then(
          () => {
            this.$msgSuc("操作成功")
            this.getList()
          },
          err => {
            this.$msgErr(err.msg)
          }
        );
    },
    setTop(id, status) {
      this.$http
        .post("merchantNavigation/set_nav_top", {
          id: id,
          navTop: status == 0 ? "" : 0
        })
        .then(
          () => {
            this.$msgSuc("操作成功");
            this.getList()
          },
          err => {
            this.$msgSuc(err.msg)
          }
        )
    },
    remove(id) {
      this.$confirm('确认删除吗？').then(() => {
        this.$http
          .post('merchantNavigation/merchant_nav_batch', {
            ids: id,
            oprate:1
          })
          .then(() => {
            this.$msgSuc("删除成功")
            this.getList()
          },
          err => {
            this.$msgErr(err.msg)
          })
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
}
.search-input {
  width: 200px;
  margin: 0 15px;
}
.box-title {
  padding-right: 20px;
}
.text-center {
  /deep/ .el-input__inner {
    text-align: center;
  }
}
</style>