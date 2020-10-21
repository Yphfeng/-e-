Component({
  properties: {
    pageinfo: Object
  },
  data: {
    isShow: false,
    pageinfo: ""
  },
  methods:{
    pagepre(){
      var pageinfo = this.data.pageinfo;
      if (pageinfo.pageIndex!=1){
        this.triggerEvent("changepage", --this.data.pageinfo.pageIndex);
      }
    },
    pagenext(){
      var pageinfo = this.data.pageinfo;
      if (pageinfo.pageIndex != this.data.pageinfo.pagesum) {
        this.triggerEvent("changepage", ++this.data.pageinfo.pageIndex);
      }
    }
  }

})