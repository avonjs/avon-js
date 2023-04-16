"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collect_js_1 = require("collect.js");
class Collection extends collect_js_1.Collection {
    /**
     * The get method returns the item at a given key. If the key does not exist, null is returned.
     */
    get(path, defaultValue) {
        if (typeof path !== 'string' || !path.includes('.')) {
            return super.get(path, defaultValue);
        }
        const [key, ...paths] = path.split('.');
        if (!this.has(key)) {
            return this.get(key, defaultValue);
        }
        const value = this.get(key);
        if (paths.length === 0 || typeof value !== 'object' || value === null) {
            return value;
        }
        return new Collection(value).get(paths.join('.'), defaultValue);
    }
    /**
     * The has method determines if one or more keys exists in the collection.
     */
    has(path) {
        if (typeof path !== 'string' || !path.includes('.')) {
            return super.has(path);
        }
        return this.get(path, undefined) !== undefined;
    }
}
exports.default = Collection;
