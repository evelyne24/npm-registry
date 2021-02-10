import "reflect-metadata";

import { DepthFirstTreeFlattener } from "./DepthFirstTreeFlattener";

describe("DepthFirstTreeFlattener", () => {
  it("flattens a tree", async () => {
    // arrange
    const treeResolver = new DepthFirstTreeFlattener();
    const tree = require("../../test/fixtures/react-tree.json");

    // act
    const flatTree = await treeResolver.flattenTree(tree);

    // assert
    expect(flatTree).toMatchObject({
      react: [
        {
          name: "react",
          version: "15.0.2",
          resolvedVersion: "15.0.2",
          parents: [],
        },
      ],
      fbjs: [
        {
          name: "fbjs",
          version: "^0.8.0",
          resolvedVersion: "0.8.17",
          parents: ["react"],
        },
      ],
      "core-js": [
        {
          name: "core-js",
          version: "^1.0.0",
          resolvedVersion: "1.2.7",
          parents: ["react", "fbjs"],
        },
      ],
      "loose-envify": [
        {
          name: "loose-envify",
          version: "^1.0.0",
          resolvedVersion: "1.4.0",
          parents: ["react", "fbjs"],
        },
        {
          name: "loose-envify",
          version: "^1.1.0",
          resolvedVersion: "1.4.0",
          parents: ["react"],
        },
      ],
      "js-tokens": [
        {
          name: "js-tokens",
          version: "^3.0.0 || ^4.0.0",
          resolvedVersion: "4.0.0",
          parents: ["react", "fbjs", "loose-envify"],
        },
        {
          name: "js-tokens",
          version: "^3.0.0 || ^4.0.0",
          resolvedVersion: "4.0.0",
          parents: ["react", "loose-envify"],
        },
      ],
    });
  });
});
