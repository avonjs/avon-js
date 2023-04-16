"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const QueryParameter_1 = tslib_1.__importDefault(require("../Http/Requests/QueryParameter"));
const AuthorizedToSee_1 = tslib_1.__importDefault(require("../Mixins/AuthorizedToSee"));
const Repositories_1 = require("../Repositories");
class Ordering extends (0, AuthorizedToSee_1.default)(QueryParameter_1.default) {
    /**
     * Get the query parameter key for filter.
     */
    key() {
        return this.constructor.name;
    }
    /**
     * Serialize parameters for schema.
     */
    serializeParameters(request) {
        return [
            {
                name: `orders[${this.key()}]`,
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
            type: 'string',
            nullable: this.isNullable(),
            enum: [Repositories_1.Direction.ASC, Repositories_1.Direction.DESC],
        };
    }
}
exports.default = Ordering;
