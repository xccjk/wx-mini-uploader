#!/usr/bin/env node

const child = require('child_process');
const { getDays } = require('./utils')

/**
 * 获取分支名
 * @returns branch name
 */
const getBranchName = () => {
  return child.execSync('git name-rev --name-only HEAD', { encoding: 'utf8' });
}

const getPull = () => {
  return child.execSync('git pull');
}

/**
 * 获取git commit提交信息
 * @param {*} limit 获取多少条commit信息，默认3条
 * @returns ['作者: xcc 日期: 2021年10月8日19点58分 说明:fix: 修改版本号']
 */
const getCommitList = (limit = 3) => {
  // 姓名
  const names = child.execSync(`git log -${limit} --format=%cn`, { encoding: 'utf8' }).toString().trim().split('\n')
  // 时间
  const dates = child.execSync(`git log -${limit} --format=%cd`, { encoding: 'utf8' }).toString().trim().split('\n')
  // 说明
  const messages = child.execSync(`git log -${limit} --format=%s`, { encoding: 'utf8' }).toString().trim().split('\n')
  return new Array(limit).fill().map((_, index) => {
    // [1] Merge branch 'feature/v102' of git.xxx.cn:fed/xxx-project/xxx-xxx into feature/v102 xcc@2021年10月8日19点33分
    return `[${index+1}] ${messages[index]} **${names[index].replace(' ', '')}**@${getDays(dates[index])}`
  })
}

/**
 * 获取仓库分支列表
 * @returns ['master']
 */
const getBranchList = () => {
  const branchs = child.execSync(`git branch -a`, { encoding: 'utf8' }).toString().trim() || []
  return branchs.split('\n').map(item => item.trim())
}

module.exports = {
  getBranchName,
  getCommitList,
  getBranchList,
  getPull
}
