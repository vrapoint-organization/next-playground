export default class VTimer {
  private createdAt: number;
  private stamps: { time: number; label?: string }[] = [];
  private now() {
    return new Date().getTime();
  }

  constructor() {
    this.createdAt = this.now();
  }

  public reset() {
    this.stamps = [];
    return this;
  }

  public start() {
    return this.reset().stamp("Start");
  }

  public add = this.stamp;
  public stamp(label?: string) {
    this.stamps.push({ time: this.now(), label });
    return this;
  }

  public finish() {
    this.stamp("Finish");
    return this;
  }

  public print() {
    const start = this.stamps[0].time;
    let prev = this.stamps[0].time;
    this.stamps.forEach((stamp, i) => {
      const elapsedFromPrev = i > 0 ? stamp.time - this.stamps[i - 1].time : 0;
      console.log(
        `[${i + 1}][${stamp.label || "stamp"}] : ${stamp.time - start}ms ${
          elapsedFromPrev ? `(${elapsedFromPrev}ms from prev)` : ""
        }`,
        i === 0 || i === this.stamps.length - 1
          ? ` - ${new Date(stamp.time).toLocaleString()}`
          : ""
      );
      prev = stamp.time;
    });
    // console.log(this.stamps);
    return this;
  }
}
