import * as Types from "@code-dependency/interfaces";

export const converter = (source: string | Types.Dependency, flatDependencies: Types.InputSourceDependency[]): Types.TreeData => {
  const root: Types.TreeData =
    typeof source === "string"
      ? {
          resolved: source,
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["undetermined"],
          module: source,
          moduleSystem: "cjs",
          matchesDoNotFollow: false,
          children: [],
        }
      : {
          ...source,
          children: [],
        };
  const rootDependency = flatDependencies.find(child => root.resolved === child.source);
  if (rootDependency) {
    root.children = rootDependency.dependencies.map(dependency => converter(dependency, flatDependencies));
  }
  return root;
};