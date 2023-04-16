"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const Field_1 = tslib_1.__importDefault(require("./Field"));
const TextFilter_1 = tslib_1.__importDefault(require("./Filters/TextFilter"));
const Repository_1 = require("../Repositories/Repository");
class Text extends Field_1.default {
    constructor() {
        super(...arguments);
        /**
         * The callback to be used for the field's default value.
         */
        this.defaultCallback = () => {
            return this.isNullable() ? this.nullValue() : '';
        };
        /**
         * The validation rules callback for creation and updates.
         */
        this.rulesSchema = joi_1.default.string();
        /**
         * The validation rules callback for creation.
         */
        this.creationRulesSchema = joi_1.default.string();
        /**
         * The validation rules callback for updates.
         */
        this.updateRulesSchema = joi_1.default.string();
    }
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request, value) {
        return String(value);
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
        return new TextFilter_1.default(this);
    }
    /**
     * Define the default filterable callback.
     */
    defaultFilterableCallback() {
        return (request, repository, value) => {
            repository.where({
                key: this.filterableAttribute(request),
                operator: Repository_1.Operator.like,
                value,
            });
        };
    }
    /**
     * Get the swagger-ui schema.
     */
    schema(request) {
        return {
            ...super.schema(request),
            type: 'string',
        };
    }
}
exports.default = Text;
