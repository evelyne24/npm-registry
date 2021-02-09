export type PromiseGenerator<T> = () => Promise<T>;

export interface PromisePool {
  enqueue<T>(promiseGenerator: PromiseGenerator<T>): Promise<T>;
}
