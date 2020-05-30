import util from "./util.js";
export default {
  box: document.createElement("div"),
  room: document.body,
  winW: window.innerWidth, //视口的宽高
  winH: window.innerHeight,
  /**
   * 获取Dom对象——单个
   * @param {String} query 选择器字符串
   * @returns {Element} DOM 对象
   */
  getElement(query) {
    return document.querySelector(query);
  },
  /**
   * 获取Dom对象——全部
   * @param {String} query 选择器字符串
   * @returns {Array[Element]} DOM 对象集合
   */
  getElements(query) {
    return document.querySelectorAll(query);
  },
  /**
   * 根据模板生成DOM
   * @param {String} tpl dom 模板字符串
   * @returns {Element} 生成后的DOM对象
   */
  create(tpl) {
    this.box.innerHTML = "";
    this.box.innerHTML = tpl;
    let el = this.box.firstElementChild;
    // div里本来是没有xy属性 让它具有xy属性
    util.elPointTransform(el, "x");
    util.elPointTransform(el, "y");
    return el;
  },
  /**
   * 将 DOM 对象插入到容器中
   * @param {Element} el 待插入容器的DOM对象
   */
  insert(el) {
    this.room.appendChild(el);
    //获取dom的一些信息
    let { width, height } = el.getBoundingClientRect();
    el._width = width;
    el._height = height;
  }
};
