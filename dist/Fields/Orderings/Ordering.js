"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Ordering_1 = tslib_1.__importDefault(require("../../Orderings/Ordering"));
class default_1 extends Ordering_1.default {
    constructor(field) {
        super();
        this.field = field;
        /**
         * Indicates if the field is nullable.
         */
        this.acceptsNullValues = true;
    }
    /**
     * Apply the ordering into the given repository.
     */
    async apply(request, repository, value) {
        if (this.isValidNullValue(value)) {
            return;
        }
        this.field.applyOrdering(request, repository, value);
    }
    /**
     * Get the query parameter key for ordering.
     */
    key() {
        return this.field.constructor.name + ':' + this.field.attribute;
    }
}
exports.default = default_1;
