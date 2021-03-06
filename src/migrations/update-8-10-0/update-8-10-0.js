"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const path = require("path");
const literals_1 = require("@angular-devkit/core/src/utils/literals");
const ignore = require('ignore');
function update() {
    return schematics_1.chain([
        displayInformation,
        addCustomTypings,
        workspace_1.updateWorkspaceInTree(updateBuilderWebpackOption),
        workspace_1.updatePackagesInPackageJson(path.join(__dirname, '../../../', 'migrations.json'), '8.10.0'),
    ]);
}
exports.default = update;
function displayInformation(host, context) {
    context.logger.info(literals_1.stripIndents `
  We've added SVG and SVGR support for React applications. If you are using this
  feature, please update your jest.config.js file(s) with the new transform.
  
  \`\`\`
  transform: {
    '^.+\\\\.[tj]sx?$': 'ts-jest',
    '^(?!.*\\\\.(js|jsx|ts|tsx|css|json)$)': '@lighth7015/preact/plugins/jest' // NEW!
  }
  \`\`\`
  `);
}
function addCustomTypings(host) {
    const workspace = workspace_1.readWorkspace(host);
    return schematics_1.chain([
        ...Object.keys(workspace.projects).map((k) => {
            const p = workspace.projects[k];
            if (p.projectType !== 'application') {
                return schematics_1.noop();
            }
            if (isReactProject(p)) {
                return workspace_1.updateJsonInTree(path.join(p.root, 'tsconfig.json'), (json) => {
                    const files = json.files || [];
                    files.push(`${workspace_1.offsetFromRoot(p.root)}node_modules/@lighth7015/preact/typings/cssmodule.d.ts`, `${workspace_1.offsetFromRoot(p.root)}node_modules/@lighth7015/preact/typings/image.d.ts`);
                    json.files = files;
                    return json;
                });
            }
            else {
                return schematics_1.noop();
            }
        }),
        workspace_1.formatFiles(),
    ]);
}
function updateBuilderWebpackOption(json) {
    Object.keys(json.projects).map((k) => {
        const p = json.projects[k];
        if (isReactProject(p)) {
            p.architect.build.options.webpackConfig = '@lighth7015/preact/plugins/webpack';
        }
    });
    return json;
}
function isReactProject(p) {
    const buildArchitect = p.architect && p.architect.build ? p.architect.build : null;
    return (buildArchitect &&
        buildArchitect.builder === '@nrwl/web:build' &&
        (buildArchitect.options.webpackConfig === '@lighth7015/preact/plugins/babel' ||
            buildArchitect.options.webpackConfig === '@lighth7015/preact/plugins/webpack'));
}
//# sourceMappingURL=update-8-10-0.js.map
