<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
        <div v-if="seller.supports" class="supports">
          <!-- 根据data数据中seller.supports的type来判断显示的图片，对应数组的值 -->
          <span class="icon" :class="classMAP[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
        <div v-if='seller.supports' class="support-count" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="iconfont icon-you"></i>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-circle-right"></i>
    </div>
    <!-- 背景，这里加了高斯模糊 -->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <!-- vue的动画效果，结合最下边的css -->
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size='48' :score='seller.score'></star>
            </div>
            <div class="title">
              <!-- 这里使用了flex布局，保证横线一样长 -->
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul class="supports" v-if='seller.supports'>
              <!-- v-for了supports的每一项，对应classMAP的不同class属性和文字 -->
              <li v-for='(item,index) in seller.supports' :key="item.index" class="support-item">
                <span class="icon" :class="classMAP[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detali-close" @click='detailShow =!detailShow'>
          <i class="iconfont icon-cuo"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

import star from '../star/star'

export default {
  // 让子组件使用父组件的数据
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      detailShow: false
    }
  },
  // 为vue添加方法函数
  methods: {
    // 定义一个属性detailShow来控制下一个窗口的display
    showDetail () {
      this.detailShow = true
    },
    hideDetail () {
      this.detailShow = false
    }
  },
  created () {
    // 这里创建一个属性，数据类型为数组，保存不同的折扣，根据supports的type不同来显示
    this.classMAP = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  components: {
    star
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
// 对应不同DPR切换图片
@import '../../common/stylus/mixin'
  .header
    position:relative
    overflow:hidden
    color:#fff
    background-color:rgba(7,17,27,0.5)
    .content-wrapper
      position:relative
      padding:24px 12px 18px 24px
      font-size:0px
      .avatar
        display:inline-block
        vertical-align:top
        img
          border-radius:2px
      .content
        display:inline-block
        margin-left:16px
        .title
          margin:2px 0px 8px 0px
          .brand
            vertical-align:top
            width:30px
            height:18px
            display:inline-block
            bg-image('brand')
            background-size:30px 18px
            background-repeat :no-repeat
          .name
            margin-left:6px
            font-size 16px
            line-height:18px
            font-weight:bold
        .description
          margin-bottom:10px
          line-height 12px
          font-size 12px
        .supports
          .icon
            display:inline-block
            vertical-align:top
            width:12px
            height:12px
            margin-right:4px
            background-size:12px 12px
            background-repeat:no-repeat
            // 不同的css对应不同的折扣图案
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            font-size:10px
            line-height:12px
      .support-count
        position:absolute
        right:12px
        bottom:14px
        padding:0 8px
        height 24px
        line-height:24px
        border-radius:14px
        background-color:rgba(0,0,0,0.2)
        text-align:center
        font-size:10px
        .count
          vertical-align:top
          font-size:10px
        .icon-you
          margin-left:2px
          font-size:10px
          line-height:24px
    .bulletin-wrapper
      position:relative
      height:28px
      line-height:28px
      padding:0 22px 0 12px
      white-space:nowrap
      overflow:hidden
      text-overflow:ellipsis
      background:rgba(7,17,27,0.2)
      .bulletin-title
        display:inline-block
        vertical-align:top
        margin-top:8px
        width:22px
        height:12px
        bg-image('bulletin')
        background-size:22px 12px
        background-repeat:no-repeat
      .bulletin-text
        vertical-align:top
        font-size:10px
        margin:0 4px
      .icon-circle-right
        position:absolute
        font-size:10px
        right:12px
        top:8px
    .background
      position :absolute
      top:0
      left:0
      width:100%
      height:100%
      z-index:-1
      filter:blur(10px) // 模糊效果
    .detail
      position:fixed
      z-index:100
      top:0
      left:0
      width:100%
      height:100%
      overflow:auto
      background-color:rgba(7,17,27,0.8)
      backdrop-filter:blur(10px)
      .detail-wrapper
        min-height:100%
        width:100%
        .detail-main
          margin-top:64px
          padding-bottom:64px
          .name
            line-height:16px
            text-align:center
            fonsiz:16px
            font-weight:700
          .star-wrapper
            margin-top:18px
            padding 2px 0
            text-align:center
          .title
            display:flex
            width:80%
            margin:28px auto 24px auto
            .line
              flex:1
              position:relative
              top:-6px
              border-bottom:1px solid rgba(255,255,255,0.2)
            .text
              padding:0 12px
              font-weight:700
              font-size:14px
          .supports
            width:80%
            margin:0 auto
            .support-item
              padding:0 12px
              margin-bottom:12px
              font-size:0
              &:last-child
                margin-bottom:0
              .icon
                display:inline-block
                width:16px
                height:16px
                margin-right:6px
                background-size:16px 16px
                background-repeat:no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .text
                line-height:16px
                font-size:12px
          .bulletin
            width:80%
            margin:0 auto
            .content
              padding: 0 12px
              line-height:24px
              font-size:12px
      .detali-close
        position:relative
        width:32px
        height:32px
        margin:-64px auto 0 auto
        clear:both
        font-size:32px
        .icon-cuo
          font-size:32px
    .fade-enter-active, .fade-leave-active
      transition: all .5s
    .fade-enter, .fade-leave-to
      opacity: 0
</style>
