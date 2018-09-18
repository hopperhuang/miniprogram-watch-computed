const { init, initComputed } = require('../../scripts/computed/index')

const obj = {
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    number: {
      a: 1,
      b: 2
    }
  },
  watch: {
    number() {
      console.log('a change')
    },
    // number() {
    //   console.log('b change')
    // }
  },
  computed: {
    c() {
      return this.data.number.a + 1
    },
    d() {
      return this.data.number.b + 1
    }
  }
}

const o = init(obj)
const { data } = o
//index.js
//获取应用实例
const app = getApp()

// Page.prototype.sayhi = () => { console.log("sayhi") }

Page({
  data,
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    const d = Object.getOwnPropertyDescriptor(this, 'data')
    Object.defineProperty(this,'data', {
      ...d,
      value: data,
    })
    initComputed(obj.computed, this.data, this)
    console.log(Object.getOwnPropertyDescriptor(this, 'data'))
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  addA() {
    this.setData({
      number: {
        ...this.data.number,
        a: this.data.number.a + 1
      }
    })
  }
})
