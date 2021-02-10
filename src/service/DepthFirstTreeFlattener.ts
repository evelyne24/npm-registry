import { injectable } from "inversify";
import {
  DependencyTree,
  DependencyBreadcrumbMap,
  isTree,
} from "../models/DependencyTree";
import { TreeFlattener } from "./TreeFlattener";

@injectable()
export class DepthFirstTreeFlattener implements TreeFlattener {
  private async recursiveFlattenTree(
    tree: DependencyTree,
    breadcrumbs: string[],
    map: DependencyBreadcrumbMap
  ): Promise<DependencyBreadcrumbMap> {
    if (!map[tree.name]) {
      map[tree.name] = [];
    }

    map[tree.name].push({
      name: tree.name,
      version: tree.version,
      resolvedVersion: tree.resolvedVersion,
      parents: breadcrumbs,
    });

    const newBreadcrumbs = [...breadcrumbs];
    newBreadcrumbs.push(tree.name);

    for (const key in tree.dependencies) {
      const dependency = tree.dependencies[key];

      if (isTree(dependency)) {
        await this.recursiveFlattenTree(dependency, newBreadcrumbs, map);
      }
    }

    return map;
  }

  async flattenTree(tree: DependencyTree): Promise<DependencyBreadcrumbMap> {
    return this.recursiveFlattenTree(tree, [], {});
  }
}
