#!/usr/bin/env node

const ci = require('miniprogram-ci')
const child = require('child_process')
const robot = require('./robot')
const { getBranchName, getCommitList } = require('./git')
const { getDays, getArgs, isDirectory, isFolder, getSubPackages, isFile } = require('./utils')

const exec = child.execSync;

const getName = () => {
  const arr = process.cwd().split('/');
  return arr[2] || '';
}

// 子包编译
const subPackageBuilds = () => {
  const { packages } = getArgs()
  if (!packages) {
    console.log('------当前项目未传入子包路径或者没有子包------')
    return false
  }
  console.log('------子包开始编译------')
  const subPackagePath = process.cwd() + `/${packages}`
  if (isDirectory(subPackagePath) && isFolder(subPackagePath)) {
    const subPackages = getSubPackages(subPackagePath)
    subPackages.forEach(name => {
      if (isFile(`${subPackagePath}/${name}/package.json`)) {
        const { scripts = {} } = require(`${subPackagePath}/${name}/package.json`)
        if (scripts.build) {
          exec(`cd ${subPackagePath}/${name} && yarn && yarn run build`)
        } else {
          console.log('------当前子包不存在build命令，请确认------')
        }
      } else {
        console.log('------当前子包不存在package.json文件------')
      }
    })
  } else {
    console.log('------指定的子包文件夹不存在------')
  }
  console.log('------子包编译完成------') 
}

// 子包编译
subPackageBuilds()

const { private, robotPath, env } = getArgs()

// 主包编译
console.log('------主包开始编译------')
if (env === 'release') {
  exec(`cd ${process.cwd()} && yarn run build:release`, { stdio: 'inherit' });
} else {
  exec(`cd ${process.cwd()} && yarn run build`, { stdio: 'inherit' });
}
console.log('------主包编译完成------')

const config = {
  projectPath: `${process.cwd()}/dist`,
  version: `0.0.1`,
  desc: `${env === 'release' ? '**版本信息：正式版**，' : ''}${getName()}在${getDays()}更新了小程序${env === 'release' ? '' : '体验版'}，发布分支${getBranchName()}`,
  private: `${process.cwd()}/${private}`
};

// 检查是否存在上传秘钥文件
if (!isFile(`${process.cwd()}/${private}`)) {
  console.log('------微信小程序上传秘钥不存在，请在微信公众平台上生成，命名为private.key------')
  console.log('------在微信公众平台->开发管理->开发设置->小程序代码上传中生成------')
  console.log('------微信公众平台地址: https://mp.weixin.qq.com/wxamp/devprofile/get_profile?token=1334386328&lang=zh_CN------')
  process.exit(1);
}

let robotConfig = {}
let mainPackageConfig = {}

if (isFile(`${process.cwd()}/${robotPath}`)) {
  mainPackageConfig = require(`${process.cwd()}/${robotPath}`)
  robotConfig = require(`${process.cwd()}/${robotPath}`).robotConfig
}

const projectConfig = require(`${process.cwd()}/dist/project.config.json`);

if (!projectConfig.appid) {
  console.error('appid不能为空!!!');
  process.exit(1);
}

// 钉钉群通知信息
const dingdingMessage = (type = 1) => {
  const { token, atMobiles = [], atUserIds = [], isAtAll = false, keyword = [] } = robotConfig || {}
  const msgs = getCommitList().join('\n\n')
  if (!token) {
    console.log('------钉钉机器人token不存在------')
    return false
  }
  if (!keyword.length) {
    console.log('------请填写钉钉机器人关键字------')
    return false
  }
  // 手机号列表
  const notify = atMobiles.length ? atMobiles.map(item => `@${item}`) : ''
  // userId列表
  const userIdList = atUserIds.length ? atUserIds.map(item => `@${item}`) : ''
  // 关键字列表
  const keywordList = keyword.join('')
  robot(token).send(
  {
    "msgtype": "markdown",
    "markdown": {
      "title": `打包发布通知${keywordList}`,
      "text": `#### 应用${projectConfig.projectname}发布${type ? '成功' : '失败'} ${notify} ${userIdList} \n > ${config.desc} \n\n 最近三条提交： \n\n ${msgs}`,
    },
    "at": {
      "atMobiles": atMobiles,
      "atDingtalkIds": atUserIds,
      "isAtAll": isAtAll
    }
    }, (err, data) => {
      if (err) {
        if (err.toString().indexOf('keywords not in content') !== -1) {
          console.log('------机器人关键词不匹配，请修改------')
        } else {
          console.error(err);
        }
        return
      }
      console.log(data);
      if (data.errcode === 0) {
        process.exit()
      }
    })
}

(async () => {
  try {
    const project = new ci.Project({
      appid: projectConfig.appid,
      type: 'miniProgram',
      projectPath: config.projectPath,
      privateKeyPath: config.private,
      ignores: ['node_modules/**/*'],
    });

    // 上传
    await ci.upload({
      project,
      version: config.version,
      desc: config.desc,
      setting: {
        ...projectConfig.setting,
      },
      onProgressUpdate: console.log,
      robot: robotConfig.robot || 1,
      threads: robotConfig.threads || 5
    });
    // 钉钉通知
    robotConfig.isRobotSwitch && dingdingMessage()
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
