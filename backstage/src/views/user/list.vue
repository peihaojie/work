<template>
  <div>
    <sub-title :subTitle="'用户列表'"></sub-title>
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
          <span class="font-14 gray">用户昵称:</span>
          <el-input
            v-model="realName"
            placeholder="请输入昵称"
            clearable
            @keyup.enter.native="search"
            @clear="search"
            class="search-input"
          ></el-input>
          <span class="font-14 gray">用户手机:</span>
          <el-input
            v-model="mobilePhone"
            placeholder="请输入手机号"
            clearable
            @keyup.enter.native="search"
            @clear="search"
            class="search-input"
          ></el-input>
          <span class="font-14 gray">注册时间:</span>
          <el-date-picker
            v-model="datePicker"
            @change="getList"
            type="daterange"
            clearable
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="margin-left: 20px;"
          ></el-date-picker>
        </div>
      </div>
      <div class="box-title flex between h-center">
        <span class="font-20">数据列表</span>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="headerStyle"
        :cell-style="tdStyle"
        class="mall-table"
        ref="table"
        v-loading="loading"
      >
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="微信头像">
          <template slot-scope="scope">
            <img :src="getGoodImg(scope.row.headImg)" alt="">
          </template>
        </el-table-column>
        <el-table-column label="微信号" prop="mobilePhone"></el-table-column>
        <el-table-column label="微信昵称" prop="userName"></el-table-column>
        <el-table-column label="openId" prop="openId"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="$router.push({name:'userInfo',params:{id: scope.row.id}})">查看</span>
          </template>
        </el-table-column>
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
  name: 'user',
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      tableData: [],
      realName: "",
      mobilePhone: "",
      datePicker: [],
      beginTime: "",
      endTime: ""
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      if (this.datePicker && this.datePicker.length > 0) {
        this.beginTime = this.datePicker[0]
        this.endTime = this.datePicker[1]
      } else {
        this.datePicker = []
        this.beginTime = ''
        this.endTime = ''
      }
      this.loading = true
      this.$http
        .post('user_detail/list', {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          mobilePhone: this.mobilePhone || null,
          realName: this.realName || null,
          beginTime: this.beginTime || null,
          endTime: this.endTime || null
        })
        .then(res => {
          this.tableData = res.list
          this.total = res.totalCount
        },
        err => {
          this.$msgErr(err.msg)
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