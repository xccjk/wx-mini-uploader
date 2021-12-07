import { svgs } from './svg';
import { redirectPage } from '../../config/index';
//获取应用实例
const app = getApp();
Page({
  data: {
    // 卡牌数组 { id: 1, disable: false }
    allCard: [],
    // 卡牌数 size * 2
    size: 6,
    // 点击次数
    clickNum: 0,
    // 初始展示时长
    initTime: 1000,
    // 累计游戏时长
    countTime: 0,
    // 样式布局
    cssBox: '',
    // 素材列表
    materialList: [],
    materialText: '',
    svgs: svgs,
    isClick: true,
  },

  detail: {},

  init: function ({ level = 'simple' }) {
    const size = level === 'simple' ? 6 : 10;
    const { materialList = [] } = this.data;
    this.select = {};
    this.status = false;
    // this.max = level === 'simple' ? 20 : 36;
    const len = materialList.length;
    if (len && len < size) {
      this.setData({
        materialText: '素材数量不可小于size',
      });
      return;
    }
    const list = new Array(size).fill().map((_, i) => {
      return { id: i + 1, disabled: true };
    });
    const all = list
      .concat(list)
      .sort(function () {
        return Math.random() > 0.5 ? -1 : 1;
      })
      .map((item, key) => {
        if (materialList[key]) {
          return { ...item, key, src: materialList[key] };
        }
        return { ...item, key };
      });
    const _size = size * 2;
    this.setData({
      allCard: all,
      size,
      cssBox: !(_size % 3) ? 'row1' : !(_size % 4) ? 'row2' : !(_size % 5) ? 'row3' : '',
    });
    this.start();
  },
  handleChoose: function (e) {
    const { disabled, id, index } = e.target.dataset;
    let { allCard = [], clickNum } = this.data;
    if (disabled) return false;
    if (!this.status) return false;
    if (!this.data.isClick) return false;
    this.timer && clearTimeout(this.timer);
    this.previewDurationTime && clearTimeout(this.previewDurationTime);
    if (!this.select.id) {
      this.select = {
        index,
        id,
        disabled: !disabled,
      };
      allCard[index].disabled = !disabled;
    } else {
      if (id === this.select.id) {
        this.select = {};
        allCard[index].disabled = !disabled;
      } else {
        allCard[index].disabled = true;
        this.setData({
          isClick: false,
        });
        this.timer = setTimeout(() => {
          allCard[index].disabled = false;
          allCard[this.select.index].disabled = false;
          this.select = {};
          this.setData({
            allCard,
            isClick: true,
          });
        }, 400);
      }
    }
    this.setData({
      allCard,
      clickNum: clickNum + 1,
    });
    // 全部翻完
    if (allCard.every((item) => item.disabled === true)) {
      this.countdownTime && clearInterval(this.countdownTime);
      this.handleNext('success');
    }
  },
  onLoad: function (params) {
    const { level, id, name, cover, isUpDown, num, users, numberPeople } = params;
    this.detail = {
      level,
      contentId: id,
      name,
      cover,
      isUpDown,
      num,
      users,
      numberPeople,
    };
    this.init({ level: level });
    wx.setNavigationBarTitle({
      title: name,
    });
  },
  onShareAppMessage() {
    return {
      title: this.detail.name,
      path: wx.share.makeSharePath(`/pages/game/detail/index?id=${this.detail.contentId}`),
      imageUrl: this.detail.cover,
    };
  },
  start: function () {
    const { initTime = 1000, allCard = [] } = this.data;
    // 初始化预览
    this.previewDurationTime = setTimeout(() => {
      const list = allCard.map((item) => {
        return { ...item, disabled: false };
      });
      this.setData({
        allCard: list,
      });
      this.status = true;
    }, initTime);
    // 初始化计时
    this.countdownTime = setInterval(() => {
      this.setData({
        countTime: this.data.countTime + 1,
      });
    }, 1000);
  },
  onReady: function () {},
  onShow() {
    const { level } = this.detail;
    this.init({ level });
    this.setData({
      clickNum: 0,
      countTime: 0,
    });
  },
  onHide() {
    this.countdownTime && clearInterval(this.countdownTime);
  },
  onUnload: function () {},
  /**
   * 游戏得分规则
   * 当游戏成功跳转尾页，超过10分钟，每多10秒扣1%，最低扣至60%为止，不超过10分钟则100%；当游戏失败跳转尾页，每过10秒加1%，最多加到50%
   */
  handleNext(result) {
    const { name, cover, contentId, isUpDown, num, users, numberPeople } = this.detail;
    let score = result === 'success' ? '通关成功' : '游戏失败',
      scale;
    if (result === 'success') {
      scale = this.data.countTime > 600 ? Math.round(100 - (this.data.countTime - 600) / 10) : 100;
      scale = scale < 60 ? 60 : scale;
    } else {
      scale = Math.round(this.data.countTime / 10);
      scale = scale > 50 ? 50 : scale;
    }
    redirectPage({
      name,
      cover,
      contentId,
      score: score,
      scale: scale + '%',
      isUpDown,
      num,
      users,
      numberPeople,
    });
  },
});
