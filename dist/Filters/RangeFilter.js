"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Filter_1 = tslib_1.__importDefault(require("./Filter"));
class RangeFilter extends Filter_1.default {
    /**
     * Serialize parameters for schema.
     */
    serializeParameters(request) {
        return [
            {
                name: `filters[${this.key()}][min]`,
                in: 'query',
                explode: true,
                style: 'deepObject',
                schema: this.schema(request),
            },
            {
                name: `filters[${this.key()}][max]`,
                in: 'query',
                explode: true,
                style: 'deepObject',
                schema: this.schema(request),
            },
        ];
    }
    /**
     * Get the swagger-ui schema.
     */
    schema(request) {
        return {
            type: 'number',
            nullable: this.isNullable(),
        };
    }
}
exports.default = RangeFilter;
