# wx-mini-uploader

基于miniprogram-ci实现的微信小程序上传工具，用于自动打包上传小程序

## 使用方式

- 本地安装wx-miniprogram-uploader

```javascript
  yarn add wx-miniprogram-uploader -D
```

- package.json新增upload命令

```javascript
  "scripts": {
    ...
    "build": "...",
    "upload": "mini-upload --private=src/config/private.key --robotPath=src/config/robot-config.js"
  }
```

- private参数(必填)：`private.key`为微信小程序上传秘钥，在微信公众平台->开发管理->开发设置->小程序代码上传中生成
- robotPath参数(非必填)：`robot-config.js`为钉钉相关配置文件，可以用来设置钉钉群通知相关

```javascript
// 钉钉机器人
const robotConfig = {
  // 是否开启钉钉通知
  isRobotSwitch: true,
  // 钉钉群token
  token: 'token...',
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
```

- 打包上传

```javascript
  yarn run upload
```

## changelog

### 1.0.0

- 新增钉钉机器人userId方式通知相关人员
- 新增打包机器人编号参数robot及多进程打包编译参数threads
