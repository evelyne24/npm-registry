import {
  DependencyBreadcrumbMap,
  DependencyTree,
} from "../models/DependencyTree";

export interface TreeFlattener {
  flattenTree(tree: DependencyTree): Promise<DependencyBreadcrumbMap>;
}
