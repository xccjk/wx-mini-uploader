#!/usr/bin/env node

const minimist = require('minimist')
const fs = require('fs')


/**
 * 获取时间
 * @param {*} time 可选
 * @returns 2021年10月9日15点36分
 */
const getDays = (time) => {
  const date = time ? new Date(time) : new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const strDate = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${year}年${month}月${strDate}日${hours}点${minutes}分`;
}

/**
 * 返回命令行参数
 * @returns 
 */
const getArgs = () => {
  return minimist(process.argv.slice(2))
}

/**
 * 判断当前路径是否为文件夹
 * @param {*} path 文件夹路径
 * @returns boolean
 */
const isDirectory = (path) => {
  return fs.lstatSync(path).isDirectory() 
}

/**
 * 判断文件夹是否存在
 * @param {*} path 文件夹路径
 * @returns boolean
 */
const isFolder = (path) => {
  try{
    fs.accessSync(path, fs.constants.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * 判断文件是否存在
 * @param {*} path 文件路径
 * @returns boolean
 */
const isFile = (path) => {
  try{
    fs.accessSync(path, fs.constants.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * 获取指定文件夹下文件夹列表
 * @param {*} folderPath 文件夹路径
 * @returns 文件夹列表
 */
const getSubPackages = (folderPath) => {
  let components = []
  const files = fs.readdirSync(folderPath)
  files.forEach((item) => {
    let stat = fs.lstatSync(`${folderPath}/` + item)
    if (stat.isDirectory() === true) { 
      components.push(item)
    }
  })
  return components
}

module.exports = {
  getDays,
  getArgs,
  getSubPackages,
  isDirectory,
  isFolder,
  isFile
}
