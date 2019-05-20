<template>
  <transition name="move">
    <div v-show="showFlag" class = 'food' ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src='food.image'>
          <div class="back" @click="hide">
          <i class="iconfont icon-xiangzuo"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol v-on:cart-add='_drop' :food='food'></cartcontrol>
          </div>
          <div @click="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评论</h1>
          <ratingselect :select-type = 'selectType' :only-content = 'onlyContent' :desc = 'desc' :ratings = 'food.ratings' v-on:ratingtype-select="ratingtype" v-on:content-toggle="toggle"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <!-- 这里通过函数对比rateType与selectType来判断显示与点击相关内容 -->
              <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating,index) in food.ratings" class="rating-item border-1px" :key="index">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" class="avatar" width="12" height="12">
                </div>
                <!-- 调用了一个正则表达式的js方法，将Js时间换算格式 -->
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span class="iconfont" :class="{'icon-zan1':rating.rateType === 0, 'icon-cai':rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol'
import vue from 'vue'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import { formatDate } from '../../common/js/date'
// const POSITYPE = 0
// const NEGATIVE = 1
const ALL = 2
export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positype: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    show () {
      this.showFlag = true
      this.selectType = ALL
      this.onlyContent = false
      // 页面滚动
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
    },
    addFirst () {
      // 派发一个事件cart-add，将DOM对象作为参数传入，提供给goods组件使用
      vue.set(this.food, 'count', 1)
      this.$emit('cart-add', event.target)
    },
    _drop () {
      this.$emit('cart-addd', event.target)
    },
    ratingtype (type) {
      this.selectType = type
      // 初始化滚动
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggle (onlyContent) {
      // 取反
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin'
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background #fff
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-xiangzuo
          display block
          padding 10px
          font-size 20px
          color #fff
    .content
      padding 18px
      position relative
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
      .detail
        margin-bottom 18px
        line-height 10px
        height 10px
        font-size 0
        .sell-count, .rating
          font-size 10px
          color rgb(147,153,159)
        .sell-count
          margin-right 12px
      .price
            font-weight:700
            line-height:24px
            .now
              margin-right:8px
              font-size:14px
              color:rgb(240,20,20)
            .old
              text-decoration:line-through
              font-size :10px
              color:rgb(147,153,159)
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10
        line-height 24px
        height 24
        padding 0 12px
        box-sizing border-box
        font-size 10px
        border-radius 12px
        color #fff
        background rgb(0,160,220)
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7,17,27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77,85,93)
    .rating
      padding-top 18px
      .title
        line-height 14px
        margin-left 18px
        font-size 14px
        color rgb(7,17,27)
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position absolute
            right 0
            top 16px
            line-height 12px
            font-size 0
            .name
              display inline-block
              vertical-align top
              font-size 10px
              color rgb(147,153,159)
              margin-right 6px
            .avatar
              border-radius 50%
          .time
            font-size 10px
            line-height 12px
            color rgb(147,153,159)
            margin-bottom 6px
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
            .icon-zan1,.icon-cai
              line-height 16px
              margin-right 4px
              font-size 12px
            .icon-zan1
              color rgb(0,160,220)
            .icon-cai
              color rgb(147,153,159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147,153,159)
  // 过渡时
  .move-enter-active, .move-leave-active
    transition: all 0.2s linear
  // 开始前和结束后的状态
  .move-enter,.move-leave-to
    transform:translate3d(100%,0,0)
    opacity: 0
  // 开始过渡结束和之后的过渡开始前
  .move-enter-to,.move-leave
    transform:translate3d(0,0,0)
</style>
