<template>
  <div>
    <sub-title :subTitle="'交易统计'"></sub-title>
    <div class='body clearfix'>
      <div class="form-item left">
        <div class="showarea">
          <div class="title">关键KPI</div>
          <div class="content clearfix">
            <div class="content-item left clearfix">
              <p>总参考用户数</p>
              <p>99999</p>
            </div>
            <div class="content-item left clearfix">
              <p>新用户数</p>
              <p>99999</p>
            </div>
            <div class="content-item left clearfix">
              <p>总扫码量</p>
              <p>99999</p>
            </div>
            <div class="content-item left clearfix">
              <p>人均扫码数</p>
              <p>99999</p>
            </div>
            <div class="content-item left clearfix">
              <p>销售量</p>
              <p>99999</p>
            </div>
          </div>
        </div>
      </div>
      <div class="form-item left">
        <div class="showarea">
          <div class="title">平台用户趋势</div>
          <div class="selection clearfix">
            <p class="selection-title">选择指数:</p>
            <div class="selection-option clearfix">
              <div class="active">参与用户数</div>
              <div>参与次数</div>
            </div>
            <div class="chartItem" id="userCharts" ref="userCharts"></div>
          </div>
        </div>
      </div>
      <div class="form-item left">
        <div class="showarea">
          <div class="title">平台活动表现</div>
          <div class="selection clearfix">
            <p class="selection-title">选择指数:</p>
            <div class="selection-option clearfix">
              <div class="active">参与用户数</div>
              <div>参与次数</div>
            </div>
            <div class="chartItem" id="activeCharts" ref="activeCharts"></div>
          </div>
        </div>
      </div>
      <div class="form-item left">
        <div class="showarea">
          <div class="title">用户参与时刻分析</div>
          <div class="selection clearfix">
            <p class="selection-title">选择指数:</p>
            <div class="selection-option clearfix">
              <div class="active">参与用户数</div>
              <div>参与次数</div>
            </div>
            <div class="chartItem" id="joinCharts" ref="joinCharts"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import subTitle from '@/components/subTitle';
import echarts from 'echarts';
export default {
  components: {
    subTitle
  },
  data() {
    return {
      userChart: null,
      activeCharts: null,
      joinCharts: null,
      bmapCharts: null
    }
  },
  mounted(){
    this.initUserChart();
    this.initActiveCharts();
    this.initJoinChart();
  },
  beforeDestroy(){
    this.userChart.dispose();
    this.userChart = null;
    this.activeCharts.dispose();
    this.activeCharts = null;
    this.joinCharts.dispose();
    this.joinCharts = null;
  },
  methods: {
    initUserChart(){
      this.userChart = echarts.init(this.$refs.userCharts)
      this.userChart.setOption({
        grid: {
          top: "5%",
          left: "5%",
          right: "0%",
          bottom: "10%",
          containLabel: true
        },
        xAxis:{
          type: 'category',
          data: ["第一季度", "第二季度", "第三季度", "第四季度"],
          name: '时间',
          nameGap: 20,
          nameLocation: 'center'
        },
        yAxis: {
          type: 'value',
          data: [0, 1500, 3000, 4500, 6000],
          name: '人数',
          nameGap: 40,
          nameLocation: 'center'
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "cross"
          }
        },
        series: [
          {
            data: [0,932,1290,1330],
            type:'line'
          }
        ]
      })
    },
    initActiveCharts(){
      this.activeCharts = echarts.init(this.$refs.activeCharts)
      this.activeCharts.setOption({
        grid: {
          top: "20%",
          left: "5%",
          right: "0%",
          bottom: "0%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          x: 'right',
          y: 'top',
          padding: 10,
          itemGap: 20,
          data: ['活动一','活动二'],
          backgroundColor: '#fff'
        },
        xAxis: {
          type: 'category',
          data: ["第一季度", "第二季度", "第三季度", "第四季度"]
        },
        yAxis: {
          type: 'value',
          data: [0, 1500, 3000, 4500, 6000],
          name: '人数',
          nameLocation: 'center',
          nameGap: 40
        },
        series:[
          {
            name: "活动一",
            type: "line",
            data: [120, 132, 101, 134]
          }, {
            name: "活动二",
            type: "line",
            data: [110, 182, 191, 234]
          }
        ]
      })
    },
    initJoinChart() {
      this.joinCharts = echarts.init(this.$refs.joinCharts);
      // 把配置和数据放这里
      this.joinCharts.setOption({
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: "10%",
          left: "5%",
          right: "0%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["第一季度", "第二季度", "第三季度", "第四季度"],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            // type : 'value'
            name: "人数",
            nameLocation: "middle",
            nameGap: 40,
            type: "value",
            data: [0, 1500, 3000, 4500, 6000]
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: "50%",
            data: [210, 52, 200, 334]
          }
        ]
      });
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/css/common';
.left {
  float: left;
}
.clearfix {
  zoom: 1;
  :after {
    display: block;
    content: "";
    height: 0;
    clear: both;
    visibility: hidden;
    overflow: hidden;
  }
}
.form-item {
  width: 540px;
  height: auto;
  padding: 14px 14px;
  background-color: #efefef;
  .showarea {
    padding: 10px 20px;
    width: 500px;
    height: 300px;
    background-color: #fff;
  }
  .title {
    line-height: 40px;
    font-size: 17px;
    font-weight: bold;
  }
  .content {
    margin-top: 10px;
    .content-item {
      width: 50%;
      line-height: 45px;
      font-size: 15px;
    }
    p {
      width: 45%;
      float: left;
      margin-left: 5%;
    }
  }
  .selection {
    margin-top: 8px;
    font-size: 12px;
    line-height: 30px;
    .selection-title {
      float: left;
    }
    .selection-option {
      float: left;
      margin-left: 18px;
      div {
        float: left;
        border: 1px solid #eee;
        width: 120px;
        text-align: center;
      }
      :hover {
        cursor: pointer;
      }
      .active {
        border: none;
        background: #5bc0bf;
        color: #fff;
      }
    }
  }
  .chartItem {
    width: 100%;
    height: 200px;
    margin-top: 10px;
  }
}
</style>