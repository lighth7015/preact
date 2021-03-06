"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
const literals_1 = require("@angular-devkit/core/src/utils/literals");
const rules_1 = require("@nrwl/web/src/utils/rules");
const workspace_1 = require("@nrwl/workspace");
let addedEmotionPreset = false;
/*
 * This migration will do a few things:
 *
 * - Create the base babel.config.json file if it doesn't already exist
 * - Create .babelrc files for each React project that doesn't already have one
 * - For any projects that are not migrated, display a message so users are not surprised.
 */
function update() {
    return (host, context) => {
        const updates = [];
        const conflicts = [];
        const projectGraph = ast_utils_1.getFullProjectGraphFromHost(host);
        if (host.exists('/babel.config.json')) {
            context.logger.info(`
        Found an existing babel.config.json file so we skipped creating it.
        
        You may want to update it to include the Nx preset "@nrwl/web/babel".
        `);
        }
        else if (host.exists('/babel.config.js')) {
            context.logger.info(`
        Found an existing babel.config.js file so we skipped creating it.
        
        You may want to update it to include the Nx preset "@nrwl/web/babel".
        `);
        }
        else {
            updates.push(rules_1.initRootBabelConfig());
        }
        Object.keys(projectGraph.nodes).forEach((name) => {
            const p = projectGraph.nodes[name];
            const deps = projectGraph.dependencies[name];
            const isReact = deps.some((d) => projectGraph.nodes[d.target].type === 'npm' &&
                d.target.indexOf('react') !== -1);
            if (isReact) {
                updates.push((host) => {
                    const babelrcPath = `${p.data.root}/.babelrc`;
                    if (host.exists(babelrcPath)) {
                        conflicts.push([name, babelrcPath]);
                    }
                    else {
                        createBabelrc(host, context, babelrcPath, deps);
                    }
                });
            }
        });
        if (conflicts.length > 0) {
            context.logger.info(literals_1.stripIndent `
      The following projects already have .babelrc so we did not create them:
      
        ${conflicts
                .map(([name, babelrc]) => `${name} - ${babelrc}`)
                .join('\n  ')}
          
      You may want to update them to include the Nx preset "@lighth7015/preact/babel".
      `);
        }
        updates.push((host) => addedEmotionPreset ? addEmotionPresetPackage : host);
        updates.push(workspace_1.formatFiles());
        return schematics_1.chain(updates);
    };
}
exports.default = update;
function createBabelrc(host, context, babelrcPath, deps) {
    const babelrc = {
        presets: ['@lighth7015/preact/babel'],
        plugins: [],
    };
    let added = 0;
    if (deps.some((d) => d.target === 'npm:styled-components')) {
        babelrc.plugins.push(['styled-components', { pure: true, ssr: true }]);
        added++;
    }
    if (deps.some((d) => d.target.startsWith('npm:@emotion'))) {
        babelrc.presets.push('@emotion/babel-preset-css-prop');
        addedEmotionPreset = true;
        added++;
    }
    if (added > 1) {
        context.logger.warn(literals_1.stripIndents `We created a babel config at ${babelrcPath} with both styled-components and emotion plugins.
      Only one should be used, please remove the unused plugin.
      
      For example, if you don't use styled-components, then remove that plugin from the .babelrc file.
      `);
    }
    host.create(babelrcPath, JSON.stringify(babelrc, null, 2));
}
const addEmotionPresetPackage = workspace_1.addDepsToPackageJson({}, {
    '@emotion/babel-preset-css-prop': '10.0.27',
});
//# sourceMappingURL=babelrc-9-4-0.js.map