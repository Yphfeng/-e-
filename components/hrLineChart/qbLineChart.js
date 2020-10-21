


function assign(target, varArgs) {
  if (target == null) {
    // TypeError if undefined or null
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var to = Object(target);

  for (var index = 1; index < arguments.length; index++) {
    var nextSource = arguments[index];

    if (nextSource != null) {
      // Skip over if undefined or null
      for (var nextKey in nextSource) {
        // Avoid bugs when hasOwnProperty is shadowed
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return to;
}

var util = {
  toFixed: function toFixed(num, limit) {
    limit = limit || 2;
    if (this.isFloat(num)) {
      num = num.toFixed(limit);
    }
    return num;
  },
  isFloat: function isFloat(num) {
    return num % 1 !== 0;
  },
  approximatelyEqual: function approximatelyEqual(num1, num2) {
    return Math.abs(num1 - num2) < 1e-10;
  },
  isSameSign: function isSameSign(num1, num2) {
    return Math.abs(num1) === num1 && Math.abs(num2) === num2 || Math.abs(num1) !== num1 && Math.abs(num2) !== num2;
  },
  isSameXCoordinateArea: function isSameXCoordinateArea(p1, p2) {
    return this.isSameSign(p1.x, p2.x);
  },
  isCollision: function isCollision(obj1, obj2) {
    obj1.end = {};
    obj1.end.x = obj1.start.x + obj1.width;
    obj1.end.y = obj1.start.y - obj1.height;
    obj2.end = {};
    obj2.end.x = obj2.start.x + obj2.width;
    obj2.end.y = obj2.start.y - obj2.height;
    var flag = obj2.start.x > obj1.end.x || obj2.end.x < obj1.start.x || obj2.end.y > obj1.start.y || obj2.start.y < obj1.end.y;

    return !flag;
  }
};

var config = {
  yAxis: {
    acturalHeight: 0, // 实际高度
    stratY: 0,              // y轴开始的y值
    endlY: 0,               // y轴结束的y值
    scaleStartY: 0,       // 刻度开始的坐标
    scaleHeight: 0        // 刻度的间隔高度
  },
  dataDrawRect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  xAxis: {
    width: 0,
    count: 0
  }
}
function drawYAxis(opts, context) {

  // y轴实际高度 = 画布高度-顶部间距 - 底部间距 - x轴文字区域高度
  config.yAxis.acturalHeight = opts.canvas.style.height - opts.canvas.style.topEdg - opts.canvas.style.bottomEdg - 20;
  config.yAxis.scaleHeight = (config.yAxis.acturalHeight - opts.yAxis.unitHeight) / opts.yAxis.scaleCount;
  config.yAxis.scaleStartY = opts.canvas.style.topEdg + opts.yAxis.unitHeight;

  config.yAxis.stratY = opts.canvas.style.topEdg;
  config.yAxis.endlY = opts.canvas.style.height - opts.canvas.style.bottomEdg - opts.xAxis.height;

  // 纵线
  context.beginPath();
  context.moveTo(opts.yAxis.width + opts.canvas.style.leftEdg, config.yAxis.stratY);
  context.lineTo(opts.yAxis.width + opts.canvas.style.leftEdg, config.yAxis.endlY);
  context.setStrokeStyle(opts.yAxis.lineColor);
  context.stroke();
  context.closePath();

  // 文字
  // 计算Y轴文字
  var yAxisTexts = [];
  const avg = parseInt(opts.yAxis.maxValue / opts.yAxis.scaleCount);
  for (var i = 0; i <= 5; i++) {
    const text = opts.yAxis.maxValue - avg * i;
    yAxisTexts.push(text);
  }

  yAxisTexts.forEach((text, index) => {

    const yValue = index * config.yAxis.scaleHeight + opts.canvas.style.topEdg + opts.yAxis.unitHeight;
    // 文字
    context.beginPath();
    context.setTextBaseline(opts.yAxis.textBaseline);
    context.setFontSize(opts.yAxis.textFontSize);
    context.setTextAlign(opts.yAxis.textAlign);
    context.setFillStyle(opts.yAxis.textColor);
    context.fillText(text, opts.canvas.style.leftEdg, yValue);
    context.closePath();

    if (index != 0) {
      context.beginPath();
      context.moveTo(config.dataDrawRect.x, yValue);
      context.lineTo(opts.canvas.style.width - opts.canvas.style.rightEdg, yValue);
      if (index < opts.yAxis.scaleCount) {
        context.setStrokeStyle(opts.xAxis.bgLineColor);
      } else {
        context.setStrokeStyle(opts.xAxis.lineColor);
      }
      context.stroke();
      context.closePath();
    }

    // 刻度线
    if (index != yAxisTexts.length - 1) {
      context.beginPath();
      context.moveTo(opts.yAxis.width + opts.canvas.style.leftEdg - opts.yAxis.sacleWidth, yValue);
      context.lineTo(opts.yAxis.width + opts.canvas.style.leftEdg, yValue);
      context.setStrokeStyle(opts.yAxis.lineColor);
      context.stroke();
      context.closePath();
    }
  });
  context.save();
  context.draw(true);
}
function drawXAxis(opts, context, xoffset) {

  // context.restore();
  // console.log(opts);
  // console.log(context);
  // console.log(config);
  // 清空画布
  context.clearRect(config.dataDrawRect.x, config.dataDrawRect.y, config.dataDrawRect.width, config.dataDrawRect.height);
  context.draw(true);
  // 画横轴
  var yValue = opts.yAxis.scaleCount * config.yAxis.scaleHeight + config.yAxis.scaleStartY;
  // 画刻度尺
  // 1、左侧下标；2、右侧下标
  const leftIndex = parseInt(xoffset / opts.xAxis.scaleWidth);
  const rightIndex = leftIndex + config.xAxis.count;
  var xDrawTexts = [];
  // 绘制
  opts.xAxis.texts.forEach((text, index) =>{

      if (index >= leftIndex && index <= rightIndex) {
        xDrawTexts.push(text);
      }
  });
  const baseOffset = config.dataDrawRect.x + (xoffset % opts.xAxis.scaleWidth);

  xDrawTexts.forEach((text, index) => {
    // 文字
    const xValue = baseOffset + index * opts.xAxis.scaleWidth;
    
    if (index != 0) {
      context.beginPath();
      context.moveTo(xValue, yValue);
      context.lineTo(xValue, yValue + opts.xAxis.scaleHeight);
      context.stroke();
      context.closePath();
      context.beginPath();
      context.setTextAlign(opts.xAxis.textAlign);
      context.setFontSize(opts.xAxis.textFontSize);
      context.setFillStyle(opts.xAxis.textColor);
      context.fillText(text, xValue, yValue + opts.xAxis.scaleHeight + opts.xAxis.textToLineEdg);
      context.closePath();
    }
  });
  context.draw(true);
}
var LineChart = function LineChart(opts) {

  this.context = wx.createCanvasContext(opts.canvas.id);
  // 计算xAxisDraw区域
  const dataDrawRect = {
    x: opts.canvas.style.leftEdg + opts.yAxis.width,
    y: opts.canvas.style.topEdg,
    width: opts.canvas.style.width - opts.canvas.style.leftEdg - opts.yAxis.width,
    height: opts.canvas.style.height - opts.canvas.style.topEdg - opts.canvas.style.bottomEdg,
  }
  config.dataDrawRect = dataDrawRect;
  config.xAxis.width = opts.canvas.style.width - opts.canvas.style.leftEdg - opts.canvas.style.rightEdg - opts.yAxis.width;
  config.xAxis.count = parseInt(config.xAxis.width / opts.xAxis.scaleWidth);

  this.opts = opts;
  this.xoffset = 0;
  this.xMaxOffset = opts.canvas.series[0].data.length * opts.xAxis.scaleWidth - config.xAxis.width;
  
  drawYAxis.call(this, this.opts, this.context);
  drawXAxis.call(this, this.opts, this.context, this.xoffset);
}

LineChart.prototype.touchstart = function(e) {
    const x = e.changedTouches[0].x;
    this.oldX = x;
}

LineChart.prototype.touchmove = function(e) {

  const x = e.changedTouches[0].x;
  if (this.oldX < x) {
    this.xoffset -= x - this.oldX;
  } else if (this.oldX > x) {
    this.xoffset += this.oldX - x;
  }
  this.oldX = x;
  if (this.xoffset < 0) {
    this.xoffset = 0;
    wx.showToast({ title: '已到最左侧', });
    return;
  } else if (this.xoffset >= this.xMaxOffset) {
    this.xoffset = this.xMaxOffset;
    wx.showToast({ title: '已到最右侧', });
    return;
  }
  drawXAxis.call(this, this.opts, this.context, this.xoffset);
}

LineChart.prototype.restore = function() {
  console.log("here");
  // this.context.restore();
  
  this.xoffset += 30;
  drawXAxis.call(this, this.opts, this.context, this.xoffset);
}

module.exports = LineChart;