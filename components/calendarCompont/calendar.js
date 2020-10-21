// components/calendarCompont/calendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: String,
      value: 200
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  attached: function() {

    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    const weeksCh = ['日', '一', '二', '三', '四', '五', '六'];
    this.setData({
      curYear,
      curMonth,
      weeksCh,
      hasEmptyGrid: false,
    })
    let self = this;
    calculateDays(curYear, curMonth, self);
    calculateEmptyGrids(curYear, curMonth, self);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleCalendar(e) {
      let self = this;
      const handle = e.currentTarget.dataset.handle;
      const curYear = this.data.curYear;
      const curMonth = this.data.curMonth;
      if (handle === 'prev') {
        let newMonth = curMonth - 1;
        let newYear = curYear;
        if (newMonth < 1) {
          newYear = curYear - 1;
          newMonth = 12;
        }

        calculateDays(newYear, newMonth, self);
        calculateEmptyGrids(newYear, newMonth, self);

        this.setData({
          'curYear': newYear,
          'curMonth': newMonth,
        });
      } else {
        let newMonth = curMonth + 1;
        let newYear = curYear;
        if (newMonth > 12) {
          newYear = curYear + 1;
          newMonth = 1;
        }

        calculateDays(newYear, newMonth, self);
        calculateEmptyGrids(newYear, newMonth, self);
        this.setData({
          'curYear': newYear,
          'curMonth': newMonth
        });
      }
    },
    tapDayItem(e) {
      const idx = e.currentTarget.dataset.idx;
      const days = this.data.days;
      days.forEach((v, index) => {
        if (index == idx) {
          v.choosed = !v.choose
        } else {
          v.choosed = false
        }
      })
      this.setData({
        'days': days,
      });
      this.triggerEvent('daySelectedEvent', { 'year': this.data.curYear, "month": this.data.curMonth, "day": days[idx].day});
    },
    chooseYearAndMonth() {
      let pickerYear = [];
      let pickerMonth = [];
      for (let i = 1900; i <= 2100; i++) {
        pickerYear.push(i);
      }
      for (let i = 1; i <= 12; i++) {
        pickerMonth.push(i);
      }
      this.setData({
        'showPicker': true,
      });
    },
  }
})

function getThisMonthDays(year, month) {
  return new Date(year, month, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  return new Date(Date.UTC(year, month - 1, 1)).getDay();
}
function calculateEmptyGrids(year, month, self) {
  const firstDayOfWeek = getFirstDayOfWeek(year, month);
  let empytGrids = [];
  if (firstDayOfWeek > 0) {
    for (let i = 0; i < firstDayOfWeek; i++) {
      empytGrids.push(i);
    }
    self.setData({
      'hasEmptyGrid': true,
      'empytGrids': empytGrids,
    });
  } else {
    self.setData({
      'hasEmptyGrid': false,
      'empytGrids': [],
    });
  }
}
function calculateDays(year, month, self) {
  let days = [];

  const thisMonthDays = getThisMonthDays(year, month);

  for (let i = 1; i <= thisMonthDays; i++) {
    days.push({
      day: i,
      choosed: false
    });
  }
  self.setData({
    'days': days,
  });
}
