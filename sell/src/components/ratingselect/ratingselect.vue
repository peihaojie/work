// 商品评论组件
<template>
  <div class = 'ratingselect'>
    <div class="rating-type border-1px">
      <!-- 这里通过点击将type传给函数，函数使用$emit自定义事件传出type给父组件,设置selectType值改变class -->
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positype}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div @click="toggleCountent()" class="switch" :class="{'on':onlyContent}">
      <span class="iconfont icon-iconfontcheck"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
const POSITYPE = 0
const NEGATIVE = 1
const ALL = 2
export default {
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    // 选择类型
    selectType: {
      type: Number,
      default: ALL
    },
    // 读或者不读内容
    onlyContent: {
      type: Boolean,
      default: false
    },
    // 描述
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positype: '满意',
          negative: '不满意'
        }
      }
    }
  },
  methods: {
    select (type, event) {
      // 这里传出一个事件
      this.$emit('ratingtype-select', type)
    },
    toggleCountent (event) {
      this.$emit('content-toggle', this.onlyContent)
    }
  },
  computed: {
    positives () {
      // 对数组进行筛选,并返回
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITYPE
      })
    },
    negatives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import '../../common/stylus/mixin'
  .ratingselect
    .rating-type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7,17,27,0.1))
      font-size 0
      .block
        display inline-block
        padding 8px 12px
        border-radius 1px
        margin-right 8px
        color rgb(77,85,93)
        font-size 12px
        line-height 16px
        &.active
          color #fff
        .count
          font-size 8px
          margin-left 2px
        &.positive
          background rgba(0,160,220,0.2)
          &.active
            background rgb(0,160,220)
        &.negative
          background rgba(77,85,93,0.2)
          &.active
            background rgb(77,85,93)
    .switch
      padding 12px 18px
      line-height 24px
      font-size 12px
      border-bottom 1px solid rgba(7,17,27,0.1)
      color rgb(147,153,159)
      font-size 0
      &.on
        .icon-iconfontcheck
          color #00c850
      .icon-iconfontcheck
        font-size 24px
        margin-right 4px
        display inline-block
        vertical-align top
      .text
        font-size 12px
        display inline-block
        vertical-align top
</style>
