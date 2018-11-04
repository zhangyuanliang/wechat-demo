// pages/shoppingCart/shoppingCart.js
import {
  SHOPPING_CART
} from '../../utils/constant'
// import api from '../../api/api'

Page({
  data: {
    list: [],
    noSelect: false,
    saveHidden: true,
    totalPrice: 0,
    allChecked: false
  },

  subtractBtnTap: function(e) {
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let item = this.data.list[index];
    if (!item.ischecked) {
      return
    }
    let num = item.num
    if (item.num === 1) {
      return
    }
    this.reduceGoodNum(id, --num, index)
  },

  addBtnTap: function(e) {
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let item = this.data.list[index];
    if (!item.ischecked) {
      return
    }
    var num = item.num
    this.addGoodNum(id, ++num, index)
  },

  getCartList: function() {
    const shoppingCart = this.shoppingCart.get()
    this.setData({
      list: shoppingCart
    })
  },

  selectAll: function() {
    let totalPrice = 0
    const list = this.data.list
    let allChecked = this.data.allChecked
    for (var i = 0; i < list.length; i++) {
      list[i].ischecked = !allChecked;
      if (!allChecked) {
        totalPrice += parseInt(list[i].priceSubtotal);
      }
    }
    this.setData({
      list: list,
      totalPrice: totalPrice,
      allChecked: !allChecked
    })
    this.shoppingCart.set(list)
  },

  selectItem: function(e) {
    var id = e.currentTarget.dataset.id
    var index = parseInt(e.currentTarget.dataset.index)
    var ischecked = this.data.list[index].ischecked
    this.checkGood(id, index, ischecked)
  },

  checkGood: function(id, index, ischecked) {
    let totalPrice = this.data.totalPrice;
    const list = this.data.list;
    list[index].ischecked = !ischecked
    if (list[index].ischecked) {
      totalPrice += list[index].priceSubtotal
    } else {
      totalPrice -= list[index].priceSubtotal
    }
    this.setData({
      list: list,
      totalPrice: totalPrice
    })
    this.shoppingCart.set(list)
  },

  reduceGoodNum(id, num, index) {
    const list = this.shoppingCart.get()
    let item = list[index]
    item.num = num
    item.priceSubtotal = item.priceSubtotal - item.price
    var data = this.data
    let totalPrice = data.totalPrice - item.price
    this.setData({
      list: list,
      totalPrice: totalPrice,
    })
    this.shoppingCart.set(list)
  },
  addGoodNum(id, num, index) {
    const list = this.shoppingCart.get()
    let item = list[index]
    item.num = num
    item.priceSubtotal = item.priceSubtotal + item.price
    var data = this.data
    let totalPrice = data.totalPrice + item.price
    this.setData({
      list: list,
      totalPrice: totalPrice,
    })
    this.shoppingCart.set(list)
  },

  shoppingCart: {
      get: () => wx.getStorageSync(SHOPPING_CART) || [],
      set: (list) => {
        list = list || []
        return wx.setStorageSync(SHOPPING_CART, list)
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 测试数据
    var list = [{
        id: '1',
        goodsName: 'test1',
        goodsSkuValName: 'description1',
        price: 66,
        num: 1,
        priceSubtotal: 66,
        ischecked: true,
        img: '../../assets/images/shopping.png'
      },
      {
        id: '2',
        goodsName: 'test2',
        goodsSkuValName: 'description2',
        price: 88,
        num: 2,
        priceSubtotal: 176,
        ischecked: false,
        img: '../../assets/images/shopping.png'
      }
    ]
    var cartData = wx.getStorageSync(SHOPPING_CART);
    if (!cartData) {
      wx.setStorageSync(SHOPPING_CART, list)
    }
    this.getCartList()
    this.selectAll()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})