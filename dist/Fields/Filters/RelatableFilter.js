"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Filter_1 = tslib_1.__importDefault(require("./Filter"));
const collect_js_1 = tslib_1.__importDefault(require("collect.js"));
class RelatableFilter extends Filter_1.default {
    constructor() {
        super(...arguments);
        /**
         * Values which will be replaced to null.
         */
        this.nullValidator = (value) => {
            return (0, collect_js_1.default)(value)
                .filter((value) => value !== undefined && String(value).length > 0)
                .isEmpty();
        };
    }
    /**
     * Apply the filter into the given repository.
     */
    async apply(request, repository, value) {
        return await super.apply(request, repository, (0, collect_js_1.default)(value).all());
    }
    /**
     * Get the query parameter key for filter.
     */
    key() {
        return this.field.constructor.name + ':' + this.field.attribute;
    }
}
exports.default = RelatableFilter;
