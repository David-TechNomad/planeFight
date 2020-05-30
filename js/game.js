import dom from "./dom.js";
import util from "./util.js";
import Music from "./music.js";
import Score from "./score.js";
import template from "./template.js";
import { Enemy, Plane } from "./model.js";

/**
 * @class
 * @classdesc 游戏类，用来控制整个游戏的生命周期
 */
class Game {
  constructor() {
    this.plane = null; // 飞机
    this.bgMusic = null; // 背景音乐
    this.bzMusic = null; // 爆炸音效
    this.enemyGroup = []; // 敌机组
    this.bulletGroup = []; // 子弹组
    this.enemyTimer = null; // 定时器·生成敌机
    this.moveTimer = null; // 定时器·移动子弹/敌机
    this.bgPosYCount = 0; // 背景y轴偏移值
    this.background = document.body; // 游戏背景
    this.initStartUI(); // 初始化开始界面
  }
  /**
   * 初始化游戏界面
   */
  initStartUI() {
    let el = dom.create(template.game_start);
    let btn = el.querySelector(".btn");
    dom.insert(el);
    btn.addEventListener("click", e => {
      this.start();
      el.remove();
      el = null;
      btn = null;
    });
  }
  /**
   * 初始化游戏音乐
   */
  initMusic() {
    this.bzMusic = new Music("explosion");
    this.bgMusic = new Music("game_bg");
    this.bgMusic.audio.autoplay = true;
    this.bgMusic.audio.loop = true;
    this.bgMusic.audio.load();
  }
  /**
   * 开始游戏
   */
  start() {
    this.plane = new Plane(this); // 飞机
    this.score = new Score(); // 计分器
    this.initMusic();
    this.startEnemy();
    this.startMove();
  }
  /**
   * 结束游戏
   */
  end() {
    setTimeout(() => {
      alert("游戏结束");
      // 清除缓存
      window.location.href = util.updateUrl(window.location.href);
    }, 500);
  }
  /**
   * 开启敌机渲染
   */
  startEnemy() {
    let createEnemy = () => {
      let enemy = new Enemy();
      this.enemyGroup.push(enemy);
    };
    createEnemy();
    // 每隔1.5s放出一架飞机
    this.enemyTimer = setInterval(createEnemy, 1500);
  }
  /**
   * 开启控制监听
   */
  startMove() {
    this.moveTimer = () => {
      this.detectCollision();
      this.elementMove();
      requestAnimationFrame(this.moveTimer);
    };
    this.moveTimer();
  }
  /**
   * 模型移动
   */
  elementMove() {
    // 敌机移动
    this.enemyGroup.forEach((enemy, index, enemys) => {
      let isExceed = enemy.y >= dom.winH;
      if (isExceed) {
        enemy.remove();
        enemys.splice(index, 1);
      } else {
        enemy.move();
      }
    });
    // 子弹移动
    this.bulletGroup.forEach((bullet, index, bullets) => {
      let isExceed = bullet.y + bullet.height <= 0;
      if (isExceed) {
        bullet.remove();
        bullets.splice(index, 1);
      } else {
        bullet.move();
      }
    });
    // 背景移动
    this.background.style.backgroundPosition = `left 0 top -${(this.bgPosYCount += 0.5)}px`;
  }
  /**
   * 碰撞检测
   */
  detectCollision() {
    // 敌机与坦克
    this.enemyGroup.forEach((enemy, i, enemys) => {
      let isCollision = util.isCollision(this.plane, enemy);
      if (isCollision) {
        new Promise(y => {
          // 获取敌机类型
          let enemyType = enemy.enemyType;
          // 爆炸音效
          this.bzMusic && this.bzMusic.play();
          // 爆炸效果
          this.plane.explosion();
          enemy.explosion(enemyType);
          // 移除敌机实例
          enemys.splice(i, 1);
          // 延迟删除dom
          setTimeout(y, 450);
        }).then(() => {
          // 移除飞机/敌机的dom;
          this.plane.remove();
          enemy.remove();
          // 结束游戏
          this.end();
        });
      }
    });
    // 子弹与敌机
    this.bulletGroup.forEach((bullet, i, bullets) => {
      this.enemyGroup.forEach((enemy, j, enemys) => {
        let isCollision = util.isCollision(bullet, enemy);
        if (isCollision) {
          // 宏任务，微任务
          // 爆炸效果是css3做的 会有播放时长 必须等到它放完之后
          new Promise(y => {
            // 获取敌机类型
            let enemyType = enemy.enemyType;
            // 爆炸音效
            this.bzMusic && this.bzMusic.play();
            // 爆炸效果
            bullet.explosion();
            enemy.explosion(enemyType);
            // 更新分数
            this.score.update(enemyType);
            // 移除子弹/敌机实例
            bullets.splice(i, 1);
            enemys.splice(j, 1);
            // 延迟删除dom
            setTimeout(y, 450);
          }).then(() => {
            // 移除子弹/敌机的dom;
            bullet.remove();
            enemy.remove();
            // 移除计分板效果类
            this.score.removeEffect();
          });
        }
      });
    });
  }
}

export default Game;
