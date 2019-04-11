<template>
  <div>
    <div class = 'shopcrat'>
      <!-- 绑定点击事件，显示购物车详情 -->
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <!-- 动态更新属性，totalCount大于0则class为highlight -->
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="iconfont icon-gouwuche" :class="{'highlight':totalCount>0}"></i>
            </div>
            <!-- 小红点 -->
            <div class="num" v-show="totalCount">{{totalCount}}</div>
            </div>
          <div class="price" :class="{'highlight':totalPrice}">￥{{totalPrice}}元</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <!-- @click.stop 阻止冒泡  @click.stop.prevent阻止默认事件-->
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <!-- 遍历五个小球出来 -->
      <div class="ball-container" v-for="ball in balls" :key="ball.index">
        <!-- 小球进入购物车动画 -->
        <transition name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
          <!-- 定义小球的结束位置 -->
          <div class="ball" v-show="ball.show">
            <!-- 小球 -->
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods" :key="food.index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food='food'></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!-- 黑色半透明背景 -->
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script>
import cartcontrol from '../cartcontrol/cartcontrol'
import BScroll from 'better-scroll'
export default {
// 获取父元素传递的数据，并设置默认值为0
  props: {
  // 获取选中产品的数组
    selectFoods: {
      type: Array,
      default () {
        return [
          {
            // price: 10,
            // count: 1
          }
        ]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      balls: [
        {
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }
      ],
      // 下落的小球数组
      dropBalls: [],
      // 购物车栏折叠
      fold: true
    }
  },
  computed: {
  // 计算总价，利用forEach遍历数组的每一项，相加得到总价
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    // 计算数量，用于小红点上显示数值
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    // 判断是否达到配送价格，并输出文字。反引号可以识别{}的内容
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    // 去结算的颜色变化
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enouth'
      }
    },
    // 控制购物车栏的显示
    listShow () {
      // 没有选中商品，则display=none
      if (!this.totalCount) {
        this.fold = true
        return false
      }
      // 购物车内有商品，则显示出来
      let show = !this.fold
      // 添加滚动效果
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            // 重新渲染
            this.scroll.refresh()
          }
        })
      }
      return show
    }
  },
  methods: {
    // 通过遍历将第一个false的ball.show设置为true显示小球
    drop (el) {
      console.log(el)
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          // 当小球下落的时候，放在数组里。等到购物车的时候隐藏
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeEnter: function (el) {
      let count = this.balls.length
      // 将ball.show设置为turn的小球全部找到，因为有可能连续点击，这里选择循环
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          // 获取加号的位置（小球动画开始的位置)浏览器接口获取元素对于视口的位置
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          // 窗口的高度
          let y = -(window.innerHeight - rect.top - 22)
          // 手动将display设置为空，显示出来。但是drop方法已经将 ball.show = true 所以为无用代码
          el.style.display = ''
          // 外层的动画，小球Y轴的位移
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          // 内层动画，小球X轴的位移
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    enter: function (el, done) {
      /* eslint-disable no-unused-vars */
      // 触发浏览器重绘
      let rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0, 0, 0)'
        inner.style.transform = 'translate3d(0, 0, 0)'
        el.addEventListener('transitionend', done)
      })
    },
    afterEnter: function (el) {
      // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
      // 将下落结束的小球从数组内取出
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    // 定义展开购物车列表
    toggleList () {
      // 购物车内没有东西的时候，点击无效
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    // 清空购物车
    empty () {
      // 遍历selectFoods数组
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    // 购物车详情背景点击关闭
    hideList () {
      this.fold = true
    },
    pay () {
      if (this.totalPrice < this.minPrice) {
        alert(`您还差￥${this.minPrice - this.totalPrice}元达到最低配送金额`)
        return
      }
      alert(`您需要支付￥${this.totalPrice}元`)
    }
  },
  components: {
    cartcontrol
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin'
  .shopcrat
    position:fixed
    left:0
    bottom:0
    z-index:50
    width:100%
    height:48px
    .content
      display:flex
      background #141b27
      font-size:0
      color:rgba(255,255,255,0.4)
      .content-left
        flex:1
        .logo-wrapper
          display:inline-block
          position:relative
          top:-10px
          margin:0 12px
          padding:6px
          width:56px
          height:56px
          box-sizing:border-box
          vertical-align:top
          border-radius:50%
          background:#141b27
          .logo
            width:100%
            height:100%
            border-radius:50%
            background:#2b343c
            text-align:center
            &.highlight
              background:rgb(0,160,220)
            .icon-gouwuche
              font-size:24px
              line-height:44px
              color:#80858a
              &.highlight
                color:#fff
          .num
            position:absolute
            top:0
            right:0
            width:24px
            height:16px
            line-height:16px
            text-align:center
            border-radius:16px
            font-size:9px
            font-weight:700
            color:#fff
            background:rgb(240,20,20)
            box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display:inline-block
          vertical-align:top
          line-height:24px
          margin-top:12px
          box-sizing:border-box
          padding-right:12px
          border-right:1px solid rgba(255,255,255,0.1)
          font-size:16px
          font-weight:700
          &.highlight
            color:#fff
        .desc
          display:inline-block
          vertical-align:top
          margin:12px 0 0 12px
          line-height:24px
          font-size:10px
      .content-right
        flex:0 0 105px
        width:105px
        .pay
          height:48px
          line-height:48px
          text-align:center
          font-size:12px
          font-weight:700
          background:#2b333b
          &.not-enough
            background:#2b333b
          &.enouth
            background:#00b43c
            color:#fff
    .ball-container
      .ball
        position:fixed
        left:32px
        bottom:22px
        z-index:200
        transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width:16px
          height:16px
          border-radius:50%
          background:rgb(0,160,220)
          transition all 0.4s linear
    .shopcart-list
      position:absolute
      left:0
      top:0
      z-index:-1
      width:100%
      transform translate3d(0, -100%, 0) //整个列表相对于当前自身的高度做一个偏移
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7,17,27,0.1)
        .title
          float left
          font-size 14px
          color rgb(7,17,27)
        .empty
          float right
          font-size 12px
          color rgb(0,160,220)
      .list-content
        padding 0 18px
        max-height 217px
        background #fff
        overflow hidden
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7,17,27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px
     // 过渡时
    .fold-enter-active, .fold-leave-active
      transition: all 0.2s linear
    // 开始前和结束后的状态
    .fold-enter,.fold-leave-to
      transform: translate3d(0, 0, 0)
      opacity: 0
    // 开始过渡结束和之后的过渡开始前
    .fold-enter-to,.fold-leave
      transform: translate3d(0, -100%, 0)
      opacity: 1
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    background blur(10px)
    background rgba(7,17,27,0.6)
    opacity: 1
  // 过渡时
  .fade-enter-active, .fade-leave-active
    transition: all 0.2s linear
  // 开始前和结束后的状态
  .fade-enter,.fade-leave-to
    background rgba(7,17,27,0)
    opacity: 0
</style>
