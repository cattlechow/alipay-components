import datePicker from './datePickerBase';

const { getDaysArr } = require('./js/handleDateArr');

Component({
  data: {
    value: [0, 0],
    defaultValue: [0, 0],
    dateTimeData: [], // 原始日期数据
    dateTimesArr: [], // 处理后日期时间数组
    dateRange:[]
  },
  didMount() {
    this.doGetDaysArr(this.props.selectedTimeArr)
    // this.setData({
    //   value: this.data.defaultValue,
    //   'dateTimesArr[0]': this.data.dateTimeData[0],
    //   'dateTimesArr[1]': this.data.dateTimeData[1][0]
    // });
  },
  methods: {

    // 获取日期数据
    doGetDaysArr(selectedTimeArr) {
      let dateTimeData = getDaysArr(2)
      let myDate = new Date();
      let _hour = myDate.getHours();       //获取当前小时数(0-23)
      let _minutes  = myDate.getMinutes();     //获取当前分钟数(0-59)
      // 今 明
      let dateRange = ["今天","明天"]
      if((_hour>=17 && _hour<24) || (16==_hour&&_minutes>30)){
        // 第一天的16:30之后 第二天之前
        dateTimeData[0].splice(0,1)
        dateTimeData[1].splice(0,1)
        dateRange.splice(0,1)
        selectedTimeArr.splice(0,1)
      }
      dateTimeData[1][0] = dateTimeData[1][0].map(item=> {
        if(selectedTimeArr[0].includes(item)) {
          return `${item}-已被预订`
        }else {
          return item
        }
      })
      // 存在第二天
      if(dateTimeData&& dateTimeData[1] && dateTimeData[1][1] && dateTimeData[1][1].length>0){
        dateTimeData[1][1] = dateTimeData[1][1].map(item=> {
        if(selectedTimeArr[1].includes(item)) {
          return `${item}-已被预订`
        }else {
          return item
        }
      })
      }
      this.setData({
        dateTimeData,
        dateRange,
        value: this.data.defaultValue,
        'dateTimesArr[0]': dateTimeData[0],
        'dateTimesArr[1]': dateTimeData[1][0]
      });
    },

    /**
     * 将 picker 选择的日期数组,生成日期 字符串
     * @param dateTimeData  // 原始的日期数组
     * @param dateIndexArr  // 日期索引数组
     */
    doTransDateStr(dateTimeData, dateIndexArr) {
      const _dayIndex = dateIndexArr[0];
      const _timeIndex = dateIndexArr[1];
      return `${dateTimeData[0][_dayIndex]} ${dateTimeData[1][_dayIndex][_timeIndex]}`;
    },

    hide() {
      this.props.onHidePicker();
    },
    onChange(e) {
      let _val = e.detail.value;
      const _timesArr = this.data.dateTimeData[1][_val[0]];

      // 判断一下当前的时间的 index 是否大于时间数组的长度,
      // 要是大的话,把 index 置为0,
      // 这是为了防止选择了 index 较大的时间点后,
      // 切换日期,时间数组却没有更新的问题
      if (_val[1] > _timesArr.length) {
        _val[1] = 0;
      }

      this.setData({
        value: _val,
        'dateTimesArr[1]': _timesArr
      });

    },
    onConfirm(e) {
      
      const dateIndexArr = this.data.value
      // 生成时间字符串
      const _dateStr = this.doTransDateStr(this.data.dateTimeData, dateIndexArr)
      if(_dateStr.indexOf("已被预订") !== -1) {
        my.showToast({
          type: 'fail',
          content: '当前时间段已被预订',
          duration: 2000,
        })
        return
      }

      // 作为参数传递给调用组价方
      this.props.onConfirm(_dateStr);

      this.hide();
    },
    onCancel() {
      this.hide();
    }
  }
});
