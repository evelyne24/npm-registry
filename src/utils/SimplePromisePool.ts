import { injectable, inject, optional } from "inversify";
import { Logger, LoggerFactory } from "./LoggerFactory";
import { PromiseGenerator, PromisePool } from "./PromisePool";

interface PendingPromise<T> {
  promiseGenerator: PromiseGenerator<T>;
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
}

@injectable()
export class SimplePromisePool implements PromisePool {
  private readonly log: Logger;
  private readonly maxConcurrency: number;
  private readonly queue: PendingPromise<any>[] = [];
  private pendingPromises: number;

  constructor(
    @inject("LoggerFactory") readonly loggerFactory: LoggerFactory,
    @inject("config.maxConcurrency")
    @optional()
    maxConcurrency?: number
  ) {
    this.log = loggerFactory.getLogger(SimplePromisePool.name);
    this.maxConcurrency = maxConcurrency || 1;
    this.pendingPromises = 0;
  }

  private async dequeue() {
    const item = this.queue.shift();
    if (!item) {
      return;
    }
    this.log.debug("Dequeuing promise...");

    try {
      const value = await item.promiseGenerator();
      item.resolve(value);
      this.log.debug("Promise processed with success.");
    } catch (error) {
      item.reject(error);
      this.log.warn(error, "Promise processed with error.");
    } finally {
      this.pendingPromises--;
      this.dequeue();
    }
  }

  async enqueue<T>(promiseGenerator: PromiseGenerator<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.log.debug("Enqueuing promise...");
      this.queue.push({
        promiseGenerator,
        resolve,
        reject,
      });
      this.pendingPromises++;
      if (this.pendingPromises > this.maxConcurrency) {
        this.log.debug(
          "Too many promises in the queue, waiting for some to complete..."
        );
        return;
      }
      this.dequeue();
    });
  }
}
