# wx-mini-uploader

基于miniprogram-ci实现的微信小程序上传工具，用于自动打包上传小程序

## 使用方式

- 本地安装miniprogram-uploader

```javascript
  yarn add miniprogram-uploader -D
```

- package.json新增upload命令

```javascript
  "scripts": {
    ...
    "build": "...",
    "upload": "mini-upload ..."
  }
```

- 打包上传

```javascript
  yarn run upload
```

## changelog

### 1.0.0

- 新增钉钉机器人userId方式通知相关人员
- 新增打包机器人编号参数robot及多进程打包编译参数threads
