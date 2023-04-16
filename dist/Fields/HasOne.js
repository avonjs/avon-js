"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HasManyOrOne_1 = tslib_1.__importDefault(require("./HasManyOrOne"));
const collect_js_1 = tslib_1.__importDefault(require("collect.js"));
class HasOne extends HasManyOrOne_1.default {
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request, value) {
        return super.getMutatedValue(request, value)[0];
    }
    /**
     * Get the swagger-ui schema.
     */
    schema(request) {
        return {
            ...super.schema(request),
            type: 'object',
            properties: (0, collect_js_1.default)(this.relatableFields(request)).mapWithKeys((field) => [field.attribute, field.schema(request)]),
        };
    }
}
exports.default = HasOne;
