Component({
  properties: {
    pageinfo: Object
  },
  data: {
    isShow: false,
    pageinfo:""
  },
  methods: {
    changgeindex(e){

    },
    //页数的显示隐藏
    changeshow() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    // 点击上一页
    pagepre(){
      if (this.data.pageinfo.pageindex == 1)return;
      var pageinfo = this.data.pageinfo;
      pageinfo.pageindex = this.data.pageinfo.pageindex - 1;
      this.setData({
        pageinfo: pageinfo
      })
      this.triggerEvent("changepage", this.data.pageinfo.pageindex);
    },
    // 点击下一页
    pagenext(){
      if (this.data.pageinfo.pageindex == this.data.pageinfo.pagesum) return;
      var pageinfo = this.data.pageinfo;
      pageinfo.pageindex = this.data.pageinfo.pageindex + 1;
      this.setData({
        pageinfo: pageinfo
      })
      this.triggerEvent("changepage", this.data.pageinfo.pageindex);
    },
    changindex(e){
      var pageindex = e.currentTarget.dataset.index;
      if (this.data.pageinfo.pageindex == pageindex)return;
      var pageinfo = this.data.pageinfo;
      pageinfo.pageindex = pageindex;
      this.setData({
        pageinfo: pageinfo
      })
      this.triggerEvent("changepage", pageindex);
    }
  },
  
})