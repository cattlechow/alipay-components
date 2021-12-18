Page({
  data: {
    list: [
      {
        id: 1,
        title: "日期选择",
        url: "/pages/dateTimePicker/index"
      },
       {
        id: 2,
        title: "日期选择(预约制)",
        url: "/pages/dateTimeHalfHourPicker/index"
      }
    ]
  },
  navigateTo(e) {
    let url = e.target.dataset.url
    my.navigateTo({
      url
    })
  }
});
