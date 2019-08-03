<template>
  <div>
    <sub-title :subTitle="'操作日志'"></sub-title>
    <div class='body'>
      <div class="filter-wrap">
        <div class="flex h-center between">
          <div>
            <img src="@/assets/order/search.png" alt="">
            <span class="font-14 gray">筛选查询</span>
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
          <span class="font-14 gray">操作日期:</span>
          <el-date-picker
            v-model="value1"
            type="date"
            align="right"
            clearable
            placeholder="选择日期"
            class="select-time"
            value-format="yyyy-MM-dd hh:mm:ss"
            :picker-options="pickerOptions1"
            @change="getList(1)"
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
        v-loading="loading"
      >
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="操作者" prop="operator"></el-table-column>
        <el-table-column label="操作日期" prop="operationDate"></el-table-column>
        <el-table-column label="IP地址" prop="ip"></el-table-column>
        <el-table-column label="操作记录" prop="operationRecord"></el-table-column>
      </el-table>
      <pagination @next="next" :isBatch="false" :total="total"></pagination>
    </div>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
import mixin from '@/utils/mixin';
import pagination from '@/components/pagination';
export default {
  name: 'accountSetting',
  mixins: [mixin],
  components: {
    subTitle,
    pagination
  },
  data() {
    return {
      input: "",
      tableData: [],
      options: [],
      total: 1,
      pageSize: 10,
      inputselect: "",
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value1: ""
    }
  },
  mounted(){
    this.getList(1)
  },
  methods: {
    getList(pageSize11) {
      this.loading = true
      this.$http
        .post('/user_operation_log/query_user_operation_log', {
          currentPage: pageSize11,
          pageSize: this.pageSize,
          operationDate: this.value1 || null,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
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
    },
    naxt(val) {
      this.getList(val)
    },
    search() {
      this.getList(1)
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/css/common';
em {
  font-style: normal;
  color: red;
}

.box-title {
  border: 1px solid #b4b4b4;
  border-bottom-color: transparent;
}

.filter-wrap {
  border: $border;
  margin-bottom: 24px;
  img {
    width: 20px;
    margin-bottom: -6px;
  }
  > div {
    padding: 0 22px;
    height: 56px;
    &:last-child {
      background-color: $bgColor;
    }
  }
  .el-input {
    width: 200px;
    margin: 0 15px;
  }
}

.search {
  margin-left: 10px;
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}

.gray {
  margin: 0 10px;
}
</style>