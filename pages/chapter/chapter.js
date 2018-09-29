// pages/chapter/chapter.js
Page({
  data: {
    /** 
     * 导航数据 
     */
    topNavs: ["l99", "lll"],

    avatarUrl: "http://oxpfrja7o.bkt.clouddn.com/18-9-22/55891526.jpg",
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
    list: [],
    //存放文章的对象数组
    // articleList:[],
    //存放chapter标题与文章列表的字典（就是Map）
    dataMap: {},
    //该字典用来存放标题与改标题下page的数量的对应关系
    pageIndexMap: {},
    //当前标题名字
    curNavName: "",
    //页面展示数据
    uiData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.list = []
    console.log("接收到的参数是list=")
    this.data.list = getApp().globalData.chapterList;
    // this.data.list = JSON.parse(options.list); 
    var tempArr = []
    for (var i = 0; i < this.data.list.length; i++) {
      tempArr[i] = this.data.list[i].name
      this.data.pageIndexMap[tempArr[i], 1]
    }
    this.setData({
      list: getApp().globalData.chapterList,
      topNavs: tempArr
    })

    this.getArticleList(0, true)
  },

  onItemClick: function (event) {
    console.log(event)
    console.log(event.currentTarget.dataset.item)
    var articleUrl = event.currentTarget.dataset.item.link;
    var articleTitle = event.currentTarget.dataset.item.title;
    wx.navigateTo({
      url: '/pages/article/article?url=' + articleUrl + "&title=" + articleTitle,
    });
  },


  /**
   * 网络请求
   * 下拉刷新
   */
  refresh: function () {
    this.getArticleList(this.data.currentActiveNavIndex,true)
  },

  /**
   * 上拉加载更多
   */
  getMoreData: function () {
    this.getArticleList(this.data.currentActiveNavIndex, false)
  },

  /**
   * 获取对应chapterId的文章列表
   */
  getArticleList(chapterIndex, isRefresh) {
    var that = this
    var chapterName = this.data.topNavs[chapterIndex]
    var pageIndex = isRefresh ? 1 : this.data.pageIndex.get(chapterName) + 1
    var chapterId = this.data.list[chapterIndex].chapterId
    wx.request({
      url: 'http://www.wanandroid.com/project/list/' + pageIndex + '/json?cid=' + chapterId,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        var dataList = []
        if (isRefresh) {
          dataList = res.data.data.datas
        } else {
          dataList = that.data.dataMap.get(chapterName).concat(res.data.data.datas)

        }
        console.log(that.data.curPageIndex + "合并后的List长度" + dataList.length)
        that.setData({
          'dataMap.get(chapterName)': dataList,
          'pageIndexMap.get(chapterName)': isRefresh ? 1 : pageIndex,
          uiData: dataList
        });
        if (pageIndex == 0) {
          wx.stopPullDownRefresh()
        }
        wx.hideNavigationBarLoading()

      }
    })
  },

  /** 
   * 顶部导航改变事件，即被点击了 
   * 1、如果2次点击同一个当航，则不做处理 
   * 2、需要记录本次点击和上次点击的位置 
   */
  topNavChange: function(e) {
    var nextActiveIndex = e.currentTarget.dataset.currentIndex,
      currentIndex = this.data.currentActiveNavIndex;
    if (currentIndex != nextActiveIndex) {
      this.setData({
        currentActiveNavIndex: nextActiveIndex,
        prevActiveNavIndex: currentIndex
      });

      var chapterName = this.data.topNavs[chapterIndex]
      var pageIndex = this.data.pageIndex.get(chapterName)
      if (pageIndex == 1) {
        var data = this.data.dataMap.get(chapterName)
        this.setData({
          uiData: chapterName
        })
      } else {
        this.getArticleList(nextActiveIndex, true)
      }
    }
  },
  /** 
   * swiper滑动时触发 
   * 1、prevIndex != currentIndex 表示的是用手滑动 swiper组件 
   * 2、prevIndex = currentIndex  表示的是通过点击顶部的导航触发的 
   */
  swiperChange: function(e) {
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
  scrollTopNav: function() {
    /** 
     * 当激活的当航小于4个时，不滚动 
     */
    if (this.data.currentActiveNavIndex <= 2 && this.data.scrollLeft >= 0) {
      this.setData({
        scrollLeft: 0
      });
    } else {
      /** 
       * 当超过4个时，需要判断是向左还是向右滚动，然后做相应的处理 
       */
      
      //根据字符大小来计算滚动距离
      console.log(this.data.list)
      var offset=0
      var curNavName = this.data.topNavs[this.data.prevActiveNavIndex]
      console.log("当前的章节名字：")
      console.log(curNavName)
      // var letterCount=curNavName.length;
      // re = '/[\u4E00-\u9FA5]/g';  //测试中文字符的正则
      // if (re.test(curNavName))        //使用正则判断是否存在中文
      // {
      //   var chineseLetterCount=curNavName.match(re).length
      //   //每个汉字给20个单位距离
      //   offset =chineseLetterCount*20+(letterCount-chineseLetterCount)*10+20
      // }else{
      //   //如果没有中文，每一个因为字幕给10个像素，另外加两边固定留白的20个像素
      //   offset = letterCount * 10 + 20
      // }

      var letterCount=this.getByteLen(curNavName);
      var offset=letterCount*8+32
      var plus = this.data.currentActiveNavIndex > this.data.prevActiveNavIndex ? offset : -offset;
      console.log("当前滚动偏移量："+letterCount)
      this.setData({
        scrollLeft: this.data.scrollLeft + plus
      });
    }
    console.info(this.data.currentActiveNavIndex, this.data.prevActiveNavIndex, this.data.scrollLeft);
  },
  //计算字符串长度包含中文
  getByteLen: function (val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
      var a = val.charAt(i);
      if (a.match(/[^\x00-\xff]/ig) != null) {
        len += 2;
      } else {
        len += 1;
      }
    }
    return len;
  }
})
 