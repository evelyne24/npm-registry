import { inject, injectable, optional } from "inversify";
import {
  Dependencies,
  Dependency,
  DependencyTree,
} from "../models/DependencyTree";
import { Logger, LoggerFactory } from "../utils/LoggerFactory";
import { PackageResolver } from "./PackageResolver";
import { TreeResolver } from "./TreeResolver";
import { VersionResolver } from "./VersionResolver";
import { NotFoundError } from "restify-errors";
import Bluebird = require("bluebird");

interface PackageVersion {
  name: string;
  version: string;
}

class LevelsTree {
  [level: number]: PackageVersion[];
}

@injectable()
export class BreadthFirstTreeResolver implements TreeResolver {
  private readonly log: Logger;
  private readonly maxConcurrency: number;

  constructor(
    @inject("LoggerFactory") readonly loggerFactory: LoggerFactory,
    @inject("PackageResolver")
    private readonly packageResolver: PackageResolver,
    @inject("VersionResolver")
    private readonly versionResolver: VersionResolver,
    @inject("config.maxConcurrency")
    @optional()
    maxConcurrency?: number
  ) {
    this.log = loggerFactory.getLogger(BreadthFirstTreeResolver.name);
    this.maxConcurrency = maxConcurrency || 1;
  }

  /*
    Get the first level of a dependency.
   */
  // private async getDependency(
  //   name: string,
  //   version: string,
  //   parentName: string,
  //   parentVersion: string
  // ): Promise<Dependency> {
  //   const resolvedVersion = await this.versionResolver.resolveMaxSatisfyingVersion(
  //     name,
  //     version
  //   );

  //   const dependencies = await this.getRecursiveDependencyTree(
  //     name,
  //     resolvedVersion,
  //     parentName,
  //     parentVersion
  //   );

  //   return {
  //     name: name,
  //     version: version,
  //     resolvedVersion: resolvedVersion,
  //     dependencies: dependencies,
  //   };
  // }

  private async getTreeLevel(
    tree: DependencyTree,
    levelsTree: LevelsTree,
    level: number
  ): Promise<DependencyTree> {
    const nextLevel = level + 1;
    levelsTree[nextLevel] = [];

    for (const i in levelsTree[level]) {
      const pv = levelsTree[level][i];
      const pkg = await this.packageResolver.getPackageInfo(pv.name);

      if (!pkg.versions[pv.version]) {
        throw new NotFoundError(
          "Can't find version %s for package %s.",
          pv.version,
          pv.name
        );
      }

      const dependencies = pkg.versions[pv.version].dependencies || {};

      if (Object.keys(dependencies).length === 0) {
        continue;
      }

      for (const key in dependencies) {
        const resolvedVersion = await this.versionResolver.resolveMaxSatisfyingVersion(
          key,
          dependencies[key]
        );
        levelsTree[nextLevel].push({
          name: key,
          version: resolvedVersion,
        });
      }
    }

    console.log(JSON.stringify(levelsTree, null, 2));

    if (levelsTree[nextLevel].length === 0) {
      return tree;
    }
    return this.getTreeLevel(tree, levelsTree, nextLevel);

    // tree

    // const subtree = await Bluebird.map(
    //   Object.keys(dependencies),
    //   async (key: string) => {
    //     const dependency = await this.getDependency.bind(this)(
    //       key,
    //       dependencies[key],
    //       name,
    //       version
    //     );
    //     return {
    //       name: key,
    //       dependency,
    //     };
    //   },
    //   {
    //     concurrency: this.maxConcurrency,
    //   }
    // );

    // return subtree.reduce((tree, { name, dependency }) => {
    //   tree[name] = dependency;
    //   return tree;
    // }, {});
  }

  async getDependencyTree(
    name: string,
    version: string
  ): Promise<DependencyTree> {
    return await this.getTreeLevel(
      { name: "root", version: "", resolvedVersion: "", dependencies: {} },
      [[{ name, version }]],
      0
    );
  }
}
