<template>
  <div class="goods">
    <!-- ref是vue定义的DOM可用$refs方法获取 -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <!-- 动态更新class当current属性（也就是currentIndex函数return的值）与index相同时，class为current -->
        <li v-for='(item,index) in goods' class="menu-item" :key="index" :class="{'current':currentIndex===index}" @click="selectMenu(index)">
          <span class="text" border-1px>
            <!-- 折扣图片，根据item.type来判断 -->
            <span v-show='item.type>0' class="icon" :class='classMAP[item.type]'></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <!-- 从goods里v-for每个组（热销榜，单人套餐什么的） -->
        <li v-for="item in goods" :key="item.index" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <!-- 从每个组里v-for出所有的商品，绑定点击事件 -->
            <li @click="selectFood(food,$event)" v-for='food in item.foods' :key="food.index" class="food-item border-1px" >
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <!-- 加减数量插件,传入food（商品） -->
                <div class="cartcontrol-wrapper">
                  <!-- 这里通过v-on监听cart-add（cartcontrol组件派发），调用_drop函数 -->
                  <cartcontrol v-on:cart-add='_drop' :food='food'></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 购物车插件,向组件传递seller的两个参数(配送费和起送价)和选中的商品 -->
    <!-- 这里通过DOM来操作，来将位置传输给他 -->
    <shopcart ref="shopcart" :select-foods='selectFoods' :delivery-price='seller.deliveryPrice' :min-price='seller.minPrice'></shopcart>
    <food v-on:cart-add='_drop' v-on:cart-addd='_drop' :food='selectedFood' ref="food"></food>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
// better-scroll是用来实现滚动的插件
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'
const ERR_OK = 0

export default {
  // 接收seller
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  created () {
    this.classMAP = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('/goods').then(response => {
      // response的body方法返回一个json
      response = response.body
      if (response.errno === ERR_OK) {
        this.goods = response.data
        // console.log(this.goods)
        // 在修改数据之后立即使用这个方法，获取更新后的 DOM。
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  methods: {
    // 分别获取对应的DOM，probeType:3表示监听
    // 这里使用了better-scroll组件
    _initScroll () {
      this.meunScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3,
        click: true
      })
      // 对滑动的数值进行监听和取整赋值
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    // 取得foodlist的高度，并且push到数组中便于后期判断
    // food-list-hook类名是专门用来DOM操作的，不添加CSS样式
    _calculateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    // 左侧栏点击事件
    selectMenu (index) {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      // 方法，滚动至这个element和时间
      this.foodsScroll.scrollToElement(el, 300)
    },
    // 访问shopcart购物车组件，调用购物车组件的方法，通过DOM操作
    _drop (target) {
      this.$refs.shopcart.drop(target)
    },
    // 商品详情页点击
    selectFood (food, event) {
      this.selectedFood = food
      this.$refs.food.show()
    }
  },
  computed: {
    // 将实际的视口高度与foodlist中的高度进行对比，并返回值
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    // 首先遍历goods找到套餐分类，之后遍历每个套餐找到每个商品，查询商品是否有count属性，有的话就push到goods数组
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          // 这里的count是由组件cartcontrol添加给food的,之后由购物车组件计算总价
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  components: {
    // 注册组件
    shopcart,
    cartcontrol,
    food
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'
  .goods
    display:flex
    position:absolute
    width:100%
    top:174px
    bottom:46px
    overflow:hidden
    .menu-wrapper
      flex:0 0 80px
      width:80px
      background:#f3f5f7
      .menu-item
        display:table
        width:56px
        height:54px
        padding:0 12px
        line-height:14px
        &.current
          position:relative
          z-index:10
          margin-top:-1px
          background:#fff
          font-weight:700
          .text
            border-none()
        .icon
          display:inline-block
          width:12px
          height:12px
          margin-right:2px
          background-size:12px 12px
          background-repeat:no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display:table-cell
          width:56px
          vertical-align:middle
          border-1px(rgba(7,17,27,0.1))
          font-size:12px
    .foods-wrapper
      flex:1
      .title
        padding-left:14px
        height:26px
        line-height:26px
        border-left:2px solid #d9dde1
        font-size:12px
        color:rgb(147,153,159)
        background:#f3f5f7
      .food-item
        display:flex
        margin:18px
        padding-bottom:18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom:0
        .icon
          flex:0 0 57px
          margin-right:10px
        .content
          flex:1
          .name
            margin:2px 0 8px 0
            height:14px
            line-height:14px
            font-size:14px
            color:rgb(7,17,27)
          .desc,.extra
            margin-bottom:8px
            line-height:10px
            font-size:10px
            color:rgb(147,153,159)
          .desc
            margin-bottom:8px
            line-height:12px
          .extra
            .count
              margin-right:12px
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
            position:absolute
            right:0
            bottom:12px
</style>
