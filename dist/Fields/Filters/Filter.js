"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Filter_1 = tslib_1.__importDefault(require("../../Filters/Filter"));
class default_1 extends Filter_1.default {
    constructor(field) {
        super();
        this.field = field;
        /**
         * Indicates if the field is nullable.
         */
        this.acceptsNullValues = true;
    }
    /**
     * Apply the filter into the given repository.
     */
    async apply(request, repository, value) {
        if (this.isValidNullValue(value)) {
            return;
        }
        await this.field.applyFilter(request, repository, value);
    }
    /**
     * Get the query parameter key for filter.
     */
    key() {
        return this.field.constructor.name + ':' + this.field.attribute;
    }
}
exports.default = default_1;
