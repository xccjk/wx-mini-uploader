const app = getApp()

Page({
  data: {
    motto: '微信小程序自动化上传demo'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '/games/pages/flop/index?level=simple'
    })
  },
  onLoad: function () {}
})
