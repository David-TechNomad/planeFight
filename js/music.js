// 音乐
class Music {
  constructor(name) {
    this.audio = new Audio();
    this.load(name);
  }
  load(name) {
    this.audio.src = `../mp3/${name}.mp3`;
  }
  play() {
    // 0 没有关于音频是否就绪的信息
    // 1 检测到音频的元数据
    // 2 当前数据 当前(1帧)可用 没有足够的元数据播放下一帧
    // 3 当前以及下一帧都可用
    // 4 至少可以播放一秒了（数据已经满足了可以播放的帧数）
    if (this.audio.readyState === 4) {
      this.audio.play();
    }
  }
  pause() {
    this.audio.pause();
  }
}

export default Music;
