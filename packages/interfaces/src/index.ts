import * as enhancedResolve from "enhanced-resolve";
import * as normalize from "normalize-package-data";

export interface Package extends normalize.Package {
  bundledDependencies?: { [name: string]: string };
}

export interface Options {
  source: string;
  executeDirectory: string;
  stripBasePath?: string;
}

export type TsConfig = any;

export interface ExtendResolveOption {
  tsConfig?: TsConfig;
  exclude?: string; // Regex pattern
  includeOnly?: string; // Regex Pattern
}

export type ResolveOption = enhancedResolve.ResolverFactory.ResolverOption & ExtendResolveOption;

export type DependencyTypes = "local" | "core" | "npm" | "npm-dev" | "undetermined";

export type ModuleSystem = "cjs" | "amd" | "es6" | "tsd";

export interface ExtractObject {
  module: string;
  moduleSystem: ModuleSystem;
}

// TODO なにに利用されているか
export interface ResolvedModule {
  resolved?: string[];
  module: string;
  moduleSystem: ModuleSystem;
  coreModule: boolean;
  couldNotResolve?: boolean;
}

export interface BaseDependencyProperties {
  /** full path */
  resolved: string | undefined;
  /** User searched file. */
  followable: boolean;
  /** relative import path */
  module: string;
  /** */
  moduleSystem: ModuleSystem;
  /** search target? */
  matchesDoNotFollow: boolean;
  /** License */
  license?: string;
  /** This file is resolve? */
  couldNotResolve: boolean;
  /** File types. */
  dependencyTypes: DependencyTypes[];
}

export interface ResolvedCoreDependency extends BaseDependencyProperties {
  resolved: string;
  coreModule: true;
  couldNotResolve: false;
}

export interface NotResolvedDependency extends BaseDependencyProperties {
  resolved: undefined;
  coreModule: false;
  couldNotResolve: true;
}

export interface ResolvedDependency extends BaseDependencyProperties {
  /** Node Library */
  coreModule: boolean;
}

export type Dependency = ResolvedDependency | NotResolvedDependency | ResolvedCoreDependency;

export interface InputSourceDependency {
  /** Source file path */
  source: string;
  /** Include dependencies. */
  dependencies: Dependency[];
}

export type FlatDependencies = InputSourceDependency[];

export interface TreeData extends ResolvedDependency {
  children: TreeData[];
}

export interface CsrProps {
  flatDependencies: FlatDependencies;
}
