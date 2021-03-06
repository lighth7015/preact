import { Rule, Tree } from '@angular-devkit/schematics';
export declare function runSchematic<SchemaOptions = any>(schematicName: string, options: SchemaOptions, tree: Tree): Promise<import("@angular-devkit/schematics/testing").UnitTestTree>;
export declare function runExternalSchematic<SchemaOptions = any>(collectionName: string, schematicName: string, options: SchemaOptions, tree: Tree): Promise<import("@angular-devkit/schematics/testing").UnitTestTree>;
export declare function callRule(rule: Rule, tree: Tree): Promise<import("@angular-devkit/schematics/src/tree/interface").Tree>;
export declare function updateNxJson(tree: any, update: (json: any) => any): void;
export declare function createApp(tree: Tree, appName: string): Promise<Tree>;
export declare function createWebApp(tree: Tree, appName: string): Promise<Tree>;
export declare function createLib(tree: Tree, libName: string): Promise<Tree>;
