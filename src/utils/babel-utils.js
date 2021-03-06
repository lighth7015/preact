"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_root_1 = require("@nrwl/workspace/src/utils/app-root");
const workspace_1 = require("@nrwl/workspace");
const path_1 = require("path");
function updateBabelOptions(options) {
    // Add react babel preset
    const idx = options.presets.findIndex((p) => Array.isArray(p) && p[0].indexOf('@babel/preset-env') !== -1);
    options.presets.splice(idx + 1, 0, [
        require.resolve('@babel/preset-react'),
        {
            useBuiltIns: true,
        },
    ]);
    // TODO: Remove this once we have composable webpack and babel plugins.
    // Add babel plugin for styled-components or emotion.
    // We don't have a good way to know when a project uses one or the other, so
    // add the plugin only if the other style package isn't used.
    const packageJson = workspace_1.readJsonFile(path_1.join(app_root_1.appRootPath, 'package.json'));
    const deps = Object.assign(Object.assign({}, packageJson.dependencies), packageJson.devDependencies);
    const hasStyledComponents = !!deps['styled-components'];
    const hasEmotion = !!deps['@emotion/core'];
    if (hasStyledComponents && !hasEmotion) {
        options.plugins.splice(0, 0, [
            require.resolve('babel-plugin-styled-components'),
            {
                pure: true,
            },
        ]);
    }
    if (hasEmotion && !hasStyledComponents) {
        options.plugins.splice(0, 0, require.resolve('babel-plugin-emotion'));
    }
    return options;
}
exports.updateBabelOptions = updateBabelOptions;
//# sourceMappingURL=babel-utils.js.map