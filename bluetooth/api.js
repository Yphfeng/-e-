//系统时间同步
let kGXYL_TimeSync = 0x0C00
//手机通知提醒暂无
let kGXYL_SOS = 0x0160
//获取设备电量
let kGXYL_GetEQ = 0x0900
//获取设备时间
let kGXYL_GetTime = 0x0800
//获取设备信息
let kGXYL_GetDeviceInfo = 0x0980
//恢复出厂状态
let kGXYL_RestoreFactorySettings = 0x0FE1
//石英时间校准
let kGXYL_setPointer = 0x0C01
//激光疗程参数
let kGXYL_LaserRegimenParameters = 0x0480
//激光手动输出参数
let kGXYL_LaserManuallyParameters = 0x0481
//手动激光付费参数
let kGXYL_LaserManuallyPayParameters = 0x0482
//开光激光输出
let kGXYL_LaserIsOpen = 0x0483
//心率自动监测
let kGXYL_HRAutomaticallIsOpen = 0x04A0
//开关心率监测
let kGXYL_HRManuallyIsOpen = 0x04A1
//实时步数心率
let kGXYL_RealtimeIsOpen = 0x0120
//获取激光疗程参数
let kGXYL_GetLaserRegimenParameters = 0x0880
//获取激光手动参数
let kGXYL_GetLaserManuallyParameters = 0x0881
//获取激光开关状态
let kGXYL_GetManuallyLaserState = 0x0885
//获取激光治疗记录
let kGXYL_GetLaserRecording = 0x0886
//获取心率自动参数
let kGXYL_GetAutoHRState = 0x08A0
//获取心率开关状态
let kGXYL_GetManuallyHRState = 0x08A1
//获取心率监测记录
let kGXYL_GetHRRecording = 0x08A2
//获取记步数据
let kGXYL_GetMotionRecording = 0x08E0

module.exports = {
  kGXYL_TimeSync: kGXYL_TimeSync,
  kGXYL_SOS: kGXYL_SOS,
  kGXYL_GetEQ: kGXYL_GetEQ,
  kGXYL_GetTime: kGXYL_GetTime,
  kGXYL_setPointer: kGXYL_setPointer,
  kGXYL_GetDeviceInfo: kGXYL_GetDeviceInfo,
  kGXYL_RealtimeIsOpen: kGXYL_RealtimeIsOpen,
  kGXYL_LaserRegimenParameters: kGXYL_LaserRegimenParameters,
  kGXYL_LaserManuallyParameters: kGXYL_LaserManuallyParameters,
  kGXYL_LaserManuallyPayParameters: kGXYL_LaserManuallyPayParameters,
  kGXYL_LaserIsOpen: kGXYL_LaserIsOpen,
  kGXYL_HRAutomaticallIsOpen: kGXYL_HRAutomaticallIsOpen,
  kGXYL_HRManuallyIsOpen: kGXYL_HRManuallyIsOpen,
  kGXYL_GetLaserRegimenParameters: kGXYL_GetLaserRegimenParameters,
  kGXYL_GetLaserManuallyParameters: kGXYL_GetLaserManuallyParameters,
  kGXYL_GetLaserRecording: kGXYL_GetLaserRecording,
  kGXYL_GetHRRecording: kGXYL_GetHRRecording,
  kGXYL_GetMotionRecording: kGXYL_GetMotionRecording,
  kGXYL_RestoreFactorySettings: kGXYL_RestoreFactorySettings,
  kGXYL_GetManuallyHRState: kGXYL_GetManuallyHRState,
  kGXYL_GetAutoHRState: kGXYL_GetAutoHRState,
  kGXYL_GetManuallyLaserState: kGXYL_GetManuallyLaserState
}