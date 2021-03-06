"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VALID_STYLES = [
    'css',
    'scss',
    'less',
    'styl',
    'styled-components',
    '@emotion/styled',
    'none',
];
function assertValidStyle(style) {
    if (VALID_STYLES.indexOf(style) === -1) {
        throw new Error(`Unsupported style option found: ${style}. Valid values are: "${VALID_STYLES.join('", "')}"`);
    }
}
exports.assertValidStyle = assertValidStyle;
//# sourceMappingURL=assertion.js.map