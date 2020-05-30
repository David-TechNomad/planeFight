export default {
  // 更新css坐标
  setCssPoints(el) {
    let { translateX: x, translateY: y } = el;
    //translateX translateY
    el.style.cssText = `transform: perspective(500px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${x}, ${y}, 0, 1);`;
  },
  // element坐标转换
  // 把translate包装成xy
  elPointTransform(el, type) {
    let prop = `translate${type.toLocaleUpperCase()}`;
    let self = this;
    el[prop] = 0;
    Object.defineProperty(el, type, {
      get: function() {
        return this[prop];
      },
      set: function(value) {
        this[prop] = value;
        self.setCssPoints(this);
      }
    });
  },
  // 实例坐标转换
  instancePointTransform(instance, type) {
    Object.defineProperty(instance, type, {
      get: function() {
        return this.el[type];
      },
      set: function(value) {
        this.el[type] = value;
      }
    });
  },
  // 检测碰撞
  // 判断俩个div是否重合在一起 用如下的公式
  isCollision(a, b) {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  },
  // 函数节流
  throttle(fn, wait, context) {
    var timer;
    return function(...args) {
      if (!timer) {
        timer = setTimeout(() => (timer = null), wait);
        return fn.apply(context || this, args);
      }
    };
  },
  // 是否为移动设备
  get isMobile() {
    if (window.navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      return true;
    } else {
      return false;
    }
  },
  // 获取随机数后缀url
  updateUrl(url, key) {
    var key = (key || "t") + "="; //默认是"t"
    var reg = new RegExp(key + "\\d+"); //正则：t=1472286066028
    var timestamp = +new Date();
    if (url.indexOf(key) > -1) {
      //有时间戳，直接更新
      return url.replace(reg, key + timestamp);
    } else {
      //没有时间戳，加上时间戳
      if (url.indexOf("?") > -1) {
        var urlArr = url.split("?");
        if (urlArr[1]) {
          return urlArr[0] + "?" + key + timestamp + "&" + urlArr[1];
        } else {
          return urlArr[0] + "?" + key + timestamp;
        }
      } else {
        if (url.indexOf("#") > -1) {
          return url.split("#")[0] + "?" + key + timestamp + location.hash;
        } else {
          return url + "?" + key + timestamp;
        }
      }
    }
  }
};
