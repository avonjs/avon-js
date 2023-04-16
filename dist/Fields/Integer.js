"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const Repository_1 = require("../Repositories/Repository");
const Field_1 = tslib_1.__importDefault(require("./Field"));
const NumberFilter_1 = tslib_1.__importDefault(require("./Filters/NumberFilter"));
class Integer extends Field_1.default {
    constructor() {
        super(...arguments);
        /**
         * The callback to be used for the field's default value.
         */
        this.defaultCallback = () => {
            return this.isNullable() ? this.nullValue() : 0;
        };
        /**
         * The validation rules callback for creation and updates.
         */
        this.rulesSchema = joi_1.default.number().integer();
        /**
         * The validation rules callback for creation.
         */
        this.creationRulesSchema = joi_1.default.number().integer();
        /**
         * The validation rules callback for updates.
         */
        this.updateRulesSchema = joi_1.default.number().integer();
    }
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request, value) {
        return parseInt(value);
    }
    /**
     * Determine field is filterable or not.
     */
    isFilterable() {
        return true;
    }
    /**
     * Determine field is orderable or not.
     */
    isOrderable() {
        return true;
    }
    /**
     * Make the field filter.
     */
    makeFilter(request) {
        return new NumberFilter_1.default(this);
    }
    /**
     * Define the default filterable callback.
     */
    defaultFilterableCallback() {
        return (request, repository, values) => {
            if (values[0] !== null) {
                repository.where({
                    key: this.filterableAttribute(request),
                    operator: Repository_1.Operator.gte,
                    value: values[0],
                });
            }
            if (values[1] !== null) {
                repository.where({
                    key: this.filterableAttribute(request),
                    operator: Repository_1.Operator.lte,
                    value: values[1],
                });
            }
        };
    }
    /**
     * Get the swagger-ui schema.
     */
    schema(request) {
        return {
            ...super.schema(request),
            type: 'integer',
        };
    }
}
exports.default = Integer;
