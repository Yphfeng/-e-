
var AES = require("../common/cryptojs/cryptojs").AES;



function coding() {

  this.aes = new AES();

  
  function setPktCount() {

    wx.setStorageSync('pktCount', 0);
  }


  function codingHead(cmd, data_size) {

    // 读取缓存的pktCount值
    var pktCount = wx.getStorageSync('pktCount');
    var buffer = new ArrayBuffer(4);
    var dataView = new DataView(buffer);
    dataView.setUint8(0, (pktCount & 0x03F) << 2 | (cmd & 0x0C00) >> 10);
    dataView.setUint8(1, (cmd & 0x03FC) >> 2);
    dataView.setUint8(2, (cmd & 0x003) << 6 | data_size & 0x3F);
    var checksum = dataView.getUint8(0);
    checksum += dataView.getUint8(1);
    checksum += dataView.getUint8(2);
    checksum &= 0xFF;
    checksum = (~checksum + 1);
    dataView.setUint8(3, checksum % 256);
    pktCount = parseInt(pktCount) + 1;
    wx.setStorage({
      key: 'pktCount',
      data: pktCount,
    })
    return buffer;
  }

  this.encoding = function encodingData(cmd, dataViewParameter) {

    var buffer = new ArrayBuffer(dataViewParameter.byteLength + 4);
    var dataView = new DataView(buffer);

    var headBuffer = codingHead(cmd, dataViewParameter.byteLength);
    var headDataView = new DataView(headBuffer);
    for (var i = 0; i < headDataView.byteLength; i++) {
      dataView.setUint8(i, headDataView.getUint8(i));
    }
    // 数据
    if (dataViewParameter.byteLength > 0) {
      for (var i = 0; i < dataViewParameter.byteLength; i++) {
        dataView.setUint8(i + 4, dataViewParameter.getUint8(i));
      }
    }

    var aesBuffer = this.aes.encoding(dataView);
    var aesDataView = new DataView(aesBuffer);
    var allBuffer = new ArrayBuffer(aesDataView.byteLength + 2);
    var allDataView = new DataView(allBuffer);
    allDataView.setUint8(0, 165);
    allDataView.setUint8(1, aesBuffer.byteLength);
    for (var i = 0; i < aesDataView.byteLength; i++) {
      allDataView.setUint8(i + 2, aesDataView.getUint8(i));
    }
    // console.debug('加密后的数据')
    // for (var i = 0; i < aesDataView.byteLength; i++) {
    //   console.debug(aesDataView.getUint8(i));
    // }
    return allBuffer;
  }

  this.decoding = function decodingData(buffer) {


    let bytes = this.aes.decoding(buffer);

    var buffer = new ArrayBuffer(1);
    var pkt_head = bytes[0] * 0x1000000 + bytes[1] * 0x10000 + bytes[2] * 0x100 + bytes[3];

    var object = new Object();
    object.cmd = parseInt(pkt_head / 0x100000);
    object.pktCount = (pkt_head & 0x000FC000) >> 14
    object.dataSize = (pkt_head & 0x00003F00) >> 8
    object.data = bytes.slice(4, bytes.length);
    return object;
  }
}
module.exports = {

  coding: coding
}




