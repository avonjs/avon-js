"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = void 0;
/**
 * Converto given string in to slugified version.
 */
const slugify = (string, sepearator = '-') => {
    return String(string).replace(/[A-Z]/g, (matched, offset) => (offset > 0 ? sepearator : '') + matched.toLowerCase());
};
exports.slugify = slugify;
