"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Filter_1 = tslib_1.__importDefault(require("./Filter"));
class BooleanFilter extends Filter_1.default {
    /**
     * Get the swagger-ui schema.
     */
    schema(request) {
        return {
            type: 'boolean',
            nullable: this.isNullable(),
        };
    }
}
exports.default = BooleanFilter;
