// 钉钉机器人
const robotConfig = {
  // 是否开启钉钉通知
  isRobotSwitch: true,
  // 钉钉群token
  token: '',
  // 需要@人员手机号
  atMobiles: [],
  // 被@人的用户ID
  atUserIds: [],
  // 是否需要@所有人
  isAtAll: false,
  // 指定打包机器人
  robot: 1,
  // 打包编译开启进程数
  threads: 8,
  // 钉钉群通知关键字
  keyword: ['发布'],
};

module.exports = {
  robotConfig,
};
