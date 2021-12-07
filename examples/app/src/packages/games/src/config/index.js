/**
 * @param {*} contentId 游戏ID
 * @param {*} name 分享标题
 * @param {*} cover 分享图片
 * @param {*} score 游戏得分
 * @param {*} scale 游戏胜率
 * @param {*} num 游戏点赞
 * @returns wx.navigateTo({params})
 */
const redirectPage = (params) => {
  const { contentId, name, cover, score, scale, isUpDown, num, users, numberPeople } = params;
  return wx.navigateTo({
    url: `/pages/game/result/index?id=${contentId}&title=${name}&cover=${cover}&score=${score}&scale=${scale}&isUpDown=${isUpDown}&num=${num}&users=${users}&numberPeople=${numberPeople}`,
  });
};

export { redirectPage };
