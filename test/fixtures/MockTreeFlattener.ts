import {
  DependencyTree,
  DependencyBreadcrumbMap,
} from "../../src/models/DependencyTree";
import { TreeFlattener } from "../../src/service/TreeFlattener";

export class MockTreeFlattener implements TreeFlattener {
  flattenTree(tree: DependencyTree): Promise<DependencyBreadcrumbMap> {
    return Promise.resolve({});
  }
}
