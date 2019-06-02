<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="tank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size='36' :score='seller.serviceScore'></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size='36' :score='seller.foodScore'></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-warpper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type = 'selectType' :only-content = 'onlyContent' :ratings = 'ratings' v-on:ratingtype-select="ratingtype" v-on:content-toggle="toggle"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li class="rating-item" v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in ratings" :key="index">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size='24' :score='rating.score'></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="iconfont icon-zan1"></span>
                <span class="item" v-for="item in rating.recommend" :key="item">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import star from '../star/star'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import { formatDate } from '../../common/js/date'
import BScroll from 'better-scroll'
// better-scroll是用来实现滚动的插件

// const POSITYPE = 0
// const NEGATIVE = 1
const ALL = 2
const ERR_OK = 0

export default {
  props: {
    seller: Object
  },
  data () {
    return {
      ratings: [],
      showFlag: false,
      selectType: ALL,
      onlyContent: false
    }
  },
  created () {
    this.$http.get('/ratings').then(response => {
      // response的body方法返回一个json
      // 看下状态码
      // console.log(response.status)
      response = response.body
      if (response.errno === ERR_OK) {
        this.ratings = response.data
        // console.log(this.ratings)
        // 在修改数据之后立即使用这个方法，获取更新后的 DOM。
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          })
        })
      }
    })
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
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
  components: {
    star,
    split,
    ratingselect
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'
  .ratings
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      display flex
      padding 10px 0
      .overview-left
        flex 0 0 137px
        width 137px
        border-right 1px solid rgba(7,17,27,0.1)
        text-align center
        padding 6px 0
        @media only screen and (max-width: 372px){
          flex 0 0 120px
          width 120px
        }
        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255,153,0)
        .title
          line-height 12px
          font-size 12px
          color rgb(7,17,27)
          margin-bottom 8px
        .tank
          line-height 10px
          font-size 10px
          color rgb(147,153,159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        @media only screen and (max-width: 320px){
          padding-left 6px
        }
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            display inline-block
            line-height 18px
            vertical-align top
            font-size 12px
            color rgb(7,17,27)
          .star
            display inline-block
            vertical-align top
            margin 0 12px
          .score
            display inline-block
            line-height 18px
            vertical-align top
            color rgb(255,153,0)
            font-size 12px
        .delivery-warpper
          font-size 0
          .title
            display inline-block
            line-height 18px
            vertical-align top
            font-size 12px
            color rgb(7,17,27)
          .delivery
            display inline-block
            font-size 12px
            color rgb(147,153,159)
            margin-left 12px
            line-height 18px
    .rating-wrapper
      padding 0 18px
      .rating-item
        display flex
        padding 18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          flex 1
          position relative
          .name
            line-height 12px
            color rgb(7,17,27)
            font-size 10px
            margin-bottom 4px
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .star
              display inline-block
              vertical-align top
              margin-right 6px
            .delivery
              display inline-block
              vertical-align top
              font-size 10
              line-height 12px
              color rgb(147,153,159)
          .text
            line-height 18px
            color rgb(7,17,27)
            font-size 12px
            margin-bottom 8px
          .recommend
            line-height 16px
            font-size 0
            .icon-zan1,.item
              display inline-block
              font-size 9px
              margin 0 8px 4px 0
            .icon-zan1
              color rgb(0,160,220)
            .item
              border 1px solid rgba(7,17,27,0.1)
              padding 0 6px
              border-radius 1px
              color rgb(147,153,159)
              background #fff
          .time
            position absolute
            top 0
            right 0
            font-size 10px
            line-height 12px
            color rgb(147,153,159)
</style>
