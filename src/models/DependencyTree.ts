export type AlreadyTraversed = string;

export type Dependency = DependencyTree | AlreadyTraversed;
export type Dependencies = { [name: string]: Dependency };

export interface DependencyTree {
  name: string;
  version: string;
  resolvedVersion: string;
  dependencies: Dependencies;
}

export interface DependencyBreadcrumb {
  name: string;
  version: string;
  resolvedVersion: string;
  parents: string[];
}

export interface DependencyBreadcrumbMap {
  [name: string]: DependencyBreadcrumb[];
}

export function isTree(value: any): value is DependencyTree {
  return value.name && value.dependencies;
}
