import iInterval from '../imodels/iInterval';

export default class Interval implements iInterval {
  public functionToRun: () => void;
  public interval: number;
  public running?: NodeJS.Timer;

  constructor(functionToRun: () => void, interval: number = 2000) {
    this.functionToRun = functionToRun;
    this.interval = interval;
  }

  public start(): NodeJS.Timer {
    this.running = setInterval(() => {
      this.functionToRun();
    }, this.interval);

    return this.running;
  }

  public stop(): Interval {
    if (this.running) {
      clearInterval(this.running);
    }
    
    return this;
  }

  public restart(): void {
    this.stop().start();
  }

  public reset(newInterval: number): void {
    if (newInterval !== this.interval) {
      this.interval = newInterval;
    }

    this.restart();
  }
}