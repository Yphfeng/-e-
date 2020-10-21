let dataService = require('../../common/newService/dataService.js');
let qbDate = require('../../common/qbDate.js');
let arrExpand = require('../../common/arrayExpand.js');

function movementHandle(subkind, data, complete) {
  var _data = new Object;
  switch (subkind) {
    case 'days':
      _data.total = {
        steps: 0,
        distance: 0,
        calorie: 0
      }
      if (data) {
        let jsonData = JSON.parse(data.data);
        if (jsonData) {
          _data.total = {
            steps: jsonData.steps_num,
            distance: parseFloat(jsonData.length / 1000).toFixed(3),
            calorie: jsonData.calorie
          }
        }
      }
      break;
    case 'weeks':
      _data.total = {
        steps: 0,
        distance: 0,
        calorie: 0
      }
      _data.values = [];
      _data.categories = [];
      if (data != null && data.data != null) {
        var _steps = 0;
        var _calorie = 0;
        var _duration = 0;
        data.data.forEach(v => {
          _steps += parseInt(v.steps_num);
          _duration += parseInt(v.length);
          _calorie += parseInt(v.calorie);
          _data.values.unshift(v.steps_num);
          const categories = qbDate.timeToDate(v.time * 1000).replace(/-/g, "/");
          _data.categories.unshift(categories);
        })
        _data.total.steps = _steps;
        _data.total.calorie = _calorie;
        _data.total.distance = parseFloat(_duration / 1000).toFixed(3);
      } else {

        for (var i = 0; i < 7; i++) {
          _data.values.push(0);
          let dateString = qbDate.getNewDay(-i).replace(/-/g, "/");
          _data.categories.push(dateString);
        }
      }
      break;
    case 'mounths':
      _data.values = [];
      _data.categories = ['本周', '前一周', '前二周', '前三周'];
      _data.total = {
        steps: 0,
        distance: 0.0,
        calorie: 0
      }
      if (data != null && data.data != null) {
        for (var i = 0; i < 4; i++) {
          var itemSteps = 0;
          var itemDistance = 0;
          var itemCalorie = 0;
          if (data.data[i] && data.data[i].length > 0) {
            data.data[i].forEach(v => {
              itemSteps += parseInt(v.steps_num);
              itemDistance += parseInt(v.length);
              itemCalorie += parseInt(v.calorie);
            })
          }
          _data.values.push(itemSteps);
          _data.total.steps += itemSteps;
          _data.total.distance = parseFloat(_data.total.distance + parseFloat(itemDistance / 1000).toFixed(3)).toFixed(3);
          _data.total.calorie += itemCalorie
        }
      } else {
        for (var i = 0; i < 4; i++) {
          _data.values.push(0);
        }
      }
      break;
    case 'years':
      _data.values = [];
      _data.categories = [];
      _data.total = {
        steps: 0,
        distance: 0,
        calorie: 0
      }
      var myDate = new Date();
      let currentMonth = myDate.getMonth() + 1;
      let currentYear = myDate.getFullYear();
      var months = [];
      for (var i = 0; i < 12; i++) {
        if (currentMonth <= 0) {
          months.push(currentMonth + 12);
          _data.categories.push((currentYear - 1) + '/' + (currentMonth + 12));
        } else {
          months.push(currentMonth);
          _data.categories.push(currentYear + '/' + currentMonth);
        }
        currentMonth -= 1;
      }
      if (data != null && data.data != null) {
        months.forEach(i => {
          var itemSteps = 0;
          var itemDistance = 0;
          var itemCalorie = 0;
          data.data.forEach(v => {
            if (parseInt(v.m) == i) {
              itemSteps = parseInt(v.steps_num);
              itemDistance = parseInt(v.length);
              itemCalorie = parseInt(v.calorie);
            }
          })
          _data.values.push(itemSteps);
          _data.total.steps += itemSteps;
          _data.total.distance = parseFloat(_data.total.distance + parseFloat(itemDistance / 1000).toFixed(3)).toFixed(3);
          _data.total.calorie += itemCalorie;
        })
      } else {
        for (var i = 0; i < 12; i++) {
          _data.values.push(0);
        }
      }
      break;
    default: return;
  }
  complete(_data);
}

function heartRateHandle(subkind, responseData, requestData, complete) {
  var _hrMax = 0;
  var _hrMin = 0;
  var _categories = [];
  var _point = [];
  var _weekValues = [];
  var _MMValues = [];
  switch (subkind) {
    case 'days':
    case 'weeks':
      for (var i = 32; i < 96; i++) { // 8: 00 -- 23: 45
        var _timeNum = i * 15;
        let _hour = parseInt(_timeNum / 60);
        let _hourString = _hour < 10 ? "0" + _hour : _hour;
        let _minute = _timeNum % 60;
        let _minuteString = _minute == 0 ? "00" : _minute;
        _categories.push(_hourString + ":" + _minuteString);
        _point.push(i);
      }
      for (var i = 0; i < 32; i++) { // 00: 00 -- 07:45
        var _timeNum = i * 15;
        let _hour = parseInt(_timeNum / 60);
        let _hourString = _hour < 10 ? "0" + _hour : _hour;
        let _minute = _timeNum % 60;
        let _minuteString = _minute == 0 ? "00" : _minute;
        _categories.push(_hourString + ":" + _minuteString);
        _point.push(i);
      }
      if (subkind == 'days') {
        const _day = {
          data: [],
          name: qbDate.timeToDate(responseData.time * 1000).replace(/-/g, '/'),
          format: function (val, name) {
            return val;
          }
        };
        let _jsonData = JSON.parse(responseData.data);
        if (_jsonData) {
          _point.forEach((v, index) => {
            let _value = _jsonData[v];
            if (_value) {
              _day.data.push(_value);
              _MMValues.push(_value);
            } else {
              _day.data.push(0);
            }
          })
        } else {
          _point.forEach((v, index) => {
            _day.data.push(0);
          })
        }
        _weekValues.push(_day);
        if (_MMValues.length > 0) { 
          _hrMax = _MMValues.max();
          _hrMin = _MMValues.min();
        }
      } else if (subkind == 'weeks') {
        let _data = responseData.data ? responseData.data : [null, null, null, null, null, null, null];
        for (var i = 0; i < 7; i++) { 
          let _dateString = qbDate.getNewDay(-i).replace(/-/g, '/');
          const _day = {
            data: [],
            name: _dateString,
            format: function (val, name) {
              return val;
            }
          };
          _weekValues.push(_day);
        }

        _weekValues.forEach(v1 => {
          let _time = parseInt(qbDate.dateStringToTime(v1.name) / 1000);
          var _ret = false;
          _data.forEach((v2, index) => { 
            if (v2 && v2.time == _time) {
              var _value = null;
              _ret = true;
              let _jsonData = JSON.parse(v2.data); 
              _point.forEach((v3, index1) => {
                _value = _jsonData[v3];
                if (_value) { 
                  v1.data.push(_value);
                  _MMValues.push(_value);
                } else {
                  v1.data.push(null);
                }
              })
            }
          })
          if (_ret == false) {
            _point.forEach(v => {
              v1.data.push(0);
            })
          }
        })
        if (_MMValues.length > 0) {
          _hrMax = _MMValues.max();
          _hrMin = _MMValues.min();
        }
      }
      break;
    case 'heartRateCustom':
      console.log(responseData);
      let _startDate = qbDate.timeToDate(requestData.time_start * 1000).replace(/-/g, '/');
      let _endDate = qbDate.timeToDate(requestData.time_end * 1000).replace(/-/g, '/');
      let _hourString = parseInt((requestData.point * 15) / 60) < 10 ? "0" + parseInt((requestData.point * 15) / 60) : parseInt((requestData.point * 15) / 60);
      let _minuteString = parseInt((requestData.point * 15) % 60) < 10 ? "0" + parseInt((requestData.point * 15) % 60) : parseInt((requestData.point * 15) % 60);
      const _day = {
        data: [],
        name: _startDate + ' - ' + _endDate + '  ' + _hourString + ":" + _minuteString,
        format: function (val, name) {
          return val;
        }
      };
      let _data = responseData.data;
      let _num = Math.abs(requestData.time_start - requestData.time_end) / 86400;
      for (var i = 0; i <= _num; i++) {
        let _curTime = (requestData.time_start + i * 86400);
        let _dateString = qbDate.timeToDate(_curTime * 1000).replace(/-/g, '/');
        _categories.push(_dateString);
        if (_data && _data[_curTime]) {
          _day.data.push(_data[_curTime]);
          _MMValues.push(_data[_curTime]);
        } else {
          _day.data.push(0);
        }
      }
      _weekValues.push(_day);
      if (_MMValues.length > 0) {
        _hrMax = _MMValues.max();
        _hrMin = _MMValues.min();
      }
      break;
    default:
      return;
  }
  complete({
    max: _hrMax ? _hrMax : 0,
    min: _hrMin ? _hrMin : 0,
    values: _weekValues,
    categories: _categories
  });
}

function laserHandle(subkind, responseData, courseParameter, complete) {
  const _weekValues = [];
  const _categories = [];
  var _totalNum = 0;
  var _totalDuration = 0;
  courseParameter.forEach(v => {
    const _day = {
      data: [],
      name: v.start_time,
      format: function (val, name) {
        return val;
      }
    }
    _weekValues.push(_day);
  })
  switch (subkind) {
    case 'weeks':
      if (responseData) {
        for (var i = 0; i < 7; i++) { 
          let _dateString = qbDate.getNewDay(-i).replace(/-/g, '/');
          let _time = parseInt(qbDate.dateStringToTime(_dateString) / 1000);
          var _isWrietToday = false;
          responseData.forEach(v => { 
            if (v.time == _time) {
              let _jsonData = JSON.parse(v.data);
              if (_jsonData) {
                _isWrietToday = true;
                _weekValues.forEach(v2 => {
                  var _isWrite = false;
                  _jsonData.forEach(v1 => {
                    if (v1.start_time == v2.name) {
                      _totalDuration += parseInt(v1.time);
                      _totalNum += 1;
                      _isWrite = true;
                      v2.data.push(v1.time);
                    }
                  })
                  if (_isWrite == false) {
                    v2.data.push(0);
                  }
                })
              }
            }
          })
          if (_isWrietToday == false) {
            _weekValues.forEach(v => {
              v.data.push(0);
            })
          }
          _categories.push(_dateString);
        }
      } else {
        for (var i = 0; i < 7; i++) { 
          let _dateString = qbDate.getNewDay(-i).replace(/-/g, '/');
          let _time = parseInt(qbDate.dateStringToTime(_dateString) / 1000);
          _weekValues.forEach(v2 => {
            v2.data.push(0);
          })
          _categories.push(_dateString);
        }
      }
      break;
    case 'mounths':
      _categories.push('本周', '前一周', '前二周', '前三周');

      if (responseData) {
        for (var i = 0; i < 4; i++) {
          _weekValues.forEach(v1 => {
            var _isWriteDay = false;
            if (responseData[i]) { 
              var _value = 0;
              responseData[i].forEach(v2 => { 
                let _jsonData = JSON.parse(v2.data);
                if (_jsonData) { 
                  _jsonData.forEach(v4 => {
                    if (v1.name == v4.start_time) { 
                      _isWriteDay = true;
                      _value += parseInt(v4.time);
                      _totalNum += 1;
                      _totalDuration += _value;
                      v1.data.push(_value);
                    }
                  })
                }
              })
            }
            if (_isWriteDay == false) {
              v1.data.push(0);
            }
          })
        }
      } else {
        for (var i = 0; i < 4; i++) {
          _weekValues.forEach(v => {
            v.data.push(0)
          })
        }
      }
      break;
    case 'years':
      var myDate = new Date();
      let currentMonth = myDate.getMonth() + 1;
      let currentYear = myDate.getFullYear();
      for (var i = 0; i < 12; i++) {
        if (currentMonth <= 0) {
          _categories.push((currentYear - 1) + '/' + (currentMonth + 12));
        } else {
          _categories.push(currentYear + '/' + currentMonth);
        }
        currentMonth -= 1;
      }
      if (responseData) {
        _categories.forEach(i => { 
          _weekValues.forEach(v1 => { 
            var _isWriteMonth = false; 
            responseData.forEach(v2 => { 
              if (i == (v2.y + '/' + parseInt(v2.m))) { 
                var _value = 0;
                v2.data.forEach(v3 => {
                  let _jsonData = JSON.parse(v3.data);
                  if (_jsonData) {
                    _jsonData.forEach(v4 => {
                      if (v4.start_time == v1.name) {
                        _isWriteMonth = true;
                        _value += parseInt(v4.time);
                        _totalNum += 1;
                        _totalDuration += _value;
                        v1.data.push(_value);
                      }
                    })
                  }
                })
              }
            })
            if (_isWriteMonth == false) { 
              v1.data.push(0)
            }
          })
        })
      } else {
        for (var i = 0; i < 12; i++) {
          _weekValues.forEach(v => {
            v.data.push(0)
          })
        }
      }
      break;
    default:
      return;
  }

  complete({
    totalNum: _totalNum,
    totalDuration: _totalDuration,
    values: _weekValues,
    categories: _categories
  });
}

function movement(subkind, complete, fail) {
  var _type;
  switch (subkind) {
    case 'days': _type = 0; break;
    case 'weeks': _type = 1; break;
    case 'mounths': _type = 2; break;
    case 'years': _type = 3; break;
    default: return;
  }
  dataService.getMotionData({
    type: _type,
    week_num: 1,
  }, function (res) {
    if (res.statusCode == 200 && res.data.status == 1) {
      movementHandle(subkind, res.data, complete)
    } else {
      wx.showToast({ icon: 'none', title: '网络出错', });
      fail();
    }
  }, function (err) {
    wx.showToast({ icon: 'none', title: '网络出错', });
    fail();
  });
}

function laser(subkind, data, courseParameter, complete, fail) {

  dataService.getLaserData(data, function (res) {
    if (res.statusCode == 200 && res.data.status == 1) {
      laserHandle(subkind, res.data.data, courseParameter, complete)
    } else {
      wx.showToast({ icon: 'none', title: '网络出错', });
      fail();
    }
  }, function (err) {
    wx.showToast({ icon: 'none', title: '网络出错', });
    fail();
  });
}

function heartRate(subkind, data, complete) {
  if (data.type == 2) {
    data.time_start = qbDate.dateStringToTime(data.time_start) / 1000;
    data.time_end = qbDate.dateStringToTime(data.time_end) / 1000;
  }
  dataService.getHeartRateData(data, function (res) {
    if (res.statusCode == 200 && res.data.status == 1) {
      heartRateHandle(subkind, res.data, data, complete)
    } else {
      wx.showToast({ icon: 'none', title: '网络出错', });
    }
  }, function (err) {
    wx.showToast({ icon: 'none', title: '网络出错', });
  });
}

function courseList(complete, fail) {
  dataService.getUserCourseSnList(complete, fail);
}
module.exports = {
  movement: movement,
  laser: laser,
  heartRate: heartRate,
  courseList: courseList
}