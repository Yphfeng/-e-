

var locationDate = function getLocationSystemDate() {

  var myDate = new Date();
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return year + '年' + month + '月' + day + '日 ' + hour + ':' + minute + ':' + second;
}

function currentTime() {
  var now = new Date();

  var year = now.getFullYear();       //年
  var month = now.getMonth() + 1;     //月
  var day = now.getDate();            //日

  var hh = now.getHours();            //时
  var mm = now.getMinutes();          //分
  var ss = now.getSeconds();          //分

  var clock = year + "-";

  if (month < 10)
    clock += "0";

  clock += month + "-";

  if (day < 10)
    clock += "0";

  clock += day + " ";

  if (hh < 10)
    clock += "0";

  clock += hh + ":";
  if (mm < 10)
    clock += '0';

  clock += mm + ":";

  if (ss < 10)
    clock += '0';
  clock += ss;
  return (clock);
}

var timestamp = Date.parse(new Date());

function getNewDay(days) {

  var nd = new Date();
  nd = nd.valueOf();
  nd = nd + days * 24 * 60 * 60 * 1000;
  nd = new Date(nd);
  var y = nd.getFullYear();
  var m = nd.getMonth() + 1;
  //获取当前天
  var d = nd.getDate();
  if (m <= 9) m = "0" + m;
  if (d <= 9) d = "0" + d;
  var cdate = y + "-" + m + "-" + d;
  console.log(cdate,'取激光数据的时间参数')
  return cdate;
}

function getNewDay2(dateString, days) {
  
  var nd = new Date(dateString);
  nd = nd.valueOf();
  nd = nd + days * 24 * 60 * 60 * 1000;
  nd = new Date(nd);
  var y = nd.getFullYear();
  var m = nd.getMonth() + 1;
  var d = nd.getDate();
  if (m <= 9) m = "0" + m;
  if (d <= 9) d = "0" + d;
  var cdate = y + "-" + m + "-" + d;
  return cdate;
  

}

/**
 * 计算两个日期间的天数
 */
function dateDiff(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式 
  var aDate, oDate1, oDate2, iDays;
  aDate = sDate1.split("-");
  oDate1 = Date.parse(aDate[1] + '/' + aDate[2] + '/' + aDate[0]); //转换为12-18-2006格式 
  aDate = sDate2.split("-");
  oDate2 = Date.parse(aDate[1] + '/' + aDate[2] + '/' + aDate[0]);
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); 
  //把相差的毫秒数转换为天数 
  return iDays;
}


Date.prototype.format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

function timeToDate(time) {

  var newDate = new Date();
  newDate.setTime(time);
  return  newDate.format('yyyy-MM-dd');
}

function dateStringToTime(dateString) {
  var date = new Date(dateString);
  var date = new Date(dateString.replace(/-/g, '/'));
  return Math.round(date.getTime());
}

/*
 *   功能:实现VBScript的DateAdd功能.
 *   参数:interval,字符串表达式，表示要添加的时间间隔.
 *   参数:number,数值表达式，表示要添加的时间间隔的个数.
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 *   var now = new Date();
 *   var newDate = DateAdd( "d", 5, now);
 *---------------   DateAdd(interval,number,date)   -----------------
 */
function DateAdd(interval, number, date) {
  switch (interval) {
    case "y ": {
      date.setFullYear(date.getFullYear() + number);
      return date;
      break;
    }
    case "q ": {
      date.setMonth(date.getMonth() + number * 3);
      return date;
      break;
    }
    case "m ": {
      date.setMonth(date.getMonth() + number);
      return date;
      break;
    }
    case "w ": {
      date.setDate(date.getDate() + number * 7);
      return date;
      break;
    }
    case "d ": {
      date.setDate(date.getDate() + number);
      return date;
      break;
    }
    case "h ": {
      date.setHours(date.getHours() + number);
      return date;
      break;
    }
    case "m ": {
      date.setMinutes(date.getMinutes() + number);
      return date;
      break;
    }
    case "s ": {
      date.setSeconds(date.getSeconds() + number);
      return date;
      break;
    }
    default: {
      date.setDate(date.getDate() + number);
      return date;
      break;
    }
  }
}


module.exports = {

  locationDate: locationDate,
  timestamp: timestamp,
  currentTime: currentTime,
  getNewDay: getNewDay,
  dateDiff: dateDiff,
  timeToDate: timeToDate,
  dateStringToTime: dateStringToTime,
  getNewDay2: getNewDay2,
  DateAdd: DateAdd
}