<template>
  <div class = 'cartcontrol'>
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart">
        <span class="inner iconfont icon-jian"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add iconfont icon-jia" @click="addCart"></div>
  </div>
</template>

<script>
// 重新引入vue用于定义count
import vue from 'vue'

export default {
  props: {
    food: {
      type: Object
    }
  },
  created () {
    // console.log(this.food)
  },
  methods: {
    addCart () {
      // console.log('click')
      if (!this.food.count) {
        // 为food定义count属性
        // 这里的商品是从父组件传递来的，所以对应的是每个商品
        vue.set(this.food, 'count', 1)
        this.food.count = 1
      } else {
        this.food.count++
      }
      // 派发一个事件cart-add，将DOM对象作为参数传入，提供给goods组件使用
      this.$emit('cart-add', event.target)
    },
    decreaseCart () {
      if (this.food.count >= 0) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .cartcontrol
    font-size:0
    // 这里从原始位置右侧24px的位置开始过渡，透明度从无到有。当count=0时再次触发过渡，到24px位置消失
    // 过渡时
    .move-enter-active, .move-leave-active
      transition: all 0.2s linear
    // 开始前和结束后的状态
    .move-enter,.move-leave-to
      transform:translate3d(24px,0,0) rotate(180deg)
      opacity: 0
    // 开始过渡结束和之后的过渡开始前
    .move-enter-to,.move-leave
      transform:translate3d(0,0,0) rotate(0)
      opacity: 1
    .cart-decrease
      display:inline-block
      padding:6px
      .inner
        display:inline-block
        font-size:24px
        line-height:24px
        color:rgb(0,160,220)
    .cart-count
      display:inline-block
      vertical-align:top
      width:12px
      padding-top:6px
      line-height:24px
      text-align:center
      font-size:10px
      color:rgb(147,153,159)
    .cart-add
      display:inline-block
      font-size:24px
      line-height:24px
      padding:6px
      color:rgb(0,160,220)
</style>
