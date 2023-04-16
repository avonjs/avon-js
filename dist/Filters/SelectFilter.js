"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Filter_1 = tslib_1.__importDefault(require("./Filter"));
class SelectFilter extends Filter_1.default {
    /**
     * Get the possible filtering values.
     */
    options() {
        return [];
    }
    /**
     * Get the swagger-ui schema.
     */
    schema(request) {
        return {
            oneOf: [{ type: 'string' }, { type: 'number' }],
            enum: this.options(),
            nullable: this.isNullable(),
        };
    }
}
exports.default = SelectFilter;
