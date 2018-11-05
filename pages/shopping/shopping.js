// pages/shoppingCart/shoppingCart.js
import {
  SHOPPING_CART
} from '../../utils/constant'
import cart from '../../data/cart'
// import api from '../../api/api'

Page({
  data: {
    security: null,
    maintenance: null,
    noSelect: false,
    saveHidden: true,
    totalPrice: 0,
    allChecked: false
  },

  subtractBtnTap: function(e) {
    let type = e.currentTarget.dataset.type
    let id = e.currentTarget.dataset.id
    let item = this.findGoodById(type, id)
    if (!item.ischecked) {
      return
    }
    let num = item.num
    if (item.num === 1) {
      return
    }
    this.reduceGoodNum(type, id, --num)
  },

  addBtnTap: function(e) {
    let type = e.currentTarget.dataset.type
    let id = e.currentTarget.dataset.id
    let item = this.findGoodById(type, id)
    if (!item.ischecked) {
      return
    }
    let num = item.num
    this.addGoodNum(type, id, ++num)
  },

  getCartFromStore: function() {
    const cart = this.shoppingCart.get()
    this.setData(cart)
  },

  selectAll: function() {
    let totalPrice = 0
    let allChecked = this.data.allChecked
    let security = this.data.security
    let maintenance = this.data.maintenance
    security.typeChecked = !allChecked
    maintenance.typeChecked = !allChecked
    for (var i = 0; i < security.list.length; i++) {
      security.list[i].ischecked = !allChecked
      if (!allChecked) {
        totalPrice += security.list[i].priceSubtotal
      }
    }
    for (var i = 0; i < maintenance.list.length; i++) {
      maintenance.list[i].ischecked = !allChecked
      if (!allChecked) {
        totalPrice += maintenance.list[i].priceSubtotal
      }
    }
    this.setData({
      security: security,
      maintenance: maintenance,
      totalPrice: totalPrice,
      allChecked: !allChecked
    })
    this.shoppingCart.set({
      security: security,
      maintenance: maintenance
    })
  },

  selectType: function(e) {
    var type = e.currentTarget.dataset.type
    var cls = this.data[type]
    var type_price = cls.type_price
    cls.typeChecked = !cls.typeChecked
    var totalPrice = this.data.totalPrice
    if (cls.typeChecked) {
      for (var i = 0; i < cls.list.length; i++) {
        if (!cls.list[i].ischecked) {
          cls.list[i].ischecked = true
          totalPrice += cls.list[i].priceSubtotal
        }
      }
    } else {
      for (var i = 0; i < cls.list.length; i++) {
        if (cls.list[i].ischecked) {
          cls.list[i].ischecked = false
          totalPrice -= cls.list[i].priceSubtotal
        }
      }
    }
    let update;
    if (type == 'security') {
      update = {
        security: cls,
        maintenance: this.data.maintenance
      }
    } else {
      update = {
        security: this.data.security,
        maintenance: cls
      }
    }

    this.setData({
      ...update,
      totalPrice: totalPrice,
      allChecked: this.isAllSelected()
    })
    this.shoppingCart.set(update)
  },

  findGoodById(type, id) {
    return this.data[type].list.find(function (item) {
      return item.id === id
    })
  },

  selectGood: function(e) {
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    this.checkGood(type, id)
  },

  isTypeAllSelected: function(type) {
    var isTypeAll = this.data[type].list.every(function (item) {
      return item.ischecked
    })
    this.data[type].typeChecked = isTypeAll
  },

  isAllSelected: function() {
    var securityList = this.data.security.list
    var maintenanceList = this.data.maintenance.list
    return securityList.concat(maintenanceList).every(function(item) {
      return item.ischecked
    })
  },

  checkGood: function(type, id) {
    let totalPrice = this.data.totalPrice
    let item = this.findGoodById(type, id)
    item.ischecked = !item.ischecked
    let allChecked = this.data.allChecked
    if (item.ischecked) {
      this.isTypeAllSelected(type)
      var isAll = this.isAllSelected()
      if (isAll) {
        allChecked = true
      }
      totalPrice += item.priceSubtotal
    } else {
      allChecked = false
      this.data[type].typeChecked = false
      totalPrice -= item.priceSubtotal
    }
    let security = this.data.security
    let maintenance = this.data.maintenance
    this.setData({
      security: security,
      maintenance: maintenance,
      totalPrice: totalPrice,
      allChecked: allChecked
    })
    this.shoppingCart.set({
      security: security,
      maintenance: maintenance
    })
  },

  reduceGoodNum(type, id, num) {
    let item = this.findGoodById(type, id)
    item.num = num
    item.priceSubtotal = item.priceSubtotal - item.price
    let data = this.data
    data[type].type_price = data[type].type_price + item.price
    let totalPrice = data.totalPrice - item.price
    let security = data.security
    let maintenance = data.maintenance
    this.setData({
      security: security,
      maintenance: maintenance,
      totalPrice: totalPrice
    })
    this.shoppingCart.set({
      security: data.security,
      maintenance: data.maintenance
    })
  },
  addGoodNum(type, id, num) {
    let item = this.findGoodById(type, id)
    item.num = num
    item.priceSubtotal = item.priceSubtotal + item.price
    let data = this.data
    data[type].type_price = data[type].type_price + item.price
    let totalPrice = data.totalPrice + item.price
    this.setData({
      security: data.security,
      maintenance: data.maintenance,
      totalPrice: totalPrice,
    })
    this.shoppingCart.set({
      security: data.security,
      maintenance: data.maintenance
    })
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
    var cartData = wx.getStorageSync(SHOPPING_CART)
    if (!cartData) {
      wx.setStorageSync(SHOPPING_CART, cart)
    }
    this.getCartFromStore()
    this.selectAll()
  }
  

})