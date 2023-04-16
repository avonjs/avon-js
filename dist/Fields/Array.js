"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Field_1 = tslib_1.__importDefault(require("./Field"));
const joi_1 = tslib_1.__importDefault(require("joi"));
const collect_js_1 = tslib_1.__importDefault(require("collect.js"));
class Array extends Field_1.default {
    constructor() {
        super(...arguments);
        /**
         * The validation rules callback for creation and updates.
         */
        this.rulesSchema = joi_1.default.array().items(joi_1.default.any());
        /**
         * The validation rules callback for creation.
         */
        this.creationRulesSchema = joi_1.default.array().items(joi_1.default.any());
        /**
         * The validation rules callback for updates.
         */
        this.updateRulesSchema = joi_1.default.array().items(joi_1.default.any());
        /**
         * Indicates items schema.
         */
        this.itemsSchema = {
            type: 'string',
            minLength: 1,
        };
    }
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillAttributeFromRequest(request, requestAttribute, model, attribute) {
        if (!request.exists(requestAttribute)) {
            return;
        }
        const value = request.array(requestAttribute);
        model.setAttribute(attribute, this.isValidNullValue(value)
            ? this.nullValue()
            : (0, collect_js_1.default)(value).values().all());
    }
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request, value) {
        return (0, collect_js_1.default)(value).values().all();
    }
    /**
     * Determine field is filterable or not.
     */
    isFilterable() {
        return false;
    }
    /**
     * Determine field is orderable or not.
     */
    isOrderable() {
        return false;
    }
    /**
     * Specify items schema.
     */
    items(itemsSchema) {
        this.itemsSchema = itemsSchema;
        return this;
    }
    /**
     * Get the value considered as null.
     */
    nullValue() {
        return [];
    }
    /**
     * Get the swagger-ui schema.
     */
    schema(request) {
        return {
            ...super.schema(request),
            type: 'array',
            items: this.itemsSchema,
            uniqueItems: true,
        };
    }
}
exports.default = Array;
