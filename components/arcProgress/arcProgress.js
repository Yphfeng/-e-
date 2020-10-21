
Component({
  properties: {
    steps: {
      type: String,
      value: "16,000"
    },
    width: {
      type: String,
      value: "200"
    }
  },
  data: {
    isShow: false
  },
  methods: {

  },
  created: function () {


  },

  ready: function () {

    const width = this.properties.width;
    const ctx = wx.createCanvasContext("daysArc", this);
    ctx.translate(width / 2, width / 2);
    
    ctx.rotate(0.5 * Math.PI);

    ctx.beginPath()
    ctx.arc(0, 0, width / 2, 0, 2 * Math.PI)
    ctx.clip();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.translate(-width / 2, -width / 2);
    const grd = ctx.createLinearGradient(0, 0, 0, width)
    grd.addColorStop(0, '#f35b4a')
    grd.addColorStop(1, 'yellow')
    ctx.setFillStyle(grd);
    ctx.fillRect(0, 0, width, width);
    ctx.closePath();

    ctx.beginPath();
    ctx.translate(width / 2, width / 2);
    ctx.arc(0, 0, width / 2 - 10, 0, 2 * Math.PI);
    ctx.setFillStyle("white");
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.setFontSize(18);
    ctx.setTextAlign('center');
    ctx.setTextBaseline('middle');
    ctx.setFillStyle('black');
    ctx.fillText('今日步数', 0, -35)
    ctx.setFontSize(35);
    ctx.fillText(this.properties.steps, 0, 10)
    ctx.closePath();

    ctx.draw();

    setTimeout(function(){
      this.setData({
        isShow: true
      })
    }.bind(this), 1000)
  }

  // ready: function () {

  //   var step = parseInt(this.properties.steps), startAngle = 0.75 * Math.PI, endAngle = 0;
  //   var endAngle = parseFloat(step * 2 * Math.PI / parseInt(this.properties.targetValue) + startAngle).toFixed(3);
  //   // 背景canvas、
  //   const progressCanvas = wx.createCanvasContext('arcProgress', this);
  //   progressCanvas.translate(this.properties.width / 2, this.properties.width / 2);
  //   progressCanvas.rotate(0.5 * Math.PI);
  //   progressCanvas.beginPath();
  //   progressCanvas.arc(0, 0, this.properties.width / 2 - 10, startAngle, 0.25 * Math.PI);
  //   progressCanvas.setLineWidth(10);
  //   progressCanvas.setLineCap("round");
  //   progressCanvas.setStrokeStyle("lightgray");
  //   progressCanvas.stroke();
  //   progressCanvas.closePath();
  //   progressCanvas.draw();

  //   // progress canvas
  //   const ctx = wx.createCanvasContext("arcProgress2", this);
  //   ctx.translate(this.properties.width / 2, this.properties.width / 2);
  //   ctx.rotate(0.5 * Math.PI);
  //   ctx.arc(0, 0, this.properties.width / 2 - 10, 0.75 * Math.PI, endAngle);
  //   ctx.setLineWidth(10);
  //   ctx.setLineCap("round");
  //   ctx.setStrokeStyle("#f35b4a");
  //   ctx.stroke();
  //   ctx.setTextAlign("center");
  //   ctx.setTextBaseline("middle");
  //   ctx.setFontSize(40);
  //   ctx.fillText(this.properties.steps, 0, 10);
  //   ctx.setFontSize(30);
  //   ctx.fillText(this.properties.calories, 0, -40);
  //   ctx.draw();

  //   setTimeout(function(){
  //     this.setData({
  //       isShow: true
  //     })
  //   }.bind(this), 1000)
  // },
})