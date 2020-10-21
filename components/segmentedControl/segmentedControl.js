function setSelecteBackgroudColor() {

}
function setNormalBackgroudColor() {

}
function setSelecteTextColor() {

}
function setNormalTextColor() {

}

function setSelectedIndex(self, index) {

  switch (parseInt(index)) {
    case 0:
      self.setData({
        segmentControl: {
          backgroundColor0: "#FF7046",
          backgroundColor1: "white",
          backgroundColor2: "white",
          backgroundColor3: "white",
          color0: "white",
          color1: "#FF7046",
          color2: "#FF7046",
          color3: "#FF7046"
        }
      })
      break;
    case 1:
      self.setData({
        segmentControl: {
          backgroundColor1: "#FF7046",
          backgroundColor0: "white",
          backgroundColor2: "white",
          backgroundColor3: "white",
          color1: "white",
          color0: "#FF7046",
          color2: "#FF7046",
          color3: "#FF7046"
        }        
      })
      break;
    case 2:
      self.setData({
        segmentControl: {
          backgroundColor2: "#FF7046",
          backgroundColor1: "white",
          backgroundColor0: "white",
          backgroundColor3: "white",
          color2: "white",
          color1: "#FF7046",
          color0: "#FF7046",
          color3: "#FF7046"
        }
      })
      break;
    case 3:
      self.setData({
        segmentControl: {
          backgroundColor3: "#FF7046",
          backgroundColor1: "white",
          backgroundColor2: "white",
          backgroundColor0: "white",
          color3: "white",
          color1: "#FF7046",
          color2: "#FF7046",
          color0: "#FF7046"
        }
      })
      break;
    default:
      break;
  }
}

/**
 * 设置默认选中的UI
 */
function setDefaulIndex(self, defaultIndex) {

  setSelectedIndex(self, defaultIndex);
}

module.exports = {
  setSelectedIndex: setSelectedIndex,
  setDefaulIndex: setDefaulIndex
}