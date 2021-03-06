"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const testing_1 = require("@angular-devkit/schematics/testing");
const name_utils_1 = require("@nrwl/workspace/src/utils/name-utils");
const workspace_1 = require("@nrwl/workspace/src/utils/workspace");
const workspace_2 = require("@nrwl/workspace");
const testRunner = new testing_1.SchematicTestRunner('@lighth7015/preact', path_1.join(__dirname, '../../collection.json'));
testRunner.registerCollection('@nrwl/cypress', path_1.join(__dirname, '../../../cypress/collection.json'));
testRunner.registerCollection('@nrwl/storybook', path_1.join(__dirname, '../../../storybook/collection.json'));
function runSchematic(schematicName, options, tree) {
    return testRunner.runSchematicAsync(schematicName, options, tree).toPromise();
}
exports.runSchematic = runSchematic;
function runExternalSchematic(collectionName, schematicName, options, tree) {
    return testRunner
        .runExternalSchematicAsync(collectionName, schematicName, options, tree)
        .toPromise();
}
exports.runExternalSchematic = runExternalSchematic;
function callRule(rule, tree) {
    return testRunner.callRule(rule, tree).toPromise();
}
exports.callRule = callRule;
function updateNxJson(tree, update) {
    const updated = update(workspace_2.readJsonInTree(tree, '/nx.json'));
    tree.overwrite('/nx.json', JSON.stringify(updated));
}
exports.updateNxJson = updateNxJson;
function createApp(tree, appName) {
    const { fileName } = name_utils_1.names(appName);
    tree.create(`/apps/${fileName}/src/main.tsx`, `import ReactDOM from 'react-dom';\n`);
    updateNxJson(tree, (json) => {
        json.projects[appName] = { tags: [] };
        return json;
    });
    return callRule(workspace_1.updateWorkspace((workspace) => {
        workspace.projects.add({
            name: fileName,
            root: `apps/${fileName}`,
            projectType: 'application',
            sourceRoot: `apps/${fileName}/src`,
            targets: {},
        });
    }), tree);
}
exports.createApp = createApp;
function createWebApp(tree, appName) {
    const { fileName } = name_utils_1.names(appName);
    tree.create(`/apps/${fileName}/src/index.ts`, `\n`);
    updateNxJson(tree, (json) => {
        json.projects[appName] = { tags: [] };
        return json;
    });
    return callRule(workspace_1.updateWorkspace((workspace) => {
        workspace.projects.add({
            name: fileName,
            root: `apps/${fileName}`,
            projectType: 'application',
            sourceRoot: `apps/${fileName}/src`,
            targets: {},
        });
    }), tree);
}
exports.createWebApp = createWebApp;
function createLib(tree, libName) {
    const { fileName } = name_utils_1.names(libName);
    tree.create(`/libs/${fileName}/src/index.ts`, `import * as React from'preact';\n`);
    updateNxJson(tree, (json) => {
        json.projects[libName] = { tags: [] };
        return json;
    });
    return callRule(workspace_1.updateWorkspace((workspace) => {
        workspace.projects.add({
            name: fileName,
            root: `libs/${fileName}`,
            projectType: 'library',
            sourceRoot: `libs/${fileName}/src`,
            targets: {},
        });
    }), tree);
}
exports.createLib = createLib;
//# sourceMappingURL=testing.js.map
