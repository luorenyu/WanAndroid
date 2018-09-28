// pages/chapter/chapter.js
Page({
  data: {
    /** 
     * 导航数据 
     */
    topNavs: ["l99","lll"],
    /** 
     * 当前激活的当航索引 
     */
    currentActiveNavIndex: 0,
    /** 
     * 上一个激活的当航索引 
     */
    prevActiveNavIndex: -1,
    /** 
     * scroll-view 横向滚动条位置 
     */
    scrollLeft: 0,
    //存放着chapter{name:"",chapterId:0}对象的数组
    list:[]
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that=this
    that.data.list=[]
    console.log("接收到的参数是list=")
    that.data.list=getApp().globalData.chapterList;
    // this.data.list = JSON.parse(options.list); 
    var tempArr=[]
    for (var i = 0; i < that.data.list.length;i++){
      tempArr[i]=that.data.list[i].name
    }
    that.setData({
      list : getApp().globalData.chapterList,
      topNavs:tempArr
    })
    //TODO 获取chapter下面的文章
  },

  /** 
   * 顶部导航改变事件，即被点击了 
   * 1、如果2次点击同一个当航，则不做处理 
   * 2、需要记录本次点击和上次点击的位置 
   */
  topNavChange: function (e) {
    var nextActiveIndex = e.currentTarget.dataset.currentIndex,
      currentIndex = this.data.currentActiveNavIndex;
    if (currentIndex != nextActiveIndex) {
      this.setData({
        currentActiveNavIndex: nextActiveIndex,
        prevActiveNavIndex: currentIndex
      });
    }
  },
  /** 
   * swiper滑动时触发 
   * 1、prevIndex != currentIndex 表示的是用手滑动 swiper组件 
   * 2、prevIndex = currentIndex  表示的是通过点击顶部的导航触发的 
   */
  swiperChange: function (e) {
    var prevIndex = this.data.currentActiveNavIndex,
      currentIndex = e.detail.current;
    this.setData({
      currentActiveNavIndex: currentIndex
    });
    if (prevIndex != currentIndex) {
      this.setData({
        prevActiveNavIndex: prevIndex
      });
    }
    this.scrollTopNav();
  },
  /** 
   * 滚动顶部的导航栏 
   * 1、这个地方是大致估算的 
   */
  scrollTopNav: function () {
    /** 
     * 当激活的当航小于4个时，不滚动 
     */
    if (this.data.currentActiveNavIndex <= 3 && this.data.scrollLeft >= 0) {
      this.setData({
        scrollLeft: 0
      });
    } else {
      /** 
       * 当超过4个时，需要判断是向左还是向右滚动，然后做相应的处理 
       */
      var plus = this.data.currentActiveNavIndex > this.data.prevActiveNavIndex ? 60 : -60;
      this.setData({
        scrollLeft: this.data.scrollLeft + plus
      });
    }
    console.info(this.data.currentActiveNavIndex, this.data.prevActiveNavIndex, this.data.scrollLeft);
  }
})  