import "reflect-metadata";

import { SimplePromisePool } from "./SimplePromisePool";
import { DebugLoggerFactory } from "./DebugLoggerFactory";
import { reject, resolve } from "bluebird";
describe("SimplePromisePool", () => {
  it("executes promises concurrently", async () => {
    const maxConcurrency = 3;
    const pool = new SimplePromisePool(
      new DebugLoggerFactory(),
      maxConcurrency
    );

    const counter = jest.fn();

    const createPromise = (i: number) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(i);
          counter(i);
          resolve(i);
        }, 1000);
      });

    const promises = Array.from(Array(5).keys()).map((i) =>
      pool.enqueue(() => createPromise(i))
    );

    await Promise.all(promises);

    expect(counter).toBeCalledTimes(5);
  });
});
