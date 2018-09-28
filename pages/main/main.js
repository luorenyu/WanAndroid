// pages/main/main.js
//获取应用实例
const app = getApp()

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
    feed_length: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getKnowlageTree()
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
    this.getKnowlageTree()
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

  },

  getKnowlageTree: function() {
    wx.showNavigationBarLoading()
    var that = this;
    wx.request({
      url: 'http://www.wanandroid.com/tree/json',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        var dataList = res.data.data
        for (var i = 0; i < dataList.length; i++) {
          var dataChildren = dataList[i]
          dataChildren.des = ""
          var dataChildList = dataChildren.children
          for (var j = 0; j < dataChildList.length; j++) {
            dataChildren.des += (dataChildList[j].name + '   ')
          }
        }
        that.setData({
          feed: dataList,
          feed_length: dataList.length
        });
        wx.hideNavigationBarLoading()
      }
    })
    setTimeout(function() {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 10000);
  },
  /**
   * 去到文章对应的分类界面
   */
  toChapter: function(event) {
    console.log("ToChapter")
    var sourceChapterList = event.currentTarget.dataset.item.children
    console.log(sourceChapterList)
    var chapterList=[]
    for(var i=0;i<sourceChapterList.length;i++){
      var chapter=new Object();
      chapter.name=sourceChapterList[i].name
      chapter.chapterId=sourceChapterList[i].id
      chapterList.push(chapter)
      console.log(chapter)
    }
    console.log("chapterList===")
    console.log(chapterList)
    getApp().globalData.chapterList = chapterList
    wx.navigateTo({
      url: '/pages/chapter/chapter',
    });
  }
})