import { DependencyTree } from "../../src/models/DependencyTree";
import { TreeResolver } from "../../src/service/TreeResolver";

export class MockTreeResolver implements TreeResolver {
  getDependencyTree(name: string, version: string): Promise<DependencyTree> {
    return Promise.resolve(require("../fixtures/react-tree.json"));
  }
}
