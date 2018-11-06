Page({
  data: {
    array: ['浙江省', '山东省', '北京', '上海'],
    index: 0
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function (options) {

  },

  onShow: function () {

  },

  onHide: function () {

  }

})