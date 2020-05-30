import util from "./util.js";
import dom from "./dom.js";
import template from "./template.js";
/**
 * @class
 * @classdec 计分板类
 */
class Score {
  constructor() {
    this.render();
    this.setProps();
  }
  /**
   * 渲染计分板
   */
  render() {
    let el = dom.create(template.score);
    dom.insert(el);
  }
  /**
   * 设置计分板 积分效果
   */
  setProps() {
    this.fractionCount = 0; // 分数
    this.scoreBoard = dom.getElement(".count"); // 计分板
    this.scoreEffect = dom.getElement(".count_effect"); // 计分板效果
    util.isMobile && this.scoreEffect.remove();
  }
  // TODO: 需要添加敌机类型描述
  /**
   * 更新计分板 数据
   * @param {enemyType} enemyType 敌机类型  可选值
   */
  update(enemyType) {
    this.fractionCount += enemyType * 500;
    this.scoreBoard.innerHTML = this.fractionCount;
    this.scoreEffect.innerHTML = this.fractionCount;
    !util.isMobile && this.scoreEffect.classList.add("effect");
  }
  /**
   * 移除计分板效果
   */
  removeEffect() {
    !util.isMobile && this.scoreEffect.classList.remove("effect");
  }
}

export default Score;
