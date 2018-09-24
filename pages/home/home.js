// pages/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerInfo: [],
    avatarUrl: "http://oxpfrja7o.bkt.clouddn.com/18-9-22/55891526.jpg",
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    feed: [],
    feed_length: 0,
    // 数据返回的额curPage是当前页数，这里是当前页数索引，所以是curPage-1
    curPageIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('罗--homePageOnLoad')
    this.refresh();
    this.getBannerInfo();
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
    console.log("刷新页面")
    this.refresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getMoreData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  /**
   * 网络请求
   * 下拉刷新
   */
  refresh: function() {
    var that = this
    that.getHomeList(0)
  },

  /**
   * 上拉加载更多
   */
  getMoreData: function() {
    var that = this;
    this.getHomeList(that.data.curPageIndex += 1);
  },

  getHomeList: function(pageIndex) {
    wx.showNavigationBarLoading()
    var that = this;
    wx.request({
      url: 'http://www.wanandroid.com/article/list/' + pageIndex + "/json",
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        var dataList = []
        if (pageIndex > 0) {
          dataList = that.data.feed.concat(res.data.data.datas)
        } else {
          dataList = res.data.data.datas;
        }
        console.log(that.data.curPageIndex + "合并后的List" + dataList.length)
        that.setData({
          feed: dataList,
          feed_length: dataList.length,
          curPageIndex: pageIndex
        });
        if (pageIndex == 0) {
          wx.stopPullDownRefresh()
        }
        wx.hideNavigationBarLoading()
        console.log(pageIndex)
        console.log(res.data.data)
      }
    })
    setTimeout(function() {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 10000);
  },

  /**
   * 获取首页的banner信息
   */

  getBannerInfo: function() {
    var that = this
    wx.request({
      url: 'http://www.wanandroid.com/banner/json',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          bannerInfo: res.data.data,
          feed_length: res.data.data.length,
        });
        console.log(res.data.data);
      }
    })
  }
})